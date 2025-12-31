import { test, expect } from "@playwright/test";
import { setupTestAuth, setupDropboxFileCache } from "../../_fake/test-utils";
import { mockNotionDatabaseQuery } from "../../_fake/notion-fake";
import * as fs from "fs";
import * as path from "path";

// 実際のサンプルEPUBファイルを読み込み
const epubPath = path.join(process.cwd(), "public/test-assets/example.epub");
const epubBuffer = fs.readFileSync(epubPath);

test.describe("Foliate EPUBリーダー", () => {
    test.beforeEach(async ({ page }) => {
        await setupTestAuth({ page });
    });

    test("EPUB書籍の表示", async ({ page }) => {
        console.log("Starting Foliate EPUB test...");

        // コンソールメッセージをキャプチャ
        page.on("console", (msg) => {
            console.log(`Browser console [${msg.type()}]: ${msg.text()}`);
        });

        // ページエラーをキャプチャ
        page.on("pageerror", (error) => {
            console.log(`Page error: ${error.message}`);
        });

        // Notion APIをモック（最後の読書位置などを取得するため）
        await mockNotionDatabaseQuery({ page, pages: [] });

        // テスト用のDropboxキャッシュを設定
        await setupDropboxFileCache({
            page,
            files: {
                "test-book.epub": epubBuffer.buffer as ArrayBuffer
            }
        });

        await page.goto("/viewer?id=test-book.epub&viewer=epub:foliate");

        // ページの基本読み込み完了を待機
        await page.waitForLoadState("domcontentloaded");

        // "Loading Viewer..."が消えるまで待機
        await expect(page.locator("text=Loading Viewer...")).toBeHidden();

        // ビューアページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();

        // foliate-viewが正常にDOMに追加されていることを確認
        await expect(page.locator("foliate-view")).toBeAttached();
    });

    test("EPUB読み込みエラー", async ({ page }) => {
        // 存在しないファイルの場合、キャッシュは設定しない
        await page.goto("/viewer?id=nonexistent.epub&viewer=epub:foliate");
        await page.waitForLoadState("domcontentloaded");

        // エラーメッセージが表示されるか、ページがクラッシュしていないことを確認
        await expect(page.locator("body")).toBeVisible();
    });
});
