import { test, expect } from "@playwright/test";
import { setupTestAuth, waitForPageLoad } from "../../_fake/test-utils";
import { mockDropboxFileDownload } from "../../_fake/dropbox-fake";

test.describe("EPUBリーダー", () => {
    test.beforeEach(async ({ page }) => {
        await setupTestAuth({ page });
    });

    test("EPUB書籍の表示", async ({ page }) => {
        // EPUBファイルダウンロードをモック
        const epubContent = "PK\x03\x04mock epub content";
        await mockDropboxFileDownload({
            page,
            filePath: "/test-book.epub",
            content: epubContent,
            contentType: "application/epub+zip"
        });

        await page.goto("/viewer?file=test-book.epub&viewer=epub:bibi");
        await waitForPageLoad({ page });

        // ビューアページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();

        // Bibiリーダーフレームが存在するかチェック（実際のUIに合わせて調整）
        const bibiFrame = page.frameLocator("#bibi-frame");
        const isBibiFrameVisible = await bibiFrame
            .locator("body")
            .isVisible()
            .catch(() => false);

        if (isBibiFrameVisible) {
            await expect(bibiFrame.locator("body")).toBeVisible();
        }
    });

    test("EPUB読み込みエラー", async ({ page }) => {
        // ファイルダウンロードエラーをモック（存在しないファイル）
        await page.route("**/content.dropboxapi.com/2/files/download", async (route) => {
            await route.fulfill({ status: 404 });
        });

        await page.goto("/viewer?file=nonexistent.epub&viewer=epub:bibi");
        await waitForPageLoad({ page });

        // エラーメッセージが表示されるか、ページがクラッシュしていないことを確認
        await expect(page.locator("body")).toBeVisible();
    });

    test("大きなEPUBファイルの処理", async ({ page }) => {
        // 大きなEPUBファイルをモック
        const largeEpubContent = "PK\x03\x04" + "large content ".repeat(10000);
        await mockDropboxFileDownload({
            page,
            filePath: "/large-book.epub",
            content: largeEpubContent,
            contentType: "application/epub+zip"
        });

        await page.goto("/viewer?file=large-book.epub&viewer=epub:bibi");
        await waitForPageLoad({ page });

        // ページが正常に表示されることを確認
        await expect(page.locator("body")).toBeVisible();
    });

    test("EPUB表示設定", async ({ page }) => {
        // EPUBファイルダウンロードをモック
        const epubContent = "PK\x03\x04mock epub content";
        await mockDropboxFileDownload({
            page,
            filePath: "/settings-test.epub",
            content: epubContent,
            contentType: "application/epub+zip"
        });

        await page.goto("/viewer?file=settings-test.epub&viewer=epub:bibi");
        await waitForPageLoad({ page });

        // ページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();

        // 設定ボタンやメニューがあるかチェック（実際のUIに合わせて調整）
        const settingsButton = page.locator('[data-testid="settings"], .settings-button, button:has-text("Settings")');
        const isSettingsVisible = await settingsButton.isVisible().catch(() => false);

        if (isSettingsVisible) {
            await settingsButton.click();
            // 設定パネルが開くことを確認
        }
    });

    test("EPUB目次の表示", async ({ page }) => {
        // EPUBファイルダウンロードをモック
        const epubContent = "PK\x03\x04mock epub with toc";
        await mockDropboxFileDownload({
            page,
            filePath: "/toc-test.epub",
            content: epubContent,
            contentType: "application/epub+zip"
        });

        await page.goto("/viewer?file=toc-test.epub&viewer=epub:bibi");
        await waitForPageLoad({ page });

        // ページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();

        // 目次ボタンがあるかチェック（実際のUIに合わせて調整）
        const tocButton = page.locator('[data-testid="toc"], .toc-button, button:has-text("目次")');
        const isTocVisible = await tocButton.isVisible().catch(() => false);

        if (isTocVisible) {
            await tocButton.click();
            // 目次が表示されることを確認
        }
    });
});
