import useSWR from "swr";
import { useMemo } from "react";
import { Client } from "@notionhq/client";
import { decodeBookMarker, prop, supportedViewerType, useNotionSetting } from "./useNotion";
import { DatabaseObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const USER_DEFINED_NOTION_BASE_URL =
    typeof localStorage !== "undefined" && localStorage.getItem("mubook-hon-NOTION_API_BASE_URL");
const NOTION_API_BASE_URL = USER_DEFINED_NOTION_BASE_URL
    ? USER_DEFINED_NOTION_BASE_URL
    : process.env.NODE_ENV === "production"
      ? "https://mubook-hon.vercel.app/api/notion-proxy"
      : "http://localhost:3000/api/notion-proxy";

export const useNotionList = () => {
    const { notionSetting, hasCompleteNotionSettings: hasCompletedNotionSettings } = useNotionSetting();
    const apiKey = notionSetting?.apiKey;
    const notionClient = useMemo(() => {
        if (!apiKey) {
            return;
        }
        return new Client({
            auth: apiKey,
            baseUrl: NOTION_API_BASE_URL,
            // SDK v5 requires explicitly bound fetch to avoid "Illegal invocation" error
            fetch: fetch.bind(globalThis)
        });
    }, [apiKey]);
    const { data: recentBooks, isLoading } = useSWR(
        () =>
            notionClient
                ? {
                      cacheKey: "/notion/recent-books"
                  }
                : null,
        async () => {
            if (!notionClient || !notionSetting?.bookListDatabaseId) {
                throw new Error("notion client is not initialized");
            }
            // Notion API 2025-09-03: databases and data_sources are separate concepts
            // A database contains one or more data_sources, and we need data_source_id to query
            // See: https://developers.notion.com/docs/upgrade-guide-2025-09-03
            const database = (await notionClient.databases.retrieve({
                database_id: notionSetting.bookListDatabaseId
            })) as DatabaseObjectResponse;
            const dataSourceId = database.data_sources[0]?.id;
            if (!dataSourceId) {
                throw new Error("No data source found for database");
            }
            const response = await notionClient.dataSources.query({
                data_source_id: dataSourceId,
                sorts: [
                    {
                        property: "Created",
                        direction: "descending"
                    }
                ],
                page_size: 5
            });
            const results = response.results as PageObjectResponse[];
            console.debug("⭐ Fetch recent books 📚", results);
            const bookItems = results.map((result) => {
                const viewerType = prop(result.properties.Viewer, "select").select?.name;
                if (!supportedViewerType(viewerType)) {
                    throw new Error("not supported viewer type:" + viewerType);
                }
                return {
                    viewer: viewerType,
                    pageId: result.id,
                    pageUrl: result.url,
                    fileId: prop(result.properties.FileId, "rich_text").rich_text[0].plain_text,
                    fileName: prop(result.properties.FileName, "title").title[0].plain_text,
                    title: prop(result.properties.Title, "rich_text").rich_text[0].plain_text,
                    authors: prop(result.properties.Author, "multi_select").multi_select.map((select) => select.name),
                    publisher: prop(result.properties.Publisher, "select").select?.name,
                    lastMarker: decodeBookMarker(
                        prop(result.properties.LastMarker, "rich_text").rich_text[0].plain_text
                    ),
                    currentPage: prop(result.properties.CurrentPage, "number").number ?? 0,
                    totalPage: prop(result.properties.TotalPage, "number").number ?? 0
                };
            });
            return bookItems;
        }
    );
    return {
        recentBooks,
        isLoadingRecentBooks: isLoading
    };
};
