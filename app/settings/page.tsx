"use client";
import "../sakura.css";
import { useNotionSetting } from "../notion/useNotion";
import { useDropbox } from "../dropbox/useDropbox";
import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { useUserSettings } from "./useUserSettings";

const emptySubscribe = () => () => {};
const useReady = () => {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );
};
export default function Page() {
    const ready = useReady();
    const { notionSetting, updateNotionSettings } = useNotionSetting();
    const { userSettings, updateUserSettings } = useUserSettings();
    const { accessTokenStatus, AuthUrl } = useDropbox();
    const DropboxFilePath = useMemo(() => {
        if (typeof navigator === "undefined") {
            return <b>~/Dropbox/Apps/mubook-hon</b>;
        }
        return navigator.languages.includes("ja") ? (
            <b>~/Dropbox/アプリ/mubook-hon</b>
        ) : (
            <b>~/Dropbox/Apps/mubook-hon</b>
        );
    }, []);
    if (!ready) {
        return <div className={"main"}></div>;
    }
    return (
        <div className={"main"}>
            <h1>Settings</h1>
            <div>
                <h2>Dropbox</h2>
                <p>You can put books into {DropboxFilePath}</p>
                <div>
                    <p>{accessTokenStatus === "valid" ? "✅ Already Logged in" : "❌ Not logged in"}</p>
                    <span>➡️️</span>
                    <AuthUrl />
                </div>
            </div>
            <div>
                <h2>Notion</h2>
                <div>
                    <label htmlFor="notion-api-key">Notion API Key:</label>
                    <input
                        id="notion-api-key"
                        type="password"
                        value={notionSetting?.apiKey}
                        style={{ width: "100%" }}
                        onChange={(e) => {
                            updateNotionSettings({
                                ...notionSetting,
                                apiKey: e.target.value
                            });
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="notion-book-list-id">Book List Database Id:</label>
                    <input
                        id="notion-book-list-id"
                        type="text"
                        value={notionSetting?.bookListDatabaseId}
                        style={{ width: "100%" }}
                        onChange={(e) => {
                            updateNotionSettings({
                                ...notionSetting,
                                bookListDatabaseId: e.target.value
                            });
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="notion-memo-id">Book Memo Database Id:</label>
                    <input
                        id="notion-memo-id"
                        type="text"
                        value={notionSetting?.bookMemoDatabaseId}
                        style={{ width: "100%" }}
                        onChange={(e) => {
                            updateNotionSettings({
                                ...notionSetting,
                                bookMemoDatabaseId: e.target.value
                            });
                        }}
                    />
                </div>
                <div>
                    <h2>Options</h2>
                    <div
                        style={{
                            display: "flex"
                        }}
                    >
                        <label htmlFor="open-new-tab">Open Book in New Tab</label>
                        <input
                            id="open-new-tab"
                            type="checkbox"
                            checked={userSettings?.openNewTab}
                            onChange={(e) => {
                                updateUserSettings({
                                    ...userSettings,
                                    openNewTab: e.target.checked
                                });
                            }}
                        />
                    </div>
                </div>
                <div>
                    <h2>Tools</h2>
                    <ul>
                        <li>
                            <Link href={"/import"}>Import Highlights</Link> - Import highlights from Kindle or
                            O&apos;Reilly
                        </li>
                        <li>
                            <Link href={"/settings/clear-cache"}>Clear Cache</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
