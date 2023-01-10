"use client";
import { FC, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { rest, setupWorker } from "msw";
import { Dropbox } from "dropbox";
import useSWR, { Fetcher, SWRConfig } from "swr";
import { useCacheProvider } from "@piotr-cz/swr-idb-cache";
import { useDropbox } from "../dropbox/useDropbox";
import { useAsync } from "react-use";
import { BibiPositionMaker, BookMarker, useNotion } from "../notion/useNotion";
import * as Toast from "@radix-ui/react-toast";
import "./toast.css";
import { useSearchParams } from "next/navigation";

const useDropboxAPI = (dropbox: Dropbox | null, props: { filePath: string }) => {
    const fileFetcher: Fetcher<Blob, string> = async (args) => {
        if (!dropbox) {
            throw new Error("no dropbox client");
        }
        return dropbox
            .filesDownload({
                path: args
            })
            .then((res) => {
                // @ts-expect-error
                return res.result.fileBlob;
            });
    };
    const { data: fileBlob, error: itemListsError } = useSWR(
        () => (dropbox ? props.filePath : undefined),
        fileFetcher,
        {}
    );
    const fileBlobUrl = useMemo(() => {
        if (!fileBlob) {
            return;
        }
        return URL.createObjectURL(fileBlob);
    }, [fileBlob]);
    return {
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
    if (!params?.book) {
        return <div>Book not found</div>;
    }
    const initialPage = searchParams.get("page") ?? undefined;
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
            <App book={params.book} id={fileId} initialPage={initialPage} />
        </SWRConfig>
    );
};

export default Page;

const App = (props: Pick<BibiReaderProps, "id" | "book" | "initialPage">) => {
    const id = props.id;
    const bookName = decodeURIComponent(props.book);
    const { dropboxClient, hasValidAccessToken, AuthUrl } = useDropbox({});
    const { fileBlobUrl } = useDropboxAPI(dropboxClient, {
        filePath: "/" + bookName
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
    return <BibiReader id={id} book={bookName} src={fileBlobUrl} initialPage={props.initialPage} />;
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
                            <li>Current Item: {restoreMakers?.current.ItemIndex}</li>
                            <li>Last read Item: {restoreMakers?.lastRead.ItemIndex}</li>
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
    book: string;
    src: string | undefined;
    initialPage?: string;
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
const BibiReader: FC<BibiReaderProps> = (props) => {
    const [isReady, setIsReady] = useState(false);
    const { currentBook, updateBookStatus, addMemo } = useNotion({
        bookName: props.book
    });
    const { showToast, bookInfo, ToastComponent } = useToast();
    const isInitialized = useRef(false);
    const bibiFrame = useRef<HTMLIFrameElement>();
    const restoreLastPositionAtFirst = useCallback(async () => {
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
        console.log("restoreLastPosition", {
            isInitialized: isInitialized.current,
            currentBook,
            bibiFrame: bibiFrame.current
        });
        isInitialized.current = true;
        console.log("new load book 📚");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for load content
        const contentWindow = bibiFrame.current.contentWindow as WindowProxy & {
            viewerController: ViewerContentMethod;
        };
        const currentMarker = await contentWindow.viewerController.getCurrentPositionMaker();
        if (currentMarker == null || currentBook.lastMarker == null) {
            return;
        }
        const isDifferencePage = Math.abs(currentMarker.ItemIndex - currentBook.lastMarker.ItemIndex) > 1;
        console.log({
            currentIIPP: currentMarker,
            lastMarker: currentBook.lastMarker,
            isDifferencePage
        });
        if (isDifferencePage) {
            showToast({
                current: currentMarker,
                lastRead: currentBook.lastMarker
            });
        }
    }, [currentBook, showToast]);
    useEffect(() => {
        console.log("Updated Current Book", currentBook);
        if (!isInitialized.current && currentBook) {
            restoreLastPositionAtFirst();
        }
    }, [currentBook, restoreLastPositionAtFirst]);
    const onInitializeIframeRef = useCallback(
        async (frameElement: HTMLIFrameElement) => {
            bibiFrame.current = frameElement;
            if (bibiFrame.current) {
                await restoreLastPositionAtFirst();
            }
        },
        [restoreLastPositionAtFirst]
    );
    const onClickJumpLastPage = useCallback(() => {
        if (bibiFrame.current && currentBook?.currentPage != null && bookInfo?.lastRead) {
            const contentWindow = bibiFrame.current.contentWindow as WindowProxy & {
                viewerController: ViewerContentMethod;
            };
            console.log("jump to Last marker", bookInfo?.lastRead);
            contentWindow.viewerController.moveToPositionMarker(bookInfo?.lastRead).catch((e) => {
                console.error(e);
            });
        }
    }, [bookInfo?.lastRead, currentBook?.currentPage]);
    useAsync(async () => {
        let unListen = () => {
            // nope
        };
        if (bibiFrame.current) {
            const contentWindow = bibiFrame.current.contentWindow as WindowProxy & {
                viewerController: ViewerContentMethod;
            };
            unListen = await contentWindow.viewerController.onChangePage(async () => {
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
                    fileName: props.book,
                    publisher: bookInfo.publisher,
                    title: bookInfo.title,
                    authors: bookInfo.author.split(",").map((author) => author.trim()),
                    currentPage,
                    totalPage,
                    lastMarker
                });
            });
        }
        return () => {
            unListen();
        };
    }, [bibiFrame.current]);
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
            rest.get("/bibi-bookshelf/" + props.id + "/META-INF/container.xml", async (_, res, ctx) => {
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
            }),
            rest.get("/bibi-bookshelf/" + props.id + "/OEBPS/package.opf", async (_, res, ctx) => {
                const epub = await fetch(src).then((res) => res.arrayBuffer());
                return res(
                    ctx.set("Content-Length", epub.byteLength.toString()),
                    ctx.set("Content-Type", "application/epub+zip"),
                    ctx.body(epub)
                );
            }),
            rest.get("/bibi-bookshelf/" + props.id, async (_, res, ctx) => {
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
    }, [props.book, props.id, props.src]);
    const bookUrl = useMemo(() => {
        const url = new URL("/bibi/index.html", location.href);
        url.search = new URLSearchParams({
            book: props.id,
            ...(props.initialPage
                ? {
                      p: props.initialPage
                  }
                : {})
        }).toString();
        console.log("bookUrl", url);
        return url.toString();
    }, [props.id, props.initialPage]);
    const memo = useCallback(async () => {
        if (bibiFrame.current) {
            const contentWindow = bibiFrame.current.contentWindow as WindowProxy & {
                viewerController: ViewerContentMethod;
            };
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
