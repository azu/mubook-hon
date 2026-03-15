type OreillyCsvRow = {
    bookTitle: string;
    chapterTitle: string;
    dateOfHighlight: string;
    bookUrl: string;
    chapterUrl: string;
    annotationUrl: string;
    highlight: string;
    color: string;
    personalNote: string;
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
        marker?: { chapterTitle: string; url: string };
    }[];
};

/**
 * RFC 4180 compliant CSV parser that handles multi-line quoted fields.
 */
const parseCsvFields = (csvText: string): string[][] => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = "";
    let inQuotes = false;
    let i = 0;

    while (i < csvText.length) {
        const char = csvText[i];

        if (inQuotes) {
            if (char === '"') {
                if (i + 1 < csvText.length && csvText[i + 1] === '"') {
                    // Escaped double quote
                    currentField += '"';
                    i += 2;
                } else {
                    // End of quoted field
                    inQuotes = false;
                    i++;
                }
            } else {
                currentField += char;
                i++;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
                i++;
            } else if (char === ",") {
                currentRow.push(currentField);
                currentField = "";
                i++;
            } else if (char === "\n" || (char === "\r" && csvText[i + 1] === "\n")) {
                currentRow.push(currentField);
                currentField = "";
                rows.push(currentRow);
                currentRow = [];
                i += char === "\r" ? 2 : 1;
            } else if (char === "\r") {
                currentRow.push(currentField);
                currentField = "";
                rows.push(currentRow);
                currentRow = [];
                i++;
            } else {
                currentField += char;
                i++;
            }
        }
    }

    // Handle last field/row
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
    }

    return rows;
};

export const parseOreillyCsv = (csvText: string): OreillyCsvRow[] => {
    const allRows = parseCsvFields(csvText);
    if (allRows.length < 2) {
        return [];
    }
    // Skip header row
    const dataRows = allRows.slice(1);
    return dataRows
        .filter((fields) => fields.length >= 7 && fields[0].trim() !== "")
        .map((fields) => ({
            bookTitle: fields[0],
            chapterTitle: fields[1],
            dateOfHighlight: fields[2],
            bookUrl: fields[3],
            chapterUrl: fields[4],
            annotationUrl: fields[5],
            highlight: fields[6],
            color: fields[7] ?? "",
            personalNote: fields[8] ?? ""
        }));
};

const extractBookId = (bookUrl: string): string => {
    const match = bookUrl.match(/\/library\/view\/-\/([^/]+)\//);
    return match ? match[1] : "unknown";
};

const extractChapterNumber = (chapterUrl: string, chapterTitle: string, index: number): number => {
    const urlMatch = chapterUrl.match(/ch(\d+)\.(?:html|xhtml)/);
    if (urlMatch) {
        return parseInt(urlMatch[1], 10);
    }
    const titleMatch = chapterTitle.match(/^(\d+)\./);
    if (titleMatch) {
        return parseInt(titleMatch[1], 10);
    }
    return index;
};

export const convertCsvToImportBookMemo = (rows: OreillyCsvRow[]): ImportBookMemo | null => {
    if (rows.length === 0) {
        return null;
    }
    const firstRow = rows[0];
    const fileId = extractBookId(firstRow.bookUrl);
    const memos = rows.map((row, index) => {
        let memo = row.highlight;
        if (row.personalNote.trim()) {
            memo += `\n---\nNote: ${row.personalNote.trim()}`;
        }
        return {
            memo,
            currentPage: extractChapterNumber(row.chapterUrl, row.chapterTitle, index),
            marker: {
                chapterTitle: row.chapterTitle,
                url: row.chapterUrl
            }
        };
    });
    return {
        fileId,
        fileName: firstRow.bookTitle,
        title: firstRow.bookTitle,
        currentPage: 0,
        totalPage: 0,
        publisher: "O'Reilly Media",
        authors: [],
        memos
    };
};

export const isOreillyCsv = (text: string): boolean => {
    return text.trimStart().startsWith("Book Title,Chapter Title,");
};
