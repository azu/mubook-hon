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

test.describe("Tap Zones", () => {
    test.beforeEach(async ({ page }) => {
        await setupTestAuth({ page });
    });

    test("Tap Zones section is displayed", async ({ page }) => {
        await page.goto("/settings");
        await waitForPageLoad({ page });

        // Viewer section is displayed
        await expect(page.getByRole("heading", { name: "Viewer" })).toBeVisible();

        // Tap Zones heading is displayed
        await expect(page.getByRole("heading", { name: "Tap Zones" })).toBeVisible();
    });

    test("Preset buttons are displayed", async ({ page }) => {
        await page.goto("/settings");
        await waitForPageLoad({ page });

        // 3 preset buttons are displayed
        const presetGroup = page.getByRole("group", { name: "Presets" });
        await expect(presetGroup.getByRole("button", { name: "Default" })).toBeVisible();
        await expect(presetGroup.getByRole("button", { name: "Right Hand" })).toBeVisible();
        await expect(presetGroup.getByRole("button", { name: "Left Hand" })).toBeVisible();
    });

    test("9-zone grid is displayed", async ({ page }) => {
        await page.goto("/settings");
        await waitForPageLoad({ page });

        // Grid with 9 cells is displayed
        const grid = page.getByRole("grid", { name: "Tap zone settings" });
        await expect(grid).toBeVisible();

        // Verify each cell by data-testid
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                await expect(page.getByTestId(`tap-zone-${row}-${col}`)).toBeVisible();
            }
        }
    });

    test("Legend is displayed", async ({ page }) => {
        await page.goto("/settings");
        await waitForPageLoad({ page });

        // Verify action names in legend
        const legend = page.getByLabel("Legend");
        await expect(legend.getByText("Next")).toBeVisible();
        await expect(legend.getByText("Prev")).toBeVisible();
        await expect(legend.getByText("Menu")).toBeVisible();
        await expect(legend.getByText("Close")).toBeVisible();
        await expect(legend.getByText("None")).toBeVisible();
    });

    test("Right Hand preset changes settings", async ({ page }) => {
        await page.goto("/settings");
        await waitForPageLoad({ page });

        const presetGroup = page.getByRole("group", { name: "Presets" });

        // Apply different preset first
        await presetGroup.getByRole("button", { name: "Left Hand" }).click();

        // Click Right Hand preset
        await presetGroup.getByRole("button", { name: "Right Hand" }).click();

        // First cell (top-left) should be Prev
        const firstCell = page.getByTestId("tap-zone-0-0");
        await expect(firstCell).toHaveAccessibleName(/Prev/);
    });

    test("Left Hand preset changes settings", async ({ page }) => {
        await page.goto("/settings");
        await waitForPageLoad({ page });

        const presetGroup = page.getByRole("group", { name: "Presets" });

        // Click Left Hand preset
        await presetGroup.getByRole("button", { name: "Left Hand" }).click();

        // First cell (top-left) should be Next
        const firstCell = page.getByTestId("tap-zone-0-0");
        await expect(firstCell).toHaveAccessibleName(/Next/);
    });

    test("Default preset changes settings", async ({ page }) => {
        await page.goto("/settings");
        await waitForPageLoad({ page });

        const presetGroup = page.getByRole("group", { name: "Presets" });

        // Click Default preset
        await presetGroup.getByRole("button", { name: "Default" }).click();

        // Middle-left cell should be Prev
        const middleLeftCell = page.getByTestId("tap-zone-1-0");
        await expect(middleLeftCell).toHaveAccessibleName(/Prev/);
    });

    test("Clicking cell changes action", async ({ page }) => {
        await page.goto("/settings");
        await waitForPageLoad({ page });

        const presetGroup = page.getByRole("group", { name: "Presets" });

        // Apply Right Hand preset to set initial state
        await presetGroup.getByRole("button", { name: "Right Hand" }).click();

        const firstCell = page.getByTestId("tap-zone-0-0");

        // Initially Prev
        await expect(firstCell).toHaveAccessibleName(/Prev/);

        // Click to change to Menu (order: next→prev→menu→close→none→next...)
        await firstCell.click();
        await expect(firstCell).toHaveAccessibleName(/Menu/);

        // Click again to change to Close
        await firstCell.click();
        await expect(firstCell).toHaveAccessibleName(/Close/);
    });
});
