import React, { FC, useCallback, useEffect, useState } from "react";
// Import the styles
import { rest, setupWorker } from "msw";
import { CharacterMap, DocumentLoadEvent, PageChangeEvent, Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { BookItem, hasDataBook, useNotion } from "../../notion/useNotion";

export type PdfReaderProps = {
    id: string;
    src?: string;
    bookFileName: string;
};
export const PdfReader: FC<PdfReaderProps> = (props) => {
    const { currentBook, updateBookStatus, addMemo, hasCompletedNotionSettings } = useNotion({
        fileId: props.id,
        fileName: props.bookFileName
    });
    const [isAddingMemo, setIsAddingMemo] = useState(false);
    const [isReady, setIsReady] = React.useState(false);
    const bookId = props.id.replace("id:", "");
    const onClickMemo = useCallback(async () => {}, []);
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
    const [runtimeBookInfo, setRuntimeBookInfo] =
        React.useState<
            Pick<BookItem, "viewer" | "fileId" | "fileName" | "authors" | "publisher" | "title" | "totalPage">
        >();
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
                authors: metadata.info?.Author?.split(/[,、]/).map((author) => author.trim()) || [],
                totalPage
            } as const;
            setRuntimeBookInfo(runtimeBookInfo);
        },
        [props.bookFileName, props.id]
    );
    const onPageChange = useCallback((event: PageChangeEvent) => {
        console.log(event);
        setCurrentPage(event.currentPage);
    }, []);
    useEffect(() => {
        if (currentPage === null) {
            return;
        }
        if (runtimeBookInfo == null) {
            return;
        }
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
        }).catch((e) => {
            console.error(e);
        });
    }, [runtimeBookInfo, currentPage, updateBookStatus, currentBook]);
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
