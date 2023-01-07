import { useLocalStorage } from "react-use";
import { useCallback, useEffect, useMemo } from "react";
import { Client } from "@notionhq/client"
import useSWR, { mutate } from "swr";
import useSWRMutation from 'swr/mutation'
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type NotionSetting = { apiKey: string; bookListDatabaseId: string; bookMemoDatabaseId: string };
export const useNotionSetting = () => {
    const [notionSetting, setNotionSettings] = useLocalStorage<Partial<NotionSetting>>("mubook-hon-notion");
    const updateNotionSettings = useCallback((notionSetting: Partial<NotionSetting>) => {
        setNotionSettings(prev => {
            return { ...prev, ...notionSetting };
        });
    }, [setNotionSettings]);
    return {
        notionSetting,
        updateNotionSettings
    } as const
}

export type BookItem = {
    pageId: string;
    fileName: string;
    title: string;
    currentPage: number;
    totalPage: number;
    publisher?: string;
    authors: string[];
}
type PropertyTypes = ExtractRecordValue<PageObjectResponse['properties']>
type ExtractRecordValue<R> = R extends Record<infer _, infer V>
    ? V
    : never
const prop = <F extends PropertyTypes, T extends F["type"]>(o: F, type: T) => {
    if (o.type !== type) {
        throw new Error("invalid type:" + JSON.stringify(o));
    }
    return o as T extends F["type"] ? Extract<F, { type: T }> : never;
};
export const useNotion = ({ bookName }: { bookName: string }) => {
    const { notionSetting } = useNotionSetting();
    const notionClient = useMemo(() => {
        if (!notionSetting?.apiKey) {
            return;
        }
        return new Client({
            auth: notionSetting.apiKey,
            baseUrl: "http://localhost:3000/api/notion-proxy"
        });
    }, [notionSetting?.apiKey]);
    const {
        data: currentBook,
        mutate: mutateCurrentBook
    } = useSWR(() => notionClient ? bookName : null, async () => {
        if (!notionClient || !notionSetting?.bookListDatabaseId) {
            throw new Error("notion client is not initialized");
        }
        const { results } = await notionClient.databases.query({
            database_id: notionSetting.bookListDatabaseId,
            filter: {
                property: "FileName",
                title: {
                    equals: bookName
                }
            }
        });
        const result = results[0] as PageObjectResponse;
        if (!result) {
            return;
        }

        return {
            pageId: result.id,
            fileName: prop(result.properties.FileName, "title").title[0].plain_text,
            title: prop(result.properties.Title, "rich_text").rich_text[0].plain_text,
            authors: prop(result.properties.Author, "multi_select").multi_select.map(select => select.name),
            publisher: prop(result.properties.Publisher, "select").select?.name,
            currentPage: prop(result.properties.CurrentPage, "number").number,
            totalPage: prop(result.properties.TotalPage, "number").number,
        }
    });
    const { trigger: updateBookStatus } = useSWRMutation(() => notionClient ? [bookName, currentBook] : null, async ([bookName, currentBook], { arg }: { arg: BookItem }) => {
        const bookItem = arg;
        if (!notionClient || !notionSetting?.bookListDatabaseId) {
            throw new Error("notion client is not initialized");
        }
        console.log("currentBook", currentBook)
        const properties = {
            "FileName": {
                "title": [
                    {
                        "text": {
                            "content": bookName
                        }
                    }
                ]
            },
            "Title": {
                "rich_text": [
                    {
                        "text": {
                            "content": bookItem.title
                        }
                    }
                ]
            },
            Author: {
                "multi_select": bookItem.authors?.map(author => {
                    return {
                        name: author
                    }
                }) ?? [],
            },
            Publisher: {
                "select": {
                    "name": bookItem.publisher
                }
            },
            CurrentPage: {
                "number": bookItem.currentPage
            },
            TotalPage: {
                "number": bookItem.totalPage
            },
        };

        if (!currentBook) {
            // create new book
            const result = await notionClient.pages.create({
                parent: {
                    database_id: notionSetting.bookListDatabaseId
                },
                // @ts-ignore
                properties: properties
            }) as PageObjectResponse;
            console.log("create new book", result);
            await mutateCurrentBook({
                pageId: result.id,
                fileName: prop(result.properties.FileName, "title").title[0].plain_text,
                title: prop(result.properties.Title, "rich_text").rich_text[0].plain_text,
                authors: prop(result.properties.Author, "multi_select").multi_select.map(select => select.name),
                publisher: prop(result.properties.Publisher, "select").select?.name,
                currentPage: prop(result.properties.CurrentPage, "number").number ?? 0,
                totalPage: prop(result.properties.TotalPage, "number").number ?? 0,
            });
        } else {
            // update item
            const result = await notionClient.pages.update({
                parent: {
                    database_id: notionSetting.bookListDatabaseId
                },
                page_id: currentBook.pageId,
                // @ts-ignore
                properties: properties
            }) as PageObjectResponse;
            console.log("update new book", result);
            await mutateCurrentBook({
                pageId: result.id,
                fileName: prop(result.properties.FileName, "title").title[0].plain_text,
                title: prop(result.properties.Title, "rich_text").rich_text[0].plain_text,
                authors: prop(result.properties.Author, "multi_select").multi_select.map(select => select.name),
                publisher: prop(result.properties.Publisher, "select").select?.name,
                currentPage: prop(result.properties.CurrentPage, "number").number ?? 0,
                totalPage: prop(result.properties.TotalPage, "number").number ?? 0,
            });
        }
        return;
    });
    const { trigger: addMemo } = useSWRMutation(() => notionClient ? [bookName, currentBook] : null, async ([bookName, currentBook], { arg }: { arg: { memo: string; currentPage: number; } }) => {
        const memo = arg.memo;
        const currentPage = arg.currentPage;
        if (!notionClient || !notionSetting?.bookMemoDatabaseId) {
            throw new Error("notion client is not initialized or book memo database id is not set");
        }
        if (!currentBook) {
            return;
        }
        const properties = {
            "Quote": {
                "title": [
                    {
                        "text": {
                            "content": memo
                        }
                    }
                ]
            },
            "Page": {
                number: currentPage
            },
            "Book List": {
                relation: [{
                    id: currentBook.pageId
                }]
            }
        };
        // create new book
        const result = await notionClient.pages.create({
            parent: {
                database_id: notionSetting.bookMemoDatabaseId
            },
            // @ts-ignore
            properties: properties
        }) as PageObjectResponse;
        console.log("create new memo", result);
    });
    return {
        currentBook,
        updateBookStatus,
        addMemo
    } as const
}
