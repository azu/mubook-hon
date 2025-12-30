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

export type DropboxOAuthTokenResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    uid?: string;
    account_id?: string;
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
    // Notion API 2025-09-03 fields
    type?: "page_or_database";
    page_or_database?: Record<string, never>;
};

export type NotionUser = {
    object: "user";
    id: string;
    name: string;
    avatar_url: string | null;
    type: "person";
    person: {
        email: string;
    };
};
