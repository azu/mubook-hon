"use client";
import "../sakura.css";
import { useCallback, useMemo, useState } from "react";
import { KindlePositionMarker, useNotion } from "../notion/useNotion";

type ImportBookMemo = {
    fileId: string;
    fileName: string;
    title: string;
    currentPage?: number;
    totalPage?: number;
    publisher?: string;
    authors: string[];
    memos: {
        memo: string;
        currentPage?: number;
        marker?: KindlePositionMarker;
    }[];
};
const useImport = () => {
    // fileId is random short id
    const [importJSONText, setImportJSONText] = useState<string>("");
    const importJSON = useMemo<ImportBookMemo | null>(() => {
        try {
            return JSON.parse(importJSONText);
        } catch (e) {
            return null;
        }
    }, [importJSONText]);
    const isValidJSON = useMemo(() => {
        return importJSON != null;
    }, [importJSON]);
    // notion client
    const { addMemo, updateBookStatus } = useNotion({
        fileId: importJSON?.fileId,
        fileName: importJSON?.fileName
    });
    const importBook = useCallback(async () => {
        if (!importJSON) {
            return;
        }
        await updateBookStatus({
            viewer: "kindle",
            fileId: importJSON.fileId,
            fileName: importJSON?.fileName,
            title: importJSON?.title,
            currentPage: importJSON?.currentPage ?? 0,
            totalPage: importJSON?.totalPage ?? 0,
            publisher: importJSON?.publisher,
            authors: importJSON?.authors
        });
        // add memo
        for (const memo of importJSON?.memos ?? []) {
            await addMemo({
                memo: memo.memo,
                currentPage: memo.currentPage ?? 0,
                marker: memo.marker ?? { locationNumber: 0 }
            });
        }
    }, [addMemo, importJSON, updateBookStatus]);
    return {
        importBook,
        importJSON,
        importJSONText,
        setImportJSONText,
        isValidJSON
    } as const;
};
const ImportPage = () => {
    const { importBook, importJSONText, setImportJSONText, isValidJSON } = useImport();
    return (
        <div className={"main"}>
            <h1>ImportPage</h1>
            <ul>
                <li>1. Create book JSON object</li>
                <li>2. Paste JSON object</li>
                <li>3. Click Import button</li>
            </ul>
            <textarea defaultValue={importJSONText} onChange={(event) => setImportJSONText(event.target.value)} />
            <button disabled={!isValidJSON} onClick={importBook}>
                Import
            </button>
            {!isValidJSON && <p>Invalid JSON</p>}
        </div>
    );
};
export default ImportPage;
