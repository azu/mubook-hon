/**
 * mubook-hon Cloudflare Worker
 * - /v1/* : Notion API Proxy（Vercelの4.5MBペイロード制限を回避）
 * - それ以外 : Next.js Static Exportの静的アセット
 */

type Env = {
    ASSETS: Fetcher;
};

// 許可するオリジン（本番環境とローカル開発）
const ALLOWED_ORIGINS = [
    "https://mubook-hon.jser.workers.dev",
    "http://localhost:3000",
    "http://localhost:8787",
    "http://127.0.0.1:3000"
];

/**
 * CORSヘッダーを生成
 */
function getCorsHeaders(origin: string | null): Record<string, string> {
    const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    return {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Notion-Version",
        "Access-Control-Max-Age": "86400"
    };
}

/**
 * プリフライトリクエストを処理
 */
function handleOptions(request: Request): Response {
    const origin = request.headers.get("Origin");
    return new Response(null, {
        status: 204,
        headers: getCorsHeaders(origin)
    });
}

/**
 * Notion APIへのプロキシ
 */
async function handleNotionProxy(request: Request): Promise<Response> {
    const origin = request.headers.get("Origin");
    const corsHeaders = getCorsHeaders(origin);

    try {
        const url = new URL(request.url);
        // /notion/v1/... -> /v1/... に変換
        const notionApiPath = url.pathname.replace(/^\/notion/, "");

        const notionURL = new URL(notionApiPath + url.search, "https://api.notion.com");

        // オリジンチェック
        if (notionURL.origin !== "https://api.notion.com") {
            return new Response(JSON.stringify({ error: "Invalid Origin" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        // 認証ヘッダーを取得
        const authorization = request.headers.get("Authorization");
        if (!authorization) {
            return new Response(JSON.stringify({ error: "Authorization header required" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        // Notion APIへのリクエストヘッダーを準備
        const headers: Record<string, string> = {
            Authorization: authorization,
            "Notion-Version": request.headers.get("Notion-Version") || "2022-06-28"
        };

        // Content-Typeがある場合は転送
        const contentType = request.headers.get("Content-Type");
        if (contentType) {
            headers["Content-Type"] = contentType;
        }

        // ボディを取得（GETメソッド以外）
        let body: BodyInit | null = null;
        if (request.method !== "GET" && request.method !== "HEAD") {
            body = await request.arrayBuffer();
        }

        // Notion APIにリクエスト
        const notionResponse = await fetch(notionURL, {
            method: request.method,
            headers,
            body
        });

        // レスポンスをそのまま返す
        const responseHeaders = new Headers(corsHeaders);
        responseHeaders.set("Content-Type", notionResponse.headers.get("Content-Type") || "application/json");

        return new Response(notionResponse.body, {
            status: notionResponse.status,
            headers: responseHeaders
        });
    } catch (e) {
        console.error("Proxy error:", e);
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        // /notion/v1/* へのリクエストはNotion APIにプロキシ
        if (url.pathname.startsWith("/notion/v1/")) {
            if (request.method === "OPTIONS") {
                return handleOptions(request);
            }
            return handleNotionProxy(request);
        }

        // それ以外は静的アセットを返す
        return env.ASSETS.fetch(request);
    }
};
