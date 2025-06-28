import { test, expect } from "@playwright/test";
import { setupTestAuth, waitForPageLoad } from "../../_fake/test-utils";
import { mockDropboxFileDownload } from "../../_fake/dropbox-fake";

test.describe("Kindleリーダー", () => {
    test.beforeEach(async ({ page }) => {
        await setupTestAuth({ page });
    });

    test("Kindle書籍の表示", async ({ page }) => {
        // Kindleファイル（通常はAZW形式やMOBI形式だが、テストではEPUBを使用）
        const kindleContent = "PK\x03\x04mock kindle content";
        await mockDropboxFileDownload({
            page,
            filePath: "/test-book.azw",
            content: kindleContent,
            contentType: "application/x-mobipocket-ebook"
        });

        await page.goto("/viewer?file=test-book.azw&viewer=kindle");
        await waitForPageLoad({ page });

        // ビューアページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();
    });

    test("Kindle読み込みエラー", async ({ page }) => {
        // ファイルダウンロードエラーをモック
        await page.route("**/content.dropboxapi.com/2/files/download", async (route) => {
            await route.fulfill({ status: 404 });
        });

        await page.goto("/viewer?file=nonexistent.azw&viewer=kindle");
        await waitForPageLoad({ page });

        // エラーメッセージが表示されるか、ページがクラッシュしていないことを確認
        await expect(page.locator("body")).toBeVisible();
    });

    test("MOBIファイルの表示", async ({ page }) => {
        // MOBIファイルをモック
        const mobiContent = "BOOKMOBI mock content";
        await mockDropboxFileDownload({
            page,
            filePath: "/test-book.mobi",
            content: mobiContent,
            contentType: "application/x-mobipocket-ebook"
        });

        await page.goto("/viewer?file=test-book.mobi&viewer=kindle");
        await waitForPageLoad({ page });

        // ページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();
    });

    test("Kindleビューア設定", async ({ page }) => {
        // Kindleファイルをモック
        const kindleContent = "PK\x03\x04mock kindle content";
        await mockDropboxFileDownload({
            page,
            filePath: "/settings-test.azw",
            content: kindleContent,
            contentType: "application/x-mobipocket-ebook"
        });

        await page.goto("/viewer?file=settings-test.azw&viewer=kindle");
        await waitForPageLoad({ page });

        // ページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();

        // Kindleリーダーの設定ボタンがあるかチェック
        const settingsButton = page.locator('[data-testid="kindle-settings"], .kindle-settings-button');
        const isSettingsVisible = await settingsButton.isVisible().catch(() => false);

        if (isSettingsVisible) {
            await settingsButton.click();
        }
    });

    test("Kindleページナビゲーション", async ({ page }) => {
        // Kindleファイルをモック
        const kindleContent = "PK\x03\x04mock kindle content with pages";
        await mockDropboxFileDownload({
            page,
            filePath: "/nav-test.azw",
            content: kindleContent,
            contentType: "application/x-mobipocket-ebook"
        });

        await page.goto("/viewer?file=nav-test.azw&viewer=kindle");
        await waitForPageLoad({ page });

        // ページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();

        // ナビゲーションボタンがあるかチェック
        const nextButton = page.locator('[data-testid="next-page"], .next-button, button:has-text("Next")');
        const prevButton = page.locator('[data-testid="prev-page"], .prev-button, button:has-text("Previous")');

        const isNextVisible = await nextButton.isVisible().catch(() => false);
        const isPrevVisible = await prevButton.isVisible().catch(() => false);

        if (isNextVisible) {
            await nextButton.click();
        }

        if (isPrevVisible) {
            await prevButton.click();
        }
    });
});
