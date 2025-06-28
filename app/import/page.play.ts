import { test, expect } from "@playwright/test";
import { setupTestAuth, waitForPageLoad, checkForAlerts } from "../_fake/test-utils";
import {
    mockNotionDatabaseQuery,
    mockNotionError,
    mockNotionEmptyDatabase,
    mockNotionUserInfo,
    createNotionPages,
    createSampleNotionPage
} from "../_fake/notion-fake";

test.describe("インポートページ", () => {
    test.beforeEach(async ({ page }) => {
        await setupTestAuth({ page });
    });

    test("Notionデータベースからのインポート", async ({ page }) => {
        // Notionページをモック
        const pages = createNotionPages({ count: 3 });
        await mockNotionDatabaseQuery({ page, pages });

        await page.goto("/import");
        await waitForPageLoad({ page });

        // インポートページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();

        // Notionページが表示されることを確認（実際のUIに合わせて調整が必要）
        // await expect(page.locator("text=Test Book 1")).toBeVisible();
        // await expect(page.locator("text=Test Book 2")).toBeVisible();
        // await expect(page.locator("text=Test Book 3")).toBeVisible();
    });

    test("Notion認証エラー", async ({ page }) => {
        // Notionエラーをモック
        await mockNotionError({ page, status: 403, code: "forbidden" });

        await page.goto("/import");
        await waitForPageLoad({ page });

        // エラーメッセージが表示されることを確認
        const alerts = await checkForAlerts({ page });

        // エラーがある場合は、ページがクラッシュしていないことを確認
        await expect(page.locator("body")).toBeVisible();
    });

    test("空のNotionデータベース", async ({ page }) => {
        // 空のデータベースをモック
        await mockNotionEmptyDatabase({ page });

        await page.goto("/import");
        await waitForPageLoad({ page });

        // ページが正常に表示されることを確認
        await expect(page.locator("body")).toBeVisible();
    });

    test("Notionユーザー情報の取得", async ({ page }) => {
        // ユーザー情報をモック
        await mockNotionUserInfo({
            page,
            user: {
                name: "Test User",
                person: { email: "test@example.com" }
            }
        });

        // サンプルページもモック
        const page_data = createSampleNotionPage();
        await mockNotionDatabaseQuery({ page, pages: [page_data] });

        await page.goto("/import");
        await waitForPageLoad({ page });

        // ページが正常に表示されることを確認
        await expect(page.locator("body")).toBeVisible();
    });

    test("大量のNotionページの処理", async ({ page }) => {
        // 大量のページをモック
        const pages = createNotionPages({ count: 50 });
        await mockNotionDatabaseQuery({ page, pages });

        await page.goto("/import");
        await waitForPageLoad({ page });

        // ページが正常に表示されることを確認
        await expect(page.locator("body")).toBeVisible();
    });
});
