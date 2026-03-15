"use client";
import "../sakura.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KindlePositionMarker, useNotion } from "../notion/useNotion";
import { convertCsvToImportBookMemo, isOreillyCsv, parseOreillyCsv } from "./parseOreillyCsv";

const bookmarkletButtonStyle = `
.bookmarklet-button:hover {
    color: #f9f9f9 !important;
    border-bottom: none !important;
}
`;

const KINDLE_CODE = `(async function (){
    const { parsePage } = await import('https://esm.sh/kindle-highlight-to-markdown');
    const o = parsePage(window);
    const result = {
        fileId: o.asin,
        fileName: o.title,
        title: o.title,
        currentPage: 0,
        totalPage: 0,
        publisher: "",
        authors: o.author.split(/[、,]/),
        memos: o.annotations.map(annotation => ({
            memo: annotation.highlight,
            currentPage: annotation.locationNumber,
            marker: { locationNumber: annotation.locationNumber }
        }))
    };
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    console.log("Copied!", result);
})()`;

const OREILLY_CODE = `(async function () {
    const cards = document.querySelectorAll('article.orm-Card-root');
    if (!cards.length) { console.error('No highlights found.'); return; }
    const firstCard = cards[0];
    const bookTitle = firstCard.querySelector('img')?.alt || 'Unknown Book';
    const firstLink = firstCard.querySelector('a.orm-Card-link')?.href || '';
    const bookIdMatch = firstLink.match(/\\/view\\/[^\\/]+\\/([^\\/]+)\\//);
    const bookId = bookIdMatch ? bookIdMatch[1] : 'unknown';
    const memos = Array.from(cards).map((card, index) => {
        const highlightText = card.querySelector('.orm-Card-description')?.textContent?.trim() || '';
        const chapterLink = card.querySelector('a.orm-Card-link')?.href || '';
        const chapterTitle = card.querySelector('.orm-Card-title')?.textContent?.trim() || '';
        const chapterMatch = chapterLink.match(/ch(\\d+)\\.xhtml/) || chapterTitle.match(/(\\d+)/);
        const chapterNumber = chapterMatch ? parseInt(chapterMatch[1]) : index;
        return { memo: highlightText, currentPage: chapterNumber, marker: { chapterTitle, url: chapterLink } };
    }).filter(memo => memo.memo);
    const result = { fileId: bookId, fileName: bookTitle, title: bookTitle, currentPage: 0, totalPage: 0, publisher: "O'Reilly Media", authors: [], memos };
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    console.log("Copied!", result);
})()`;

const CodeBlock = ({ code, label }: { code: string; label: string }) => {
    const [copied, setCopied] = useState(false);
    const linkRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        if (linkRef.current) {
            linkRef.current.href = `javascript:${encodeURIComponent(code.replace(/\s+/g, " "))}`;
        }
    }, [code]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const buttonStyle = { lineHeight: "1", padding: "6px 10px", fontSize: "inherit" } as const;

    return (
        <>
            <style>{bookmarkletButtonStyle}</style>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <button onClick={handleCopy} style={buttonStyle}>
                    {copied ? "Copied!" : "Copy Code"}
                </button>
                <span style={{ color: "#666" }}>or</span>
                <a
                    ref={linkRef}
                    className="button bookmarklet-button"
                    style={{
                        ...buttonStyle,
                        backgroundColor: "#666",
                        borderColor: "#666"
                    }}
                    onClick={(e) => e.preventDefault()}
                    draggable
                >
                    {label}
                </a>
                <small style={{ color: "#888" }}>← Drag to bookmarks</small>
            </div>
        </>
    );
};

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
    const [csvConverted, setCsvConverted] = useState(false);
    const setImportText = useCallback(
        (text: string) => {
            if (isOreillyCsv(text)) {
                const rows = parseOreillyCsv(text);
                const result = convertCsvToImportBookMemo(rows);
                if (result) {
                    setImportJSONText(JSON.stringify(result, null, 2));
                    setCsvConverted(true);
                    return;
                }
            }
            setCsvConverted(false);
            setImportJSONText(text);
        },
        [setImportJSONText]
    );
    const handleCsvFile = useCallback(
        (file: File) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result;
                if (typeof text === "string") {
                    setImportText(text);
                }
            };
            reader.readAsText(file);
        },
        [setImportText]
    );
    return {
        importBook,
        importJSON,
        importJSONText,
        setImportText,
        isValidJSON,
        csvConverted,
        handleCsvFile
    } as const;
};
const ImportPage = () => {
    const { importBook, importJSONText, setImportText, isValidJSON, csvConverted, handleCsvFile } = useImport();
    const [isImporting, setIsImporting] = useState(false);
    const [importSuccess, setImportSuccess] = useState(false);

    const handleImport = async () => {
        setIsImporting(true);
        setImportSuccess(false);
        try {
            await importBook();
            setImportSuccess(true);
            setImportText("");
        } catch (error) {
            console.error("Import failed:", error);
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className={"main"}>
            <h1>Import Highlights</h1>
            <p>このページでは、KindleやO&apos;Reilly Learningからハイライトをインポートできます。</p>

            <h2>使い方</h2>
            <details open>
                <summary>
                    <strong>Kindle からインポート</strong>
                </summary>
                <ol>
                    <li>
                        <a href="https://read.amazon.co.jp/notebook" target="_blank" rel="noopener noreferrer">
                            Kindle ノートブック
                        </a>
                        を開く
                    </li>
                    <li>インポートしたい本を選択</li>
                    <li>ブラウザの開発者コンソールを開く（F12 または Cmd+Option+I）</li>
                    <li>コードをコピーしてコンソールに貼り付けて実行</li>
                </ol>
                <CodeBlock code={KINDLE_CODE} label="Kindle Import" />
                <ol start={5}>
                    <li>JSONが自動でコピーされるので、下のテキストエリアに貼り付け</li>
                    <li>「Import」ボタンをクリック</li>
                </ol>
            </details>

            <details>
                <summary>
                    <strong>O&apos;Reilly Learning からインポート（CSV）</strong>
                </summary>
                <ol>
                    <li>
                        <a href="https://learning.oreilly.com/highlights" target="_blank" rel="noopener noreferrer">
                            O&apos;Reilly Highlights
                        </a>
                        を開く
                    </li>
                    <li>「Export Highlights for this Title」をクリックしてCSVをダウンロード</li>
                    <li>ダウンロードしたCSVファイルを選択</li>
                </ol>
                <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            handleCsvFile(file);
                        }
                    }}
                />
                <p>
                    <small>CSVのテキストをそのまま下のテキストエリアに貼り付けることもできます。</small>
                </p>
            </details>

            <details>
                <summary>
                    <strong>O&apos;Reilly Learning からインポート（ブックマークレット）</strong>
                </summary>
                <ol>
                    <li>
                        <a href="https://learning.oreilly.com/highlights" target="_blank" rel="noopener noreferrer">
                            O&apos;Reilly Highlights
                        </a>
                        を開く
                    </li>
                    <li>ブラウザの開発者コンソールを開く（F12 または Cmd+Option+I）</li>
                    <li>コードをコピーしてコンソールに貼り付けて実行</li>
                </ol>
                <CodeBlock code={OREILLY_CODE} label="O'Reilly Import" />
                <ol start={4}>
                    <li>JSONが自動でコピーされるので、下のテキストエリアに貼り付け</li>
                    <li>「Import」ボタンをクリック</li>
                </ol>
            </details>

            <h2>インポート</h2>
            <p>JSONデータを貼り付けてください：</p>
            <textarea
                value={importJSONText}
                onChange={(event) => setImportText(event.target.value)}
                placeholder="JSONまたはO'Reilly CSVを貼り付け"
                style={{ width: "100%", minHeight: "200px", fontFamily: "monospace" }}
            />

            <div style={{ marginTop: "1rem" }}>
                <button disabled={!isValidJSON || isImporting} onClick={handleImport} style={{ marginRight: "1rem" }}>
                    {isImporting ? "インポート中..." : "Import"}
                </button>

                {!isValidJSON && importJSONText && <span style={{ color: "red" }}>無効なJSON形式です</span>}
                {isValidJSON && csvConverted && !importSuccess && (
                    <span style={{ color: "green" }}>CSVをJSONに変換しました</span>
                )}
                {isValidJSON && !csvConverted && !importSuccess && (
                    <span style={{ color: "green" }}>有効なJSON形式です</span>
                )}
                {importSuccess && <span style={{ color: "green" }}>✅ インポートが完了しました！</span>}
            </div>

            <details style={{ marginTop: "2rem" }}>
                <summary>JSONフォーマットの例</summary>
                <pre style={{ backgroundColor: "#f5f5f5", padding: "1rem", overflow: "auto" }}>
                    {`{
  "fileId": "B0BXXXXXX",
  "fileName": "サンプル本",
  "title": "サンプル本のタイトル",
  "currentPage": 0,
  "totalPage": 300,
  "publisher": "出版社名",
  "authors": ["著者名"],
  "memos": [
    {
      "memo": "ハイライトテキスト",
      "currentPage": 42,
      "marker": {
        "locationNumber": 1234
      }
    }
  ]
}`}
                </pre>
            </details>
        </div>
    );
};
export default ImportPage;
