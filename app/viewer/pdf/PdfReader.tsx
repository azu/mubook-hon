import React, { FC, useEffect } from "react";
// Import the styles
import { rest, setupWorker } from "msw";
import { Viewer, Worker } from "@react-pdf-viewer/core";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

const workerUrl = new URL("node_modules/pdfjs-dist/build/pdf.worker.js", import.meta.url); // no ../node_modules
export type PdfReaderProps = {
    id: string;
    src?: string;
};
export const PdfReader: FC<PdfReaderProps> = (props) => {
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
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    return (
        <div>
            <Worker workerUrl={workerUrl.toString()}>
                {isReady && <Viewer fileUrl={`/pdf/${bookId}`} plugins={[defaultLayoutPluginInstance]} />}
            </Worker>
        </div>
    );
};
