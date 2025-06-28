import { Page, expect, test } from "@playwright/test";

/**
 * DropboxトークンをlocalStorageに設定
 */
export async function setupDropboxAuth({ page }: { page: Page }) {
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
}

/**
 * NotionトークンをlocalStorageに設定
 */
export async function setupNotionAuth({ page }: { page: Page }) {
    await page.addInitScript(() => {
        localStorage.setItem(
            "mubook-hon-notion-config",
            JSON.stringify({
                token: "mock-notion-token",
                databaseId: "mock-database-id"
            })
        );

        // 既存のユーザー設定形式もサポート
        localStorage.setItem(
            "mubook-hon-user-settings",
            JSON.stringify({
                notionToken: "mock-notion-token",
                bookListDatabaseId: "mock-database-id",
                openNewTab: false
            })
        );
    });
}

/**
 * 基本的なテストセットアップ
 */
export async function setupTestAuth({ page }: { page: Page }) {
    await setupDropboxAuth({ page });
    await setupNotionAuth({ page });
}

/**
 * すべてのモックをクリア
 */
export async function clearAllMocks({ page }: { page: Page }) {
    await page.unroute("**/*");
}

/**
 * テスト環境のリセット
 */
export async function resetTestEnvironment({ page }: { page: Page }) {
    await clearAllMocks({ page });
    await page.addInitScript(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
}

/**
 * コンソールエラーをキャプチャするためのユーティリティ
 */
export function setupConsoleCapture({ page }: { page: Page }): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    page.on("console", (msg) => {
        if (msg.type() === "error") {
            errors.push(msg.text());
        } else if (msg.type() === "warning") {
            warnings.push(msg.text());
        }
    });

    return { errors, warnings };
}

/**
 * ネットワークエラーをキャプチャするためのユーティリティ
 */
export function setupNetworkCapture({ page }: { page: Page }): { requests: string[]; failures: string[] } {
    const requests: string[] = [];
    const failures: string[] = [];

    page.on("request", (request) => {
        requests.push(`${request.method()} ${request.url()}`);
    });

    page.on("requestfailed", (request) => {
        failures.push(`Failed: ${request.method()} ${request.url()}`);
    });

    return { requests, failures };
}

/**
 * ページの読み込み完了を待つ
 */
export async function waitForPageLoad({ page, timeout = 10000 }: { page: Page; timeout?: number }) {
    await page.waitForLoadState("networkidle", { timeout });
}

/**
 * 特定の要素が表示されるまで待つ
 */
export async function waitForElementVisible({
    page,
    selector,
    timeout = 5000
}: {
    page: Page;
    selector: string;
    timeout?: number;
}) {
    await page.waitForSelector(selector, { state: "visible", timeout });
}

/**
 * アラートメッセージの存在をチェック
 */
export async function checkForAlerts({ page }: { page: Page }): Promise<string[]> {
    const alerts = await page.locator('[role="alert"]').all();
    return Promise.all(alerts.map((alert) => alert.textContent().then((text) => text || "")));
}

/**
 * テスト用のDropboxファイルキャッシュを設定
 */
export async function setupDropboxFileCache({ page, files }: { page: Page; files: { [fileId: string]: ArrayBuffer } }) {
    // ArrayBufferをArray形式に変換（シリアライズ可能にするため）
    const serializedFiles: { [fileId: string]: number[] } = {};
    Object.entries(files).forEach(([fileId, arrayBuffer]) => {
        serializedFiles[fileId] = Array.from(new Uint8Array(arrayBuffer));
    });

    await page.addInitScript((serializedFiles) => {
        const cache: any = {};

        Object.entries(serializedFiles).forEach(([fileId, byteArray]) => {
            const uint8Array = new Uint8Array(byteArray);
            const blob = new Blob([uint8Array], {
                type: "application/epub+zip"
            });

            cache[fileId] = {
                name: fileId.split("/").pop() || fileId,
                path_lower: fileId.startsWith("/") ? fileId : `/${fileId}`,
                path_display: fileId.startsWith("/") ? fileId : `/${fileId}`,
                id: `id:${fileId.replace(/[^a-zA-Z0-9]/g, "")}-file-id`,
                client_modified: "2023-01-01T00:00:00Z",
                server_modified: "2023-01-01T00:00:00Z",
                rev: `${fileId.replace(/[^a-zA-Z0-9]/g, "")}-rev`,
                size: uint8Array.byteLength,
                is_downloadable: true,
                content_hash: `${fileId.replace(/[^a-zA-Z0-9]/g, "")}-hash`,
                fileBlob: blob
            };
        });

        // @ts-ignore
        window.__TEST_DROPBOX_CACHE__ = cache;
        console.log("Test Dropbox cache configured for files:", Object.keys(cache));
        console.log(
            "File sizes:",
            Object.entries(cache).map(([id, data]: [string, any]) => `${id}: ${data.size} bytes`)
        );
    }, serializedFiles);
}

/**
 * EPUBビューアーが正しく読み込まれ、エラーがないことを確認する
 */
export async function assertEpubViewerNoErrors({ page }: { page: Page }) {
    await test.step("Check for BibiReader epub content", async () => {
        await expect(
            page.locator("#bibi-frame").contentFrame().locator(".item").first().contentFrame().locator("#cover-image")
        ).toBeVisible();
    });
}
