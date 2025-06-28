import { Page } from "@playwright/test";
import type { DropboxFileEntry, DropboxListFolderResponse, DropboxOAuthTokenResponse } from "./types";

/**
 * 正常なファイル一覧レスポンスをモック
 */
export async function mockDropboxFileList({ page, files }: { page: Page; files: DropboxFileEntry[] }) {
    await page.route("**/api.dropboxapi.com/2/files/list_folder", async (route) => {
        const response: DropboxListFolderResponse = {
            entries: files,
            cursor: "mock-cursor",
            has_more: false
        };

        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(response)
        });
    });
}

/**
 * エラーレスポンスをモック
 */
export async function mockDropboxError({
    page,
    status = 401,
    error = "invalid_access_token"
}: {
    page: Page;
    status?: number;
    error?: string;
}) {
    await page.route("**/api.dropboxapi.com/2/files/list_folder", async (route) => {
        await route.fulfill({
            status,
            contentType: "application/json",
            body: JSON.stringify({ error })
        });
    });
}

/**
 * ファイルダウンロードをモック
 */
export async function mockDropboxFileDownload({
    page,
    filePath,
    content,
    contentType
}: {
    page: Page;
    filePath: string;
    content: string;
    contentType: string;
}) {
    await page.route("**/content.dropboxapi.com/2/files/download", async (route) => {
        const dropboxApiArg = route.request().headers()["dropbox-api-arg"];
        const pathInfo = JSON.parse(dropboxApiArg || "{}");

        if (pathInfo.path === filePath) {
            await route.fulfill({
                status: 200,
                contentType,
                body: content,
                headers: {
                    "Dropbox-API-Result": JSON.stringify({
                        name: filePath.split("/").pop(),
                        path_lower: filePath,
                        path_display: filePath,
                        id: `id:${filePath.replace("/", "")}-file-id`,
                        client_modified: "2023-01-01T00:00:00Z",
                        server_modified: "2023-01-01T00:00:00Z",
                        rev: `${filePath.replace("/", "")}-rev`,
                        size: content.length,
                        is_downloadable: true,
                        content_hash: `${filePath.replace("/", "")}-hash`
                    })
                }
            });
        } else {
            await route.fulfill({ status: 404 });
        }
    });
}

/**
 * 複数のファイルダウンロードをモック
 */
export async function mockDropboxMultipleFileDownloads({
    page,
    fileContents
}: {
    page: Page;
    fileContents: { filePath: string; content: string; contentType: string }[];
}) {
    await page.route("**/content.dropboxapi.com/2/files/download", async (route) => {
        const dropboxApiArg = route.request().headers()["dropbox-api-arg"];
        const pathInfo = JSON.parse(dropboxApiArg || "{}");

        const fileConfig = fileContents.find((f) => f.filePath === pathInfo.path);
        if (fileConfig) {
            await route.fulfill({
                status: 200,
                contentType: fileConfig.contentType,
                body: fileConfig.content,
                headers: {
                    "Dropbox-API-Result": JSON.stringify({
                        name: fileConfig.filePath.split("/").pop(),
                        path_lower: fileConfig.filePath,
                        path_display: fileConfig.filePath,
                        id: `id:${fileConfig.filePath.replace("/", "")}-file-id`,
                        client_modified: "2023-01-01T00:00:00Z",
                        server_modified: "2023-01-01T00:00:00Z",
                        rev: `${fileConfig.filePath.replace("/", "")}-rev`,
                        size: fileConfig.content.length,
                        is_downloadable: true,
                        content_hash: `${fileConfig.filePath.replace("/", "")}-hash`
                    })
                }
            });
        } else {
            await route.fulfill({ status: 404 });
        }
    });
}

/**
 * OAuth認証をモック
 */
export async function mockDropboxOAuth({
    page,
    response
}: {
    page: Page;
    response?: Partial<DropboxOAuthTokenResponse>;
}) {
    await page.route("**/api.dropbox.com/oauth2/token", async (route) => {
        const tokenResponse: DropboxOAuthTokenResponse = {
            access_token: "mock-access-token",
            token_type: "bearer",
            expires_in: 14400,
            refresh_token: "mock-refresh-token",
            scope: "files.content.read files.metadata.read",
            uid: "12345",
            account_id: "dbid:mock-account-id",
            ...response
        };

        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(tokenResponse)
        });
    });
}

/**
 * 空のファイル一覧をモック
 */
export async function mockDropboxEmptyFiles({ page }: { page: Page }) {
    await mockDropboxFileList({ page, files: [] });
}

/**
 * 遅延レスポンスをモック
 */
export async function mockDropboxSlowResponse({ page, delayMs = 3000 }: { page: Page; delayMs?: number }) {
    await page.route("**/api.dropboxapi.com/2/files/list_folder", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, delayMs));

        const response: DropboxListFolderResponse = {
            entries: [createDropboxFile({ name: "slow-book.epub" })],
            cursor: "slow-cursor",
            has_more: false
        };

        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(response)
        });
    });
}

/**
 * テスト用ファイルエントリを作成
 */
export function createDropboxFile({
    name,
    overrides = {}
}: {
    name: string;
    overrides?: Partial<DropboxFileEntry>;
}): DropboxFileEntry {
    return {
        ".tag": "file",
        name,
        path_lower: `/${name}`,
        path_display: `/${name}`,
        id: `id:${name}-file-id`,
        client_modified: "2023-01-01T00:00:00Z",
        server_modified: "2023-01-01T00:00:00Z",
        rev: `${name}-rev`,
        size: 1234567,
        is_downloadable: true,
        content_hash: `${name}-hash`,
        ...overrides
    };
}

/**
 * 複数のファイルを生成
 */
export function createDropboxFiles({
    count,
    type = "epub"
}: {
    count: number;
    type?: "epub" | "pdf";
}): DropboxFileEntry[] {
    return Array.from({ length: count }, (_, i) =>
        createDropboxFile({ name: `book-${i + 1}.${type}`, overrides: { size: 1000000 + i } })
    );
}

/**
 * 特定の形式のテストファイルセットを作成
 */
export function createSampleDropboxFiles(): DropboxFileEntry[] {
    return [
        createDropboxFile({
            name: "sample.epub",
            overrides: {
                id: "id:sample-epub-file-id",
                size: 1234567,
                content_hash: "sample-hash"
            }
        }),
        createDropboxFile({
            name: "sample.pdf",
            overrides: {
                id: "id:sample-pdf-file-id",
                size: 2345678,
                content_hash: "sample-hash"
            }
        })
    ];
}
