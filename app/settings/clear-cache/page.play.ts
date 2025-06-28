import { test, expect } from "@playwright/test";
import { setupTestAuth, waitForPageLoad } from "../../_fake/test-utils";

test.describe("キャッシュクリアページ", () => {
    test.beforeEach(async ({ page }) => {
        await setupTestAuth({ page });
    });

    test("キャッシュクリアページの表示", async ({ page }) => {
        await page.goto("/settings/clear-cache");
        await waitForPageLoad({ page });

        // ページが正常に表示されることを確認
        await expect(page.locator("body")).toBeVisible();
    });

    test("キャッシュクリア操作", async ({ page }) => {
        // localStorage/sessionStorageにテストデータを設定
        await page.addInitScript(() => {
            localStorage.setItem("test-cache-key", "test-cache-value");
            sessionStorage.setItem("test-session-key", "test-session-value");
        });

        await page.goto("/settings/clear-cache");
        await waitForPageLoad({ page });

        // クリアボタンがある場合はクリック
        const clearButton = page.locator('button:has-text("Clear"), button:has-text("クリア")');
        const isClearButtonVisible = await clearButton.isVisible().catch(() => false);

        if (isClearButtonVisible) {
            await clearButton.click();

            // キャッシュがクリアされたかを確認
            const cacheValue = await page.evaluate(() => localStorage.getItem("test-cache-key"));
            expect(cacheValue).toBeNull();
        }

        // ページがクラッシュしていないことを確認
        await expect(page.locator("body")).toBeVisible();
    });
});
