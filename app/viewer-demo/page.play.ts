import { test, expect } from "@playwright/test";

test.describe("ログイン不要の表示確認ページ", () => {
    test("サンプルの一覧が表示される", async ({ page }) => {
        await page.goto("/viewer-demo");
        await expect(page.getByRole("link", { name: "表示確認用サンプル（縦書き）" })).toBeVisible();
        await expect(page.getByRole("link", { name: "表示確認用サンプル（横書き）" })).toBeVisible();
    });

    for (const mode of ["vertical", "horizontal"] as const) {
        test(`ログインせずにサンプル本文を表示できる (${mode})`, async ({ page }) => {
            const notionRequests: string[] = [];
            page.on("request", (request) => {
                if (request.url().includes("/notion/") || request.url().includes("api.notion.com")) {
                    notionRequests.push(request.url());
                }
            });

            await page.goto(`/viewer-demo?mode=${mode}`);
            await expect(page.locator("foliate-view")).toBeAttached();
            const expectedTitle = mode === "vertical" ? "表示確認用サンプル（縦書き）" : "表示確認用サンプル（横書き）";
            await expect(page).toHaveTitle(expectedTitle);
            // 最後に読んだ書籍として保存しない
            expect(await page.evaluate(() => localStorage.getItem("mubook-hon-last-read"))).toBeNull();
            // Notionとは通信しない
            expect(notionRequests).toEqual([]);
        });
    }

    test("ログイン済みでもNotionと通信しない", async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem(
                "mubook-hon-notion",
                JSON.stringify({
                    apiKey: "mock-notion-token",
                    bookListDatabaseId: "mock-book-db",
                    bookMemoDatabaseId: "mock-memo-db"
                })
            );
        });
        const notionRequests: string[] = [];
        page.on("request", (request) => {
            if (request.url().includes("/notion/") || request.url().includes("api.notion.com")) {
                notionRequests.push(request.url());
            }
        });
        await page.goto("/viewer-demo?mode=vertical");
        await expect(page.locator("foliate-view")).toBeAttached();
        await expect(page).toHaveTitle("表示確認用サンプル（縦書き）");
        await page.waitForTimeout(1000);
        expect(notionRequests).toEqual([]);
    });
});
