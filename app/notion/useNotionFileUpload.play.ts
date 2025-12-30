import { test, expect, Page } from "@playwright/test";
import { setupTestAuth, setupDropboxFileCache } from "../_fake/test-utils";
import { mockNotionDatabaseRetrieve, mockNotionDataSourceQuery, createNotionPage } from "../_fake/notion-fake";
import * as fs from "fs";
import * as path from "path";

// 実際のサンプルEPUBファイルを読み込み
const epubPath = path.join(process.cwd(), "public/test-assets/example.epub");
const epubBuffer = fs.readFileSync(epubPath);

/**
 * Notion File Upload APIのモック
 * Note: Notion SDKはbaseUrl(api/notion-proxy) + /v1/ + pathを使う
 */
async function mockNotionFileUploadAPI({
    page,
    shouldFail = false,
    fileSizeLimitMB = 5
}: {
    page: Page;
    shouldFail?: boolean;
    fileSizeLimitMB?: number;
}) {
    // 1. Create file upload endpoint (Notion SDK経由)
    // パターン: /api/notion-proxy/v1/file_uploads
    await page.route("**/v1/file_uploads", async (route) => {
        // send エンドポイントは別途処理
        if (route.request().url().includes("/send")) {
            return route.fallback();
        }

        if (route.request().method() !== "POST") {
            return route.fallback();
        }

        if (shouldFail) {
            await route.fulfill({
                status: 400,
                contentType: "application/json",
                body: JSON.stringify({
                    object: "error",
                    status: 400,
                    code: "validation_error",
                    message: "File upload failed"
                })
            });
            return;
        }

        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                object: "file_upload",
                id: "mock-file-upload-id",
                upload_url: "http://localhost:3000/api/notion-proxy/v1/file_uploads/mock-file-upload-id/send",
                status: "pending",
                expiry_time: new Date(Date.now() + 3600000).toISOString()
            })
        });
    });

    // 2. Send file upload endpoint (fetch直接呼び出し)
    // パターン: /api/notion-proxy/v1/file_uploads/*/send
    await page.route("**/v1/file_uploads/*/send", async (route) => {
        if (route.request().method() !== "POST") {
            return route.fallback();
        }

        if (shouldFail) {
            await route.fulfill({
                status: 413,
                contentType: "application/json",
                body: JSON.stringify({
                    object: "error",
                    status: 413,
                    code: "payload_too_large",
                    message: `File size exceeds ${fileSizeLimitMB}MB limit`
                })
            });
            return;
        }

        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                status: "uploaded",
                filename: "test.epub",
                content_type: "application/epub+zip",
                content_length: "1024"
            })
        });
    });

    // 3. Complete file upload endpoint (not used for small files but mock anyway)
    await page.route("**/v1/file_uploads/*/complete", async (route) => {
        if (route.request().method() !== "POST") {
            return route.fallback();
        }

        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                object: "file_upload",
                id: "mock-file-upload-id",
                status: "uploaded"
            })
        });
    });
}

/**
 * Notion Page APIのモック（GET/PATCH両対応）
 * Note: Notion SDKはbaseUrl(api/notion-proxy) + /v1/ + pathを使う
 */
async function mockNotionPageAPI({
    page,
    notionPage,
    captureUpdateRequest
}: {
    page: Page;
    notionPage: ReturnType<typeof createNotionPageWithEmptyFileProperty>;
    captureUpdateRequest?: (body: any) => void;
}) {
    await page.route("**/v1/pages/*", async (route) => {
        const method = route.request().method();

        if (method === "GET") {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(notionPage)
            });
            return;
        }

        if (method === "PATCH") {
            const body = route.request().postDataJSON();
            if (captureUpdateRequest) {
                captureUpdateRequest(body);
            }

            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    object: "page",
                    id: notionPage.id,
                    properties: { ...notionPage.properties, ...body.properties }
                })
            });
            return;
        }

        return route.fallback();
    });
}

/**
 * Fileプロパティが空のNotionページを作成
 */
function createNotionPageWithEmptyFileProperty({
    bookName,
    fileId,
    viewer = "epub:bibi"
}: {
    bookName: string;
    fileId: string;
    viewer?: string;
}) {
    return {
        id: `page-${bookName.replace(/\s+/g, "-").toLowerCase()}`,
        object: "page" as const,
        url: `https://notion.so/page-${bookName.replace(/\s+/g, "-").toLowerCase()}`,
        created_time: "2023-01-01T00:00:00.000Z",
        last_edited_time: "2023-01-01T00:00:00.000Z",
        properties: {
            FileName: {
                type: "title",
                title: [{ text: { content: bookName } }]
            },
            FileId: {
                type: "rich_text",
                rich_text: [{ text: { content: fileId }, plain_text: fileId }]
            },
            Title: {
                type: "rich_text",
                rich_text: [{ text: { content: bookName }, plain_text: bookName }]
            },
            Viewer: {
                type: "select",
                select: { name: viewer }
            },
            Author: {
                type: "multi_select",
                multi_select: []
            },
            Publisher: {
                type: "select",
                select: null
            },
            LastMarker: {
                type: "rich_text",
                rich_text: [{ text: { content: "" }, plain_text: "" }]
            },
            CurrentPage: {
                type: "number",
                number: 0
            },
            TotalPage: {
                type: "number",
                number: 0
            },
            // Fileプロパティが空
            File: {
                type: "files",
                files: [] as Array<{
                    type: "file_upload" | "external";
                    file_upload?: { id: string };
                    external?: { url: string };
                    name?: string;
                }>
            }
        }
    };
}

/**
 * Fileプロパティに既にファイルがあるNotionページを作成
 */
function createNotionPageWithFileProperty({
    bookName,
    fileId,
    viewer = "epub:bibi"
}: {
    bookName: string;
    fileId: string;
    viewer?: string;
}) {
    const page = createNotionPageWithEmptyFileProperty({ bookName, fileId, viewer });
    page.properties.File = {
        type: "files",
        files: [
            {
                type: "file_upload" as const,
                file_upload: { id: "existing-file-upload-id" },
                name: "existing.epub"
            }
        ]
    };
    return page;
}

/**
 * ユーザー設定を初期化する
 */
async function setupUserSettings({
    page,
    uploadBookToNotion = false,
    openNewTab = true
}: {
    page: Page;
    uploadBookToNotion?: boolean;
    openNewTab?: boolean;
}) {
    await page.addInitScript(
        ({ uploadBookToNotion, openNewTab }) => {
            localStorage.setItem(
                "mubook-hon-user-settings",
                JSON.stringify({
                    openNewTab,
                    uploadBookToNotion
                })
            );
            // Notion設定も同時に設定（useNotionSettingが読む）
            localStorage.setItem(
                "mubook-hon-notion",
                JSON.stringify({
                    apiKey: "mock-notion-api-key",
                    bookListDatabaseId: "mock-book-list-database-id",
                    bookMemoDatabaseId: "mock-book-memo-database-id"
                })
            );
        },
        { uploadBookToNotion, openNewTab }
    );
}

test.describe("Notion File Upload", () => {
    test.beforeEach(async ({ page }) => {
        await setupTestAuth({ page });
    });

    test("Book DatabaseのFileプロパティが空のとき、アップロードされること", async ({ page }) => {
        // アップロード設定をONに
        await setupUserSettings({ page, uploadBookToNotion: true });

        // Notion APIをモック
        await mockNotionDatabaseRetrieve({ page });
        const notionPage = createNotionPageWithEmptyFileProperty({
            bookName: "test-book.epub",
            fileId: "test-book.epub"
        });
        await mockNotionDataSourceQuery({ page, pages: [notionPage] });
        await mockNotionFileUploadAPI({ page });

        let updateRequestBody: any = null;
        await mockNotionPageAPI({
            page,
            notionPage,
            captureUpdateRequest: (body) => {
                updateRequestBody = body;
            }
        });

        // テスト用のDropboxキャッシュを設定
        await setupDropboxFileCache({
            page,
            files: {
                "test-book.epub": epubBuffer.buffer as ArrayBuffer
            }
        });

        // PATCHレスポンスを待機する準備（ルートハンドラーの処理完了を待つため）
        const patchResponsePromise = page.waitForResponse(
            (response) => response.request().method() === "PATCH" && response.url().includes("/pages/"),
            { timeout: 30000 }
        );

        await page.goto("/viewer?id=test-book.epub&viewer=epub:bibi");

        // ページの基本読み込み完了を待機
        await page.waitForLoadState("domcontentloaded");

        // "Loading Viewer..."が消えるまで待機
        await expect(page.locator("text=Loading Viewer...")).toBeHidden({ timeout: 30000 });

        // PATCHレスポンスが完了するまで待機
        await patchResponsePromise;

        // Fileプロパティが更新されたことを確認
        expect(updateRequestBody).not.toBeNull();
        expect(updateRequestBody.properties?.File?.files).toBeDefined();
        expect(updateRequestBody.properties.File.files.length).toBeGreaterThan(0);
        expect(updateRequestBody.properties.File.files[0].type).toBe("file_upload");
    });

    test("Book DatabaseのFileプロパティが空でないとき、アップロードされないこと", async ({ page }) => {
        // アップロード設定をONに
        await setupUserSettings({ page, uploadBookToNotion: true });

        // Notion APIをモック（既にファイルがある状態）
        await mockNotionDatabaseRetrieve({ page });
        const notionPage = createNotionPageWithFileProperty({
            bookName: "test-book.epub",
            fileId: "test-book.epub"
        });
        await mockNotionDataSourceQuery({ page, pages: [notionPage] });
        await mockNotionPageAPI({ page, notionPage });

        // File Upload APIのモック（呼ばれないはず）
        let fileUploadCalled = false;
        await page.route("**/v1/file_uploads", async (route) => {
            fileUploadCalled = true;
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    object: "file_upload",
                    id: "mock-file-upload-id",
                    status: "pending"
                })
            });
        });

        // テスト用のDropboxキャッシュを設定
        await setupDropboxFileCache({
            page,
            files: {
                "test-book.epub": epubBuffer.buffer as ArrayBuffer
            }
        });

        await page.goto("/viewer?id=test-book.epub&viewer=epub:bibi");

        // ページの基本読み込み完了を待機
        await page.waitForLoadState("domcontentloaded");

        // "Loading Viewer..."が消えるまで待機
        await expect(page.locator("text=Loading Viewer...")).toBeHidden({ timeout: 30000 });

        // アップロードが呼ばれていないことを確認
        await page.waitForTimeout(2000);
        expect(fileUploadCalled).toBe(false);
    });
});
