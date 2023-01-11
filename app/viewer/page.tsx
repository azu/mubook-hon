"use client";
import { FC, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { rest, setupWorker } from "msw";
import { Dropbox, DropboxResponse } from "dropbox";
import useSWR, { Fetcher, SWRConfig } from "swr";
import { useCacheProvider } from "@piotr-cz/swr-idb-cache";
import { useDropbox } from "../dropbox/useDropbox";
import {
    BibiPositionMaker,
    BookItem,
    BookMarker,
    decodeBookMarker,
    hasDataBook,
    NO_BOOK_DATA,
    useNotion
} from "../notion/useNotion";
import * as Toast from "@radix-ui/react-toast";
import "./toast.css";
import { useSearchParams } from "next/navigation";
import { files } from "dropbox/types/dropbox_types";
import Head from "next/head";

const useDropboxAPI = (dropbox: Dropbox | null, props: { fileId: string }) => {
    const fileFetcher: Fetcher<
        DropboxResponse<files.FileMetadata>["result"] & { fileBlob: Blob },
        { fileId: string }
    > = async ({ fileId }) => {
        if (!dropbox) {
            throw new Error("no dropbox client");
        }
        console.log("download dropbox fileId", fileId);
        return dropbox
            .filesDownload({
                path: fileId
            })
            .then((res) => {
                // @ts-ignore
                return res.result;
            }) as Promise<DropboxResponse<files.FileMetadata>["result"] & { fileBlob: Blob }>;
    };
    const { data: downloadResponse, error: itemListsError } = useSWR(
        () =>
            dropbox
                ? {
                      cacheKey: "/dropbox/filesDownload",
                      fileId: props.fileId
                  }
                : undefined,
        fileFetcher,
        {}
    );
    const fileBlobUrl = useMemo(() => {
        if (!downloadResponse) {
            return;
        }
        return URL.createObjectURL(downloadResponse.fileBlob);
    }, [downloadResponse]);
    const fileDisplayName = useMemo(() => {
        if (!downloadResponse) {
            return "";
        }
        return downloadResponse.name ?? "";
    }, [downloadResponse]);
    return {
        fileDisplayName,
        fileBlobUrl
    } as const;
};

type PageProps = {
    params?: { book?: string };
};
const Page: FC<PageProps> = ({ params }) => {
    const searchParams = useSearchParams();
    const cacheProvider = useCacheProvider({
        dbName: "mubook-hon",
        storeName: "mubook-book"
    });
    if (!cacheProvider) {
        return <div>Initializing cache…</div>;
    }
    const initialPage = searchParams.get("page") ?? undefined;
    const initialMarker = searchParams.get("marker") ?? undefined;
    const fileId = searchParams?.get("id");
    if (!fileId) {
        return <div>ID not found</div>;
    }
    return (
        <SWRConfig
            value={{
                provider: cacheProvider
            }}
        >
            <App id={fileId} initialPage={initialPage} initialMarker={initialMarker} />
        </SWRConfig>
    );
};

export default Page;

const App = (props: Pick<BibiReaderProps, "id" | "initialPage" | "initialMarker">) => {
    const id = props.id;
    const { dropboxClient, hasValidAccessToken, AuthUrl } = useDropbox({});
    const { fileBlobUrl, fileDisplayName } = useDropboxAPI(dropboxClient, {
        fileId: id
    });
    if (!hasValidAccessToken) {
        return (
            <div>
                <Suspense fallback={<div>loading...</div>}>
                    <AuthUrl />
                </Suspense>
            </div>
        );
    }
    return (
        <>
            <Head>
                <title>{fileDisplayName}</title>
            </Head>
            <BibiReader
                id={id}
                bookFileName={fileDisplayName}
                src={fileBlobUrl}
                initialPage={props.initialPage}
                initialMarker={props.initialMarker}
            />
        </>
    );
};

const useToast = () => {
    const [open, setOpen] = useState(false);
    const timerRef = useRef(0);
    const [restoreMakers, setRestoreMakers] = useState<{ current: BookMarker; lastRead: BookMarker }>();
    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);
    const show = useCallback((bookMakers: { current: BookMarker; lastRead: BookMarker }) => {
        setRestoreMakers(bookMakers);
        setOpen(true);
        clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            setOpen(false);
        }, 5000);
    }, []);
    const hide = useCallback(() => {
        setOpen(false);
        clearTimeout(timerRef.current);
    }, []);
    const ToastComponent: FC<{ onClickJumpLastPage: () => void }> = (props) => {
        return (
            <Toast.Provider swipeDirection="right">
                <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
                    <Toast.Title className="ToastTitle">Found last read page</Toast.Title>
                    <Toast.Description>
                        <ul>
                            <li>Current: {restoreMakers?.current.ItemIndex}</li>
                            <li>Last read: {restoreMakers?.lastRead.ItemIndex}</li>
                        </ul>
                        <p>You can Jump to last read page.</p>
                    </Toast.Description>
                    <Toast.Action className="ToastAction" asChild altText="Goto to last read page">
                        <button className="Button small green" onClick={props.onClickJumpLastPage}>
                            Jump
                        </button>
                    </Toast.Action>
                </Toast.Root>
                <Toast.Viewport className="ToastViewport" />
            </Toast.Provider>
        );
    };
    return {
        open,
        setOpen,
        bookInfo: restoreMakers,
        showToast: show,
        hideToast: hide,
        ToastComponent
    } as const;
};

type BibiReaderProps = {
    id: string;
    bookFileName: string;
    src: string | undefined;
    initialPage?: string;
    initialMarker?: string;
};
type ViewerContentMethod = {
    movePrevPage: () => Promise<void>;
    moveNextPage: () => Promise<void>;
    moveToIIPP: (page: Number) => Promise<void>;
    moveToPositionMarker: (marker: BibiPositionMaker) => Promise<void>;
    getTotalPage: () => Promise<number>;
    getCurrentIIPP: () => Promise<number>;
    getCurrentPage: () => Promise<number>;
    getCurrentPositionMaker: () => Promise<BibiPositionMaker>;
    getCurrentTexts: () => Promise<{ text: string; selectedText: string }>;
    getBookInfo: () => Promise<{
        type: "EPUB";
        title: string;
        author: string;
        publisher: string;
        id: string;
    }>;
    onChangePage: (fn: (page: number) => void) => Promise<() => void>;
};
type ContentWindow = WindowProxy & {
    viewerController: ViewerContentMethod;
};
const BibiReader: FC<BibiReaderProps> = (props) => {
    const [isReady, setIsReady] = useState(false);
    const { currentBook, updateBookStatus, addMemo } = useNotion({
        fileId: props.id,
        fileName: props.bookFileName
    });
    const { showToast, bookInfo, ToastComponent } = useToast();
    const isInitialized = useRef(false);
    const bibiFrame = useRef<HTMLIFrameElement>();
    const restoreLastPosition = useCallback(
        async (contentWindow: ContentWindow, currentBook: BookItem) => {
            const currentMarker = await contentWindow.viewerController.getCurrentPositionMaker();
            if (currentMarker == null || currentBook.lastMarker == null) {
                isInitialized.current = true;
                return;
            }
            const isDifferencePage = Math.abs(currentMarker.ItemIndex - currentBook.lastMarker.ItemIndex) > 1;
            console.log("last restore position check", {
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
        console.log("new load book 📚");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for load content
        const contentWindow = bibiFrame.current.contentWindow as ContentWindow;
        console.log("restoreLastPosition", {
            isInitialized: isInitialized.current,
            currentBook,
            bibiFrame: bibiFrame.current
        });
        // prefer ?marker rather than restore position
        if (props.initialMarker) {
            const marker = decodeBookMarker(props.initialMarker);
            console.log("restore to initial marker", {
                marker: marker
            });
            if (marker) {
                await contentWindow.viewerController.moveToPositionMarker(marker);
            }
        } else if (hasDataBook(currentBook)) {
            await restoreLastPosition(contentWindow, currentBook);
        }
        isInitialized.current = true;
    }, [currentBook, props.initialMarker, restoreLastPosition]);
    useEffect(() => {
        console.log("Updated Current Book", currentBook);
        if (!isInitialized.current && currentBook) {
            tryToRestoreLastPositionAtFirst();
        }
    }, [currentBook, tryToRestoreLastPositionAtFirst]);
    useEffect(
        function registerNewBookStatusIfBookIsNotFoundOnDB() {
            const current = bibiFrame.current;
            if (currentBook === NO_BOOK_DATA && current) {
                // TODO: this line change behavior?
                console.log("Check registerNewBookStatusIfBookIsNotFoundOnDB", {
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
                        pageId: bookInfo.id,
                        fileId: props.id,
                        fileName: props.bookFileName,
                        publisher: bookInfo.publisher,
                        title: bookInfo.title,
                        authors: bookInfo.author.split(",").map((author) => author.trim()),
                        currentPage,
                        totalPage,
                        lastMarker
                    });
                })();
            }
        },
        [currentBook, props.bookFileName, props.id, updateBookStatus]
    );

    const viewerControllerUnListen = useRef<() => void>();
    const onInitializeIframeRef = useCallback(
        async (frameElement: HTMLIFrameElement) => {
            bibiFrame.current = frameElement;
            if (bibiFrame.current && !isInitialized.current) {
                await tryToRestoreLastPositionAtFirst();
            }
            if (bibiFrame.current) {
                const contentWindow = bibiFrame.current.contentWindow as ContentWindow;
                await new Promise<void>((resolve) => {
                    if (contentWindow.document.readyState === "complete") {
                        setTimeout(() => resolve(), 1000);
                    } else {
                        contentWindow.addEventListener("load", () => {
                            resolve();
                        });
                    }
                });
                viewerControllerUnListen.current?.(); // avoid register twice
                viewerControllerUnListen.current = await contentWindow.viewerController.onChangePage(async () => {
                    if (!isInitialized.current) {
                        console.log("not yet initialized");
                        return;
                    }
                    const bookInfo = await contentWindow.viewerController.getBookInfo();
                    const currentPage = await contentWindow.viewerController.getCurrentPage();
                    const totalPage = await contentWindow.viewerController.getTotalPage();
                    const lastMarker = await contentWindow.viewerController.getCurrentPositionMaker();
                    console.log("onChangePage", {
                        bookInfo,
                        currentBook,
                        lastMarker,
                        currentPage,
                        totalPage
                    });
                    return updateBookStatus({
                        pageId: bookInfo.id,
                        fileId: props.id,
                        fileName: props.bookFileName,
                        publisher: bookInfo.publisher,
                        title: bookInfo.title,
                        authors: bookInfo.author.split(",").map((author) => author.trim()),
                        currentPage,
                        totalPage,
                        lastMarker
                    });
                });
            } else {
                viewerControllerUnListen.current?.();
            }
        },
        [currentBook, props.bookFileName, props.id, tryToRestoreLastPositionAtFirst, updateBookStatus]
    );
    const onClickJumpLastPage = useCallback(async () => {
        if (bibiFrame.current && hasDataBook(currentBook) && bookInfo?.lastRead) {
            const contentWindow = bibiFrame.current.contentWindow as ContentWindow;
            console.log("jump to Last marker", bookInfo?.lastRead);
            await contentWindow.viewerController.moveToPositionMarker(bookInfo?.lastRead);
        }
    }, [bookInfo?.lastRead, currentBook]);
    useEffect(() => {
        const src = props.src;
        if (!src) {
            return;
        }
        const worker = setupWorker(
            // Bibi request
            // 1. /META-INF/container.xml
            // 2. /OEBPS/content.opf
            // Response epub content as /OEBPS/content.opf
            rest.get(
                "/bibi-bookshelf/" + props.id.replace("id:", "") + "/META-INF/container.xml",
                async (_, res, ctx) => {
                    return res(
                        ctx.set("Content-Type", "application/xml"),
                        // Respond with the "ArrayBuffer".
                        ctx.body(`<?xml version="1.0" ?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/package.opf" media-type="application/oebps-package+xml" />
  </rootfiles>
</container>
`)
                    );
                }
            ),
            rest.get("/bibi-bookshelf/" + props.id.replace("id:", "") + "/OEBPS/package.opf", async (_, res, ctx) => {
                const epub = await fetch(src).then((res) => res.arrayBuffer());
                return res(
                    ctx.set("Content-Length", epub.byteLength.toString()),
                    ctx.set("Content-Type", "application/epub+zip"),
                    ctx.body(epub)
                );
            }),
            rest.get("/bibi-bookshelf/" + props.id.replace("id:", ""), async (_, res, ctx) => {
                const epub = await fetch(src).then((res) => res.arrayBuffer());
                return res(
                    ctx.set("Content-Length", epub.byteLength.toString()),
                    ctx.set("Content-Type", "application/epub+zip"),
                    // Respond with the "ArrayBuffer".
                    ctx.body(epub)
                );
            })
        );
        worker
            .start({
                onUnhandledRequest: "bypass",
                waitUntilReady: true
            })
            .then(() => {
                setIsReady(true);
            })
            .catch((e) => {
                console.error(e);
            });
        return () => {
            worker.stop();
        };
    }, [props.bookFileName, props.id, props.src]);
    const bookUrl = useMemo(() => {
        const url = new URL("/bibi/index.html", location.href);
        // We can not use URLSearchParams because URLSearchParams encoding and encodeURIComponent is different
        // https://kuma-emon.com/it/pc/2178/
        const bookUrl =
            url.toString() +
            "?book=" +
            props.id.replace("id:", "") +
            (props.initialPage ? "&p=" + props.initialPage : "");
        console.log("bookUrl", bookUrl);
        return bookUrl;
    }, [props.id, props.initialPage]);
    const memo = useCallback(async () => {
        if (bibiFrame.current) {
            const contentWindow = bibiFrame.current.contentWindow as ContentWindow;
            const text = await contentWindow.viewerController.getCurrentTexts();
            const currentPage = await contentWindow.viewerController.getCurrentPage();
            const currentMarker = await contentWindow.viewerController.getCurrentPositionMaker();
            await addMemo({
                memo: text.selectedText,
                currentPage,
                marker: currentMarker
            });
        }
    }, [addMemo]);
    if (!isReady) {
        return <></>;
    }
    return (
        <>
            <button
                className="Button small violet"
                style={{
                    position: "fixed",
                    right: 0,
                    bottom: 0,
                    zIndex: 1000,
                    padding: "1rem",
                    borderRadius: "4px"
                }}
                onClick={memo}
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
        </>
    );
};
