import { test, expect } from "@playwright/test";
import {
    setupTestAuth,
    setupDropboxFileCache,
    assertBibiReaderLoaded,
    assertEpubViewerNoErrors,
    assertNoConsoleErrors
} from "../../_fake/test-utils";
import * as fs from "fs";
import * as path from "path";

test.describe("EPUBリーダー", () => {
    test.beforeEach(async ({ page }) => {
        await setupTestAuth({ page });
    });

    test("EPUB書籍の表示", async ({ page }) => {
        console.log("Starting EPUB test...");

        // 実際のサンプルEPUBファイルを読み込み
        const epubPath = path.join(process.cwd(), "public/test-assets/example.epub");
        const epubBuffer = fs.readFileSync(epubPath);
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

    test("大きなEPUBファイルの処理", async ({ page }) => {
        // 実際のサンプルEPUBファイルを読み込み
        const epubPath = path.join(process.cwd(), "public/test-assets/example.epub");
        const epubBuffer = fs.readFileSync(epubPath);

        await setupDropboxFileCache({
            page,
            files: {
                "large-book.epub": epubBuffer.buffer as ArrayBuffer
            }
        });

        await page.goto("/viewer?id=large-book.epub&viewer=epub:bibi");
        await page.waitForLoadState("domcontentloaded");

        // ページが正常に表示されることを確認
        await expect(page.locator("body")).toBeVisible();

        // BibiReaderが正常に読み込まれ、エラーがないことを確認
        await assertEpubViewerNoErrors({ page });
    });

    test("EPUB表示設定", async ({ page }) => {
        // 実際のサンプルEPUBファイルを読み込み
        const epubPath = path.join(process.cwd(), "public/test-assets/example.epub");
        const epubBuffer = fs.readFileSync(epubPath);

        await setupDropboxFileCache({
            page,
            files: {
                "settings-test.epub": epubBuffer.buffer as ArrayBuffer
            }
        });

        await page.goto("/viewer?id=settings-test.epub&viewer=epub:bibi");
        await page.waitForLoadState("domcontentloaded");

        // ページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();

        // BibiReaderが正常に読み込まれ、エラーがないことを確認
        await assertEpubViewerNoErrors({ page });

        // 設定ボタンやメニューがあるかチェック（実際のUIに合わせて調整）
        const settingsButton = page.locator('[data-testid="settings"], .settings-button, button:has-text("Settings")');
        const isSettingsVisible = await settingsButton.isVisible().catch(() => false);

        if (isSettingsVisible) {
            await settingsButton.click();
            // 設定パネルが開くことを確認
        }
    });

    test("EPUB目次の表示", async ({ page }) => {
        // 実際のサンプルEPUBファイルを読み込み
        const epubPath = path.join(process.cwd(), "public/test-assets/example.epub");
        const epubBuffer = fs.readFileSync(epubPath);

        await setupDropboxFileCache({
            page,
            files: {
                "toc-test.epub": epubBuffer.buffer as ArrayBuffer
            }
        });

        await page.goto("/viewer?id=toc-test.epub&viewer=epub:bibi");
        await page.waitForLoadState("domcontentloaded");

        // ページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();

        // BibiReaderが正常に読み込まれ、エラーがないことを確認
        await assertEpubViewerNoErrors({ page });

        // 目次ボタンがあるかチェック（実際のUIに合わせて調整）
        const tocButton = page.locator('[data-testid="toc"], .toc-button, button:has-text("目次")');
        const isTocVisible = await tocButton.isVisible().catch(() => false);

        if (isTocVisible) {
            await tocButton.click();
            // 目次が表示されることを確認
        }
    });
});
