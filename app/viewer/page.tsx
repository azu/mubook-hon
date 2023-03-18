"use client";
import React, { FC, Suspense, useMemo } from "react";
import { Dropbox, DropboxResponse } from "dropbox";
import useSWR, { Fetcher, SWRConfig } from "swr";
import { useCacheProvider } from "@piotr-cz/swr-idb-cache";
import { useDropbox } from "../dropbox/useDropbox";
import "./toast.css";
import { useSearchParams } from "next/navigation";
import { files } from "dropbox/types/dropbox_types";
import Head from "next/head";
import { BibiReaderProps } from "./epub/BibiReader";

const BibiReader = React.lazy(() => import("./epub/BibiReader").then((mod) => ({ default: mod.BibiReader })));
const PdfReader = React.lazy(() => import("./pdf/PdfReader").then((mod) => ({ default: mod.PdfReader })));
const KindleReader = React.lazy(() => import("./kindle/KindleReader").then((mod) => ({ default: mod.KindleReader })));

const useDropboxAPI = (dropbox: Dropbox | null, props: { fileId: string }) => {
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
            revalidateIfStale: false,
            revalidateOnFocus: false
        }
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
        return <div>Loading...</div>;
    }
    const initialPage = searchParams.get("page") ?? undefined;
    const viewerType = searchParams.get("viewer") ?? undefined;
    const initialMarker = searchParams.get("marker") ?? undefined;
    const translation = searchParams.has("translation") ?? false;
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

const App = (
    props: Pick<BibiReaderProps, "id" | "initialPage" | "initialMarker" | "translation"> & {
        viewerType: "epub:bibi" | "pdf:pdfjs" | "kindle";
    }
) => {
    const id = props.id;
    const { dropboxClient, accessTokenStatus, AuthUrl } = useDropbox({});
    const { fileBlobUrl, fileDisplayName } = useDropboxAPI(dropboxClient, {
        fileId: id
    });
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
                <Suspense fallback={<div>Loading...</div>}>
                    <KindleReader id={id} initialMarker={props.initialMarker} />
                </Suspense>
            )}
            {props.viewerType === "epub:bibi" && (
                <Suspense fallback={<div>Loading...</div>}>
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
                <Suspense fallback={<div>Loading...</div>}>
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
