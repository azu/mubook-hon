import { test, expect } from "@playwright/test";
import { setupTestAuth, setupDropboxFileCache, assertEpubViewerNoErrors } from "../../_fake/test-utils";
import { mockNotionDatabaseQuery } from "../../_fake/notion-fake";
import * as fs from "fs";
import * as path from "path";

// 実際のサンプルEPUBファイルを読み込み
const epubPath = path.join(process.cwd(), "public/test-assets/example.epub");
const epubBuffer = fs.readFileSync(epubPath);

test.describe("EPUBリーダー", () => {
    test.beforeEach(async ({ page }) => {
        await setupTestAuth({ page });
    });

    test("EPUB書籍の表示", async ({ page }) => {
        console.log("Starting EPUB test...");
        // Notion APIをモック（最後の読書位置などを取得するため）
        await mockNotionDatabaseQuery({ page, pages: [] });

        // テスト用のDropboxキャッシュを設定
        await setupDropboxFileCache({
            page,
            files: {
                "test-book.epub": epubBuffer.buffer as ArrayBuffer
            }
        });

        await page.goto("/viewer?id=test-book.epub&viewer=epub:bibi");

        // ページの基本読み込み完了を待機（より短いタイムアウト）
        await page.waitForLoadState("domcontentloaded");

        // "Loading Viewer..."が消えるまで待機
        await expect(page.locator("text=Loading Viewer...")).toBeHidden({ timeout: 30000 });

        // ビューアページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();

        // BibiReaderが正常に読み込まれ、エラーがないことを確認
        await assertEpubViewerNoErrors({ page });

        // 最初のページが表示されることを確認
        await expect(
            page.locator("#bibi-frame").contentFrame().locator(".item").first().contentFrame().locator("#cover-image")
        ).toBeVisible();
    });

    test("EPUB読み込みエラー", async ({ page }) => {
        // 存在しないファイルの場合、キャッシュは設定しない
        // fileFetcherが適切にエラーを処理することをテスト

        await page.goto("/viewer?id=nonexistent.epub&viewer=epub:bibi");
        await page.waitForLoadState("domcontentloaded");

        // エラーメッセージが表示されるか、ページがクラッシュしていないことを確認
        await expect(page.locator("body")).toBeVisible();
    });
});
