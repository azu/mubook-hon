# Playwright Route API Migration Design Document

## 概要

MSWからPlaywright Route APIへ移行し、テストファイルの配置とモック管理を改善する。

## 目標

1. **テストごとのモック制御**: Playwright Route APIを使用してテスト固有のモックを実現
2. **サービス別のFakeユーティリティ**: DropboxやNotionごとにモックユーティリティを整理
3. **テストファイルの配置改善**: ページファイルと同じディレクトリにテストファイルを配置
4. **Fakeユーティリティの統一管理**: `_fake`ディレクトリで管理

## テスト方針

- 〜すると、〜できる みたいな操作に対して期待した結果を書く
- https://playwright.dev/docs/best-practices を参照する
- https://github.com/playwright-community/eslint-plugin-playwright を使う
- テストごとにfakeを設定して、Unitテストのように機能のテストを書く
- テストはFully Parallelで実行できるようにする

## 新しいディレクトリ構造

```
app/
├── page.tsx
├── page.play.ts                    # ホームページのテスト
├── layout.tsx
├── _fake/                          # Fakeユーティリティディレクトリ
│   ├── dropbox-fake.ts            # Dropbox API Fake
│   ├── notion-fake.ts             # Notion API Fake
│   ├── types.ts                   # 共通型定義
│   └── test-utils.ts              # テスト共通ユーティリティ
├── import/
│   ├── page.tsx
│   └── page.play.ts               # インポートページのテスト
├── settings/
│   ├── page.tsx
│   ├── page.play.ts               # 設定ページのテスト
│   └── clear-cache/
│       ├── page.tsx
│       └── page.play.ts           # キャッシュクリアページのテスト
└── viewer/
    ├── page.tsx
    ├── page.play.ts               # ビューアページのテスト
    ├── epub/
    │   ├── BibiReader.tsx
    │   └── BibiReader.play.ts     # EPUBリーダーのテスト
    ├── kindle/
    │   ├── KindleReader.tsx
    │   └── KindleReader.play.ts   # Kindleリーダーのテスト
    └── pdf/
        ├── PdfReader.tsx
        └── PdfReader.play.ts      # PDFリーダーのテスト
```

## アーキテクチャ設計

### 1. Fakeユーティリティの設計

#### 型定義 (`app/_fake/types.ts`)
```typescript
// Dropbox API型定義
export type DropboxFileEntry = {
    ".tag": "file" | "folder";
    name: string;
    path_lower: string;
    path_display: string;
    id: string;
    client_modified: string;
    server_modified: string;
    rev: string;
    size: number;
    is_downloadable: boolean;
    content_hash: string;
};

export type DropboxListFolderResponse = {
    entries: DropboxFileEntry[];
    cursor: string;
    has_more: boolean;
};

// Notion API型定義
export type NotionPage = {
    id: string;
    object: "page";
    created_time: string;
    last_edited_time: string;
    properties: Record<string, any>;
};

export type NotionDatabaseQueryResponse = {
    object: "list";
    results: NotionPage[];
    next_cursor: string | null;
    has_more: boolean;
};
```

#### Dropbox Fake (`app/_fake/dropbox-fake.ts`)
```typescript
import { Page } from "@playwright/test";
import type { DropboxFileEntry, DropboxListFolderResponse } from "./types";

/**
 * 正常なファイル一覧レスポンスをモック
 */
export async function mockDropboxFileList({ page, files }: { page: Page; files: DropboxFileEntry[] }) {
    await page.route("**/api.dropboxapi.com/2/files/list_folder", async route => {
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
export async function mockDropboxError({ page, status = 401, error = "invalid_access_token" }: { page: Page; status?: number; error?: string }) {
    await page.route("**/api.dropboxapi.com/2/files/list_folder", async route => {
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
export async function mockDropboxFileDownload({ page, filePath, content, contentType }: { page: Page; filePath: string; content: string; contentType: string }) {
    await page.route("**/content.dropboxapi.com/2/files/download", async route => {
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
                        path_display: filePath
                    })
                }
            });
        } else {
            await route.fulfill({ status: 404 });
        }
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
    await page.route("**/api.dropboxapi.com/2/files/list_folder", async route => {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        
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
export function createDropboxFile({ name, overrides = {} }: { name: string; overrides?: Partial<DropboxFileEntry> }): DropboxFileEntry {
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
export function createDropboxFiles({ count, type = 'epub' }: { count: number; type?: 'epub' | 'pdf' }): DropboxFileEntry[] {
    return Array.from({ length: count }, (_, i) => 
        createDropboxFile({ name: `book-${i + 1}.${type}`, overrides: { size: 1000000 + i } })
    );
}
```

#### Notion Fake (`app/_fake/notion-fake.ts`)
```typescript
import { Page } from "@playwright/test";
import type { NotionPage, NotionDatabaseQueryResponse } from "./types";

/**
 * データベースクエリレスポンスをモック
 */
export async function mockNotionDatabaseQuery({ page, pages }: { page: Page; pages: NotionPage[] }) {
    await page.route("**/api.notion.com/v1/databases/*/query", async route => {
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
export async function mockNotionError({ page, status = 401, code = "unauthorized" }: { page: Page; status?: number; code?: string }) {
    await page.route("**/api.notion.com/v1/databases/*/query", async route => {
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
 * 空のデータベースをモック
 */
export async function mockNotionEmptyDatabase({ page }: { page: Page }) {
    await mockNotionDatabaseQuery({ page, pages: [] });
}

/**
 * テスト用Notionページを作成
 */
export function createNotionPage({ bookName, fileId, viewer = "epub:bibi" }: { bookName: string; fileId: string; viewer?: string }): NotionPage {
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
            "Viewer": {
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
```

#### テスト共通ユーティリティ (`app/_fake/test-utils.ts`)
```typescript
import { Page } from "@playwright/test";

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
```

### 2. テストファイルの例

#### ホームページテスト (`app/page.play.ts`)
```typescript
import { test, expect } from "@playwright/test";
import { setupTestAuth } from "./_fake/test-utils";
import { mockDropboxFileList, mockDropboxError, mockDropboxEmptyFiles, mockDropboxSlowResponse, createDropboxFiles } from "./_fake/dropbox-fake";

test.describe("ホームページ", () => {
    test.beforeEach(async ({ page }) => {
        await setupTestAuth({ page });
    });

    test("正常なファイル一覧の表示", async ({ page }) => {
        // Dropboxファイル一覧をモック
        const files = createDropboxFiles({ count: 5, type: 'epub' });
        await mockDropboxFileList({ page, files });

        await page.goto("/");
        
        // Book Listが表示されることを確認
        await expect(page.locator('h2:has-text("Book List")')).toBeVisible();
    });

    test("Dropboxエラー時の処理", async ({ page }) => {
        // エラーレスポンスをモック
        await mockDropboxError({ page, status: 401, error: "invalid_access_token" });

        await page.goto("/");
        
        // エラーメッセージが表示されることを確認
        const errorAlert = page.locator('[role="alert"]');
        await expect(errorAlert).toBeVisible();
    });

    test("空のファイル一覧", async ({ page }) => {
        // 空のファイル一覧をモック
        await mockDropboxEmptyFiles({ page });

        await page.goto("/");
        
        // 空状態のメッセージが表示されることを確認
        await expect(page.locator("text=No files found")).toBeVisible();
    });

    test("読み込み遅延の処理", async ({ page }) => {
        // 遅延レスポンスをモック
        await mockDropboxSlowResponse({ page, delayMs: 2000 });

        await page.goto("/");
        
        // ローディング表示を確認
        await expect(page.locator('[data-testid="loading"]')).toBeVisible();
        
        // 最終的にコンテンツが読み込まれることを確認
        await expect(page.locator('h2:has-text("Book List")')).toBeVisible({ timeout: 5000 });
    });
});
```

#### インポートページテスト (`app/import/page.play.ts`)
```typescript
import { test, expect } from "@playwright/test";
import { setupTestAuth } from "../_fake/test-utils";
import { mockNotionDatabaseQuery, mockNotionError, createNotionPages } from "../_fake/notion-fake";

test.describe("インポートページ", () => {
    test.beforeEach(async ({ page }) => {
        await setupTestAuth({ page });
    });

    test("Notionデータベースからのインポート", async ({ page }) => {
        // Notionページをモック
        const pages = createNotionPages({ count: 3 });
        await mockNotionDatabaseQuery({ page, pages });

        await page.goto("/import");
        
        // Notionページが表示されることを確認
        await expect(page.locator("text=Test Book 1")).toBeVisible();
        await expect(page.locator("text=Test Book 2")).toBeVisible();
        await expect(page.locator("text=Test Book 3")).toBeVisible();
    });

    test("Notion認証エラー", async ({ page }) => {
        // Notionエラーをモック
        await mockNotionError({ page, status: 403, code: "forbidden" });

        await page.goto("/import");
        
        // エラーメッセージが表示されることを確認
        await expect(page.locator('[role="alert"]')).toBeVisible();
    });
});
```

#### EPUBリーダーテスト (`app/viewer/epub/BibiReader.play.ts`)
```typescript
import { test, expect } from "@playwright/test";
import { setupTestAuth } from "../../_fake/test-utils";
import { mockDropboxFileDownload } from "../../_fake/dropbox-fake";

test.describe("EPUBリーダー", () => {
    test.beforeEach(async ({ page }) => {
        await setupTestAuth({ page });
    });

    test("EPUB書籍の表示", async ({ page }) => {
        // EPUBファイルダウンロードをモック
        const epubContent = "PK\x03\x04mock epub content";
        await mockDropboxFileDownload({
            page,
            filePath: "/test-book.epub",
            content: epubContent,
            contentType: "application/epub+zip"
        });

        await page.goto("/viewer?file=test-book.epub&viewer=epub:bibi");
        
        // Bibiリーダーが読み込まれることを確認
        await expect(page.frameLocator('#bibi-frame')).toBeVisible();
        // EPUBコンテンツが表示されることを確認
        // ... 
    });

    test("EPUB読み込みエラー", async ({ page }) => {
        // ファイルダウンロードエラーをモック
        await mockDropboxFileDownload({ 
            page, 
            filePath: "/nonexistent.epub", 
            content: "", 
            contentType: "" 
        });

        await page.goto("/viewer?file=nonexistent.epub&viewer=epub:bibi");
        
        // エラーメッセージが表示されることを確認
        await expect(page.locator("text=Failed to load EPUB")).toBeVisible();
    });
});
```

## 移行計画

### Phase 1: Fakeユーティリティの作成
1. `app/_fake/` ディレクトリの作成
2. 型定義ファイルの作成
3. Dropbox関数の実装
4. Notion関数の実装
5. テスト共通関数の実装

### Phase 2: テストファイルの移行
1. 既存テストファイルの分析
2. ページごとのテストファイル作成
3. MSWからPlaywright Route APIへの変換
4. テストケースの動作確認

### Phase 3: 既存MSWはテストからのみ削除
1. テストのMSW関連ファイルの削除
2. playwright.configからglobal-setupの削除

アプリケーション側でmswを使ってるので依存は残す

### Phase 4: テストの最適化
1. 重複テストの統合
2. テストカバレッジの確認
3. パフォーマンスの最適化

## 利点

1. **テストの独立性**: 各テストが独自のモックを持ち、他のテストに影響されない
2. **ファイル配置の明確性**: ページファイルと同じ場所にテストがあり、見つけやすい
3. **型安全性**: TypeScriptによる型チェックでモックの品質向上
4. **保守性**: サービス別に関数が分かれ、メンテナンスしやすい
5. **柔軟性**: テストごとに異なるシナリオを簡単に作成可能

## 懸念事項と対策

### 懸念事項
1. **テストファイルの増加**: ページごとにテストファイルが作成される
2. **重複コード**: 似たようなモック設定が複数のテストで発生する可能性
3. **移行コスト**: 既存のMSWベースのテストから移行する労力

### 対策
1. **共通ユーティリティ**: 共通関数で共通の設定を提供
2. **関数の活用**: 再利用可能なモック機能を関数として提供
3. **段階的移行**: フェーズ分けして少しずつ移行する
