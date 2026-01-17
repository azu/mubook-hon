/**
 * アプリケーションで使用するストレージキーとスキーマの一元管理
 * すべてのキーは "mubook-hon-" プレフィックスを使用
 */

// ========================================
// 型定義
// ========================================

/** Dropboxアクセストークン */
export type DropboxTokens = {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
};

/** Notion API設定 */
export type NotionSetting = {
    apiKey: string;
    bookListDatabaseId: string;
    bookMemoDatabaseId: string;
};

/** タップアクションの種類 */
export type TapAction = "next" | "prev" | "menu" | "close" | "none";

/** 3x3 グリッドのタップゾーン設定 */
export type TapZoneGrid = [
    [TapAction, TapAction, TapAction],
    [TapAction, TapAction, TapAction],
    [TapAction, TapAction, TapAction]
];

/** タップゾーン設定 */
export type TapZoneConfig = {
    zones: TapZoneGrid;
};

/** ユーザー設定 */
export type UserSettings = {
    openNewTab: boolean;
    uploadBookToNotion: boolean;
    tapZones?: TapZoneConfig;
};

/** 最後に読んだ書籍情報（PWA自動遷移用） */
export type LastReadInfo = {
    fileId: string;
    fileName: string;
    title: string;
    viewer: string;
    timestamp: number;
};

// ========================================
// localStorage スキーマ
// ========================================

/** localStorageキーと型のマッピング */
export type StorageSchema = {
    /** Dropboxアクセストークン */
    "mubook-hon-dropbox-tokens": DropboxTokens;
    /** Notion API設定 */
    "mubook-hon-notion": Partial<NotionSetting>;
    /** Notion API ベースURL（オプション） */
    "mubook-hon-NOTION_API_BASE_URL": string;
    /** ユーザー設定（タップゾーンなど） */
    "mubook-hon-user-settings": UserSettings;
    /** 最後に読んだ書籍情報（PWA自動遷移用） */
    "mubook-hon-last-read": LastReadInfo;
};

// ========================================
// sessionStorage スキーマ
// ========================================

/** sessionStorageキーと型のマッピング */
export type SessionSchema = {
    /** PWAセッションアクティブフラグ（新規起動判定用） */
    "mubook-hon-pwa-session-active": "true";
};

// ========================================
// 型安全なストレージラッパー
// ========================================

const isBrowser = typeof window !== "undefined";

/** localStorageの全キー */
const STORAGE_KEYS: (keyof StorageSchema)[] = [
    "mubook-hon-dropbox-tokens",
    "mubook-hon-notion",
    "mubook-hon-NOTION_API_BASE_URL",
    "mubook-hon-user-settings",
    "mubook-hon-last-read"
];

/** sessionStorageの全キー */
const SESSION_KEYS: (keyof SessionSchema)[] = ["mubook-hon-pwa-session-active"];

/**
 * 型安全なlocalStorageラッパー
 */
export const typedStorage = {
    get<K extends keyof StorageSchema>(key: K): StorageSchema[K] | null {
        if (!isBrowser) return null;
        const data = localStorage.getItem(key);
        if (!data) return null;
        try {
            return JSON.parse(data) as StorageSchema[K];
        } catch {
            return null;
        }
    },
    set<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]): void {
        if (!isBrowser) return;
        localStorage.setItem(key, JSON.stringify(value));
    },
    delete<K extends keyof StorageSchema>(key: K): void {
        if (!isBrowser) return;
        localStorage.removeItem(key);
    },
    clear(): void {
        if (!isBrowser) return;
        STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    }
};

/**
 * 型安全なsessionStorageラッパー
 */
export const typedSessionStorage = {
    get<K extends keyof SessionSchema>(key: K): SessionSchema[K] | null {
        if (!isBrowser) return null;
        return sessionStorage.getItem(key) as SessionSchema[K] | null;
    },
    set<K extends keyof SessionSchema>(key: K, value: SessionSchema[K]): void {
        if (!isBrowser) return;
        sessionStorage.setItem(key, value);
    },
    delete<K extends keyof SessionSchema>(key: K): void {
        if (!isBrowser) return;
        sessionStorage.removeItem(key);
    },
    clear(): void {
        if (!isBrowser) return;
        SESSION_KEYS.forEach((key) => sessionStorage.removeItem(key));
    }
};
