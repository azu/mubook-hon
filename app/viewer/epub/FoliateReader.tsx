"use client";
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    FoliatePositionMarker,
    BookItem,
    decodeBookMarker,
    hasDataBook,
    isFoliateBookItem,
    isFoliatePositionMarker,
    NO_BOOK_DATA,
    useNotion
} from "../../notion/useNotion";
import { useNotionFileUpload } from "../../notion/useNotionFileUpload";
import { useToast } from "../useToast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loading } from "../../components/Loading";
import { joinMemoStock } from "../../utils/joinMemoStock";
import styles from "./FoliateReader.module.css";

export type FoliateReaderProps = {
    id: string;
    bookFileName: string;
    src: string | undefined;
    fileBlob?: Blob;
    initialPage?: string;
    initialMarker?: string;
    translation?: boolean;
};

type BookMetadata = {
    title?: string | Record<string, string>;
    // author can be: string, array of strings, array of contributor objects, or single contributor object
    author?:
        | string
        | string[]
        | { name: string | Record<string, string> }[]
        | { name: string | Record<string, string> };
    publisher?: string | { name: string | Record<string, string> };
    language?: string;
};

type TOCItem = {
    label: string;
    href: string;
    subitems?: TOCItem[];
};

type RelocateDetail = {
    cfi: string;
    fraction: number;
    location?: { current: number; total: number };
    range?: Range;
    tocItem?: { label: string; href: string };
    pageItem?: { label: string };
};

type FoliateView = HTMLElement & {
    open: (file: File | Blob | string) => Promise<void>;
    init: (options: { lastLocation?: string; showTextStart?: boolean }) => Promise<void>;
    close: () => void;
    goTo: (target: string | number) => Promise<void>;
    goToFraction: (fraction: number) => Promise<void>;
    prev: () => Promise<void>;
    next: () => Promise<void>;
    goLeft: () => Promise<void>;
    goRight: () => Promise<void>;
    book: {
        metadata?: BookMetadata;
        toc?: TOCItem[];
        dir?: "ltr" | "rtl";
        getCover?: () => Promise<Blob | null>;
        sections?: { id: string; linear?: string }[];
    };
    renderer: {
        setStyles?: (css: string) => void;
        setAttribute: (name: string, value: string) => void;
        getContents: () => { doc: Document; index: number }[];
    };
    lastLocation?: RelocateDetail;
    getCFI: (index: number, range?: Range) => string;
};

// Helper to get string from language map (e.g., { ja: "著者名", en: "Author Name" } or "Author Name")
const getStringFromLanguageMap = (value: string | Record<string, string> | undefined): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    const keys = Object.keys(value);
    return keys.length > 0 ? value[keys[0]] : "";
};

// Helper to get author string from various formats
// metadata.author can be: string | string[] | { name: string | LanguageMap }[] | { name: string | LanguageMap }
const getAuthorString = (author: BookMetadata["author"]): string => {
    if (!author) return "";
    if (typeof author === "string") return author;
    if (Array.isArray(author)) {
        return author
            .map((a) => {
                if (typeof a === "string") return a;
                // a.name can be a string or a language map object
                return getStringFromLanguageMap(a.name as string | Record<string, string>);
            })
            .filter(Boolean)
            .join(", ");
    }
    // Single object case: { name: string | LanguageMap, ... }
    if (typeof author === "object" && "name" in author) {
        return getStringFromLanguageMap(author.name as string | Record<string, string>);
    }
    return "";
};

// Helper to get title string from various formats
const getTitleString = (title: BookMetadata["title"]): string => {
    return getStringFromLanguageMap(title);
};

// Helper to get publisher string from various formats
const getPublisherString = (publisher: BookMetadata["publisher"]): string => {
    if (!publisher) return "";
    if (typeof publisher === "string") return publisher;
    return getStringFromLanguageMap(publisher.name);
};

const getCSS = (options: { spacing: number; justify: boolean; hyphenate: boolean }) => `
    @namespace epub "http://www.idpf.org/2007/ops";
    html {
        color-scheme: light only;
        background: white;
        color: black;
    }
    p, li, blockquote, dd {
        line-height: ${options.spacing};
        text-align: ${options.justify ? "justify" : "start"};
        -webkit-hyphens: ${options.hyphenate ? "auto" : "manual"};
        hyphens: ${options.hyphenate ? "auto" : "manual"};
        hanging-punctuation: allow-end last;
        widows: 2;
    }
    [align="left"] { text-align: left; }
    [align="right"] { text-align: right; }
    [align="center"] { text-align: center; }
    [align="justify"] { text-align: justify; }
    pre {
        white-space: pre-wrap !important;
    }
    aside[epub|type~="endnote"],
    aside[epub|type~="footnote"],
    aside[epub|type~="note"],
    aside[epub|type~="rearnote"] {
        display: none;
    }
`;

// Discriminated union for viewer state
type ViewerState =
    | { status: "waiting-src" }
    | { status: "loading" }
    | { status: "ready" }
    | { status: "error"; error: string };

export const FoliateReader: FC<FoliateReaderProps> = (props) => {
    const [viewerState, setViewerState] = useState<ViewerState>({ status: "waiting-src" });
    const [menuState, setMenuState] = useState<"open" | "closed">("closed");
    const [layoutMode, setLayoutMode] = useState<"paginated" | "scrolled">("paginated");
    const viewRef = useRef<FoliateView | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInitialized = useRef(false);
    // Prevent duplicate book creation when multiple relocate events fire before first creation completes
    const isBookCreatingRef = useRef(false);
    // Store latest relocate detail for updating book status (state to trigger effects)
    const [latestRelocateDetail, setLatestRelocateDetail] = useState<RelocateDetail | null>(null);
    // Track the last fraction we updated to Notion to avoid unnecessary updates
    const lastUpdatedFractionRef = useRef<number | null>(null);

    const { currentBook, updateBookStatus, addMemo, hasCompletedNotionSettings } = useNotion({
        fileId: props.id,
        fileName: props.bookFileName
    });

    // Ref to access current book without adding to useEffect dependencies (avoids update loop)
    const currentBookRef = useRef(currentBook);
    useEffect(() => {
        currentBookRef.current = currentBook;
    }, [currentBook]);

    // File upload
    const pageId = hasDataBook(currentBook) ? currentBook.pageId : undefined;
    const { uploadFile, uploadState, isUploadEnabled } = useNotionFileUpload({
        pageId,
        fileName: props.bookFileName
    });

    const fileUploadAttemptedRef = useRef(false);
    useEffect(() => {
        if (isUploadEnabled && hasDataBook(currentBook) && props.fileBlob && !fileUploadAttemptedRef.current) {
            fileUploadAttemptedRef.current = true;
            uploadFile(props.fileBlob).then((result) => {
                if (result.success) {
                    console.debug("File uploaded to Notion successfully");
                } else {
                    console.debug("File upload skipped or failed:", result.error);
                }
            });
        }
    }, [currentBook, isUploadEnabled, props.fileBlob, uploadFile]);

    const { showToast, bookInfo, ToastComponent } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [memoStock, setMemoStock] = useState<{ text: string; selectors: { start: string; end: string } }[]>([]);
    const [isTranslation, setIsTranslation] = useState(props.translation);
    const [canMemoContent, setCanMemoContent] = useState(false);
    const [isAddingMemo, setIsAddingMemo] = useState(false);
    const [showTOC, setShowTOC] = useState(false);
    const [toc, setToc] = useState<TOCItem[]>([]);

    // Initialize foliate-view
    useEffect(() => {
        // Only initialize once when we have src and are in waiting-src state
        if (!props.src || viewerState.status !== "waiting-src") {
            return;
        }

        setViewerState({ status: "loading" });
        const initFoliate = async () => {
            try {
                // Import foliate-js view module from public directory
                // foliate-js uses native ESM, so we load it via dynamic import in browser
                if (!customElements.get("foliate-view")) {
                    // Use dynamic import to load the module
                    const script = document.createElement("script");
                    script.type = "module";
                    script.textContent = `
                        import '/foliate-js/view.js';
                        window.dispatchEvent(new Event('foliate-loaded'));
                    `;
                    document.head.appendChild(script);

                    // Wait for the module to load
                    await new Promise<void>((resolve) => {
                        const checkLoaded = () => {
                            if (customElements.get("foliate-view")) {
                                resolve();
                            } else {
                                setTimeout(checkLoaded, 50);
                            }
                        };
                        // Listen for our custom event
                        window.addEventListener("foliate-loaded", () => resolve(), { once: true });
                        // Also poll as fallback
                        setTimeout(checkLoaded, 100);
                    });
                }

                const view = document.createElement("foliate-view") as FoliateView;
                viewRef.current = view;

                // Set up event listeners
                view.addEventListener("relocate", (e: Event) => {
                    const detail = (e as CustomEvent<RelocateDetail>).detail;
                    console.debug("relocate", detail);
                    setCanMemoContent(true);
                    // Store latest relocate detail for use when updating book status
                    setLatestRelocateDetail(detail);
                });

                view.addEventListener("load", (e: Event) => {
                    const detail = (e as CustomEvent<{ doc: Document; index: number }>).detail;
                    console.debug("load", detail);

                    // Add keyboard event listener to the loaded document
                    detail.doc.addEventListener("keydown", handleKeydown);

                    // Add selection change listener
                    detail.doc.addEventListener("selectionchange", () => {
                        const selection = detail.doc.getSelection();
                        if (selection && selection.toString().trim()) {
                            setCanMemoContent(true);
                        }
                    });
                });

                // Append to container
                if (containerRef.current) {
                    // Disable horizontal swipe gestures, allow vertical scroll and pinch zoom
                    view.style.cssText = "width: 100%; height: 100%; touch-action: pan-y pinch-zoom;";
                    containerRef.current.appendChild(view);
                }

                // Fetch and open the book
                if (!props.src) {
                    throw new Error("No src provided");
                }
                const response = await fetch(props.src);
                const blob = await response.blob();
                const file = new File([blob], props.bookFileName || "book.epub", {
                    type: "application/epub+zip"
                });

                await view.open(file);

                // Set styles
                view.renderer.setStyles?.(
                    getCSS({
                        spacing: 1.4,
                        justify: true,
                        hyphenate: true
                    })
                );

                // Set TOC
                if (view.book?.toc) {
                    setToc(view.book.toc);
                }

                // Initialize with last location or marker
                const lastLocation = props.initialMarker
                    ? decodeBookMarker<FoliatePositionMarker>(props.initialMarker)?.cfi
                    : hasDataBook(currentBook) && isFoliateBookItem(currentBook)
                      ? currentBook.lastMarker?.cfi
                      : undefined;

                await view.init({
                    lastLocation,
                    showTextStart: !lastLocation
                });

                isInitialized.current = true;
                setViewerState({ status: "ready" });
            } catch (error) {
                console.error("Failed to initialize foliate reader:", error);
                setViewerState({ status: "error", error: error instanceof Error ? error.message : "Unknown error" });
            }
        };

        initFoliate();

        return () => {
            if (viewRef.current) {
                viewRef.current.close();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        props.src,
        props.bookFileName,
        props.id,
        props.initialMarker,
        currentBook,
        updateBookStatus,
        viewerState.status
    ]);

    // Show toast for saved reading position from Notion after view is ready
    const hasShownPositionToast = useRef(false);
    useEffect(() => {
        if (
            viewerState.status === "ready" &&
            viewRef.current &&
            hasDataBook(currentBook) &&
            isFoliateBookItem(currentBook) &&
            currentBook.lastMarker?.cfi &&
            !hasShownPositionToast.current
        ) {
            hasShownPositionToast.current = true;
            const view = viewRef.current;
            const lastMarker = currentBook.lastMarker;
            const currentFraction = view.lastLocation?.fraction ?? 0;

            // Show toast if position differs significantly (more than 5%)
            const isDifferentPosition = Math.abs(currentFraction - lastMarker.fraction) > 0.05;
            console.debug("Position check:", {
                currentFraction,
                lastMarkerFraction: lastMarker.fraction,
                isDifferentPosition
            });

            if (isDifferentPosition) {
                showToast({
                    current: {
                        cfi: view.lastLocation?.cfi ?? "",
                        fraction: currentFraction,
                        sectionIndex: 0
                    },
                    lastRead: lastMarker
                });
            }
        }
    }, [viewerState.status, currentBook, showToast]);

    // Register new book if not found (only place where new books are created)
    useEffect(() => {
        if (currentBook === NO_BOOK_DATA && viewRef.current && isInitialized.current && latestRelocateDetail) {
            // Skip if already creating book to prevent duplicate entries
            // Important: Don't reset this flag until currentBook has actual data
            if (isBookCreatingRef.current) {
                return;
            }
            const view = viewRef.current;
            const metadata = view.book?.metadata;
            if (metadata) {
                isBookCreatingRef.current = true;
                console.debug("Creating new book entry in Notion");
                const authorString = getAuthorString(metadata.author);
                updateBookStatus({
                    viewer: "epub:foliate",
                    fileId: props.id,
                    fileName: props.bookFileName,
                    publisher: getPublisherString(metadata.publisher),
                    title: getTitleString(metadata.title),
                    authors: authorString
                        .split(/[,、]/)
                        .map((a) => a.trim())
                        .filter(Boolean),
                    currentPage:
                        latestRelocateDetail.location?.current ?? Math.floor(latestRelocateDetail.fraction * 100),
                    totalPage: latestRelocateDetail.location?.total ?? 100,
                    lastMarker: {
                        cfi: latestRelocateDetail.cfi,
                        fraction: latestRelocateDetail.fraction,
                        sectionIndex: 0
                    }
                });
                // Note: Don't reset isBookCreatingRef here - it will be reset when currentBook changes to have data
            }
        }
    }, [currentBook, latestRelocateDetail, props.bookFileName, props.id, updateBookStatus]);

    // Reset the creating flag when book data is available
    useEffect(() => {
        if (hasDataBook(currentBook) && isBookCreatingRef.current) {
            console.debug("Book created successfully, resetting isBookCreatingRef");
            isBookCreatingRef.current = false;
        }
    }, [currentBook]);

    // Update existing book status when navigating (debounced, only when position changes significantly)
    const updateTimeoutRef = useRef<number | null>(null);
    useEffect(() => {
        // Only update if book already exists and we have relocate data
        if (!viewRef.current || !isInitialized.current || !latestRelocateDetail) {
            return;
        }

        // Skip if position hasn't changed significantly (less than 1%)
        const currentFraction = latestRelocateDetail.fraction;
        if (
            lastUpdatedFractionRef.current !== null &&
            Math.abs(currentFraction - lastUpdatedFractionRef.current) < 0.01
        ) {
            return;
        }

        // Debounce updates to avoid too many API calls
        if (updateTimeoutRef.current) {
            window.clearTimeout(updateTimeoutRef.current);
        }

        updateTimeoutRef.current = window.setTimeout(() => {
            const view = viewRef.current;
            if (!view?.book?.metadata || !latestRelocateDetail) return;

            // Double-check position change in case it reverted during debounce
            if (
                lastUpdatedFractionRef.current !== null &&
                Math.abs(latestRelocateDetail.fraction - lastUpdatedFractionRef.current) < 0.01
            ) {
                return;
            }

            // Only update if book already exists (use ref to avoid dependency loop)
            if (!hasDataBook(currentBookRef.current)) {
                return;
            }

            console.debug("Updating existing book status", { fraction: latestRelocateDetail.fraction });
            lastUpdatedFractionRef.current = latestRelocateDetail.fraction;

            const metadata = view.book.metadata;
            const authorString = getAuthorString(metadata.author);
            updateBookStatus({
                viewer: "epub:foliate",
                fileId: props.id,
                fileName: props.bookFileName,
                publisher: getPublisherString(metadata.publisher),
                title: getTitleString(metadata.title),
                authors: authorString
                    .split(/[,、]/)
                    .map((a) => a.trim())
                    .filter(Boolean),
                currentPage: latestRelocateDetail.location?.current ?? Math.floor(latestRelocateDetail.fraction * 100),
                totalPage: latestRelocateDetail.location?.total ?? 100,
                lastMarker: {
                    cfi: latestRelocateDetail.cfi,
                    fraction: latestRelocateDetail.fraction,
                    sectionIndex: 0
                }
            });
        }, 1000); // 1 second debounce

        return () => {
            if (updateTimeoutRef.current) {
                window.clearTimeout(updateTimeoutRef.current);
            }
        };
    }, [latestRelocateDetail, props.bookFileName, props.id, updateBookStatus]);

    // Keyboard handler
    const handleKeydown = useCallback(
        (event: KeyboardEvent) => {
            const view = viewRef.current;
            if (!view) return;

            if (event.shiftKey && event.key === "A") {
                // Stock memo
                onClickStockMemo();
            } else if (event.shiftKey && event.key === "S") {
                // Save memo
                onClickMemo();
            } else if (event.key === "j" || event.key === "ArrowRight") {
                view.goRight();
            } else if (event.key === "k" || event.key === "ArrowLeft") {
                view.goLeft();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    // Add global keyboard listener
    useEffect(() => {
        document.addEventListener("keydown", handleKeydown);
        return () => {
            document.removeEventListener("keydown", handleKeydown);
        };
    }, [handleKeydown]);

    const onClickTranslationButton = useCallback(() => {
        setIsTranslation(!isTranslation);
        const newParams = new URLSearchParams(searchParams ?? []);
        if (isTranslation) {
            newParams.delete("translation");
        } else {
            newParams.set("translation", "true");
        }
        router.replace(`${pathname}?${newParams.toString()}`);
    }, [isTranslation, pathname, router, searchParams]);

    const getSelectedText = useCallback((): { text: string; selectors: { start: string; end: string } } | null => {
        const view = viewRef.current;
        if (!view) return null;

        const contents = view.renderer.getContents();
        for (const { doc, index } of contents) {
            const selection = doc.getSelection();
            if (selection && selection.toString().trim()) {
                const range = selection.getRangeAt(0);
                const cfi = view.getCFI(index, range);
                return {
                    text: selection.toString(),
                    selectors: {
                        start: cfi,
                        end: cfi
                    }
                };
            }
        }
        return null;
    }, []);

    const getCurrentPageText = useCallback((): { text: string; selectors: { start: string; end: string } } | null => {
        const view = viewRef.current;
        if (!view?.lastLocation) return null;

        const contents = view.renderer.getContents();
        if (contents.length === 0) return null;

        const { doc, index } = contents[0];
        const bodyText = doc.body?.textContent?.trim() ?? "";
        if (!bodyText) return null;

        return {
            text: bodyText.slice(0, 500), // Limit to first 500 chars
            selectors: {
                start: view.lastLocation.cfi,
                end: view.lastLocation.cfi
            }
        };
    }, []);

    const onClickStockMemo = useCallback(() => {
        const selected = getSelectedText() ?? getCurrentPageText();
        if (!selected?.text) return;

        setMemoStock((prev) => [...prev, selected]);
    }, [getSelectedText, getCurrentPageText]);

    const onClickMemo = useCallback(async () => {
        const view = viewRef.current;
        if (!view?.lastLocation) return;

        const stockedMemo =
            memoStock.length > 0
                ? {
                      text: joinMemoStock(memoStock.map((memo) => memo.text)),
                      selectors: {
                          start: memoStock.at(0)?.selectors.start,
                          end: memoStock.at(-1)?.selectors.end
                      }
                  }
                : undefined;

        const selected = stockedMemo ?? getSelectedText() ?? getCurrentPageText();

        if (!selected?.text) {
            window.alert("Please select text to add memo");
            return;
        }

        try {
            setIsAddingMemo(true);
            const currentPage = view.lastLocation.location?.current ?? Math.floor(view.lastLocation.fraction * 100);
            await addMemo({
                memo: selected.text,
                currentPage,
                marker: {
                    cfi: view.lastLocation.cfi,
                    fraction: view.lastLocation.fraction,
                    sectionIndex: 0,
                    highlightSelectors: selected.selectors as { start?: string; end?: string }
                }
            });
            setMemoStock([]);
            // Clear selection
            const contents = view.renderer.getContents();
            for (const { doc } of contents) {
                doc.getSelection()?.removeAllRanges();
            }
        } finally {
            setIsAddingMemo(false);
        }
    }, [addMemo, getSelectedText, getCurrentPageText, memoStock]);

    const onClickOpenNotionPage = useCallback(() => {
        if (!hasDataBook(currentBook)) return;
        window.open(currentBook.pageUrl, "_blank");
    }, [currentBook]);

    const onClickJumpLastPage = useCallback(() => {
        if (viewRef.current && hasDataBook(currentBook) && bookInfo?.lastRead) {
            const marker = bookInfo.lastRead as FoliatePositionMarker;
            if (marker.cfi) {
                viewRef.current.goTo(marker.cfi);
            }
        }
    }, [bookInfo?.lastRead, currentBook]);

    const onClickPrev = useCallback(() => {
        viewRef.current?.goLeft();
    }, []);

    const onClickNext = useCallback(() => {
        viewRef.current?.goRight();
    }, []);

    const onClickTOCItem = useCallback((href: string) => {
        viewRef.current?.goTo(href);
        setShowTOC(false);
    }, []);

    const toggleMenu = useCallback(() => {
        setMenuState((prev) => (prev === "open" ? "closed" : "open"));
    }, []);

    const toggleLayoutMode = useCallback(() => {
        setLayoutMode((prev) => {
            const newMode = prev === "paginated" ? "scrolled" : "paginated";
            viewRef.current?.renderer?.setAttribute?.("flow", newMode);
            return newMode;
        });
    }, []);

    const enableMemoButton = useMemo(() => {
        if (memoStock.length > 0) return true;
        return canMemoContent && !isAddingMemo;
    }, [canMemoContent, isAddingMemo, memoStock.length]);

    // Show error if foliate failed to initialize
    if (viewerState.status === "error") {
        return (
            <div style={{ padding: "20px", color: "red" }}>
                <h2>Failed to load EPUB viewer</h2>
                <p>{viewerState.error}</p>
            </div>
        );
    }

    return (
        <div style={{ height: "100dvh" }} className="full-page">
            {/* Loading overlay */}
            {(viewerState.status === "waiting-src" || viewerState.status === "loading") && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9999,
                        background: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Loading>Loading Viewer...</Loading>
                </div>
            )}
            {/* Menu trigger area - tap to open menu */}
            {viewerState.status === "ready" && menuState === "closed" && (
                <button
                    className={styles.menuTrigger}
                    onClick={toggleMenu}
                    title="Tap to open menu"
                    aria-label="Open menu"
                />
            )}
            {/* Top menu bar */}
            <div
                className={styles.menuBar}
                style={{
                    display: menuState === "open" ? "flex" : "none"
                }}
            >
                <button className={styles.menuButton} onClick={() => setShowTOC(!showTOC)} title="Table of Contents">
                    ☰
                </button>
                <button
                    className={styles.menuButton}
                    style={{ background: isTranslation ? "#ddd" : "#fff" }}
                    onClick={onClickTranslationButton}
                    title="Translate Page"
                >
                    A
                </button>
                {hasCompletedNotionSettings && (
                    <button className={styles.menuButton} onClick={onClickOpenNotionPage} title="Open Notion Page">
                        N
                    </button>
                )}
                <button
                    className={styles.menuButton}
                    onClick={toggleLayoutMode}
                    title={layoutMode === "paginated" ? "Switch to scroll mode" : "Switch to page mode"}
                >
                    {layoutMode === "paginated" ? "Scroll" : "Page"}
                </button>
                <button className={styles.menuButton} onClick={toggleMenu} title="Close menu">
                    ✕
                </button>
            </div>

            {/* TOC Sidebar */}
            {showTOC && (
                <div className={styles.tocOverlay} onClick={() => setShowTOC(false)}>
                    <div className={styles.tocSidebar} onClick={(e) => e.stopPropagation()}>
                        <h3>Table of Contents</h3>
                        <div className={styles.tocList}>
                            {toc.map((item, index) => (
                                <TOCItemComponent key={index} item={item} onClickItem={onClickTOCItem} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation buttons - left */}
            <button
                className={styles.navButton}
                style={{
                    left: 0,
                    display: viewerState.status === "ready" && menuState === "closed" ? "flex" : "none"
                }}
                onClick={onClickPrev}
                title="Previous page"
            >
                ‹
            </button>

            {/* Navigation buttons - right */}
            <button
                className={styles.navButton}
                style={{
                    right: 0,
                    display: viewerState.status === "ready" && menuState === "closed" ? "flex" : "none"
                }}
                onClick={onClickNext}
                title="Next page"
            >
                ›
            </button>

            {/* Memo buttons */}
            {hasCompletedNotionSettings && viewerState.status === "ready" && menuState === "closed" && (
                <>
                    <button
                        className={`Button small violet ${styles.memoButton}`}
                        disabled={!canMemoContent || isAddingMemo}
                        title="Stock Memo"
                        style={{
                            position: "fixed",
                            left: "env(safe-area-inset-left, 0)",
                            bottom: "env(safe-area-inset-bottom, 0)",
                            zIndex: 1000
                        }}
                        onClick={onClickStockMemo}
                    >
                        📁+{memoStock.length}
                    </button>
                    <button
                        className={`Button small violet ${styles.memoButton}`}
                        disabled={!enableMemoButton}
                        title="Add Memo"
                        style={{
                            position: "fixed",
                            right: "env(safe-area-inset-right, 0)",
                            bottom: "env(safe-area-inset-bottom, 0)",
                            zIndex: 1000
                        }}
                        onClick={onClickMemo}
                    >
                        Memo
                    </button>
                </>
            )}

            {/* Foliate view container */}
            <div
                ref={containerRef}
                className={styles.viewerContainer}
                onClick={toggleMenu}
                style={{
                    width: "100%",
                    height: "100%"
                }}
            />

            <ToastComponent onClickJumpLastPage={onClickJumpLastPage} />

            {/* Upload status indicator */}
            {uploadState.status === "uploading" && <div className={styles.uploadStatus}>Uploading to Notion...</div>}
            {uploadState.status === "success" && (
                <div className={styles.uploadStatus} style={{ background: "rgba(0, 128, 0, 0.8)" }}>
                    Uploaded
                </div>
            )}
            {uploadState.status === "error" && (
                <div
                    className={styles.uploadStatus}
                    style={{ background: "rgba(200, 0, 0, 0.8)" }}
                    title={uploadState.error}
                >
                    Upload failed
                </div>
            )}
        </div>
    );
};

// TOC Item Component
const TOCItemComponent: FC<{ item: TOCItem; onClickItem: (href: string) => void; depth?: number }> = ({
    item,
    onClickItem,
    depth = 0
}) => {
    return (
        <div style={{ paddingLeft: `${depth * 16}px` }}>
            <button className={styles.tocItem} onClick={() => onClickItem(item.href)}>
                {item.label}
            </button>
            {item.subitems?.map((subitem, index) => (
                <TOCItemComponent key={index} item={subitem} onClickItem={onClickItem} depth={depth + 1} />
            ))}
        </div>
    );
};
