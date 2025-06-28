import { Page } from "@playwright/test";
import type { NotionPage, NotionDatabaseQueryResponse, NotionUser } from "./types";

/**
 * データベースクエリレスポンスをモック
 */
export async function mockNotionDatabaseQuery({ page, pages }: { page: Page; pages: NotionPage[] }) {
    await page.route("**/api.notion.com/v1/databases/*/query", async (route) => {
        const response: NotionDatabaseQueryResponse = {
            object: "list",
            results: pages,
            next_cursor: null,
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
export async function mockNotionError({
    page,
    status = 401,
    code = "unauthorized"
}: {
    page: Page;
    status?: number;
    code?: string;
}) {
    await page.route("**/api.notion.com/v1/databases/*/query", async (route) => {
        await route.fulfill({
            status,
            contentType: "application/json",
            body: JSON.stringify({
                object: "error",
                status,
                code,
                message: "API request failed"
            })
        });
    });
}

/**
 * ページ作成をモック
 */
export async function mockNotionPageCreation({ page }: { page: Page }) {
    await page.route("**/api.notion.com/v1/pages", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                id: "new-page-id",
                object: "page",
                created_time: new Date().toISOString(),
                last_edited_time: new Date().toISOString(),
                properties: {}
            })
        });
    });
}

/**
 * ユーザー情報取得をモック
 */
export async function mockNotionUserInfo({ page, user }: { page: Page; user?: Partial<NotionUser> }) {
    await page.route("**/api.notion.com/v1/users/me", async (route) => {
        const userResponse: NotionUser = {
            object: "user",
            id: "mock-user-id",
            name: "Test User",
            avatar_url: null,
            type: "person",
            person: {
                email: "test@example.com"
            },
            ...user
        };

        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(userResponse)
        });
    });
}

/**
 * 空のデータベースをモック
 */
export async function mockNotionEmptyDatabase({ page }: { page: Page }) {
    await mockNotionDatabaseQuery({ page, pages: [] });
}

/**
 * 遅延レスポンスをモック
 */
export async function mockNotionSlowResponse({ page, delayMs = 3000 }: { page: Page; delayMs?: number }) {
    await page.route("**/api.notion.com/v1/databases/*/query", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, delayMs));

        const response: NotionDatabaseQueryResponse = {
            object: "list",
            results: [createNotionPage({ bookName: "Slow Book", fileId: "id:slow-book-file-id" })],
            next_cursor: null,
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
 * テスト用Notionページを作成
 */
export function createNotionPage({
    bookName,
    fileId,
    viewer = "epub:bibi"
}: {
    bookName: string;
    fileId: string;
    viewer?: string;
}): NotionPage {
    return {
        id: `page-${bookName.replace(/\s+/g, "-").toLowerCase()}`,
        object: "page",
        created_time: "2023-01-01T00:00:00.000Z",
        last_edited_time: "2023-01-01T00:00:00.000Z",
        properties: {
            "Book Name": {
                title: [{ text: { content: bookName } }]
            },
            "File ID": {
                rich_text: [{ text: { content: fileId } }]
            },
            Viewer: {
                select: { name: viewer }
            }
        }
    };
}

/**
 * 複数のページを生成
 */
export function createNotionPages({ count }: { count: number }): NotionPage[] {
    return Array.from({ length: count }, (_, i) =>
        createNotionPage({ bookName: `Test Book ${i + 1}`, fileId: `id:book-${i + 1}-file-id` })
    );
}

/**
 * 既存のMSWテストデータと互換性のあるサンプルページを作成
 */
export function createSampleNotionPage(): NotionPage {
    return createNotionPage({
        bookName: "Sample Book",
        fileId: "id:sample-epub-file-id",
        viewer: "epub:bibi"
    });
}
