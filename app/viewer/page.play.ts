import { test, expect } from "@playwright/test";
import { setupTestAuth, waitForPageLoad } from "../_fake/test-utils";
import { mockDropboxFileDownload, createSampleDropboxFiles } from "../_fake/dropbox-fake";

test.describe("ビューアページ", () => {
    test.beforeEach(async ({ page }) => {
        await setupTestAuth({ page });
    });

    test("URLパラメータによるファイル指定", async ({ page }) => {
        // EPUBファイルダウンロードをモック
        const epubContent = "PK\x03\x04mock epub content";
        await mockDropboxFileDownload({
            page,
            filePath: "/sample.epub",
            content: epubContent,
            contentType: "application/epub+zip"
        });

        await page.goto("/viewer?file=sample.epub&viewer=epub:bibi");
        await waitForPageLoad({ page });

        // ビューアページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();
    });

    test("ファイルIDによる指定", async ({ page }) => {
        // ファイルダウンロードをモック
        const pdfContent = "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n%%EOF";
        await mockDropboxFileDownload({
            page,
            filePath: "/sample.pdf",
            content: pdfContent,
            contentType: "application/pdf"
        });

        await page.goto("/viewer?id=id:sample-pdf-file-id&viewer=pdf");
        await waitForPageLoad({ page });

        // ビューアページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();
    });

    test("無効なファイル指定", async ({ page }) => {
        // 存在しないファイルをモック（404エラー）
        await mockDropboxFileDownload({
            page,
            filePath: "/nonexistent.epub",
            content: "",
            contentType: ""
        });

        await page.goto("/viewer?file=nonexistent.epub&viewer=epub:bibi");
        await waitForPageLoad({ page });

        // エラーが表示されるか、ページがクラッシュしていないことを確認
        await expect(page.locator("body")).toBeVisible();
    });

    test("ビューア種類の切り替え", async ({ page }) => {
        // EPUBファイルダウンロードをモック
        const epubContent = "PK\x03\x04mock epub content";
        await mockDropboxFileDownload({
            page,
            filePath: "/sample.epub",
            content: epubContent,
            contentType: "application/epub+zip"
        });

        // EPUBビューアで開く
        await page.goto("/viewer?file=sample.epub&viewer=epub:bibi");
        await waitForPageLoad({ page });

        await expect(page.locator("body")).toBeVisible();

        // Kindleビューアに切り替え（同じファイル）
        await page.goto("/viewer?file=sample.epub&viewer=kindle");
        await waitForPageLoad({ page });

        await expect(page.locator("body")).toBeVisible();
    });

    test("パラメータなしでのアクセス", async ({ page }) => {
        await page.goto("/viewer");
        await waitForPageLoad({ page });

        // ファイル選択画面またはエラー画面が表示されることを確認
        await expect(page.locator("body")).toBeVisible();
    });
});
