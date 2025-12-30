import { useMemo, useRef, useCallback } from "react";
import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { useNotionSetting, hasDataBook, prop } from "./useNotion";
import { useUserSettings } from "../settings/useUserSettings";

const USER_DEFINED_NOTION_BASE_URL =
    typeof localStorage !== "undefined" && localStorage.getItem("mubook-hon-NOTION_API_BASE_URL");
const NOTION_API_BASE_URL = USER_DEFINED_NOTION_BASE_URL
    ? USER_DEFINED_NOTION_BASE_URL
    : process.env.NODE_ENV === "production"
      ? "https://mubook-hon.vercel.app/api/notion-proxy"
      : "http://localhost:3000/api/notion-proxy";

// ファイルサイズ制限 (無料プランは5MB)
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Notion File Upload APIがサポートしていない形式の変換マップ
// Note: EPUBなどはapplication/msword + .doc拡張子で送信（ブラウザがダウンロードする形式）
const UNSUPPORTED_EXTENSIONS: Record<string, { contentType: string; addExtension: string }> = {
    ".epub": { contentType: "application/msword", addExtension: ".doc" },
    ".mobi": { contentType: "application/msword", addExtension: ".doc" },
    ".azw": { contentType: "application/msword", addExtension: ".doc" },
    ".azw3": { contentType: "application/msword", addExtension: ".doc" }
};

/**
 * ファイル情報を変換（Notion APIでサポートされていない形式用）
 */
function convertFileInfo(
    fileName: string,
    originalContentType: string
): { uploadFileName: string; contentType: string } {
    const ext = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
    const mapping = UNSUPPORTED_EXTENSIONS[ext];
    if (mapping) {
        return {
            uploadFileName: fileName + mapping.addExtension,
            contentType: mapping.contentType
        };
    }
    return { uploadFileName: fileName, contentType: originalContentType };
}

type FileUploadResponse = {
    object: "file_upload";
    id: string;
    upload_url: string;
    status: "pending" | "uploaded";
    expiry_time: string;
};

type SendFileResponse = {
    status: "uploaded";
    filename: string;
    content_type: string;
    content_length: string;
};

type FilePropertyValue = {
    type: "files";
    files: Array<{
        type: "file_upload" | "external";
        file_upload?: { id: string };
        external?: { url: string };
        name?: string;
    }>;
};

/**
 * Notionにファイルをアップロードするためのフック
 */
export const useNotionFileUpload = ({ pageId, fileName }: { pageId?: string; fileName?: string }) => {
    const { notionSetting, hasCompleteNotionSettings } = useNotionSetting();
    const { userSettings } = useUserSettings();
    const apiKey = notionSetting?.apiKey;
    const uploadedRef = useRef(false);

    const notionClient = useMemo(() => {
        if (!pageId || !fileName) {
            return;
        }
        if (!apiKey) {
            return;
        }
        return new Client({
            auth: apiKey,
            baseUrl: NOTION_API_BASE_URL,
            fetch: fetch.bind(globalThis)
        });
    }, [pageId, fileName, apiKey]);

    /**
     * ファイルがアップロード対象かチェック
     * - 設定でONになっている
     * - Fileプロパティが空
     * - ファイルサイズが制限内
     */
    const checkShouldUpload = useCallback(
        async (fileBlob: Blob): Promise<{ shouldUpload: boolean; reason?: string }> => {
            if (!userSettings?.uploadBookToNotion) {
                return { shouldUpload: false, reason: "Upload setting is disabled" };
            }

            if (!hasCompleteNotionSettings || !notionClient || !pageId) {
                return { shouldUpload: false, reason: "Notion settings not complete" };
            }

            if (fileBlob.size > MAX_FILE_SIZE_BYTES) {
                return {
                    shouldUpload: false,
                    reason: `File size ${(fileBlob.size / 1024 / 1024).toFixed(2)}MB exceeds ${MAX_FILE_SIZE_MB}MB limit`
                };
            }

            // 既存のFileプロパティを確認
            try {
                const page = (await notionClient.pages.retrieve({ page_id: pageId })) as PageObjectResponse;
                const fileProperty = page.properties.File as FilePropertyValue | undefined;

                if (fileProperty && fileProperty.files && fileProperty.files.length > 0) {
                    return { shouldUpload: false, reason: "File already exists in Notion" };
                }
            } catch (error) {
                console.warn("Failed to check existing file property", error);
                return { shouldUpload: false, reason: "Failed to check existing file" };
            }

            return { shouldUpload: true };
        },
        [hasCompleteNotionSettings, notionClient, pageId, userSettings?.uploadBookToNotion]
    );

    /**
     * ファイルをNotionにアップロードしてページのFileプロパティに設定
     */
    const uploadFile = useCallback(
        async (fileBlob: Blob): Promise<{ success: boolean; error?: string }> => {
            if (!notionClient || !pageId || !fileName || !apiKey) {
                return { success: false, error: "Not initialized" };
            }

            // 二重アップロード防止
            if (uploadedRef.current) {
                return { success: false, error: "Already uploaded" };
            }

            const { shouldUpload, reason } = await checkShouldUpload(fileBlob);
            if (!shouldUpload) {
                console.debug("Skip upload:", reason);
                return { success: false, error: reason };
            }

            try {
                uploadedRef.current = true;

                // Notion APIでサポートされていない形式は変換
                const originalContentType = fileBlob.type || "application/octet-stream";
                const { uploadFileName, contentType } = convertFileInfo(fileName, originalContentType);

                // 1. File Upload オブジェクトを作成
                const createResponse = await notionClient.request<FileUploadResponse>({
                    path: "file_uploads",
                    method: "post",
                    body: {
                        filename: uploadFileName,
                        content_type: contentType
                    }
                });

                console.debug("Created file upload:", createResponse);

                // 2. ファイルを送信
                // Blobのcontent_typeをcreate時と合わせる必要がある
                const uploadBlob = new Blob([fileBlob], { type: contentType });
                const formData = new FormData();
                formData.append("file", uploadBlob, uploadFileName);

                const sendResponse = await fetch(`${NOTION_API_BASE_URL}/v1/file_uploads/${createResponse.id}/send`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Notion-Version": "2022-06-28"
                    },
                    body: formData
                });

                if (!sendResponse.ok) {
                    const errorText = await sendResponse.text();
                    throw new Error(`Failed to send file: ${sendResponse.status} ${errorText}`);
                }

                const sendResult: SendFileResponse = await sendResponse.json();
                console.debug("Sent file:", sendResult);

                // 3. ページのFileプロパティを更新
                await notionClient.pages.update({
                    page_id: pageId,
                    properties: {
                        File: {
                            // @ts-ignore - Notion SDK types might not include file_upload yet
                            files: [
                                {
                                    type: "file_upload",
                                    file_upload: { id: createResponse.id },
                                    name: fileName
                                }
                            ]
                        }
                    }
                });

                console.debug("File uploaded and attached to page:", pageId);
                return { success: true };
            } catch (error) {
                console.error("Failed to upload file to Notion:", error);
                uploadedRef.current = false; // 失敗時はリトライを許可
                return {
                    success: false,
                    error: error instanceof Error ? error.message : "Unknown error"
                };
            }
        },
        [apiKey, checkShouldUpload, fileName, notionClient, pageId]
    );

    return {
        uploadFile,
        checkShouldUpload,
        isUploadEnabled: userSettings?.uploadBookToNotion ?? false
    } as const;
};
