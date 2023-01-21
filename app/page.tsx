"use client";
import "./sakura.css";
import { Dropbox, DropboxResponse } from "dropbox";
import { FC, Suspense, useCallback, useEffect, useMemo, useState } from "react";
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
const useSearch = (initialSearch: string) => {
    const [searchInput, setSearchInput] = useState(initialSearch);
    const onInputSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    }, []);
    return {
        searchInput,
        onInputSearch
    };
};
const useDropboxAPI = (dropboxClient: Dropbox | null, options: { path: string; filterQuery: string }) => {
    const filterQuery = options.filterQuery;
    const listFetcher: Fetcher<DropboxResponse<files.ListFolderResult>> = async () => {
        if (!dropboxClient) {
            throw new Error("no dropbox client");
        }
        return dropboxClient.filesListFolder({ path: options.path });
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
    const bookItems = useMemo(() => {
        const epubFiles =
            itemLists?.result.entries.filter((entry) => {
                return entry?.path_lower?.endsWith(".epub") || entry?.path_lower?.endsWith(".pdf");
            }) ?? [];
        if (filterQuery) {
            return epubFiles.filter((entry) => {
                return entry?.path_lower?.includes(filterQuery);
            });
        }
        return epubFiles;
    }, [filterQuery, itemLists?.result.entries]);
    const sortedItems = useMemo(() => {
        return bookItems.sort((a, b) => {
            // @ts-expect-error: entry?.is_downloadable is not defined in the type
            return a.client_modified < b.client_modified ? 1 : -1;
        });
    }, [bookItems]);
    return {
        bookItems,
        sortedItems
    } as const;
};
const Home: FC = () => {
    const ready = useReady();
    const searchParams = useSearchParams();
    const { dropboxClient, accessTokenStatus, AuthUrl } = useDropbox({
        code: searchParams.get("code") ?? undefined
    });
    const { searchInput, onInputSearch } = useSearch(searchParams.get("filter") || "");
    const { sortedItems } = useDropboxAPI(dropboxClient, {
        filterQuery: searchInput,
        path: searchParams.get("path") ?? ""
    });
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
            <form style={{ display: "flex", flexDirection: "row" }} onSubmit={(event) => event.preventDefault()}>
                <label htmlFor={"input-search"}>🔎</label>
                <input
                    id="input-search"
                    type={"text"}
                    value={searchInput}
                    onInput={onInputSearch}
                    style={{ flex: 1, marginLeft: "0.5em" }}
                />
            </form>
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
                                        type: item.path_lower?.endsWith(".epub") ? "epub:bibi" : "pdf:pdfjs"
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
