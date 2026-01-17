"use client";
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    decodeBookMarker,
    FoliatePositionMarker,
    hasDataBook,
    isFoliateBookItem,
    NO_BOOK_DATA,
    useNotion
} from "../../notion/useNotion";
import { useNotionFileUpload } from "../../notion/useNotionFileUpload";
import { useUserSettings, TapAction, TAP_PRESET_DEFAULT } from "../../settings/useUserSettings";
import { useToast } from "../useToast";
import { Loading } from "../../components/Loading";
import { joinMemoStock } from "../../utils/joinMemoStock";
import { addToMemoStock, MemoStockItem } from "../../utils/addToMemoStock";
import { clearIndexedDBCache } from "../../lib/clearIndexedDBCache";
import { extractFullText } from "./extractFullText";
import { isPWAStandaloneMode } from "../../lib/pwa";
import { saveLastRead } from "../../lib/usePWAFreshLaunch";
import styles from "./FoliateReader.module.css";

export type FoliateReaderProps = {
    id: string;
    bookFileName: string;
    src: string | undefined;
    fileBlob?: Blob;
    initialPage?: string;
    initialMarker?: string;
    onClearCache?: () => Promise<unknown>;
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

type FixedLayoutRenderer = {
    setStyles?: (css: string) => void;
    setAttribute: (name: string, value: string) => void;
    getContents: () => { doc: Document; index: number }[];
    // Fixed-layout specific methods
    index: number;
    book: { sections: unknown[] };
    getSpreadOf: (section: unknown) => { index: number; side: string } | undefined;
    goToSpread: (index: number, side: string, reason: string) => Promise<void>;
    rtl: boolean;
};

type PaginatorRenderer = {
    setStyles?: (css: string) => void;
    setAttribute: (name: string, value: string) => void;
    getContents: () => { doc: Document; index: number }[];
    // Paginator specific methods
    nextSection: () => Promise<void>;
    prevSection: () => Promise<void>;
    goTo: (target: { index: number; anchor?: () => number }) => Promise<void>;
    // Force unlock navigation (added to fix stuck #locked state)
    forceUnlock: () => void;
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
        sections?: {
            id: string;
            linear?: string;
            createDocument: () => Promise<Document>;
        }[];
    };
    renderer: {
        setStyles?: (css: string) => void;
        setAttribute: (name: string, value: string) => void;
        getContents: () => { doc: Document; index: number }[];
    };
    isFixedLayout?: boolean;
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

// Navigation helper - uses next/prev for consistent page number progression
// regardless of book reading direction (LTR/RTL)
const navigate = async (view: FoliateView, direction: "next" | "prev") => {
    if (direction === "next") {
        await view.next();
    } else {
        await view.prev();
    }
};

// Base font size in pixels (100% = 16px, browser default)
// This ensures consistent font sizing across all books
const BASE_FONT_SIZE_PX = 16;

const getCSS = (options: { spacing: number; justify: boolean; hyphenate: boolean; fontSize: number }) => `
    @namespace epub "http://www.idpf.org/2007/ops";
    html {
        color-scheme: light only;
        background: white;
        color: black;
        /* Define normalized font size as CSS variable for consistent sizing across all chapters */
        --normalized-font-size: ${BASE_FONT_SIZE_PX * (options.fontSize / 100)}px;
        font-size: var(--normalized-font-size) !important;
    }
    body {
        font-size: var(--normalized-font-size) !important;
    }
    /* Force text elements to use normalized font-size directly (not inherit from parent).
       Using var() instead of inherit ensures consistent sizing even when parent elements
       (section, article, etc.) have different font-sizes defined in the EPUB's original CSS. */
    p, span, div, li, blockquote, dd, a, em, strong, b, i {
        font-size: var(--normalized-font-size) !important;
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
    | { status: "error"; error: string; logs: string[] };

// Height of memo button area (to prevent content from rendering under buttons)
const MEMO_BUTTON_AREA_HEIGHT = 20;
const MEMO_BUTTON_AREA_HEIGHT_PWA = 60;

export const FoliateReader: FC<FoliateReaderProps> = (props) => {
    const [viewerState, setViewerState] = useState<ViewerState>({ status: "waiting-src" });
    const [menuState, setMenuState] = useState<"open" | "closed">("closed");
    const [layoutMode, setLayoutMode] = useState<"paginated" | "scrolled">("paginated");
    const [fontSize, setFontSize] = useState(100); // percentage
    const viewRef = useRef<FoliateView | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    // Store current styles for reapplication on section load
    const currentStylesRef = useRef<string | null>(null);
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

    // Tap zone settings
    const { userSettings } = useUserSettings();
    const tapZones = userSettings?.tapZones?.zones ?? TAP_PRESET_DEFAULT;
    // Ref to access tapZones in event handlers without adding to useEffect dependencies
    const tapZonesRef = useRef(tapZones);
    useEffect(() => {
        tapZonesRef.current = tapZones;
    }, [tapZones]);

    // Ref to access current book without adding to useEffect dependencies (avoids update loop)
    const currentBookRef = useRef(currentBook);
    useEffect(() => {
        currentBookRef.current = currentBook;
    }, [currentBook]);

    // File upload
    const pageId = hasDataBook(currentBook) ? currentBook.pageId : undefined;
    const { uploadFile, uploadTextFile, isUploadEnabled } = useNotionFileUpload({
        pageId,
        fileName: props.bookFileName
    });

    const { showToast, bookInfo, notify, ToastComponent } = useToast();

    // File uploads (EPUB and TXT)
    const [isUploading, setIsUploading] = useState(false);
    const uploadAttemptedRef = useRef<{ epub: boolean; text: boolean }>({ epub: false, text: false });

    useEffect(() => {
        if (!isUploadEnabled || !hasDataBook(currentBook)) {
            return;
        }

        const sections = viewRef.current?.book?.sections;
        const shouldUploadEpub = props.fileBlob && !uploadAttemptedRef.current.epub;
        const shouldUploadText = sections && !uploadAttemptedRef.current.text;

        if (!shouldUploadEpub && !shouldUploadText) {
            return;
        }

        const uploads: Promise<{ type: string; success: boolean }>[] = [];

        // EPUB upload
        if (shouldUploadEpub) {
            uploadAttemptedRef.current.epub = true;
            uploads.push(
                uploadFile(props.fileBlob!).then((result) => {
                    console.debug("EPUB upload result:", result.success ? "success" : result.error);
                    return { type: "epub", success: result.success };
                })
            );
        }

        // Text extraction and upload
        if (shouldUploadText) {
            uploadAttemptedRef.current.text = true;
            uploads.push(
                extractFullText(sections!)
                    .then((fullText) => {
                        if (!fullText || fullText.length < 100) {
                            console.debug("Text too short, skipping upload");
                            return { type: "text", success: false };
                        }
                        console.debug(`Extracted ${fullText.length} chars, uploading...`);
                        return uploadTextFile(fullText).then((result) => ({
                            type: "text",
                            success: result.success
                        }));
                    })
                    .catch((error) => {
                        console.error("Text extraction failed:", error);
                        return { type: "text", success: false };
                    })
            );
        }

        if (uploads.length === 0) return;

        setIsUploading(true);
        console.debug(`[FoliateReader] Starting ${uploads.length} upload(s)...`);

        Promise.all(uploads)
            .then((results) => {
                console.debug("Upload results:", results);
                const successCount = results.filter((r) => r.success).length;
                if (successCount > 0) {
                    notify({ title: `Uploaded ${successCount} file(s)`, type: "success" });
                }
            })
            .catch((error) => {
                console.error("Upload failed:", error);
                notify({ title: "Upload failed", type: "error" });
            })
            .finally(() => {
                setIsUploading(false);
            });
    }, [currentBook, isUploadEnabled, notify, props.fileBlob, uploadFile, uploadTextFile]);
    const [memoStock, setMemoStock] = useState<MemoStockItem[]>([]);
    const [canMemoContent, setCanMemoContent] = useState(false);
    const [isAddingMemo, setIsAddingMemo] = useState(false);
    const [showTOC, setShowTOC] = useState(false);
    const [toc, setToc] = useState<TOCItem[]>([]);
    // Position indicator visibility (for temporary display on page turn)
    const [positionIndicatorVisible, setPositionIndicatorVisible] = useState(false);
    const positionIndicatorTimeoutRef = useRef<number | null>(null);

    // Handle Safari bfcache: reload page when restored from back-forward cache
    useEffect(() => {
        const handlePageShow = (e: PageTransitionEvent) => {
            if (e.persisted) {
                console.debug("[FoliateReader] Page restored from bfcache, reloading...");
                window.location.reload();
            }
        };
        window.addEventListener("pageshow", handlePageShow);
        return () => window.removeEventListener("pageshow", handlePageShow);
    }, []);

    // Initialize foliate-view
    useEffect(() => {
        // Only initialize once when we have src or fileBlob and are in waiting-src state
        if ((!props.src && !props.fileBlob) || viewerState.status !== "waiting-src") {
            return;
        }

        setViewerState({ status: "loading" });

        // Capture logs during initialization for debugging
        const capturedLogs: string[] = [];
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;
        const originalConsoleDebug = console.debug;
        const captureLog = (level: string, ...args: unknown[]) => {
            const message = args
                .map((arg) => (arg instanceof Error ? arg.stack || arg.message : String(arg)))
                .join(" ");
            capturedLogs.push(`[${level}] ${message}`);
        };
        console.error = (...args) => {
            captureLog("ERROR", ...args);
            originalConsoleError.apply(console, args);
        };
        console.warn = (...args) => {
            captureLog("WARN", ...args);
            originalConsoleWarn.apply(console, args);
        };
        console.debug = (...args) => {
            captureLog("DEBUG", ...args);
            originalConsoleDebug.apply(console, args);
        };

        const restoreConsole = () => {
            console.error = originalConsoleError;
            console.warn = originalConsoleWarn;
            console.debug = originalConsoleDebug;
        };

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
                    console.debug("[FoliateReader] relocate", {
                        fraction: detail.fraction,
                        cfi: detail.cfi?.substring(0, 50)
                    });
                    setCanMemoContent(true);
                    // Store latest relocate detail for use when updating book status
                    setLatestRelocateDetail(detail);
                    // Clear any stuck selection/focus state on page change
                    if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                    }
                    window.getSelection()?.removeAllRanges();

                    // Show position indicator temporarily on page turn
                    if (positionIndicatorTimeoutRef.current) {
                        window.clearTimeout(positionIndicatorTimeoutRef.current);
                    }
                    setPositionIndicatorVisible(true);
                    positionIndicatorTimeoutRef.current = window.setTimeout(() => {
                        setPositionIndicatorVisible(false);
                    }, 1000);
                });

                // Disable paginator's touch handling to prevent conflict with tap navigation
                // This prevents snap() from being called on touchend, which can race with our navigation
                const disablePaginatorTouch = (e: TouchEvent) => {
                    if (e.touches && e.touches.length > 1) return; // Allow pinch zoom
                    e.stopImmediatePropagation();
                };

                view.addEventListener("load", (e: Event) => {
                    const detail = (e as CustomEvent<{ doc: Document; index: number }>).detail;
                    console.debug("[FoliateReader] load event fired", {
                        index: detail.index,
                        docTitle: detail.doc?.title
                    });

                    // Reapply styles to ensure consistent font sizing across all sections
                    if (currentStylesRef.current && viewRef.current?.renderer?.setStyles) {
                        viewRef.current.renderer.setStyles(currentStylesRef.current);
                    }

                    // Add keyboard event listener to the loaded document
                    detail.doc.addEventListener("keydown", handleKeydown);

                    // Disable paginator's touch handling (swipe/snap) - we use tap navigation instead
                    detail.doc.addEventListener("touchstart", disablePaginatorTouch, { capture: true });
                    detail.doc.addEventListener("touchmove", disablePaginatorTouch, { capture: true });
                    detail.doc.addEventListener("touchend", disablePaginatorTouch, { capture: true });

                    // Add selection change listener
                    detail.doc.addEventListener("selectionchange", () => {
                        const selection = detail.doc.getSelection();
                        if (selection && selection.toString().trim()) {
                            setCanMemoContent(true);
                        }
                    });

                    // Add pointer event handlers for navigation on iframe content
                    const TAP_THRESHOLD_MS = 300;
                    const MOVE_THRESHOLD_PX = 10;
                    let pointerStart: { time: number; x: number; y: number } | null = null;
                    let hadSelectionOnPointerDown = false;
                    let hadPointerMove = false;

                    detail.doc.addEventListener("pointerdown", (e: PointerEvent) => {
                        if (!e.isPrimary) return;
                        // Record if there was a selection at pointerdown time
                        // This is needed because on touch devices, the selection may not be
                        // finalized yet at pointerup time when completing a selection gesture
                        const selection = detail.doc.getSelection();
                        hadSelectionOnPointerDown = !!(selection && selection.toString().trim());
                        hadPointerMove = false;
                        pointerStart = {
                            time: Date.now(),
                            x: e.screenX,
                            y: e.screenY
                        };
                    });

                    detail.doc.addEventListener("pointermove", (e: PointerEvent) => {
                        if (!e.isPrimary) return;
                        // Track significant movement during touch/pointer interaction
                        // This helps detect selection gestures on iOS where selection
                        // may not be finalized at pointerup time
                        // Use threshold (8px) to filter out finger jitter during tap
                        if (pointerStart && !hadPointerMove) {
                            const moveDx = Math.abs(e.screenX - pointerStart.x);
                            const moveDy = Math.abs(e.screenY - pointerStart.y);
                            if (moveDx > 8 || moveDy > 8) {
                                hadPointerMove = true;
                            }
                        }
                    });

                    detail.doc.addEventListener("pointerup", (e: PointerEvent) => {
                        if (!e.isPrimary) return;
                        const start = pointerStart;
                        const wasPointerMove = hadPointerMove;
                        pointerStart = null;

                        const selection = detail.doc.getSelection();
                        const selectionText = selection?.toString().trim() || "";
                        console.debug("[FoliateReader] pointerup on doc index:", detail.index, {
                            hasStart: !!start,
                            hadPointerMove: wasPointerMove,
                            hadSelectionOnPointerDown,
                            hasSelectionNow: !!selectionText,
                            pointerType: e.pointerType,
                            startPos: start ? { x: start.x, y: start.y } : null,
                            endPos: { x: e.screenX, y: e.screenY }
                        });

                        if (!start) return;

                        // Check timing - ignore long press (used for selection)
                        const duration = Date.now() - start.time;
                        if (duration > TAP_THRESHOLD_MS) {
                            console.debug("[FoliateReader] ignored - long press", duration);
                            return;
                        }

                        // Check movement - ignore drag
                        const dx = Math.abs(e.screenX - start.x);
                        const dy = Math.abs(e.screenY - start.y);
                        if (dx > MOVE_THRESHOLD_PX || dy > MOVE_THRESHOLD_PX) {
                            console.debug("[FoliateReader] ignored - drag", { dx, dy });
                            return;
                        }

                        // Ignore if there was a selection at pointerdown time
                        // This catches selection gestures where the selection may not be
                        // finalized yet at pointerup time
                        if (hadSelectionOnPointerDown) {
                            console.debug("[FoliateReader] ignored - had selection on pointerdown");
                            return;
                        }

                        // Ignore if there's a text selection at pointerup time
                        if (selectionText) {
                            console.debug("[FoliateReader] ignored - has selection");
                            return;
                        }

                        // For touch devices, ignore if there was any pointer movement
                        // On iOS, selection may not be finalized at pointerup time,
                        // so we use movement as a signal that this was a selection gesture
                        if (e.pointerType === "touch" && hadPointerMove) {
                            console.debug("[FoliateReader] ignored - touch with move (possible selection gesture)");
                            return;
                        }

                        // Calculate tap position relative to the main window
                        // Use screenX/screenY for reliable cross-iframe coordinate calculation
                        const windowScreenX = window.top?.screenX ?? window.screenX ?? 0;
                        const windowScreenY = window.top?.screenY ?? window.screenY ?? 0;
                        const viewportWidth = window.top?.innerWidth ?? window.innerWidth;
                        const viewportHeight = window.top?.innerHeight ?? window.innerHeight;

                        // Get position relative to the main window
                        const xInWindow = e.screenX - windowScreenX;
                        const yInWindow = e.screenY - windowScreenY;

                        // Determine which zone (3x3 grid) was tapped
                        const col = xInWindow < viewportWidth / 3 ? 0 : xInWindow < (viewportWidth * 2) / 3 ? 1 : 2;
                        const row = yInWindow < viewportHeight / 3 ? 0 : yInWindow < (viewportHeight * 2) / 3 ? 1 : 2;
                        const action = tapZonesRef.current[row][col];

                        console.debug("[FoliateReader] tap zone", {
                            xInWindow,
                            yInWindow,
                            viewportWidth,
                            viewportHeight,
                            row,
                            col,
                            action
                        });

                        // Execute the action
                        switch (action) {
                            case "next":
                                navigate(view, "next");
                                break;
                            case "prev":
                                navigate(view, "prev");
                                break;
                            case "menu":
                                setMenuState((prev) => (prev === "open" ? "closed" : "open"));
                                break;
                            case "close":
                                window.location.href = "/";
                                break;
                            case "none":
                                // Do nothing
                                break;
                        }
                    });

                    detail.doc.addEventListener("pointercancel", () => {
                        pointerStart = null;
                    });
                });

                // Append to container
                if (containerRef.current) {
                    // Disable horizontal swipe gestures, allow vertical scroll and pinch zoom
                    view.style.cssText = "width: 100%; height: 100%; touch-action: pan-y pinch-zoom;";
                    containerRef.current.appendChild(view);
                }

                // Get the book blob - prefer direct blob over fetching from URL
                let blob: Blob | undefined;
                if (props.fileBlob && props.fileBlob.size > 0) {
                    console.debug("[FoliateReader] Using direct fileBlob, size:", props.fileBlob.size);
                    // Validate blob is readable (Safari can have stale blobs from cache)
                    try {
                        await props.fileBlob.slice(0, 1).arrayBuffer();
                        blob = props.fileBlob;
                    } catch (blobError) {
                        console.warn("[FoliateReader] fileBlob validation failed, falling back to fetch:", blobError);
                        if (!props.src) {
                            throw new Error("fileBlob is invalid and no src available");
                        }
                        // Fall through to fetch
                        blob = undefined;
                    }
                }
                if (!blob && props.src) {
                    console.debug("[FoliateReader] Fetching book from:", props.src.substring(0, 100));
                    const response = await fetch(props.src);
                    if (!response.ok) {
                        throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
                    }
                    console.debug("[FoliateReader] Fetch response:", response.status, "type:", response.type);
                    blob = await response.blob();
                    console.debug("[FoliateReader] Blob size:", blob.size, "type:", blob.type);
                }
                if (!blob) {
                    throw new Error("No valid src or fileBlob available");
                }

                if (blob.size === 0) {
                    throw new Error("Book blob is empty");
                }
                const file = new File([blob], props.bookFileName || "book.epub", {
                    type: "application/epub+zip"
                });
                console.debug("[FoliateReader] Opening file:", file.name, "size:", file.size);

                try {
                    await view.open(file);
                    console.debug("[FoliateReader] Book opened successfully");
                } catch (openError) {
                    console.error("[FoliateReader] view.open failed:", openError);
                    throw openError;
                }

                // Set styles (fontSize: 100 = 16px base)
                const initialCSS = getCSS({
                    spacing: 1.4,
                    justify: true,
                    hyphenate: true,
                    fontSize: 100
                });
                currentStylesRef.current = initialCSS;
                view.renderer.setStyles?.(initialCSS);

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

                // Also add to view itself for redundancy
                view.addEventListener("touchstart", disablePaginatorTouch, { capture: true });
                view.addEventListener("touchmove", disablePaginatorTouch, { capture: true });
                view.addEventListener("touchend", disablePaginatorTouch, { capture: true });

                isInitialized.current = true;
                restoreConsole();

                // 最後に読んだ書籍として保存（PWA自動遷移用）
                const metadata = view.book?.metadata;
                saveLastRead({
                    fileId: props.id,
                    fileName: props.bookFileName,
                    title: getTitleString(metadata?.title) || props.bookFileName,
                    viewer: "epub:foliate"
                });

                setViewerState({ status: "ready" });
            } catch (error) {
                // Log error before restoring console so it gets captured
                console.error("Failed to initialize foliate reader:", error);
                restoreConsole();
                setViewerState({
                    status: "error",
                    error: error instanceof Error ? error.message : "Unknown error",
                    logs: capturedLogs
                });
            }
        };

        initFoliate();

        return () => {
            restoreConsole();
            if (viewRef.current) {
                try {
                    viewRef.current.close();
                } catch (e) {
                    console.warn("Error closing foliate view:", e);
                }
                // Remove from DOM
                viewRef.current.remove();
                viewRef.current = null;
            }
            isInitialized.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        props.src,
        props.fileBlob,
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
                // Next page (increase page number)
                navigate(view, "next");
            } else if (event.key === "k" || event.key === "ArrowLeft") {
                // Previous page (decrease page number)
                navigate(view, "prev");
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
        if (!selected?.text) {
            return;
        }
        setMemoStock((prev) => addToMemoStock(prev, selected));
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

    const applyFontSize = useCallback((size: number) => {
        const view = viewRef.current;
        if (!view?.renderer?.setStyles) return;
        const css = getCSS({
            spacing: 1.4,
            justify: true,
            hyphenate: true,
            fontSize: size
        });
        currentStylesRef.current = css;
        view.renderer.setStyles(css);
    }, []);

    const increaseFontSize = useCallback(() => {
        setFontSize((prev) => {
            const newSize = Math.min(prev + 10, 200);
            applyFontSize(newSize);
            return newSize;
        });
    }, [applyFontSize]);

    const decreaseFontSize = useCallback(() => {
        setFontSize((prev) => {
            const newSize = Math.max(prev - 10, 50);
            applyFontSize(newSize);
            return newSize;
        });
    }, [applyFontSize]);

    const enableMemoButton = useMemo(() => {
        if (memoStock.length > 0) return true;
        return canMemoContent && !isAddingMemo;
    }, [canMemoContent, isAddingMemo, memoStock.length]);

    // Show error if foliate failed to initialize
    if (viewerState.status === "error") {
        const handleClearCacheAndReload = async () => {
            try {
                // Clear both SWR cache and IndexedDB cache
                if (props.onClearCache) {
                    await props.onClearCache();
                }
                await clearIndexedDBCache();
                window.location.reload();
            } catch (error) {
                console.error("Failed to clear cache:", error);
                window.location.reload();
            }
        };

        return (
            <div style={{ padding: "20px" }}>
                <h2 style={{ color: "red" }}>Failed to load EPUB viewer</h2>
                <p style={{ color: "red" }}>{viewerState.error}</p>
                <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                    <button
                        onClick={handleClearCacheAndReload}
                        style={{
                            padding: "10px 20px",
                            fontSize: "14px",
                            cursor: "pointer"
                        }}
                    >
                        Clear Cache & Reload
                    </button>
                    <button
                        onClick={() => (window.location.href = "/")}
                        style={{
                            padding: "10px 20px",
                            fontSize: "14px",
                            cursor: "pointer"
                        }}
                    >
                        Back to Home
                    </button>
                </div>
                <details style={{ marginTop: "20px" }}>
                    <summary style={{ cursor: "pointer", color: "#666" }}>
                        Debug Logs ({viewerState.logs.length})
                    </summary>
                    <pre
                        style={{
                            marginTop: "10px",
                            padding: "10px",
                            background: "#f5f5f5",
                            borderRadius: "4px",
                            fontSize: "12px",
                            overflow: "auto",
                            maxHeight: "300px",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all"
                        }}
                    >
                        {viewerState.logs.length > 0 ? viewerState.logs.join("\n") : "(No logs captured)"}
                        {"\n\n--- Context ---"}
                        {"\nsrc: " + (props.src ? props.src.substring(0, 100) + "..." : "undefined")}
                        {"\nfileBlob: " +
                            (props.fileBlob
                                ? `Blob(size=${props.fileBlob.size}, type=${props.fileBlob.type})`
                                : "undefined")}
                        {"\nfileName: " + props.bookFileName}
                        {"\nuserAgent: " + (typeof navigator !== "undefined" ? navigator.userAgent : "N/A")}
                    </pre>
                </details>
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
            {/* Top menu bar */}
            <div
                className={styles.menuBar}
                style={{
                    display: menuState === "open" ? "flex" : "none"
                }}
            >
                <button
                    className={styles.menuButton}
                    onClick={() => (window.location.href = "/")}
                    title="Back to book list"
                >
                    ←
                </button>
                <button className={styles.menuButton} onClick={() => setShowTOC(!showTOC)} title="Table of Contents">
                    ☰
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
                <button className={styles.menuButton} onClick={decreaseFontSize} title="Decrease font size">
                    A-
                </button>
                <span style={{ fontSize: "12px", minWidth: "36px", textAlign: "center" }}>{fontSize}%</span>
                <button className={styles.menuButton} onClick={increaseFontSize} title="Increase font size">
                    A+
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

            {/* Memo buttons */}
            {hasCompletedNotionSettings && viewerState.status === "ready" && menuState === "closed" && (
                <div
                    style={{
                        position: "fixed",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: "60px",
                        paddingBottom: "env(safe-area-inset-bottom, 0)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        pointerEvents: "none",
                        userSelect: "none",
                        WebkitUserSelect: "none",
                        zIndex: 1000
                    }}
                >
                    <button
                        className={`Button small violet ${styles.memoButton}`}
                        disabled={!canMemoContent || isAddingMemo}
                        title="Stock Memo"
                        style={{
                            pointerEvents: "auto",
                            marginLeft: "env(safe-area-inset-left, 0)"
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
                            pointerEvents: "auto",
                            marginRight: "env(safe-area-inset-right, 0)"
                        }}
                        onClick={onClickMemo}
                    >
                        Memo
                    </button>
                </div>
            )}

            {/* Foliate view container */}
            <div
                ref={containerRef}
                className={styles.viewerContainer}
                style={{
                    width: "100%",
                    height: hasCompletedNotionSettings
                        ? `calc(100% - ${isPWAStandaloneMode() ? MEMO_BUTTON_AREA_HEIGHT_PWA : MEMO_BUTTON_AREA_HEIGHT}px)`
                        : "100%"
                }}
            />

            <ToastComponent onClickJumpLastPage={onClickJumpLastPage} />

            {/* Position indicator - temporary on page turn, always visible when menu is open */}
            {viewerState.status === "ready" && latestRelocateDetail && (
                <div
                    className={`${styles.positionIndicator} ${positionIndicatorVisible || menuState === "open" ? styles.visible : styles.fadeOut}`}
                >
                    <span className={styles.current}>
                        {latestRelocateDetail.location?.current ?? Math.round(latestRelocateDetail.fraction * 100)}
                    </span>
                    <span className={styles.delimiter}>/</span>
                    <span>{latestRelocateDetail.location?.total ?? 100}</span>
                    <span className={styles.percent}>
                        (<span className={styles.current}>{Math.round(latestRelocateDetail.fraction * 100)}</span>
                        <span className={styles.unit}>%</span>)
                    </span>
                </div>
            )}

            {/* Upload status indicator */}
            {isUploading && <div className={styles.uploadStatus}>Uploading to Notion...</div>}
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
