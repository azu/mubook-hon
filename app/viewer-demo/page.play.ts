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

test.describe("本文の選択", () => {
    for (const mode of ["vertical", "horizontal"] as const) {
        test(`ページの端を長押ししても本文全体が選択されないよう、本文以外は選択できない (${mode})`, async ({
            page
        }) => {
            await page.goto(`/viewer-demo?mode=${mode}`);
            await expect(page.locator("foliate-view")).toBeAttached();
            // ページの端やページ間の余白は本の iframe の <html> の padding / column-gap
            await expect
                .poll(async () => {
                    const frame = page.frames().find((f) => f !== page.mainFrame());
                    if (!frame) return null;
                    return frame.evaluate(() => {
                        const html = getComputedStyle(document.documentElement);
                        const body = getComputedStyle(document.body);
                        return {
                            html: html.webkitUserSelect || html.userSelect,
                            body: body.webkitUserSelect || body.userSelect
                        };
                    });
                })
                .toEqual({ html: "none", body: "text" });
            // 本の周りの余白（iframeの外）も選択できない
            const container = await page
                .locator("foliate-view")
                .evaluate((el) => getComputedStyle(el.parentElement as Element).userSelect);
            expect(container).toBe("none");
        });
    }
});
