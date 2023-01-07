"use client"
import { FC, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { rest, setupWorker } from "msw";
import { Dropbox } from "dropbox";
import useSWR, { Fetcher, SWRConfig } from "swr";
import { useCacheProvider } from "@piotr-cz/swr-idb-cache";
import { useDropbox } from "../dropbox/useDropbox";
import { useAsync, usePrevious, usePromise } from "react-use";
import { useNotion } from "../notion/useNotion";
import * as Toast from '@radix-ui/react-toast';
import "./toast.css";

const useDropboxAPI = (dropbox: Dropbox | null, props: { filePath: string }) => {
    const fileFetcher: Fetcher<Blob, string> = async (args) => {
        if (!dropbox) {
            throw new Error("no dropbox client");
        }
        return dropbox.filesDownload({
            path: args
        }).then((res) => {
            // @ts-expect-error
            return res.result.fileBlob;
        })
    }
    const { data: fileBlob, error: itemListsError } = useSWR(() => dropbox
            ? props.filePath
            : undefined,
        fileFetcher, {});
    const fileBlobUrl = useMemo(() => {
        if (!fileBlob) {
            return;
        }
        return URL.createObjectURL(fileBlob);
    }, [fileBlob]);
    return {
        fileBlobUrl
    } as const
}


export type PageProps = {
    params: { book: string, };
    searchParams: { id: string; page?: string; };
};
export default function Page({ params, searchParams }: PageProps) {
    const cacheProvider = useCacheProvider({
        dbName: 'mubook-hon',
        storeName: 'book',
    });
    if (!cacheProvider) {
        return <div>Initializing cache…</div>
    }
    return <SWRConfig value={{
        provider: cacheProvider,
    }}>
        <App book={params.book} id={searchParams.id} initialPage={searchParams.page}/>
    </SWRConfig>
}
const App = (props: Pick<BibiReaderProps, "id" | "book" | "initialPage">) => {
    const id = props.id;
    const bookName = decodeURIComponent(props.book);
    const { dropboxClient, hasValidAccessToken, AuthUrl } = useDropbox({});
    const { fileBlobUrl } = useDropboxAPI(dropboxClient, {
        filePath: "/" + bookName
    });
    if (!hasValidAccessToken) {
        return <div>
            <Suspense fallback={<div>loading...</div>}>
                <AuthUrl/>
            </Suspense>
        </div>
    }
    return <BibiReader id={id} book={bookName} src={fileBlobUrl} initialPage={props.initialPage}/>
}

const useToast = () => {
    const [open, setOpen] = useState(false);
    const timerRef = useRef(0);
    const [bookInfo, setBookInfo] = useState<{ currentPage: number; lastPage: number; }>({
        currentPage: 0,
        lastPage: 0
    });
    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);
    const show = useCallback((props: { currentPage: number; lastPage: number; }) => {
        setBookInfo(props);
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
        return <Toast.Provider swipeDirection="right">
            <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
                <Toast.Title className="ToastTitle">Found last read page</Toast.Title>
                <Toast.Description>
                    <ul>
                        <li>Current page: {bookInfo.currentPage}</li>
                        <li>Last read page: {bookInfo.lastPage}</li>
                    </ul>
                    <p>You can Jump to last read page.</p>
                </Toast.Description>
                <Toast.Action className="ToastAction" asChild altText="Goto to last read page">
                    <button className="Button small green" onClick={props.onClickJumpLastPage}>Jump</button>
                </Toast.Action>
            </Toast.Root>
            <Toast.Viewport className="ToastViewport"/>
        </Toast.Provider>
    }
    return {
        open,
        setOpen,
        bookInfo,
        showToast: show,
        hideToast: hide,
        ToastComponent
    } as const
}

type BibiReaderProps = {
    id: string;
    book: string;
    src: string | undefined;
    initialPage?: string;
}
type ViewerContentMethod = {
    movePrevPage: () => Promise<void>,
    moveNextPage: () => Promise<void>,
    moveToPage: (page: Number) => Promise<void>,
    getTotalPage: () => Promise<number>,
    getCurrentPage: () => Promise<number>,
    getCurrentTexts: () => Promise<{ text: string; selectedText: string }>,
    getBookInfo: () => Promise<{
        type: "EPUB"
        title: string;
        author: string;
        publisher: string;
        id: string;
    }>;
    onChangePage: (fn: (page: number) => void) => Promise<() => void>;
}
const BibiReader: FC<BibiReaderProps> = (props) => {
    const [isReady, setIsReady] = useState(false);
    const { currentBook, updateBookStatus, addMemo } = useNotion({
        bookName: props.book,
    });
    const { showToast, bookInfo, ToastComponent } = useToast();
    const prevBookState = usePrevious(currentBook);
    const bibiFrame = useRef<HTMLIFrameElement>(null);
    const onClickJumpLastPage = useCallback(() => {
        if (bibiFrame.current && currentBook?.currentPage != null) {
            const contentWindow = bibiFrame.current.contentWindow as WindowProxy & { viewerController: ViewerContentMethod };
            console.log("jump to " + currentBook.currentPage)
            contentWindow.viewerController.moveToPage(bookInfo.lastPage).catch((e) => {
                console.error(e);
            });
        }
    }, [bookInfo.lastPage, currentBook?.currentPage])
    useAsync(async () => {
        let unListen = () => {
            // nope
        };
        if (bibiFrame.current) {
            const contentWindow = bibiFrame.current.contentWindow as WindowProxy & { viewerController: ViewerContentMethod };
            const bookInfo = await contentWindow.viewerController.getBookInfo();
            const currentPage = await contentWindow.viewerController.getCurrentPage();
            const totalPage = await contentWindow.viewerController.getTotalPage();
            console.log({
                bookInfo,
                currentBook,
                currentPage,
                totalPage
            })
            unListen = await contentWindow.viewerController.onChangePage(currentPage => {
                return updateBookStatus({
                    pageId: bookInfo.id,
                    fileName: props.book,
                    publisher: bookInfo.publisher,
                    title: bookInfo.title,
                    authors: bookInfo.author.split(",").map(author => author.trim()),
                    currentPage,
                    totalPage
                })
            });
        }
        return () => {
            unListen();
        }
    }, [bibiFrame.current])
    // when load new book
    const mounted = usePromise();
    useAsync(async () => {
        if (prevBookState || !currentBook) {
            return
        }
        await mounted;
        // TODO: workaround for wating for iframe load
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!bibiFrame.current) {
            return;
        }
        console.log("new load book 📚")
        const contentWindow = bibiFrame.current.contentWindow as WindowProxy & { viewerController: ViewerContentMethod };
        const currentPage = await contentWindow.viewerController.getCurrentPage();
        console.log({
            savedPage: currentBook.currentPage,
            currentPage,
        })
        if (currentPage == null || currentBook.currentPage == null) {
            return;
        }
        const isDifferencePage = currentPage !== currentBook.currentPage;
        if (isDifferencePage) {
            showToast({
                currentPage,
                lastPage: currentBook.currentPage
            });
        }
    }, [prevBookState, currentBook]);
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
                rest.get('/bibi-bookshelf/' + props.id + "/META-INF/container.xml", async (_, res, ctx) => {
                    return res(
                        ctx.set('Content-Type', 'application/xml'),
                        // Respond with the "ArrayBuffer".
                        ctx.body(`<?xml version="1.0" ?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/package.opf" media-type="application/oebps-package+xml" />
  </rootfiles>
</container>
`),
                    )
                }),
                rest.get('/bibi-bookshelf/' + props.id + "/OEBPS/package.opf", async (_, res, ctx) => {
                    const epub = await fetch(src).then((res) => res.arrayBuffer());
                    return res(
                        ctx.set('Content-Length', epub.byteLength.toString()),
                        ctx.set('Content-Type', 'application/epub+zip'),
                        ctx.body(epub),
                    )
                }),
                rest.get('/bibi-bookshelf/' + props.id, async (_, res, ctx) => {
                    const epub = await fetch(src).then((res) => res.arrayBuffer());
                    return res(
                        ctx.set('Content-Length', epub.byteLength.toString()),
                        ctx.set('Content-Type', 'application/epub+zip'),
                        // Respond with the "ArrayBuffer".
                        ctx.body(epub),
                    )
                })
            )
        ;
        worker.start({
            onUnhandledRequest: 'bypass',
            waitUntilReady: true
        }).then(() => {
            setIsReady(true);
        }).catch((e) => {
            console.error(e)
        });
        return () => {
            worker.stop();
        }
    }, [props.book, props.id, props.src]);
    const bookUrl = useMemo(() => {
        const url = new URL("/bibi/index.html", location.href);
        url.search = new URLSearchParams({
            book: props.id,
            ...(props.initialPage ? {
                p: props.initialPage
            } : {})
        }).toString();
        return url.toString()
    }, [props.id, props.initialPage])
    const memo = useCallback(async () => {
        if (bibiFrame.current) {
            const contentWindow = bibiFrame.current.contentWindow as WindowProxy & { viewerController: ViewerContentMethod };
            const text = await contentWindow.viewerController.getCurrentTexts();
            const currentPage = await contentWindow.viewerController.getCurrentPage();
            await addMemo({
                memo: text.selectedText,
                currentPage
            })
        }
    }, [addMemo])
    if (!isReady) {
        return <></>;
    }
    return <>
        <iframe src={bookUrl}
                width={"100%"}
                height={"100%"}
                className={"bibi-frame"}
                id={"bibi-frame"}
                ref={bibiFrame}
        ></iframe>
        <ToastComponent onClickJumpLastPage={onClickJumpLastPage}/>
        <button style={{ position: "fixed", right: 0, bottom: 0 }} onClick={memo}>Memo</button>
    </>;
}
