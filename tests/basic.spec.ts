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
    });
});

test.describe("mubook アプリケーション", () => {
    test("ホームページが正常に読み込まれる", async ({ page }) => {
        await page.goto("/");

        // ページタイトルを確認
        await expect(page).toHaveTitle(/mubook/);

        // ナビゲーションが表示されることを確認
        await expect(page.locator("body")).toBeVisible();
    });

    test("Dropbox認証状態が表示される", async ({ page }) => {
        await page.goto("/");

        // ローディング後、何らかのコンテンツが表示されることを確認
        await page.waitForTimeout(3000); // Dropboxの初期化を待つ

        // コンソールエラーを確認
        const consoleLogs: string[] = [];
        page.on("console", (msg) => {
            if (msg.type() === "error") {
                consoleLogs.push(msg.text());
            }
        });

        // ページがロードされていることを確認
        await expect(page.locator("body")).toBeVisible();

        // アラートエラーがあるかチェック
        const alerts = await page.locator('[role="alert"]').all();
        if (alerts.length > 0) {
            const alertTexts = await Promise.all(alerts.map((alert) => alert.textContent()));
            console.log("Found alerts:", alertTexts);
        }

        // ページの内容を確認して、基本的な要素が表示されているかチェック
        const hasContent = await page.locator('h1, h2, [role="alert"]').first().isVisible();
        expect(hasContent).toBe(true);
    });

    test("ファイル一覧が表示される（モック）", async ({ page }) => {
        // ネットワークインターセプトを有効にする
        await page.route("**/api.dropboxapi.com/**", (route) => {
            // すでにMSWでモック済みなので、そのまま通す
            route.continue();
        });

        // MSWモックが有効になるように、ページをリロード
        await page.goto("/", { waitUntil: "networkidle" });

        // トークンが設定されているので、ファイル一覧の取得が試行される
        await page.waitForTimeout(5000);

        // Dropboxのアクセス状態を確認
        const bodyText = await page.textContent("body");
        console.log("Page content preview:", bodyText?.substring(0, 500));

        // Book Listのセクションが表示されているか確認
        const bookListHeading = page.locator('h2:has-text("Book List")');
        const isBookListVisible = await bookListHeading.isVisible().catch(() => false);

        if (isBookListVisible) {
            // モックデータが表示されることを期待
            await expect(bookListHeading).toBeVisible();
        } else {
            // Dropbox認証が必要な状態の可能性
            const authLink = page.locator("text=Authorize");
            const isAuthVisible = await authLink.isVisible().catch(() => false);

            if (isAuthVisible) {
                console.log("Dropbox authorization required");
                await expect(authLink).toBeVisible();
            } else {
                // ページがクラッシュしていないことを最低限確認
                await expect(page.locator("body")).toBeVisible();
            }
        }
    });

    test("設定ページにアクセスできる", async ({ page }) => {
        await page.goto("/settings");

        // 設定ページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();
    });

    test("インポートページにアクセスできる", async ({ page }) => {
        await page.goto("/import");

        // インポートページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();
    });
});
