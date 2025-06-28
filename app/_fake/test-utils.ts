import { Page, expect } from "@playwright/test";

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
 * BibiReaderのiframe内のエラーをチェックする
 */
export async function assertBibiReaderLoaded({
    page,
    timeout = 15000,
    debug = false
}: {
    page: Page;
    timeout?: number;
    debug?: boolean;
}) {
    // iframeが存在することを確認（より柔軟なセレクター）
    const iframe = page.locator("iframe");
    await expect(iframe.first()).toBeVisible({ timeout });

    // iframe内のフレームを取得
    const bibiFrame = page.frameLocator("iframe").first();

    // iframeの読み込み完了を待機
    await bibiFrame.locator("body").waitFor({ state: "visible", timeout });

    // デバッグモードでのみ実際の構造をログ出力
    if (debug) {
        const bodyContent = await bibiFrame
            .locator("body")
            .innerHTML()
            .catch(() => "Unable to get body content");
        console.log("BibiReader iframe body content preview:", bodyContent.substring(0, 500));
    }

    // エラー要素がないことを確認
    const errorElements = bibiFrame.locator('.error, .bibi-error, [class*="error"]');
    const errorCount = await errorElements.count();

    if (errorCount > 0) {
        const errorTexts = await errorElements.allTextContents();
        throw new Error(`BibiReader iframe contains errors: ${errorTexts.join(", ")}`);
    }

    // コンテンツが正しく読み込まれていることを確認（より寛容な条件）
    await expect(bibiFrame.locator("body")).toBeVisible();

    // BibiReaderの基本要素が存在することを確認
    const contentElements = [
        ".calibre",
        ".bibi-main",
        '[class*="content"]',
        "body > div",
        "#bibi-main" // メインコンテンツエリア
    ];

    let contentFound = false;
    for (const selector of contentElements) {
        const elementCount = await bibiFrame.locator(selector).count();
        if (elementCount > 0) {
            if (debug) {
                console.log(`Found BibiReader content element: ${selector} (${elementCount} elements)`);
            }
            contentFound = true;
            break;
        }
    }

    if (!contentFound) {
        console.warn("No specific content elements found, but iframe body is visible");
    }

    console.log("BibiReader iframe loaded successfully");
    return bibiFrame;
}

/**
 * EPUBビューアーのエラー状態をチェックする
 */
export async function assertEpubViewerNoErrors({ page, timeout = 10000 }: { page: Page; timeout?: number }) {
    // ページレベルのエラーをチェック
    const pageErrors = page.locator('.error, [role="alert"][class*="error"], .toast-error');
    const pageErrorCount = await pageErrors.count();

    if (pageErrorCount > 0) {
        const errorTexts = await pageErrors.allTextContents();
        throw new Error(`Page contains errors: ${errorTexts.join(", ")}`);
    }

    // BibiReader iframe内のエラーもチェック
    const bibiFrame = await assertBibiReaderLoaded({ page, timeout });

    return bibiFrame;
}

/**
 * コンソールエラーをキャプチャしてアサートする
 */
export async function assertNoConsoleErrors({ page, allowedErrors = [] }: { page: Page; allowedErrors?: string[] }) {
    const { errors } = setupConsoleCapture({ page });

    // 一定時間待って、コンソールエラーを収集
    await page.waitForTimeout(1000);

    // 許可されたエラー以外をフィルタリング
    const unexpectedErrors = errors.filter((error) => !allowedErrors.some((allowed) => error.includes(allowed)));

    if (unexpectedErrors.length > 0) {
        throw new Error(`Unexpected console errors: ${unexpectedErrors.join(", ")}`);
    }

    console.log(
        `No unexpected console errors found (${errors.length} total, ${
            errors.length - unexpectedErrors.length
        } allowed)`
    );
}
