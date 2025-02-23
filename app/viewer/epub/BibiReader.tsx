"use client";
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    BibiPositionMarker,
    BookItem,
    decodeBookMarker,
    hasDataBook,
    isBibiBookItem,
    isBibiPositionMaker,
    NO_BOOK_DATA,
    useNotion
} from "../../notion/useNotion";
import { generateBackoff } from "exponential-backoff-generator";
import { http } from "msw";
import type { SetupWorker } from "msw/browser";
import { useToast } from "../useToast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useOnetimeStorage } from "../../settings/TemporaryStorage";
import { Loading } from "../../components/Loading";
import { joinMemoStock } from "../../utils/joinMemoStock";

const getSetupWorker = async () => {
    const { setupWorker } = await import("msw/browser");
    return setupWorker;
};

type ContentWindow = WindowProxy & {
    viewerController: ViewerContentMethod;
};
export type BibiReaderProps = {
    id: string;
    bookFileName: string;
    src: string | undefined;
    initialPage?: string;
    initialMarker?: string;
    translation?: boolean;
};
export type ViewerContentMethod = {
    movePrevPage: () => Promise<void>;
    moveNextPage: () => Promise<void>;
    moveToPositionMarker: (marker: BibiPositionMarker) => Promise<void>;
    getTotalPage: () => Promise<number>;
    getCurrentPage: () => Promise<number>;
    getCurrentPositionMaker: () => Promise<BibiPositionMarker>;
    getSelectedText: () => Promise<{ text: string; selectors: { start: string; end: string } } | null>;
    getCurrentPageText: () => Promise<{ text: string; selectors: { start: string; end: string } } | null>;
    getCurrentFrameWindow: () => Promise<ContentWindow | undefined>;
    removeSelection: () => Promise<void>;
    getBookInfo: () => Promise<{
        type: "EPUB";
        title: string;
        author: string;
        publisher: string;
        id: string;
    }>;
    onChangePage: (fn: (page: number) => void) => Promise<() => void>;
    onKeydown: (fn: (event: KeyboardEvent) => void) => Promise<() => void>;
    onChangeMenuState: (fn: (state: "open" | "closed") => void) => Promise<() => void>;
    onChangeSelection: (fn: (selection?: string) => void) => Promise<() => void>;

    enableTranslation: () => void;
    disableTranslation: () => void;
};

const waitContentWindowLoad = async (contentWindow: ContentWindow) => {
    // lazy initialized
    await new Promise<void>(async (resolve) => {
        if (contentWindow.document.readyState === "complete") {
            const backoff = generateBackoff();
            for (const { sleep } of backoff) {
                try {
                    if (typeof contentWindow.viewerController === "object") {
                        return resolve();
                    } else {
                        throw new Error("contentWindow.viewerController is not defined");
                    }
                } catch (error) {
                    await sleep(); // wait 100ms, 200ms, 400ms, 800ms ...
                }
            }
            throw new Error("waitContentWindowLoad failed at all");
        } else {
            contentWindow.addEventListener("load", () => {
                resolve();
            });
        }
    });
};

const usePageVisibilityHide = (fn: () => void) => {
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                fn();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [fn]);
};
const useEpubServiceWorker = (props: { id: string; src?: string; initialPage?: string }) => {
    const [isReadyBook, setIsReadyBook] = useState(false);
    const { set } = useOnetimeStorage();
    const bookId = props.id.replace("id:", "");
    const workerRef = useRef<SetupWorker | null>(null);
    useEffect(() => {
        const src = props.src;
        if (!src) {
            console.debug("src is empty");
            return;
        }
        console.debug("create mock server for", src, bookId);
        const initWorker = async () => {
            const worker = await (await getSetupWorker())(
                // Bibi request
                // 1. /META-INF/container.xml
                // 2. /OEBPS/content.opf
                // Response epub content as /OEBPS/content.opf
                http.get("/bibi-bookshelf/" + bookId + "/META-INF/container.xml", () => {
                    const xml = `<?xml version="1.0" ?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/package.opf" media-type="application/oebps-package+xml" />
  </rootfiles>
</container>
`;
                    return new Response(xml, {
                        headers: {
                            "Content-Type": "application/xml"
                        }
                    });
                }),
                http.get("/bibi-bookshelf/" + bookId + "/OEBPS/package.opf", async () => {
                    try {
                        const epub = await fetch(src).then((res) => res.arrayBuffer());
                        return new Response(epub, {
                            headers: {
                                "Content-Length": epub.byteLength.toString(),
                                "Content-Type": "application/epub+zip"
                            }
                        });
                    } catch (error) {
                        console.error(
                            new Error("fetch book OEBPS/package.opf", {
                                cause: error
                            })
                        );
                        return new Response("Error", {
                            status: 500
                        });
                    }
                }),
                http.get("/bibi-bookshelf/" + bookId, async () => {
                    try {
                        const epub = await fetch(src).then((res) => res.arrayBuffer());
                        // Respond with the "ArrayBuffer".
                        return new Response(epub, {
                            headers: {
                                "Content-Length": epub.byteLength.toString(),
                                "Content-Type": "application/epub+zip"
                            }
                        });
                    } catch (error) {
                        // probably, blob is broken
                        console.error(
                            new Error("failed to fetch book content", {
                                cause: error
                            })
                        );
                        // disable cache for fileId
                        set(props.id, {
                            noCache: true
                        });
                        console.debug("disable cache for", props.id);
                        return new Response("Error", {
                            status: 500
                        });
                    }
                })
            );
            return worker;
        };

        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
                reject(new Error("Service Worker is timeout"));
            }, 3_000);
        });

        const workerPromise = Promise.race([
            initWorker().then(worker => {
                workerRef.current = worker;
                return worker.start({
                    onUnhandledRequest: "bypass",
                    waitUntilReady: true
                }).then(() => {
                    setIsReadyBook(true);
                    console.debug("Service Worker is Ready!");
                    return worker;
                });
            }),
            timeoutPromise
        ]).catch(async (error) => {
            console.debug("Service Worker is failed to start", error.message);
            console.error(error);
            // unregister worker
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                await registration.unregister();
            }
            // reload page
            window.location.reload();
            return null;
        });

        return () => {
            console.debug("Service Worker is stop on unmount");
            workerRef.current?.stop();
        };
    }, [bookId, set, props.id, props.src]);
    // on hide page, stop worker
    // Note: SW is required when loading page.
    // After loading page, SW is not required.
    usePageVisibilityHide(() => {
        console.debug("Service Worker stop on hide page");
        workerRef.current?.stop();
    });
    const bookUrl = useMemo(() => {
        const url = new URL("/bibi/index.html", location.href);
        url.search = new URLSearchParams({
            book: bookId,
            ...(props.initialPage
                ? {
                      p: props.initialPage
                  }
                : {})
        }).toString();
        console.debug("bookUrl", url.toString());
        return url.toString();
    }, [bookId, props.initialPage]);
    return {
        isReadyBook,
        bookUrl
    } as const;
};
export const BibiReader: FC<BibiReaderProps> = (props) => {
    const { isReadyBook, bookUrl } = useEpubServiceWorker({
        id: props.id,
        src: props.src,
        initialPage: props.initialPage
    });
    const [menuState, setMenuState] = useState<"open" | "closed">("closed");
    const { currentBook, updateBookStatus, addMemo, hasCompletedNotionSettings } = useNotion({
        fileId: props.id,
        fileName: props.bookFileName
    });
    const { showToast, bookInfo, ToastComponent } = useToast();
    const isInitialized = useRef(false);
    const bibiFrame = useRef<HTMLIFrameElement>();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [memoStock, setMemoStock] = useState<{ text: string; selectors: { start: string; end: string } }[]>([]);
    const [isTranslation, setIsTranslation] = useState(props.translation);
    const onClickTranslationButton = useCallback(async () => {
        if (!bibiFrame.current) {
            return;
        }
        const contentWindow = bibiFrame.current.contentWindow as ContentWindow;
        if (isTranslation) {
            contentWindow.viewerController.disableTranslation();
        } else {
            contentWindow.viewerController.enableTranslation();
        }
        setIsTranslation(!isTranslation);

        const newParams = new URLSearchParams(searchParams ?? []);
        if (isTranslation) {
            newParams.delete("translation");
        } else {
            newParams.set("translation", "true");
        }
        router.replace(`${pathname}?${newParams.toString()}`);
    }, [isTranslation, pathname, router, searchParams]);
    const restoreLastPosition = useCallback(
        async (contentWindow: ContentWindow, currentBook: BookItem) => {
            await waitContentWindowLoad(contentWindow);
            const currentMarker = await contentWindow.viewerController.getCurrentPositionMaker();
            if (currentMarker == null || currentBook.lastMarker == null) {
                isInitialized.current = true;
                return;
            }
            if (!isBibiBookItem(currentBook)) {
                console.debug({ currentBook });
                throw new Error("currentBook is not BibiBookItem. This is unexpected error");
            }
            const isDifferencePage = Math.abs(currentMarker.ItemIndex - currentBook.lastMarker.ItemIndex) > 1;
            console.debug("last restore position check", {
                currentMarker: currentMarker,
                lastMarker: currentBook.lastMarker,
                isDifferencePage
            });
            if (isDifferencePage) {
                showToast({
                    current: currentMarker,
                    lastRead: currentBook.lastMarker
                });
            }
        },
        [showToast]
    );
    const tryToRestoreLastPositionAtFirst = useCallback(async () => {
        // execute once
        if (isInitialized.current) {
            return;
        }
        if (!currentBook) {
            return;
        }
        if (!bibiFrame.current) {
            return;
        }
        console.debug("new load book 📚");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for load window
        const contentWindow = bibiFrame.current.contentWindow as ContentWindow;
        console.debug("restoreLastPosition", {
            isInitialized: isInitialized.current,
            currentBook,
            bibiFrame: bibiFrame.current
        });
        // prefer ?marker rather than restore position
        if (props.initialMarker) {
            const marker = decodeBookMarker(props.initialMarker);
            console.debug("restore to initial marker", {
                marker: marker
            });
            if (marker) {
                if (!isBibiPositionMaker(marker)) {
                    console.error("invalid marker", { marker });
                    throw new Error("marker is not BibiPositionMaker. This is unexpected error");
                }
                await waitContentWindowLoad(contentWindow);
                await contentWindow.viewerController.moveToPositionMarker(marker);
            }
        } else if (hasDataBook(currentBook)) {
            await restoreLastPosition(contentWindow, currentBook);
        }
        isInitialized.current = true;
    }, [currentBook, props.initialMarker, restoreLastPosition]);
    useEffect(() => {
        console.debug("Updated Current Book", currentBook);
        if (!isInitialized.current && currentBook) {
            tryToRestoreLastPositionAtFirst().catch((e) => {
                console.error(e);
            });
        }
    }, [currentBook, tryToRestoreLastPositionAtFirst]);
    useEffect(
        function registerNewBookStatusIfBookIsNotFoundOnDB() {
            const current = bibiFrame.current;
            if (currentBook === NO_BOOK_DATA && current) {
                // TODO: this line change behavior?
                console.debug("Check registerNewBookStatusIfBookIsNotFoundOnDB", {
                    currentBook,
                    current
                });
                (async function registerBook() {
                    const contentWindow = current.contentWindow as ContentWindow;
                    const bookInfo = await contentWindow.viewerController.getBookInfo();
                    const currentPage = await contentWindow.viewerController.getCurrentPage();
                    const totalPage = await contentWindow.viewerController.getTotalPage();
                    const lastMarker = await contentWindow.viewerController.getCurrentPositionMaker();
                    return updateBookStatus({
                        viewer: "epub:bibi",
                        // pageId: bookInfo.id, // first time
                        fileId: props.id,
                        fileName: props.bookFileName,
                        publisher: bookInfo.publisher,
                        title: bookInfo.title,
                        authors: bookInfo.author.split(/[,、]/).map((author) => author.trim()),
                        currentPage,
                        totalPage,
                        lastMarker
                    });
                })();
            }
        },
        [currentBook, props.bookFileName, props.id, updateBookStatus]
    );

    // has selected text or page content
    const [canMemoContent, setCanMemoContent] = useState(false);
    const viewerControllerOnKeydownRef = useRef<() => void>();
    const viewerControllerOnChangePageRef = useRef<() => void>();
    const viewerControllerOnChangeMenuRef = useRef<() => void>();
    const viewerControllerOnSelectionChangeRef = useRef<() => void>();
    const onInitializeIframeRef = useCallback(
        async (frameElement: HTMLIFrameElement) => {
            bibiFrame.current = frameElement;
            if (bibiFrame.current && !isInitialized.current) {
                await tryToRestoreLastPositionAtFirst();
            }
            if (bibiFrame.current) {
                const contentWindow = bibiFrame.current.contentWindow as ContentWindow;
                // lazy initialized
                await waitContentWindowLoad(contentWindow);
                const watchChangePage = async ({ attempts }: { attempts: number }) => {
                    console.debug("Try to add listener to page. attempts: " + attempts);
                    viewerControllerOnChangeMenuRef.current?.();
                    viewerControllerOnChangeMenuRef.current = await contentWindow.viewerController.onChangeMenuState(
                        (state) => {
                            setMenuState(state);
                        }
                    );
                    // on selection change
                    viewerControllerOnSelectionChangeRef.current?.();
                    viewerControllerOnSelectionChangeRef.current =
                        await contentWindow.viewerController.onChangeSelection((selection) => {
                            console.debug("selection change", {
                                selection
                            });
                            if (selection) {
                                setCanMemoContent(true);
                            }
                        });
                    // on keydown
                    viewerControllerOnKeydownRef.current?.();
                    viewerControllerOnKeydownRef.current = await contentWindow.viewerController.onKeydown((event) => {
                        if (/* Shift + A */ event.shiftKey && event.key === "A") {
                            onClickStockMemo();
                        } else if (/* Shift + S */ event.shiftKey && event.key === "S") {
                            onClickMemo();
                        } else if (/* J */ event.key === "j") {
                            contentWindow.viewerController.moveNextPage();
                        } else if (/* K */ event.key === "k") {
                            contentWindow.viewerController.movePrevPage();
                        }
                    });
                    // on change page
                    viewerControllerOnChangePageRef.current?.();
                    viewerControllerOnChangePageRef.current = await contentWindow.viewerController.onChangePage(
                        async () => {
                            if (!isInitialized.current) {
                                console.debug("not yet initialized");
                                return;
                            }
                            const bookInfo = await contentWindow.viewerController.getBookInfo();
                            const currentPage = await contentWindow.viewerController.getCurrentPage();
                            const totalPage = await contentWindow.viewerController.getTotalPage();
                            const lastMarker = await contentWindow.viewerController.getCurrentPositionMaker();
                            const currentPageText = await contentWindow.viewerController.getCurrentPageText();
                            console.debug("onChangePage", {
                                bookInfo,
                                currentBook,
                                lastMarker,
                                currentPage,
                                totalPage,
                                currentPageText: currentPageText
                            });
                            await updateBookStatus({
                                viewer: "epub:bibi", // TODO: currently, only support bibi
                                pageId: bookInfo.id,
                                fileId: props.id,
                                fileName: props.bookFileName,
                                publisher: bookInfo.publisher,
                                title: bookInfo.title,
                                authors: bookInfo.author
                                    .split(",")
                                    .map((author) => author.trim())
                                    .filter((author) => author !== ""),
                                currentPage,
                                totalPage,
                                lastMarker
                            });
                            // if you get current page text, can memo it
                            const canMemo = Boolean(currentPageText?.text);
                            setCanMemoContent(canMemo);
                        }
                    );
                };
                const backoff = generateBackoff();
                for (const { sleep, attempts } of backoff) {
                    try {
                        await watchChangePage({ attempts });
                        if (isTranslation) {
                            contentWindow.viewerController.enableTranslation();
                        }
                        return;
                    } catch (error) {
                        await sleep(); // wait 100ms, 200ms, 400ms, 800ms ...
                    }
                }

                console.error(new Error("Fail to initialized book viewer"), {
                    current: bibiFrame.current
                });
                alert("Fail to initialize book viewer. Please reload page");
            } else {
                viewerControllerOnChangeMenuRef.current?.();
                viewerControllerOnChangePageRef.current?.();
                viewerControllerOnSelectionChangeRef.current?.();
            }
        },
        [currentBook, isTranslation, props.bookFileName, props.id, tryToRestoreLastPositionAtFirst, updateBookStatus]
    );
    const onClickJumpLastPage = useCallback(async () => {
        if (bibiFrame.current && hasDataBook(currentBook) && bookInfo?.lastRead) {
            const contentWindow = bibiFrame.current.contentWindow as ContentWindow;
            console.debug("jump to Last marker", bookInfo?.lastRead);
            // @ts-expect-error
            await contentWindow.viewerController.moveToPositionMarker(bookInfo?.lastRead);
        }
    }, [bookInfo?.lastRead, currentBook]);

    const [isAddingMemo, setIsAddingMemo] = useState(false);
    const onClickStockMemo = useCallback(async () => {
        console.debug("onClickStockMemo");
        if (bibiFrame.current) {
            const contentWindow = bibiFrame.current.contentWindow as ContentWindow;
            // selected > page
            const selected =
                (await contentWindow.viewerController.getSelectedText()) ??
                (await contentWindow.viewerController.getCurrentPageText());
            if (!selected?.text) {
                return;
            }
            setMemoStock((prev) => {
                return [...prev, selected];
            });
        }
    }, []);

    const onClickMemo = useCallback(async () => {
        if (bibiFrame.current) {
            const contentWindow = bibiFrame.current.contentWindow as ContentWindow;
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
            // stock > selected > page
            const selected = stockedMemo
                ? stockedMemo
                : (await contentWindow.viewerController.getSelectedText()) ??
                  (await contentWindow.viewerController.getCurrentPageText());
            console.debug("selected object", {
                selected,
                stockedMemo
            });
            const currentPage = await contentWindow.viewerController.getCurrentPage();
            const currentMarker = await contentWindow.viewerController.getCurrentPositionMaker();
            if (!selected?.text) {
                console.debug("selected text is empty", { selected, currentPage, currentMarker });
                window.alert("Please select text to add memo");
                return;
            }
            try {
                setIsAddingMemo(true);
                await addMemo({
                    memo: selected.text,
                    currentPage,
                    marker: {
                        ...currentMarker,
                        highlightSelectors: selected.selectors
                    }
                }).then(() => {
                    setMemoStock([]);
                    return contentWindow.viewerController.removeSelection();
                });
            } finally {
                setIsAddingMemo(false);
            }
        }
    }, [addMemo, memoStock]);
    const onClickOpenNotionPage = useCallback(async () => {
        if (!hasDataBook(currentBook)) {
            return;
        }
        window.open(currentBook.pageUrl, "_blank");
    }, [currentBook]);
    const enableMemoButton = useMemo(() => {
        if (memoStock.length > 0) {
            return true;
        }
        return canMemoContent && !isAddingMemo;
    }, [canMemoContent, isAddingMemo, memoStock.length]);
    if (!isReadyBook) {
        return <Loading>Loading Viewer...</Loading>;
    }
    return (
        <div style={{ height: "100dvh" }} className={"full-page"}>
            <div
                hidden={menuState === "closed"}
                style={{
                    position: "fixed",
                    top: 0,
                    left: "calc(50vw - 50px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100px",
                    margin: "auto"
                }}
            >
                <button
                    className="Button small violet"
                    style={{
                        height: "32px",
                        margin: "6px 6px",
                        background: isTranslation ? "#ddd" : "#fff",
                        border: "1px solid #ddd"
                    }}
                    title={"Translate Page"}
                    onClick={onClickTranslationButton}
                >
                    A
                </button>
                <button
                    className="Button small violet"
                    hidden={!hasCompletedNotionSettings}
                    title={"Open Notion Page"}
                    style={{
                        height: "32px",
                        margin: "6px 6px",
                        background: "#fff",
                        border: "1px solid #ddd"
                    }}
                    onClick={onClickOpenNotionPage}
                >
                    N
                </button>
            </div>
            <button
                className="Button small violet"
                hidden={!hasCompletedNotionSettings || menuState === "open"}
                disabled={!canMemoContent || isAddingMemo}
                title={"Stock Memo"}
                style={{
                    position: "fixed",
                    left: 0,
                    bottom: 0,
                    zIndex: 1000,
                    padding: "1rem",
                    borderRadius: "4px"
                }}
                onClick={onClickStockMemo}
            >
                📁+{memoStock.length}
            </button>
            <button
                className="Button small violet"
                hidden={!hasCompletedNotionSettings || menuState === "open"}
                disabled={!enableMemoButton}
                title={"Add Memo"}
                style={{
                    position: "fixed",
                    right: 0,
                    bottom: 0,
                    zIndex: 1000,
                    padding: "1rem",
                    borderRadius: "4px"
                }}
                onClick={onClickMemo}
            >
                Memo
            </button>
            <iframe
                src={bookUrl}
                width={"100%"}
                height={"100%"}
                className={"bibi-frame"}
                id={"bibi-frame"}
                ref={onInitializeIframeRef}
            ></iframe>
            <ToastComponent onClickJumpLastPage={onClickJumpLastPage} />
        </div>
    );
};
