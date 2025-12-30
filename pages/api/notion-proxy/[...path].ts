import type { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";

// bodyParserを無効化してrawボディを取得できるようにする
export const config = {
    api: {
        bodyParser: false
    }
};

/**
 * リクエストボディをBufferとして読み取る
 */
async function getRawBody(req: NextApiRequest): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of req as unknown as Readable) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export default async function Handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        const url = new URL(request.url!, "https://example.test");
        // proxy/http://example.com should throw an error
        if (url.pathname.startsWith("http")) {
            return response.status(400).json({ error: "Invalid URL" });
        }
        const notionApiPath = url.pathname.replace("/api/notion-proxy/", "");
        const notionURL = new URL(notionApiPath, "https://api.notion.com");
        if (notionURL.origin !== "https://api.notion.com") {
            return response.status(400).json({ error: "Invalid Origin" });
        }

        const contentType = request.headers["content-type"] || "";

        // ヘッダーの準備
        const headers: Record<string, string> = {
            authorization: request.headers.authorization as string,
            "notion-version": (request.headers["notion-version"] as string) || "2022-06-28"
        };

        let body: BodyInit | undefined;

        // ボディがあるメソッドの場合
        if (request.method === "POST" || request.method === "PATCH" || request.method === "PUT") {
            const rawBody = await getRawBody(request);

            if (rawBody.length > 0) {
                headers["content-type"] = contentType;
                // BufferをUint8Arrayに変換してfetchに渡す
                body = new Uint8Array(rawBody);
            }
        }

        const notionResponse = await fetch(notionURL, {
            method: request.method,
            headers,
            body
        });

        const responseData = await notionResponse.json();
        return response.status(notionResponse.status).json(responseData);
    } catch (e: any) {
        console.error(e);
        return response.status(500).json({ error: e.message });
    }
}
