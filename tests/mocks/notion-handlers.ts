import { http, HttpResponse } from "msw";

export const notionHandlers = [
    // Notion Database query
    http.post("https://api.notion.com/v1/databases/:databaseId/query", () => {
        return HttpResponse.json({
            object: "list",
            results: [
                {
                    id: "sample-notion-page-id",
                    object: "page",
                    created_time: "2023-01-01T00:00:00.000Z",
                    last_edited_time: "2023-01-01T00:00:00.000Z",
                    properties: {
                        "Book Name": {
                            title: [
                                {
                                    text: {
                                        content: "Sample Book"
                                    }
                                }
                            ]
                        },
                        "File ID": {
                            rich_text: [
                                {
                                    text: {
                                        content: "id:sample-epub-file-id"
                                    }
                                }
                            ]
                        },
                        Viewer: {
                            select: {
                                name: "epub:bibi"
                            }
                        }
                    }
                }
            ],
            next_cursor: null,
            has_more: false
        });
    }),

    // Notion page creation
    http.post("https://api.notion.com/v1/pages", () => {
        return HttpResponse.json({
            id: "new-page-id",
            object: "page",
            created_time: new Date().toISOString(),
            last_edited_time: new Date().toISOString(),
            properties: {}
        });
    }),

    // Notion user info
    http.get("https://api.notion.com/v1/users/me", () => {
        return HttpResponse.json({
            object: "user",
            id: "mock-user-id",
            name: "Test User",
            avatar_url: null,
            type: "person",
            person: {
                email: "test@example.com"
            }
        });
    })
];
