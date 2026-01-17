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
// localStorage キーとスキーマのマッピング
// ========================================

export const STORAGE_KEYS = {
    /** Dropboxアクセストークン */
    DROPBOX_TOKENS: "mubook-hon-dropbox-tokens",
    /** Notion API設定 */
    NOTION: "mubook-hon-notion",
    /** Notion API ベースURL（オプション） */
    NOTION_API_BASE_URL: "mubook-hon-NOTION_API_BASE_URL",
    /** ユーザー設定（タップゾーンなど） */
    USER_SETTINGS: "mubook-hon-user-settings",
    /** 最後に読んだ書籍情報（PWA自動遷移用） */
    LAST_READ: "mubook-hon-last-read"
} as const;

/** localStorageキーと型のマッピング */
export type StorageSchema = {
    [STORAGE_KEYS.DROPBOX_TOKENS]: DropboxTokens;
    [STORAGE_KEYS.NOTION]: Partial<NotionSetting>;
    [STORAGE_KEYS.NOTION_API_BASE_URL]: string;
    [STORAGE_KEYS.USER_SETTINGS]: UserSettings;
    [STORAGE_KEYS.LAST_READ]: LastReadInfo;
};

// ========================================
// sessionStorage キーとスキーマのマッピング
// ========================================

export const SESSION_KEYS = {
    /** PWAセッションアクティブフラグ（新規起動判定用） */
    PWA_SESSION_ACTIVE: "mubook-hon-pwa-session-active"
} as const;

/** sessionStorageキーと型のマッピング */
export type SessionSchema = {
    [SESSION_KEYS.PWA_SESSION_ACTIVE]: "true";
};

// ========================================
// 型安全なストレージラッパー
// ========================================

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
type SessionKey = (typeof SESSION_KEYS)[keyof typeof SESSION_KEYS];

/**
 * 型安全なlocalStorageラッパー
 */
export const typedStorage = {
    get<K extends StorageKey>(key: K): StorageSchema[K] | null {
        if (typeof window === "undefined") return null;
        const data = localStorage.getItem(key);
        if (!data) return null;
        try {
            return JSON.parse(data) as StorageSchema[K];
        } catch {
            return null;
        }
    },
    set<K extends StorageKey>(key: K, value: StorageSchema[K]): void {
        if (typeof window === "undefined") return;
        localStorage.setItem(key, JSON.stringify(value));
    },
    delete<K extends StorageKey>(key: K): void {
        if (typeof window === "undefined") return;
        localStorage.removeItem(key);
    },
    clear(): void {
        if (typeof window === "undefined") return;
        // アプリ用のキーのみ削除
        Object.values(STORAGE_KEYS).forEach((key) => {
            localStorage.removeItem(key);
        });
    }
};

/**
 * 型安全なsessionStorageラッパー
 */
export const typedSessionStorage = {
    get<K extends SessionKey>(key: K): SessionSchema[K] | null {
        if (typeof window === "undefined") return null;
        return sessionStorage.getItem(key) as SessionSchema[K] | null;
    },
    set<K extends SessionKey>(key: K, value: SessionSchema[K]): void {
        if (typeof window === "undefined") return;
        sessionStorage.setItem(key, value);
    },
    delete<K extends SessionKey>(key: K): void {
        if (typeof window === "undefined") return;
        sessionStorage.removeItem(key);
    },
    clear(): void {
        if (typeof window === "undefined") return;
        // アプリ用のキーのみ削除
        Object.values(SESSION_KEYS).forEach((key) => {
            sessionStorage.removeItem(key);
        });
    }
};
