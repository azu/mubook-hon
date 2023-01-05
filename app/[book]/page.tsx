"use client"
import { FC, useEffect, useMemo, useState } from "react";
import { rest, setupWorker } from "msw";
import { useLocalStorage } from "react-use";
import { Dropbox, DropboxAuth } from "dropbox";
import useSWR, { Fetcher, SWRConfig } from "swr";
import { useCacheProvider } from "@piotr-cz/swr-idb-cache";

const useDropbox = (props: { filePath: string; }) => {
    const [apiKey, setApiKey] = useLocalStorage<string>("mubook-hon-dropbox-api-key", "");
    const hasApiKey = apiKey !== "";
    const [hasValidAccessToken, setHasValidAccessToken] = useState(false);
    const dropboxAuth = useMemo(() => {
        return new DropboxAuth({
            refreshToken: apiKey
        })
    }, [apiKey]);
    const dropboxClient = useMemo(() => {
        if (!hasValidAccessToken) return null;
        return new Dropbox({
            accessToken: apiKey
        })
    }, [apiKey, hasValidAccessToken]);
    useEffect(() => {
        console.log("_____S_");
        const date = dropboxAuth.getAccessTokenExpiresAt();
        console.log(date)
        // @ts-expect-error https://github.com/dropbox/dropbox-sdk-js/issues/606
        dropboxAuth.checkAndRefreshAccessToken().then(() => {
            console.log("new", dropboxAuth.getAccessToken());
            console.log("new?", dropboxAuth.getRefreshToken());
            setHasValidAccessToken(true);
            setApiKey(dropboxAuth.getAccessToken());
            dropboxAuth.checkAndRefreshAccessToken()
        }).catch((e: Error) => {
            console.error(e)
        })
    }, [dropboxAuth, setApiKey])
    const fileFetcher: Fetcher<Blob, string> = async (args) => {
        if (!dropboxClient) {
            throw new Error("no dropbox client");
        }
        return dropboxClient.filesDownload({
            path: args
        }).then((res) => {
            // @ts-expect-error
            return res.result.fileBlob;
        })
    }
    const { data: fileBlob, error: itemListsError } = useSWR(
        props.filePath,
        dropboxClient ? fileFetcher : null);
    const fileBlobUrl = useMemo(() => {
        if (!fileBlob) {
            return;
        }
        return URL.createObjectURL(fileBlob);
    }, [fileBlob]);
    return {
        hasApiKey,
        setApiKey,
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
    const { fileBlobUrl } = useDropbox({
        filePath: "/" + bookName
    });
    return <BibiReader id={id} book={bookName} src={fileBlobUrl} initialPage={props.initialPage}/>
}
type BibiReaderProps = {
    id: string;
    book: string;
    src: string | undefined;
    initialPage?: string;
}
const BibiReader: FC<BibiReaderProps> = (props) => {
    const [isReady, setIsReady] = useState(false);
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
    if (!isReady) {
        return <></>;
    }
    console.log(bookUrl)
    return <iframe src={bookUrl}
                   width={"100%"}
                   height={"100%"}
                   className={"bibi-frame"}
                   id={"bibi-frame"}
    ></iframe>;
}
