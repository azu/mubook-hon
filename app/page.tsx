"use client";
import type { NextPage } from "next";
import { Dropbox, DropboxResponse } from "dropbox";
import { FC, Suspense, useEffect, useLayoutEffect, useMemo, useState } from "react";
import useSWR, { Fetcher } from "swr";
import { files } from "dropbox/types/dropbox_types";
import Link from "next/link";
import { useDropbox } from "./dropbox/useDropbox";
import { useSearchParams } from "next/navigation";

const useReady = () => {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        setReady(true);
    }, []);
    return ready;
};

const useDropboxAPI = (dropboxClient: Dropbox | null) => {
    const searchParams = useSearchParams();
    const filterQuery = searchParams.get("filter");
    const listFetcher: Fetcher<DropboxResponse<files.ListFolderResult>> = async () => {
        if (!dropboxClient) {
            throw new Error("no dropbox client");
        }
        return dropboxClient.filesListFolder({ path: "" });
    };
    const { data: itemLists, error: itemListsError } = useSWR<DropboxResponse<files.ListFolderResult>>(
        () =>
            dropboxClient
                ? {
                      cacheKey: "/dropbox/filesListFolder/"
                  }
                : null,
        listFetcher,
        {
            revalidateOnFocus: true,
            revalidateIfStale: true,
            revalidateOnMount: true
        }
    );
    const epubItems = useMemo(() => {
        const epubFiles =
            itemLists?.result.entries.filter((entry) => {
                return entry?.path_lower?.endsWith(".epub");
            }) ?? [];
        if (filterQuery) {
            return epubFiles.filter((entry) => {
                return entry?.path_lower?.includes(filterQuery);
            });
        }
        return epubFiles;
    }, [filterQuery, itemLists?.result.entries]);
    return {
        epubItems
    } as const;
};
const Home: FC = () => {
    const ready = useReady();
    const searchParams = useSearchParams();
    const { dropboxClient, hasValidAccessToken, AuthUrl } = useDropbox({
        code: searchParams.get("code") ?? undefined
    });
    const { epubItems } = useDropboxAPI(dropboxClient);
    if (!ready) {
        return null;
    }
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
        <div>
            <aside>
                <Link href={"/settings"}>Settings</Link>
            </aside>
            <h2>Book List</h2>
            <ul>
                {epubItems.map((item) => {
                    return (
                        <li key={item.path_lower}>
                            <Link
                                href={{
                                    pathname: "/viewer",
                                    query: {
                                        // @ts-ignore
                                        id: item.id
                                    }
                                }}
                                target={"_blank"}
                            >
                                {item.path_display}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Home;
