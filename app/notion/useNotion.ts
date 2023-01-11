import { useLocalStorage } from "react-use";
import { useCallback, useEffect, useMemo } from "react";
import { Client } from "@notionhq/client";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Fetcher } from "swr/_internal";

export type NotionSetting = { apiKey: string; bookListDatabaseId: string; bookMemoDatabaseId: string };
const NOTION_API_BASE_URL =
    process.env.NODE_ENV === "production"
        ? "https://mubook-hon.vercel.app/api/notion-proxy"
        : "http://localhost:3000/api/notion-proxy";
export const useNotionSetting = () => {
    const [notionSetting, setNotionSettings] = useLocalStorage<Partial<NotionSetting>>("mubook-hon-notion");
    const updateNotionSettings = useCallback(
        (notionSetting: Partial<NotionSetting>) => {
            setNotionSettings((prev) => {
                return { ...prev, ...notionSetting };
            });
        },
        [setNotionSettings]
    );
    return {
        notionSetting,
        updateNotionSettings
    } as const;
};

export type BibiPositionMaker = {
    ItemIndex: number; // iframe index
    ElementSelector: string; // css selector of Item(iframe)
    /**
     * Highlight Selectors
     */
    highlightSelectors?: {
        start?: string;
        end?: string;
    };
};
export type BookMarker = BibiPositionMaker;

export const encodeBookMarker = (marker?: BookMarker): string => {
    if (!marker) {
        return "";
    }
    return encodeURIComponent(JSON.stringify(marker));
};
export const decodeBookMarker = (markerString?: string): BookMarker | undefined => {
    if (!markerString) {
        return;
    }
    try {
        return JSON.parse(decodeURIComponent(markerString));
    } catch (error) {
        console.warn("Fail to parse marker string", markerString);
    }
};
export type BookItem = {
    pageId: string;
    fileId: string;
    fileName: string;
    title: string;
    currentPage: number;
    totalPage: number;
    publisher?: string;
    authors: string[];
    lastMarker?: BookMarker;
};
type PropertyTypes = ExtractRecordValue<PageObjectResponse["properties"]>;
type ExtractRecordValue<R> = R extends Record<infer _, infer V> ? V : never;
const prop = <F extends PropertyTypes, T extends F["type"]>(o: F, type: T) => {
    if (o.type !== type) {
        throw new Error("invalid type:" + JSON.stringify(o));
    }
    return o as T extends F["type"] ? Extract<F, { type: T }> : never;
};
export const NO_BOOK_DATA = Symbol("No Data YET");
export const hasDataBook = (bookItem: unknown): bookItem is BookItem => {
    return bookItem !== undefined && bookItem !== null && typeof bookItem === "object" && "fileId" in bookItem;
};
export const useNotion = ({ fileId, fileName }: { fileId: string; fileName: string }) => {
    const { notionSetting } = useNotionSetting();
    const notionClient = useMemo(() => {
        if (!notionSetting?.apiKey) {
            return;
        }
        return new Client({
            auth: notionSetting.apiKey,
            baseUrl: NOTION_API_BASE_URL
        });
    }, [notionSetting?.apiKey]);
    const { data: currentBook, mutate: mutateCurrentBook } = useSWR<BookItem | typeof NO_BOOK_DATA>(
        () =>
            notionClient
                ? {
                      cacheKey: "/notion/get-book",
                      fileId
                  }
                : null,
        (async () => {
            if (!notionClient || !notionSetting?.bookListDatabaseId) {
                throw new Error("notion client is not initialized");
            }
            const { results } = await notionClient.databases.query({
                database_id: notionSetting.bookListDatabaseId,
                filter: {
                    property: "FileId",
                    title: {
                        equals: fileId
                    }
                }
            });
            console.log("⭐ Fetch book 📚", results[0]);
            const result = results[0] as PageObjectResponse;
            if (!result) {
                return NO_BOOK_DATA;
            }
            const currentBook: BookItem = {
                pageId: result.id,
                fileId: prop(result.properties.FileId, "title").title[0].plain_text,
                fileName: prop(result.properties.FileName, "rich_text").rich_text[0].plain_text,
                title: prop(result.properties.Title, "rich_text").rich_text[0].plain_text,
                authors: prop(result.properties.Author, "multi_select").multi_select.map((select) => select.name),
                publisher: prop(result.properties.Publisher, "select").select?.name,
                lastMarker: decodeBookMarker(prop(result.properties.LastMarker, "rich_text").rich_text[0].plain_text),
                currentPage: prop(result.properties.CurrentPage, "number").number ?? 0,
                totalPage: prop(result.properties.TotalPage, "number").number ?? 0
            };
            return currentBook;
        }) as Fetcher<BookItem>
    );
    const { trigger: updateBookStatus } = useSWRMutation(
        () =>
            notionClient
                ? {
                      cacheKey: "/notion/update-book-status",
                      fileId,
                      fileName,
                      currentBook
                  }
                : null,
        async (param, { arg }: { arg: BookItem }) => {
            const { fileId, fileName, currentBook } = param;
            const bookItem = arg;
            if (!notionClient || !notionSetting?.bookListDatabaseId) {
                throw new Error("notion client is not initialized");
            }
            const properties = {
                FileId: {
                    title: [
                        {
                            text: {
                                content: fileId
                            }
                        }
                    ]
                },
                FileName: {
                    rich_text: [
                        {
                            text: {
                                content: fileName
                            }
                        }
                    ]
                },
                Title: {
                    rich_text: [
                        {
                            text: {
                                content: bookItem.title
                            }
                        }
                    ]
                },
                ...(bookItem.authors?.length > 0
                    ? {
                          Author: {
                              multi_select:
                                  bookItem.authors?.map((author) => {
                                      return {
                                          name: author
                                      };
                                  }) ?? []
                          }
                      }
                    : {}),
                ...(bookItem.publisher
                    ? {
                          Publisher: {
                              select: {
                                  name: bookItem.publisher
                              }
                          }
                      }
                    : {}),
                LastMarker: {
                    rich_text: [
                        {
                            text: {
                                content: encodeBookMarker(bookItem.lastMarker)
                            }
                        }
                    ]
                },
                CurrentPage: {
                    number: bookItem.currentPage
                },
                TotalPage: {
                    number: bookItem.totalPage
                }
            };

            if (!hasDataBook(currentBook)) {
                // create new book
                const result = (await notionClient.pages.create({
                    parent: {
                        database_id: notionSetting.bookListDatabaseId
                    },
                    properties: properties
                })) as PageObjectResponse;
                console.log("⭐ create new book 📚", result);
                await mutateCurrentBook(
                    {
                        pageId: result.id,
                        fileId: prop(result.properties.FileId, "title").title[0].plain_text,
                        fileName: prop(result.properties.FileName, "rich_text").rich_text[0].plain_text,
                        title: prop(result.properties.Title, "rich_text").rich_text[0].plain_text,
                        authors: prop(result.properties.Author, "multi_select").multi_select.map(
                            (select) => select.name
                        ),
                        publisher: prop(result.properties.Publisher, "select").select?.name,
                        currentPage: prop(result.properties.CurrentPage, "number").number ?? 0,
                        totalPage: prop(result.properties.TotalPage, "number").number ?? 0,
                        lastMarker: decodeBookMarker(
                            prop(result.properties.LastMarker, "rich_text").rich_text[0].plain_text
                        )
                    },
                    {
                        populateCache: true, // No revoke fetch again after mutate
                        revalidate: false
                    }
                );
            } else {
                // update item
                const result = (await notionClient.pages.update({
                    page_id: currentBook.pageId,
                    properties: properties
                })) as PageObjectResponse;
                console.log("⭐ Update book 📚", result);
                await mutateCurrentBook(
                    {
                        pageId: result.id,
                        fileId: prop(result.properties.FileId, "title").title[0].plain_text,
                        fileName: prop(result.properties.FileName, "rich_text").rich_text[0].plain_text,
                        title: prop(result.properties.Title, "rich_text").rich_text[0].plain_text,
                        authors: prop(result.properties.Author, "multi_select").multi_select.map(
                            (select) => select.name
                        ),
                        publisher: prop(result.properties.Publisher, "select").select?.name,
                        currentPage: prop(result.properties.CurrentPage, "number").number ?? 0,
                        totalPage: prop(result.properties.TotalPage, "number").number ?? 0,
                        lastMarker: decodeBookMarker(
                            prop(result.properties.LastMarker, "rich_text").rich_text[0].plain_text
                        )
                    },
                    {
                        populateCache: true, // No revoke fetch again after mutate
                        revalidate: false
                    }
                );
            }
            return;
        }
    );
    const { trigger: addMemo } = useSWRMutation(
        () =>
            notionClient
                ? {
                      cacheKey: "/notion/add-memo",
                      fileId,
                      fileName,
                      currentBook
                  }
                : null,
        async (params, { arg }: { arg: { memo: string; currentPage: number; marker: BookMarker } }) => {
            const { currentBook } = params;
            const memo = arg.memo;
            const currentPage = arg.currentPage;
            const marker = arg.marker;
            if (!notionClient || !notionSetting?.bookMemoDatabaseId) {
                throw new Error("notion client is not initialized or book memo database id is not set");
            }
            if (!hasDataBook(currentBook)) {
                return;
            }
            const properties = {
                Quote: {
                    title: [
                        {
                            text: {
                                content: memo
                            }
                        }
                    ]
                },
                Page: {
                    number: currentPage
                },
                Marker: {
                    rich_text: [
                        {
                            text: {
                                content: encodeBookMarker(marker)
                            }
                        }
                    ]
                },
                "Book List": {
                    relation: [
                        {
                            id: currentBook.pageId
                        }
                    ]
                }
            };
            console.log("⭐ New Memo", properties);
            // create new book
            const result = (await notionClient.pages.create({
                parent: {
                    database_id: notionSetting.bookMemoDatabaseId
                },
                // @ts-ignore
                properties: properties
            })) as PageObjectResponse;
            console.log("create new memo", result);
        }
    );
    return {
        currentBook,
        updateBookStatus,
        addMemo
    } as const;
};
