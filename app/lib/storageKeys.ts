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
