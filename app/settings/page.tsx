"use client";
import { useNotionSetting } from "../notion/useNotion";
import { useDropbox } from "../dropbox/useDropbox";


export default function Page() {
    const { notionSetting, updateNotionSettings } = useNotionSetting()
    const { hasValidAccessToken, AuthUrl } = useDropbox();
    return <div
        style={{ display: "flex", flexDirection: "column", maxWidth: "38rem", padding: "2rem", margin: "auto" }}>
        <h1>Settings</h1>
        <div>
            <h2>Dropbox</h2>
            <div>
                <p>{hasValidAccessToken ? "Logged in" : "Not logged in"}</p>
                <AuthUrl/>
            </div>
        </div>
        <div>
            <h2>Notion</h2>
            <div>
                <label htmlFor="notion-api-key">Notion API Key:</label>
                <input id="notion-api-key" type="password" value={notionSetting?.apiKey} onChange={(e) => {
                    updateNotionSettings({
                        apiKey: e.target.value
                    })
                }}/>
            </div>
            <div>
                <label htmlFor="notion-book-list-id">Book List Database Id:</label>
                <input id="notion-book-list-id" type="text" value={notionSetting?.bookListDatabaseId} onChange={(e) => {
                    updateNotionSettings({
                        bookListDatabaseId: e.target.value
                    })
                }}/>
            </div>
            <div>
                <label htmlFor="notion-memo-id">Book Memo Database Id:</label>
                <input id="notion-memo-id" type="text" value={notionSetting?.bookMemoDatabaseId} onChange={(e) => {
                    updateNotionSettings({
                        bookMemoDatabaseId: e.target.value
                    })
                }}/>
            </div>
        </div>
    </div>
}
