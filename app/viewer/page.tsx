"use client";
import React, { FC, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Dropbox, DropboxResponse } from "dropbox";
import useSWR, { Fetcher, mutate, SWRConfig, useSWRConfig } from "swr";
import { useCacheProvider } from "@piotr-cz/swr-idb-cache";
import { useDropbox } from "../dropbox/useDropbox";
import "./toast.css";
import type { BibiReaderProps } from "./epub/BibiReader";
import { useSearchParams } from "next/navigation";
import { files } from "dropbox/types/dropbox_types";
import Head from "next/head";

import dynamic from "next/dynamic";
import { useOnetimeStorage } from "../settings/TemporaryStorage";

const BibiReader = dynamic(() => import("./epub/BibiReader").then((mod) => ({ default: mod.BibiReader })), {
    ssr: false
});
const PdfReader = dynamic(() => import("./pdf/PdfReader").then((mod) => ({ default: mod.PdfReader })), { ssr: false });
const KindleReader = dynamic(() => import("./kindle/KindleReader").then((mod) => ({ default: mod.KindleReader })), {
    ssr: false
});

const useDropboxAPI = (dropbox: Dropbox | null, props: { fileId: string; noCache: boolean }) => {
    const { cache } = useSWRConfig();
    const fileFetcher: Fetcher<
        DropboxResponse<files.FileMetadata>["result"] & { fileBlob: Blob },
        { fileId: string }
    > = async ({ fileId }) => {
        if (!dropbox) {
            throw new Error("no dropbox client");
        }
        console.debug("download dropbox fileId", fileId);
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
        {
            revalidateIfStale: props.noCache,
            revalidateOnFocus: props.noCache
        }
    );
    const removeCache = useCallback(() => {
        return mutate(
            () => {
                return {
                    cacheKey: "/dropbox/filesDownload",
                    fileId: props.fileId
                };
            },
            undefined, // キャッシュデータを `undefined` に更新する
            { revalidate: false } // 再検証しない
        );
    }, [props.fileId]);
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
        fileBlobUrl,
        removeCache
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
        return <div>Loading Cache Provider...</div>;
    }
    const initialPage = searchParams?.get("page") ?? undefined;
    const viewerType = searchParams?.get("viewer") ?? undefined;
    const initialMarker = searchParams?.get("marker") ?? undefined;
    const translation = searchParams?.has("translation") ?? false;
    const fileId = searchParams?.get("id");
    if (!fileId) {
        return <div>ID not found</div>;
    }
    if (viewerType !== "epub:bibi" && viewerType !== "pdf:pdfjs" && viewerType !== "kindle") {
        return <div>Invalid viewer type: {viewerType}</div>;
    }
    return (
        <SWRConfig
            value={{
                provider: cacheProvider
            }}
        >
            <App
                viewerType={viewerType}
                id={fileId}
                initialPage={initialPage}
                initialMarker={initialMarker}
                translation={translation}
            />
        </SWRConfig>
    );
};

export default Page;

const LoadingBook = (props: { tooLoadingLong: boolean; onClickReloadWithoutCache: () => void }) => {
    return (
        <div>
            <p>Loading Book...</p>
            {props.tooLoadingLong && <button onClick={props.onClickReloadWithoutCache}>Remove Cache and Reload</button>}
        </div>
    );
};

const App = (
    props: Pick<BibiReaderProps, "id" | "initialPage" | "initialMarker" | "translation"> & {
        viewerType: "epub:bibi" | "pdf:pdfjs" | "kindle";
    }
) => {
    const id = props.id;
    const onetimeStorage = useOnetimeStorage();
    const { dropboxClient, accessTokenStatus, AuthUrl } = useDropbox({});
    const { fileBlobUrl, fileDisplayName, removeCache } = useDropboxAPI(dropboxClient, {
        fileId: id,
        noCache: onetimeStorage.get(id)?.noCache ?? false
    });
    const [tooLoadLong, setTooLoadLong] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setTooLoadLong(true);
        }, 5000);
        return () => {
            clearTimeout(timer);
        };
    }, []);
    const onClickReloadWithoutCache = useCallback(() => {
        removeCache().then(() => {
            location.reload();
        });
    }, [removeCache]);
    if (accessTokenStatus === "none") {
        return null;
    }
    if (accessTokenStatus === "invalid") {
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
            {props.viewerType === "kindle" && (
                <Suspense
                    fallback={
                        <LoadingBook
                            onClickReloadWithoutCache={onClickReloadWithoutCache}
                            tooLoadingLong={tooLoadLong}
                        />
                    }
                >
                    <KindleReader id={id} initialMarker={props.initialMarker} />
                </Suspense>
            )}
            {props.viewerType === "epub:bibi" && (
                <Suspense
                    fallback={
                        <LoadingBook
                            onClickReloadWithoutCache={onClickReloadWithoutCache}
                            tooLoadingLong={tooLoadLong}
                        />
                    }
                >
                    <BibiReader
                        id={id}
                        bookFileName={fileDisplayName}
                        src={fileBlobUrl}
                        initialPage={props.initialPage}
                        initialMarker={props.initialMarker}
                        translation={props.translation}
                    />
                </Suspense>
            )}
            {props.viewerType === "pdf:pdfjs" && (
                <Suspense
                    fallback={
                        <LoadingBook
                            onClickReloadWithoutCache={onClickReloadWithoutCache}
                            tooLoadingLong={tooLoadLong}
                        />
                    }
                >
                    <PdfReader
                        src={fileBlobUrl}
                        id={id}
                        bookFileName={fileDisplayName}
                        initialPage={props.initialPage}
                        initialMarker={props.initialMarker}
                    />
                </Suspense>
            )}
        </>
    );
};
