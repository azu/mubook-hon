import React, { FC, useCallback, useEffect, useRef, useState } from "react";
// Import the styles
import { rest, setupWorker } from "msw";
import { CharacterMap, DocumentLoadEvent, PageChangeEvent, PdfJs, Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { BookItem, hasDataBook, useNotion } from "../../notion/useNotion";

export type PdfReaderProps = {
    id: string;
    src?: string;
    bookFileName: string;
};

function absoluteRect(el: HTMLElement) {
    const pos = { top: 0, left: 0 };
    const boundingClientRect = el.getBoundingClientRect();
    pos.top = boundingClientRect.top;
    pos.left = boundingClientRect.left;
    const doc = el.ownerDocument;
    let childWindow = doc.defaultView;
    while (window.top !== childWindow) {
        let boundingClientRect1 = childWindow?.frameElement?.getBoundingClientRect();
        pos.top += boundingClientRect1?.top ?? 0;
        pos.left += boundingClientRect1?.left ?? 0;
        // @ts-expect-error
        childWindow = childWindow?.parent ?? null;
    }

    return {
        top: pos.top,
        left: pos.left,
        width: boundingClientRect.width,
        height: boundingClientRect.height
    };
}

function elementInViewport(el: HTMLElement) {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const { top, left, width, height } = absoluteRect(el);
    return top >= 0 && top < viewportHeight && left + width > 0 && left + width < viewportHeight;
}

const usePdfText = () => {
    const getVisibleText = useCallback(() => {
        const textElement = document.querySelectorAll(".rpv-core__inner-page-container .rpv-core__text-layer-text");
        return Array.from(textElement)
            .filter((element) => {
                return elementInViewport(element as HTMLElement);
            })
            .map((element) => element.textContent)
            .join(" ");
    }, []);
    const getSelectedText = useCallback(() => {
        return window.getSelection()?.toString() ?? "";
    }, []);
    return {
        getVisibleText,
        getSelectedText
    } as const;
};
export const PdfReader: FC<PdfReaderProps> = (props) => {
    const { currentBook, updateBookStatus, addMemo, hasCompletedNotionSettings } = useNotion({
        fileId: props.id,
        fileName: props.bookFileName
    });
    const { getVisibleText, getSelectedText } = usePdfText();
    const [isAddingMemo, setIsAddingMemo] = useState(false);
    const [isReady, setIsReady] = React.useState(false);
    const bookId = props.id.replace("id:", "");
    useEffect(() => {
        const src = props.src;
        if (!src) {
            return;
        }
        const worker = setupWorker(
            rest.get("/pdf/" + bookId, async (_, res, ctx) => {
                const pdf = await fetch(src).then((res) => res.arrayBuffer());
                return res(
                    ctx.set("Content-Length", pdf.byteLength.toString()),
                    ctx.set("Content-Type", "application/pdf"),
                    // Respond with the "ArrayBuffer".
                    ctx.body(pdf)
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
                console.debug("Service Worker is Ready!");
            })
            .catch((e) => {
                console.error(e);
            });
        return () => {
            console.debug("Service Worker is stop");
            worker.stop();
        };
    }, [bookId, props.src]);
    const [runtimeBookInfo, setRuntimeBookInfo] = React.useState<
        Pick<BookItem, "fileId" | "fileName" | "authors" | "publisher" | "title" | "totalPage"> & {
            viewer: "pdf:pdfjs";
        }
    >();
    const [currentDoc, setCurrentDoc] = React.useState<PdfJs.PdfDocument>();
    const [currentPage, setCurrentPage] = React.useState<number | null>(null);
    const onDocumentLoad = useCallback(
        async (event: DocumentLoadEvent) => {
            const metadata = await event.doc.getMetadata();
            const totalPage = event.doc.numPages;
            console.log({
                metadata
            });
            const runtimeBookInfo = {
                viewer: "pdf:pdfjs",
                fileId: props.id,
                fileName: props.bookFileName,
                title: metadata.info.Title,
                authors:
                    metadata.info?.Author?.split(/[,、]/)
                        .map((author) => author.trim())
                        .filter((author) => Boolean(author)) || [],
                totalPage
            } as const;
            setRuntimeBookInfo(runtimeBookInfo);
            setCurrentDoc(event.doc);
        },
        [props.bookFileName, props.id]
    );
    const onPageChange = useCallback((event: PageChangeEvent) => {
        setCurrentPage(event.currentPage);
    }, []);
    const isUpdatingBookStatus = useRef<boolean>(false);
    useEffect(() => {
        if (currentPage === null) {
            return;
        }
        if (runtimeBookInfo == null) {
            return;
        }
        if (isUpdatingBookStatus?.current) {
            return;
        }
        isUpdatingBookStatus.current = true;
        updateBookStatus({
            pageId: hasDataBook(currentBook) ? currentBook.pageId : undefined,
            viewer: runtimeBookInfo.viewer,
            fileId: runtimeBookInfo.fileId,
            fileName: runtimeBookInfo.fileName,
            title: runtimeBookInfo.title,
            authors: runtimeBookInfo.authors,
            totalPage: runtimeBookInfo.totalPage,
            publisher: runtimeBookInfo.publisher,
            currentPage,
            lastMarker: { currentPage }
        })
            .catch((e) => {
                console.error(e);
            })
            .finally(() => {
                isUpdatingBookStatus.current = false;
            });
    }, [runtimeBookInfo, currentPage, updateBookStatus, currentBook, isUpdatingBookStatus]);
    const onClickMemo = useCallback(async () => {
        if (!currentDoc) {
            console.debug("currentDoc is not ready");
            return;
        }
        if (currentPage === null) {
            console.debug("currentPage is not ready");
            return;
        }
        const text = getSelectedText() || getVisibleText();
        setIsAddingMemo(true);
        addMemo({
            memo: text,
            currentPage,
            marker: {
                currentPage
            }
        }).finally(() => {
            setIsAddingMemo(false);
        });
    }, [addMemo, currentDoc, currentPage, getSelectedText, getVisibleText]);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const characterMap: CharacterMap = {
        isCompressed: true,
        url: "https://unpkg.com/pdfjs-dist@3.1.81/cmaps/"
    };
    if (!isReady) {
        return <div>Loading...</div>;
    }
    return (
        <div style={{ height: "100dvh" }}>
            <button
                className="Button small violet"
                hidden={!hasCompletedNotionSettings}
                disabled={isAddingMemo}
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
            <Worker workerUrl={"https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js"}>
                <Viewer
                    initialPage={hasDataBook(currentBook) ? currentBook?.currentPage : 0}
                    fileUrl={`/pdf/${bookId}`}
                    plugins={[defaultLayoutPluginInstance]}
                    characterMap={characterMap}
                    onDocumentLoad={onDocumentLoad}
                    onPageChange={onPageChange}
                />
            </Worker>
        </div>
    );
};
