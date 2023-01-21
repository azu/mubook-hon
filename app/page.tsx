"use client";
import "./sakura.css";
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
                // @ts-expect-error: entry?.is_downloadable is not defined in the type
                return (
                    (entry?.path_lower?.endsWith(".epub") || entry?.path_lower?.endsWith(".pdf")) &&
                    Boolean(entry?.is_downloadable)
                );
            }) ?? [];
        if (filterQuery) {
            return epubFiles.filter((entry) => {
                return entry?.path_lower?.includes(filterQuery);
            });
        }
        return epubFiles;
    }, [filterQuery, itemLists?.result.entries]);
    const sortedItems = useMemo(() => {
        return epubItems.sort((a, b) => {
            // @ts-expect-error: entry?.is_downloadable is not defined in the type
            return a.client_modified < b.client_modified ? 1 : -1;
        });
    }, [epubItems]);
    return {
        epubItems,
        sortedItems
    } as const;
};
const Home: FC = () => {
    const ready = useReady();
    const searchParams = useSearchParams();
    const { dropboxClient, accessTokenStatus, AuthUrl } = useDropbox({
        code: searchParams.get("code") ?? undefined
    });
    const { epubItems, sortedItems } = useDropboxAPI(dropboxClient);
    if (!ready) {
        return <div className={"main"}>Loading...</div>;
    }
    if (accessTokenStatus === "none") {
        return <div className={"main"}>Loading...</div>;
    }
    if (accessTokenStatus === "invalid") {
        return (
            <div className={"main"}>
                <h1>mubook-hon</h1>
                <p>mubook-hon require to access your dropbox account.</p>
                <Suspense fallback={<div>loading...</div>}>
                    ➡️ <AuthUrl />
                </Suspense>
                <div>
                    <h3>Why need to access Dropbox?</h3>
                    <ul>
                        <li>Download epub files from your dropbox account from browser</li>
                    </ul>
                </div>
                <div>
                    <p>
                        For more details, please see{" "}
                        <a href={"https://efcl.notion.site/mubook-hon-addce6c324d44d749a73748f92e3a1a6"}>Document</a>
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className={"main"}>
            <header>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end"
                    }}
                >
                    <Link
                        href={"/settings"}
                        style={{
                            fontSize: "1.2em"
                        }}
                    >
                        ⚙️Settings
                    </Link>
                </div>
            </header>
            <h2>Book List</h2>
            <ul>
                {sortedItems.map((item) => {
                    return (
                        <li key={item.path_lower}>
                            <Link
                                href={{
                                    pathname: "/viewer",
                                    query: {
                                        // @ts-ignore
                                        id: item.id,
                                        type: item.path_lower?.endsWith(".epub") ? "epub" : "pdf"
                                    }
                                }}
                                // target={"_blank"}
                                // rel="noopener"
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
