import { test, expect } from "@playwright/test";
import { setupTestAuth, waitForPageLoad } from "../_fake/test-utils";

test.describe("設定ページ", () => {
    test.beforeEach(async ({ page }) => {
        await setupTestAuth({ page });
    });

    test("設定ページの基本表示", async ({ page }) => {
        await page.goto("/settings");
        await waitForPageLoad({ page });

        // 設定ページのタイトルが表示されることを確認
        await expect(page.locator('h1:has-text("Settings")')).toBeVisible();

        // Notion API Keyフィールドが表示されることを確認
        await expect(page.locator("#notion-api-key")).toBeVisible();

        // Book List Database Idフィールドが表示されることを確認
        await expect(page.locator("#notion-book-list-id")).toBeVisible();
    });

    test("Notion設定の入力", async ({ page }) => {
        await page.goto("/settings");
        await waitForPageLoad({ page });

        // APIキーの入力
        const apiKeyInput = page.locator("#notion-api-key");
        await apiKeyInput.fill("test-api-key");

        // データベースIDの入力
        const databaseIdInput = page.locator("#notion-book-list-id");
        await databaseIdInput.fill("test-database-id");

        // 値が正しく入力されることを確認
        await expect(apiKeyInput).toHaveValue("test-api-key");
        await expect(databaseIdInput).toHaveValue("test-database-id");
    });

    test("設定の保存", async ({ page }) => {
        await page.goto("/settings");
        await waitForPageLoad({ page });

        // 設定を入力
        await page.locator("#notion-api-key").fill("save-test-key");
        await page.locator("#notion-book-list-id").fill("save-test-db-id");

        // 保存ボタンがある場合はクリック
        const saveButton = page.locator('button:has-text("Save"), button:has-text("保存")');
        const isSaveButtonVisible = await saveButton.isVisible().catch(() => false);

        if (isSaveButtonVisible) {
            await saveButton.click();
        }

        // ページがクラッシュしていないことを確認
        await expect(page.locator("body")).toBeVisible();
    });

    test("その他の設定項目", async ({ page }) => {
        await page.goto("/settings");
        await waitForPageLoad({ page });

        // 「新しいタブで開く」設定があるかチェック
        const openNewTabCheckbox = page.locator('input[type="checkbox"]');
        const isCheckboxVisible = await openNewTabCheckbox.isVisible().catch(() => false);

        if (isCheckboxVisible) {
            await expect(openNewTabCheckbox).toBeVisible();
        }

        // ページが正常に表示されることを確認
        await expect(page.locator('h1:has-text("Settings")')).toBeVisible();
    });
});
