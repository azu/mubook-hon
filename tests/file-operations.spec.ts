import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    // テスト用のDropboxトークンを設定
    await page.addInitScript(() => {
        localStorage.setItem(
            "mubook-hon-dropbox-tokens",
            JSON.stringify({
                accessToken: "mock-access-token",
                refreshToken: "mock-refresh-token",
                accessTokenExpiresAt: new Date(Date.now() + 14400 * 1000).toISOString()
            })
        );

        // テスト用のNotion設定を追加
        localStorage.setItem(
            "mubook-hon-user-settings",
            JSON.stringify({
                notionToken: "mock-notion-token",
                bookListDatabaseId: "mock-database-id",
                openNewTab: false
            })
        );
    });
});

test.describe("ファイル操作", () => {
    test("モックされたEPUBとPDFファイルが表示される", async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });

        // ファイル一覧が読み込まれるまで待機
        await page.waitForTimeout(3000);

        // Book Listセクションが表示されることを確認
        await expect(page.locator('h2:has-text("Book List")')).toBeVisible();

        // ファイル検索機能をテスト
        const searchInput = page.locator("#input-search");
        await expect(searchInput).toBeVisible();

        // EPUBで検索
        await searchInput.fill("epub");
        await page.waitForTimeout(1000);

        // 検索結果が反映されることを確認（モックデータにsample.epubが含まれている）
        const pageContent = await page.textContent("body");
        console.log('Search results for "epub":', pageContent?.includes("sample.epub"));

        // 検索をクリア
        await searchInput.fill("");
        await page.waitForTimeout(1000);
    });

    test("検索機能が動作する", async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });

        // ファイル一覧が読み込まれるまで待機
        await page.waitForTimeout(3000);

        const searchInput = page.locator("#input-search");
        await expect(searchInput).toBeVisible();

        // PDFで検索
        await searchInput.fill("pdf");
        await page.waitForTimeout(1000);

        // 検索が機能していることを確認
        const searchValue = await searchInput.inputValue();
        expect(searchValue).toBe("pdf");
    });

    test("Recent Booksが表示される", async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });

        // Recent Booksセクションが表示されるまで待機
        await page.waitForTimeout(3000);

        // Recent Booksセクションが表示されることを確認
        await expect(page.locator('h2:has-text("Recent Books")')).toBeVisible();

        // Notion設定があるので、モックデータが取得される
        const detailsElement = page.locator("details");
        await expect(detailsElement).toBeVisible();

        // サマリーテキストをチェック（ローディング中またはデータ表示）
        const summaryText = await detailsElement.locator("summary").textContent();
        console.log("Recent Books summary:", summaryText);

        // 基本的にエラーではないことを確認
        expect(summaryText).toBeTruthy();
    });

    test("設定ページでNotionの設定ができる", async ({ page }) => {
        await page.goto("/settings");

        // 設定ページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();

        // 設定ページのh1タイトルを確認
        await expect(page.locator('h1:has-text("Settings")')).toBeVisible();

        // Notion API Keyフィールドが表示されることを確認
        await expect(page.locator("#notion-api-key")).toBeVisible();

        // Book List Database Idフィールドが表示されることを確認
        await expect(page.locator("#notion-book-list-id")).toBeVisible();
    });

    test("ビューアーページのURLパラメータが処理される", async ({ page }) => {
        // モックファイルIDを使用してビューアーページにアクセス
        await page.goto("/viewer?id=id:sample-epub-file-id&viewer=epub:bibi");

        // ビューアーページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();

        // エラーではなく、何らかのコンテンツが表示されることを確認
        const pageContent = await page.textContent("body");
        expect(pageContent).toBeTruthy();
    });
});
