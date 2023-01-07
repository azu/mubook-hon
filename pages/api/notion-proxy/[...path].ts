import { NextApiRequest, NextApiResponse } from "next";

export default async function Handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        console.log(request.method, request.url)
        const url = new URL(request.url!, "https://example.test");
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Authorization, Content-Type, Notion-Version"
                }
            });
        }

        const notionApiPath = url.pathname.replace("/api/notion-proxy/", "");
        const notionURL = new URL(notionApiPath, "https://api.notion.com")
        const notionResponse = await fetch(notionURL, {
            method: request.method,
            // @ts-ignore
            headers: {
                authorization: request.headers.authorization,
                'content-type': request.headers["content-type"],
                'notion-version': request.headers["notion-version"],
            },
            body: request.body ? JSON.stringify(request.body): undefined
        });
        return response.status(notionResponse.status).json(await notionResponse.json());
    } catch (e: any) {
        console.error(e);
        return response.status(500).json({ error: e.message })
    }
}
