"use client";
import "./sakura.css";
import { Dropbox, DropboxResponse } from "dropbox";
import { FC, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import useSWR, { Fetcher } from "swr";
import { files } from "dropbox/types/dropbox_types";
import Link from "next/link";
import { useDropbox } from "./dropbox/useDropbox";
import { useSearchParams } from "next/navigation";
import { useNotionList } from "./notion/useNotionList";
import { Loading } from "./components/Loading";
import { useUserSettings } from "./settings/useUserSettings";

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
                      cacheKey: "/dropbox/filesListFolder/",
                      path: options.path
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
        const files =
            itemLists?.result.entries.filter((entry) => {
                if (entry[".tag"] === "folder") {
                    return true;
                }
                return entry?.path_lower?.endsWith(".epub") || entry?.path_lower?.endsWith(".pdf");
            }) ?? [];
        if (filterQuery) {
            return files.filter((entry) => {
                return entry?.path_lower?.toLowerCase().includes(filterQuery.toLowerCase());
            });
        }
        return files;
    }, [filterQuery, itemLists?.result.entries]);
    const sortedItems = useMemo(() => {
        return bookItems.sort((a, b) => {
            if (a[".tag"] === "folder" && b[".tag"] === "folder") {
                return 0;
            }
            if (a[".tag"] === "file" && b[".tag"] === "folder") {
                return 1;
            }
            if (a[".tag"] === "folder" && b[".tag"] === "file") {
                return -1;
            }
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
    const { userSettings } = useUserSettings();
    const searchParams = useSearchParams();
    const { recentBooks, isLoadingRecentBooks } = useNotionList();
    const path = searchParams?.get("code");
    const { dropboxClient, accessTokenStatus, AuthUrl } = useDropbox({
        code: path ?? undefined
    });
    const currentPath = searchParams?.get("path");
    const { searchInput, onInputSearch } = useSearch(searchParams?.get("filter") || "");
    const { sortedItems } = useDropboxAPI(dropboxClient, {
        filterQuery: searchInput,
        path: currentPath ?? ""
    });
    if (!ready) {
        return (
            <div className={"main"}>
                <Loading>Loading...</Loading>
            </div>
        );
    }
    if (accessTokenStatus === "none") {
        return (
            <div className={"main"}>
                <Loading>Checking Dropbox Access Token...</Loading>
            </div>
        );
    }
    if (accessTokenStatus === "invalid") {
        return (
            <div className={"main"}>
                <h1>mubook-hon</h1>
                <p>mubook-hon require to access your dropbox account.</p>
                <Suspense fallback={<Loading>Loading Dropbox Auth Url...</Loading>}>
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
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            justifyContent: "flex-start"
                        }}
                    >
                        <h1 style={{ margin: 0 }}>
                            <Link href={"/"}>
                                <img
                                    src={"/icons/icon-256x256.png"}
                                    style={{
                                        width: "1em",
                                        height: "1em",
                                        margin: "0"
                                    }}
                                    alt={"mubook-hon"}
                                />
                            </Link>
                        </h1>
                    </div>
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "1em"
                        }}
                    >
                        <Link
                            href={"/settings"}
                            style={{
                                fontSize: "1.2em"
                            }}
                            title={"Settings"}
                        >
                            ⚙️Settings
                        </Link>
                        <Link
                            href={"https://efcl.notion.site/mubook-hon-addce6c324d44d749a73748f92e3a1a6"}
                            style={{
                                fontSize: "1.2em"
                            }}
                            target={"_blank"}
                            title={"Document"}
                        >
                            📝
                        </Link>
                        <Link
                            href={"https://github.com/sponsors/azu"}
                            style={{
                                fontSize: "1.2em"
                            }}
                            target={"_blank"}
                            title={"GitHub Sponsors"}
                        >
                            ❤️
                        </Link>
                        <Link
                            href={"https://github.com/azu/mubook-hon"}
                            style={{
                                fontSize: "1.2em"
                            }}
                            target={"_blank"}
                            title={"Source Code"}
                        >
                            ℹ️
                        </Link>
                    </div>
                </div>
            </header>
            <h2>Recent Books</h2>
            <details>
                <summary>
                    {isLoadingRecentBooks ? (
                        "Loading recent books..."
                    ) : recentBooks?.length === 0 ? (
                        "No recent books"
                    ) : (
                        <Link
                            href={{
                                pathname: "/viewer",
                                query: {
                                    id: recentBooks?.at(0)?.fileId,
                                    viewer: recentBooks?.at(0)?.viewer
                                }
                            }}
                        >
                            📖 {recentBooks?.at(0)?.fileName}
                        </Link>
                    )}
                </summary>
                <ul>
                    {recentBooks?.slice(1).map((item) => {
                        return (
                            <li key={item.fileId}>
                                📖{" "}
                                <Link
                                    href={{
                                        pathname: "/viewer",
                                        query: {
                                            id: item.fileId,
                                            viewer: item.viewer
                                        }
                                    }}
                                    target={userSettings?.openNewTab ? "_blank" : ""}
                                >
                                    {item.fileName}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </details>
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
                    if (item[".tag"] === "folder") {
                        return (
                            <li key={item.path_lower}>
                                📁
                                <Link
                                    href={{
                                        pathname: "/",
                                        query: {
                                            path: item.path_lower
                                        }
                                    }}
                                >
                                    {item.path_display}
                                </Link>
                            </li>
                        );
                    }
                    return (
                        <li key={item.path_lower}>
                            <Link
                                href={{
                                    pathname: "/viewer",
                                    query: {
                                        // @ts-ignore
                                        id: item.id,
                                        viewer: item.path_lower?.endsWith(".epub") ? "epub:bibi" : "pdf:pdfjs"
                                    }
                                }}
                                target={userSettings?.openNewTab ? "_blank" : ""}
                                rel="noopener"
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
