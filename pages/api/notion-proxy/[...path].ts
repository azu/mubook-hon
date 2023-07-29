import type { NextApiRequest, NextApiResponse } from "next";

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
        const notionResponse = await fetch(notionURL, {
            method: request.method,
            // @ts-expect-error
            headers: {
                authorization: request.headers.authorization,
                "content-type": request.headers["content-type"],
                "notion-version": request.headers["notion-version"]
            },
            body: request.body ? JSON.stringify(request.body) : undefined
        });
        return response.status(notionResponse.status).json(await notionResponse.json());
    } catch (e: any) {
        console.error(e);
        return response.status(500).json({ error: e.message });
    }
}
