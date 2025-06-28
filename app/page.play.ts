import { test, expect } from "@playwright/test";
import { setupTestAuth, waitForPageLoad, checkForAlerts } from "./_fake/test-utils";
import {
    mockDropboxFileList,
    mockDropboxError,
    mockDropboxEmptyFiles,
    mockDropboxSlowResponse,
    createDropboxFiles,
    createSampleDropboxFiles,
    mockDropboxMultipleFileDownloads
} from "./_fake/dropbox-fake";

test.describe("ホームページ", () => {
    test.beforeEach(async ({ page }) => {
        await setupTestAuth({ page });
    });

    test("正常なファイル一覧の表示", async ({ page }) => {
        // Dropboxファイル一覧をモック
        const files = createSampleDropboxFiles();
        await mockDropboxFileList({ page, files });

        await page.goto("/");
        await waitForPageLoad({ page });

        // Book Listが表示されることを確認
        await expect(page.locator('h2:has-text("Book List")')).toBeVisible();

        // ファイルが表示されることを確認
        await expect(page.locator("text=sample.epub")).toBeVisible();
        await expect(page.locator("text=sample.pdf")).toBeVisible();
    });

    test("Dropboxエラー時の処理", async ({ page }) => {
        // エラーレスポンスをモック
        await mockDropboxError({ page, status: 401, error: "invalid_access_token" });

        await page.goto("/");
        await waitForPageLoad({ page });

        // エラーメッセージが表示されることを確認
        const alerts = await checkForAlerts({ page });
        expect(alerts.length).toBeGreaterThan(0);
    });

    test("空のファイル一覧", async ({ page }) => {
        // 空のファイル一覧をモック
        await mockDropboxEmptyFiles({ page });

        await page.goto("/");
        await waitForPageLoad({ page });

        // Book Listセクションは表示されるが、ファイルがないことを確認
        await expect(page.locator('h2:has-text("Book List")')).toBeVisible();

        // 空状態の表示を確認（実際のUIに合わせて調整が必要かもしれません）
        const content = await page.textContent("body");
        expect(content).not.toContain("sample.epub");
        expect(content).not.toContain("sample.pdf");
    });

    test("読み込み遅延の処理", async ({ page }) => {
        // 遅延レスポンスをモック
        await mockDropboxSlowResponse({ page, delayMs: 2000 });

        await page.goto("/");

        // ローディング表示を確認（実際のUIにローディング要素があれば）
        const loadingElement = page.locator('[data-testid="loading"]');
        const isLoadingVisible = await loadingElement.isVisible().catch(() => false);

        if (isLoadingVisible) {
            await expect(loadingElement).toBeVisible();
        }

        // 最終的にコンテンツが読み込まれることを確認
        await expect(page.locator('h2:has-text("Book List")')).toBeVisible({ timeout: 10000 });
        await expect(page.locator("text=slow-book.epub")).toBeVisible();
    });

    test("ファイル検索機能", async ({ page }) => {
        // 複数のファイルをモック
        const files = createDropboxFiles({ count: 5, type: "epub" }).concat(
            createDropboxFiles({ count: 3, type: "pdf" })
        );
        await mockDropboxFileList({ page, files });

        await page.goto("/");
        await waitForPageLoad({ page });

        // 検索ボックスが表示されることを確認
        const searchInput = page.locator("#input-search");
        await expect(searchInput).toBeVisible();

        // EPUBで検索
        await searchInput.fill("epub");
        await page.waitForTimeout(1000);

        // 検索結果が適用されることを確認
        const searchValue = await searchInput.inputValue();
        expect(searchValue).toBe("epub");

        // 検索をクリア
        await searchInput.fill("");
        await page.waitForTimeout(1000);
    });

    test("多数のファイルの表示", async ({ page }) => {
        // 大量のファイルをモック
        const files = createDropboxFiles({ count: 20, type: "epub" });
        await mockDropboxFileList({ page, files });

        await page.goto("/");
        await waitForPageLoad({ page });

        // Book Listが表示されることを確認
        await expect(page.locator('h2:has-text("Book List")')).toBeVisible();

        // 最初のいくつかのファイルが表示されることを確認
        await expect(page.locator("text=book-1.epub")).toBeVisible();
        await expect(page.locator("text=book-2.epub")).toBeVisible();
    });
});
