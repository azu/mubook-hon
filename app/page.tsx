"use client";
import { FC, Suspense, useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useDropbox } from "./dropbox/useDropbox";
import { useSearchParams } from "next/navigation";
import { useNotionList } from "./notion/useNotionList";
import { Loading } from "./components/Loading";
import { useUserSettings } from "./settings/useUserSettings";
import { useDropboxAPI } from "./dropbox/useDropboxAPI";
import { usePWAFreshLaunch, useLastRead } from "./lib/usePWAFreshLaunch";

const emptySubscribe = () => () => {};
const useReady = () => {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );
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
// 24時間をミリ秒で表現
const RESUME_THRESHOLD_MS = 24 * 60 * 60 * 1000;

const HomeContent: FC = () => {
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

    // PWA新規起動判定
    const isFreshLaunch = usePWAFreshLaunch();
    const lastRead = useLastRead();
    const [isAutoNavigating, setIsAutoNavigating] = useState(false);

    // PWA起動時の自動遷移
    useEffect(() => {
        if (!isFreshLaunch || !lastRead) {
            return;
        }

        // 24時間以内かチェック
        const now = Date.now();
        const isWithin24Hours = now - lastRead.timestamp < RESUME_THRESHOLD_MS;

        if (!isWithin24Hours) {
            return;
        }

        // 自動遷移を実行
        setIsAutoNavigating(true);
        const targetUrl = `/viewer?id=${encodeURIComponent(lastRead.fileId)}&viewer=${encodeURIComponent(lastRead.viewer)}`;
        window.location.href = targetUrl;
    }, [isFreshLaunch, lastRead]);

    // 自動遷移中はローディング表示
    if (isAutoNavigating && lastRead) {
        return (
            <div className={"main"}>
                <Loading>Resuming: {lastRead.title || lastRead.fileName}...</Loading>
            </div>
        );
    }

    return (
        <div className={"main"}>
            {!ready ? (
                <Loading>Loading...</Loading>
            ) : accessTokenStatus === "none" ? (
                <Loading>Checking Dropbox Access Token...</Loading>
            ) : accessTokenStatus === "invalid" ? (
                <div>
                    <h1>mubook-hon</h1>
                    <p>mubook-hon requires to access your dropbox account.</p>
                    <Suspense fallback={<Loading>Loading Dropbox Auth Url...</Loading>}>
                        ➡️ <AuthUrl />
                    </Suspense>
                    <div>
                        <h3>Why need to connect Dropbox?</h3>
                        <ul>
                            <li>mubook-hon downloads epub/pdf files from your dropbox account</li>
                            <li>
                                After connect, You can put your epub/pdf files to <b>~/Dropbox/Apps/mubook-hon</b>{" "}
                                directory
                            </li>
                        </ul>
                    </div>
                    <div>
                        <p>
                            For more details, please see{" "}
                            <a
                                href={"https://efcl.notion.site/mubook-hon-addce6c324d44d749a73748f92e3a1a6"}
                                target={"_blank"}
                                rel={"noopener noreferrer"}
                            >
                                Document
                            </a>
                        </p>
                    </div>
                </div>
            ) : (
                <>
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
                                // Use <a> instead of Link to force full page reload
                                // This prevents foliate-view state corruption from SPA navigation
                                <a
                                    href={`/viewer?id=${encodeURIComponent(recentBooks?.at(0)?.fileId ?? "")}&viewer=${encodeURIComponent(recentBooks?.at(0)?.viewer ?? "")}`}
                                >
                                    📖 {recentBooks?.at(0)?.fileName}
                                </a>
                            )}
                        </summary>
                        <ul>
                            {recentBooks?.slice(1).map((item) => {
                                return (
                                    <li key={item.fileId}>
                                        📖{" "}
                                        <a
                                            href={`/viewer?id=${encodeURIComponent(item.fileId)}&viewer=${encodeURIComponent(item.viewer)}`}
                                            target={userSettings?.openNewTab ? "_blank" : undefined}
                                            rel={userSettings?.openNewTab ? "noopener" : undefined}
                                        >
                                            {item.fileName}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </details>
                    <h2>Book List</h2>
                    <form
                        style={{ display: "flex", flexDirection: "row" }}
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <label htmlFor={"input-search"}>🔎</label>
                        <input
                            id="input-search"
                            type={"text"}
                            value={searchInput}
                            onInput={onInputSearch}
                            style={{ flex: 1, marginLeft: "0.5em", fontSize: "16px" }}
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
                                    {/* Use <a> instead of Link to force full page reload */}
                                    {/* This prevents foliate-view state corruption from SPA navigation */}
                                    <a
                                        href={`/viewer?id=${encodeURIComponent((item as { id: string }).id)}&viewer=${encodeURIComponent(item.path_lower?.endsWith(".epub") ? "epub:foliate" : "pdf:pdfjs")}`}
                                        target={userSettings?.openNewTab ? "_blank" : undefined}
                                        rel={userSettings?.openNewTab ? "noopener" : undefined}
                                    >
                                        {item.path_display}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </div>
    );
};

const Home: FC = () => {
    // HomeContentコンポーネントはuseSearchParamsとDropbox APIを使用するため、
    // Suspenseで囲んでクライアントサイドレンダリングを適切に処理します。
    // これにより、データ取得中のローディング状態を適切に表示できます。
    return (
        <Suspense fallback={<Loading>Loading...</Loading>}>
            <HomeContent />
        </Suspense>
    );
};

export default Home;
