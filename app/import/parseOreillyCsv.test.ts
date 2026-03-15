import { describe, it } from "node:test";
import assert from "node:assert";
import { parseOreillyCsv, convertCsvToImportBookMemo, isOreillyCsv } from "./parseOreillyCsv.ts";

describe("parseOreillyCsv", () => {
    it("parses a simple CSV row", () => {
        const csv = `Book Title,Chapter Title,Date of Highlight,Book URL,Chapter URL,Annotation URL,Highlight,Color,Personal Note
My Book,Chapter 1,2026-03-15,https://learning.oreilly.com/library/view/-/1234567890/,https://learning.oreilly.com/library/view/-/1234567890/ch01.html,https://learning.oreilly.com/library/view/-/1234567890/ch01.html#abc,Hello world,YELLOW,`;
        const rows = parseOreillyCsv(csv);
        assert.strictEqual(rows.length, 1);
        assert.strictEqual(rows[0].bookTitle, "My Book");
        assert.strictEqual(rows[0].chapterTitle, "Chapter 1");
        assert.strictEqual(rows[0].highlight, "Hello world");
        assert.strictEqual(rows[0].color, "YELLOW");
        assert.strictEqual(rows[0].personalNote, "");
    });

    it("parses multi-line quoted highlight fields", () => {
        const csv = `Book Title,Chapter Title,Date of Highlight,Book URL,Chapter URL,Annotation URL,Highlight,Color,Personal Note
My Book,Chapter 1,2026-03-15,https://learning.oreilly.com/library/view/-/1234567890/,https://learning.oreilly.com/library/view/-/1234567890/ch01.html,https://learning.oreilly.com/library/view/-/1234567890/ch01.html#abc,"Line 1
Line 2
Line 3",YELLOW,`;
        const rows = parseOreillyCsv(csv);
        assert.strictEqual(rows.length, 1);
        assert.strictEqual(rows[0].highlight, "Line 1\nLine 2\nLine 3");
    });

    it("handles escaped double quotes in fields", () => {
        const csv = `Book Title,Chapter Title,Date of Highlight,Book URL,Chapter URL,Annotation URL,Highlight,Color,Personal Note
My Book,Chapter 1,2026-03-15,https://learning.oreilly.com/library/view/-/1234567890/,https://learning.oreilly.com/library/view/-/1234567890/ch01.html,https://learning.oreilly.com/library/view/-/1234567890/ch01.html#abc,"He said ""hello""",YELLOW,`;
        const rows = parseOreillyCsv(csv);
        assert.strictEqual(rows[0].highlight, 'He said "hello"');
    });

    it("parses multiple rows", () => {
        const csv = `Book Title,Chapter Title,Date of Highlight,Book URL,Chapter URL,Annotation URL,Highlight,Color,Personal Note
My Book,Chapter 1,2026-03-15,https://learning.oreilly.com/library/view/-/1234567890/,https://learning.oreilly.com/library/view/-/1234567890/ch01.html,https://learning.oreilly.com/library/view/-/1234567890/ch01.html#a,First,YELLOW,
My Book,Chapter 2,2026-03-15,https://learning.oreilly.com/library/view/-/1234567890/,https://learning.oreilly.com/library/view/-/1234567890/ch02.html,https://learning.oreilly.com/library/view/-/1234567890/ch02.html#b,Second,BLUE,My note`;
        const rows = parseOreillyCsv(csv);
        assert.strictEqual(rows.length, 2);
        assert.strictEqual(rows[0].highlight, "First");
        assert.strictEqual(rows[1].highlight, "Second");
        assert.strictEqual(rows[1].personalNote, "My note");
    });

    it("returns empty array for header-only CSV", () => {
        const csv = `Book Title,Chapter Title,Date of Highlight,Book URL,Chapter URL,Annotation URL,Highlight,Color,Personal Note`;
        const rows = parseOreillyCsv(csv);
        assert.strictEqual(rows.length, 0);
    });

    it("returns empty array for empty string", () => {
        const rows = parseOreillyCsv("");
        assert.strictEqual(rows.length, 0);
    });
});

describe("convertCsvToImportBookMemo", () => {
    it("converts CSV rows to ImportBookMemo format", () => {
        const rows =
            parseOreillyCsv(`Book Title,Chapter Title,Date of Highlight,Book URL,Chapter URL,Annotation URL,Highlight,Color,Personal Note
My Book,6. Chapter Six,2026-03-15,https://learning.oreilly.com/library/view/-/1234567890/,https://learning.oreilly.com/library/view/-/1234567890/ch06.html,https://learning.oreilly.com/library/view/-/1234567890/ch06.html#abc,Some highlight,YELLOW,`);
        const result = convertCsvToImportBookMemo(rows);
        assert.ok(result);
        assert.strictEqual(result.fileId, "1234567890");
        assert.strictEqual(result.fileName, "My Book");
        assert.strictEqual(result.title, "My Book");
        assert.strictEqual(result.publisher, "O'Reilly Media");
        assert.deepStrictEqual(result.authors, []);
        assert.strictEqual(result.memos.length, 1);
        assert.strictEqual(result.memos[0].memo, "Some highlight");
        assert.strictEqual(result.memos[0].currentPage, 6);
        assert.deepStrictEqual(result.memos[0].marker, {
            chapterTitle: "6. Chapter Six",
            url: "https://learning.oreilly.com/library/view/-/1234567890/ch06.html"
        });
    });

    it("extracts chapter number from chapter title when URL does not have ch pattern", () => {
        const rows =
            parseOreillyCsv(`Book Title,Chapter Title,Date of Highlight,Book URL,Chapter URL,Annotation URL,Highlight,Color,Personal Note
My Book,3. Introduction,2026-03-15,https://learning.oreilly.com/library/view/-/1234567890/,https://learning.oreilly.com/library/view/-/1234567890/intro.html,https://learning.oreilly.com/library/view/-/1234567890/intro.html#abc,Text,YELLOW,`);
        const result = convertCsvToImportBookMemo(rows);
        assert.ok(result);
        assert.strictEqual(result.memos[0].currentPage, 3);
    });

    it("appends personal note to memo text", () => {
        const rows =
            parseOreillyCsv(`Book Title,Chapter Title,Date of Highlight,Book URL,Chapter URL,Annotation URL,Highlight,Color,Personal Note
My Book,Chapter 1,2026-03-15,https://learning.oreilly.com/library/view/-/1234567890/,https://learning.oreilly.com/library/view/-/1234567890/ch01.html,https://learning.oreilly.com/library/view/-/1234567890/ch01.html#abc,Highlight text,YELLOW,My personal note`);
        const result = convertCsvToImportBookMemo(rows);
        assert.ok(result);
        assert.strictEqual(result.memos[0].memo, "Highlight text\n---\nNote: My personal note");
    });

    it("returns null for empty rows", () => {
        const result = convertCsvToImportBookMemo([]);
        assert.strictEqual(result, null);
    });
});

describe("isOreillyCsv", () => {
    it("returns true for O'Reilly CSV header", () => {
        assert.strictEqual(isOreillyCsv("Book Title,Chapter Title,Date of Highlight"), true);
    });

    it("returns true with leading whitespace", () => {
        assert.strictEqual(isOreillyCsv("  Book Title,Chapter Title,Date of Highlight"), true);
    });

    it("returns false for JSON", () => {
        assert.strictEqual(isOreillyCsv('{"fileId": "123"}'), false);
    });
});
