"use client";
import { useNotionSetting } from "../notion/useNotion";


export default function Page() {
    const { notionSetting, updateNotionSettings } = useNotionSetting()
    return <div
        style={{ display: "flex", flexDirection: "column", maxWidth: "38rem", padding: "2rem", margin: "auto" }}>
        <h1>Settings</h1>
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
                <label htmlFor="notion-api-key">Book List Database Id:</label>
                <input id="notion-api-key" type="text" value={notionSetting?.bookListDatabaseId} onChange={(e) => {
                    updateNotionSettings({
                        bookListDatabaseId: e.target.value
                    })
                }}/>
            </div>
            <div>
                <label htmlFor="notion-api-key">Book Memo Database Id:</label>
                <input id="notion-api-key" type="text" value={notionSetting?.bookMemoDatabaseId} onChange={(e) => {
                    updateNotionSettings({
                        bookMemoDatabaseId: e.target.value
                    })
                }}/>
            </div>
        </div>
    </div>
}
