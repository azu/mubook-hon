import { http, HttpResponse } from "msw";

export const dropboxHandlers = [
    // ファイル一覧取得のモック
    http.post("https://api.dropboxapi.com/2/files/list_folder", () => {
        return HttpResponse.json({
            entries: [
                {
                    ".tag": "file",
                    name: "sample.epub",
                    path_lower: "/sample.epub",
                    path_display: "/sample.epub",
                    id: "id:sample-epub-file-id",
                    client_modified: "2023-01-01T00:00:00Z",
                    server_modified: "2023-01-01T00:00:00Z",
                    rev: "sample-rev",
                    size: 1234567,
                    is_downloadable: true,
                    content_hash: "sample-hash"
                },
                {
                    ".tag": "file",
                    name: "sample.pdf",
                    path_lower: "/sample.pdf",
                    path_display: "/sample.pdf",
                    id: "id:sample-pdf-file-id",
                    client_modified: "2023-01-01T00:00:00Z",
                    server_modified: "2023-01-01T00:00:00Z",
                    rev: "sample-rev",
                    size: 2345678,
                    is_downloadable: true,
                    content_hash: "sample-hash"
                }
            ],
            cursor: "sample-cursor",
            has_more: false
        });
    }),

    // ファイルダウンロードのモック
    http.post("https://content.dropboxapi.com/2/files/download", async ({ request }) => {
        const dropboxApiArg = request.headers.get("Dropbox-API-Arg");
        const pathInfo = JSON.parse(dropboxApiArg || "{}");

        // テスト用のEPUBファイルを返す
        if (pathInfo.path?.includes("sample.epub")) {
            // 簡単なテスト用EPUBファイルの内容
            const epubContent = "PK\x03\x04sample epub content"; // 最低限のZIP/EPUBヘッダー
            const epubBuffer = new TextEncoder().encode(epubContent);

            return new HttpResponse(epubBuffer, {
                status: 200,
                headers: {
                    "Content-Type": "application/epub+zip",
                    "Dropbox-API-Result": JSON.stringify({
                        name: "sample.epub",
                        path_lower: "/sample.epub",
                        path_display: "/sample.epub",
                        id: "id:sample-epub-file-id",
                        client_modified: "2023-01-01T00:00:00Z",
                        server_modified: "2023-01-01T00:00:00Z",
                        rev: "sample-rev",
                        size: epubBuffer.byteLength,
                        is_downloadable: true,
                        content_hash: "sample-hash"
                    })
                }
            });
        }

        // テスト用のPDFファイルを返す
        if (pathInfo.path?.includes("sample.pdf")) {
            // 簡単なテスト用PDFファイルの内容
            const pdfContent = "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n%%EOF";
            const pdfBuffer = new TextEncoder().encode(pdfContent);

            return new HttpResponse(pdfBuffer, {
                status: 200,
                headers: {
                    "Content-Type": "application/pdf",
                    "Dropbox-API-Result": JSON.stringify({
                        name: "sample.pdf",
                        path_lower: "/sample.pdf",
                        path_display: "/sample.pdf",
                        id: "id:sample-pdf-file-id",
                        client_modified: "2023-01-01T00:00:00Z",
                        server_modified: "2023-01-01T00:00:00Z",
                        rev: "sample-rev",
                        size: pdfBuffer.byteLength,
                        is_downloadable: true,
                        content_hash: "sample-hash"
                    })
                }
            });
        }

        return new HttpResponse("File not found", { status: 404 });
    }),

    // OAuth認証のモック
    http.post("https://api.dropbox.com/oauth2/token", () => {
        return HttpResponse.json({
            access_token: "mock-access-token",
            token_type: "bearer",
            expires_in: 14400,
            refresh_token: "mock-refresh-token",
            scope: "files.content.read files.metadata.read",
            uid: "12345",
            account_id: "dbid:mock-account-id"
        });
    }),

    // トークンリフレッシュのモック
    http.post("https://api.dropbox.com/oauth2/token", ({ request }) => {
        return HttpResponse.json({
            access_token: "mock-refreshed-access-token",
            token_type: "bearer",
            expires_in: 14400,
            refresh_token: "mock-refreshed-refresh-token",
            scope: "files.content.read files.metadata.read"
        });
    })
];
