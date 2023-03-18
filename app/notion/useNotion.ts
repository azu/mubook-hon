import { useLocalStorage } from "react-use";
import { useCallback, useMemo } from "react";
import { Client } from "@notionhq/client";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Fetcher } from "swr/_internal";

export type NotionSetting = { apiKey: string; bookListDatabaseId: string; bookMemoDatabaseId: string };
// User can define own proxy url

const USER_DEFINED_NOTION_BASE_URL =
    typeof localStorage !== "undefined" && localStorage.getItem("mubook-hon-NOTION_API_BASE_URL");
const NOTION_API_BASE_URL = USER_DEFINED_NOTION_BASE_URL
    ? USER_DEFINED_NOTION_BASE_URL
    : process.env.NODE_ENV === "production"
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
    const hasCompleteNotionSettings = useMemo(() => {
        return (
            notionSetting?.apiKey !== undefined &&
            notionSetting?.bookListDatabaseId !== undefined &&
            notionSetting?.bookMemoDatabaseId !== undefined
        );
    }, [notionSetting?.apiKey, notionSetting?.bookListDatabaseId, notionSetting?.bookMemoDatabaseId]);
    return {
        hasCompleteNotionSettings,
        notionSetting,
        updateNotionSettings
    } as const;
};
export const isBibiPositionMaker = (marker: unknown): marker is BibiPositionMarker => {
    return typeof marker === "object" && marker !== null && "ItemIndex" in marker;
};
export const isPdfJsPositionMarker = (marker: unknown): marker is PdfJsPositionMarker => {
    return typeof marker === "object" && marker !== null && "currentPage" in marker;
};
export const isKindleMarker = (marker: unknown): marker is KindlePositionMarker => {
    return typeof marker === "object" && marker !== null && "locationNumber" in marker;
};
export type BibiPositionMarker = {
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
export type PdfJsPositionMarker = {
    currentPage: number;
};
export type KindlePositionMarker = {
    locationNumber: number;
};
export type BookMarker = BibiPositionMarker | PdfJsPositionMarker | KindlePositionMarker;

export const encodeBookMarker = (marker?: BookMarker): string => {
    if (!marker) {
        return "";
    }
    return encodeURIComponent(JSON.stringify(marker));
};
export const decodeBookMarker = <T extends BookMarker>(markerString?: string): T | undefined => {
    if (!markerString) {
        return;
    }
    try {
        return JSON.parse(decodeURIComponent(markerString));
    } catch (error) {
        console.warn("Fail to parse marker string", markerString);
    }
};
export const supportedViewerType = (viewerType: unknown): viewerType is BookItem["viewer"] => {
    if (!viewerType) {
        return false;
    }
    if (typeof viewerType !== "string") {
        return false;
    }
    const SUPPORTED_TYPES: BookItem["viewer"][] = ["epub:bibi", "pdf:pdfjs", "kindle"];
    // @ts-expect-error: ok
    return SUPPORTED_TYPES.includes(viewerType);
};

export const isBibiBookItem = (item: BibiBookItem | PdfJsBookItem | KindleBookItem): item is BibiBookItem => {
    return item.viewer === "epub:bibi";
};
export const isPdfjsBookItem = (item: BibiBookItem | PdfJsBookItem | KindleBookItem): item is BibiBookItem => {
    return item.viewer === "pdf:pdfjs";
};
export type CommonBookItemProps = {
    pageId: string;
    fileId: string;
    fileName: string;
    title: string;
    currentPage: number;
    totalPage: number;
    publisher?: string;
    authors: string[];
};
export type BibiBookItem = {
    // Book Viewer type
    viewer: "epub:bibi";
    lastMarker?: BibiPositionMarker;
} & CommonBookItemProps;
export type PdfJsBookItem = {
    viewer: "pdf:pdfjs";
    lastMarker?: PdfJsPositionMarker;
} & CommonBookItemProps;
export type KindleBookItem = {
    viewer: "kindle";
    lastMarker?: PdfJsPositionMarker;
} & CommonBookItemProps;
export type BookItem = BibiBookItem | PdfJsBookItem | KindleBookItem;
type PropertyTypes = ExtractRecordValue<PageObjectResponse["properties"]>;
type ExtractRecordValue<R> = R extends Record<infer _, infer V> ? V : never;
export const prop = <F extends PropertyTypes, T extends F["type"]>(o: F, type: T) => {
    if (o.type !== type) {
        throw new Error("invalid type:" + JSON.stringify(o));
    }
    return o as T extends F["type"] ? Extract<F, { type: T }> : never;
};
export const NO_BOOK_DATA = Symbol("No Data YET");
export const hasDataBook = (bookItem: unknown): bookItem is BookItem => {
    return bookItem !== undefined && bookItem !== null && typeof bookItem === "object" && "fileId" in bookItem;
};
export const useNotion = ({ fileId, fileName }: { fileId?: string; fileName?: string }) => {
    const { notionSetting, hasCompleteNotionSettings: hasCompletedNotionSettings } = useNotionSetting();
    const notionClient = useMemo(() => {
        if (!fileId || !fileName) {
            return;
        }
        if (!notionSetting?.apiKey) {
            return;
        }
        return new Client({
            auth: notionSetting.apiKey,
            baseUrl: NOTION_API_BASE_URL
        });
    }, [fileId, fileName, notionSetting?.apiKey]);
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
            if (!fileId || !fileName) {
                return NO_BOOK_DATA;
            }
            const { results } = await notionClient.databases.query({
                database_id: notionSetting.bookListDatabaseId,
                filter: {
                    // Dropbox fileIs is case-sensitive
                    // https://www.dropboxforum.com/t5/Dropbox-API-Support-Feedback/Unique-file-id-not-really-unique/td-p/333590
                    // But, Notion does not case-sensitive search
                    // fileId x fileName
                    // Note: Notion Query just ignore empty string
                    // e.g. equals: "" => always true
                    and: [
                        {
                            property: "FileId",
                            rich_text: {
                                equals: fileId
                            }
                        },
                        {
                            property: "FileName",
                            title: {
                                equals: fileName
                            }
                        }
                    ]
                }
            });
            console.debug("⭐ Fetch book 📚", results[0]);
            const result = results[0] as PageObjectResponse;
            if (!result) {
                return NO_BOOK_DATA;
            }
            const viewerType = prop(result.properties.Viewer, "select").select?.name;
            if (!supportedViewerType(viewerType)) {
                throw new Error("not supported viewer type:" + viewerType);
            }
            const currentBook = {
                viewer: viewerType,
                pageId: result.id,
                fileId: prop(result.properties.FileId, "rich_text").rich_text[0].plain_text,
                fileName: prop(result.properties.FileName, "title").title[0].plain_text,
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
        // pageId is not required because it comes from the `currentBook`
        async (param, { arg }: { arg: Omit<BookItem, "pageId"> | BookItem }) => {
            const { fileId, fileName, currentBook } = param;
            // TODO: currently, only support bibi
            const bookItem = arg;
            if (!notionClient || !notionSetting?.bookListDatabaseId) {
                throw new Error("notion client is not initialized");
            }
            if (!fileId || !fileName) {
                return;
            }
            const properties = {
                FileId: {
                    rich_text: [
                        {
                            text: {
                                content: fileId
                            }
                        }
                    ]
                },
                Viewer: {
                    select: {
                        name: bookItem.viewer
                    }
                },
                FileName: {
                    title: [
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
                console.debug("⭐ create new book 📚", result);
                const viewerType = prop(result.properties.Viewer, "select").select?.name;
                if (!supportedViewerType(viewerType)) {
                    throw new Error("not supported viewer type:" + viewerType);
                }
                const commonBookItem: CommonBookItemProps = {
                    pageId: result.id,
                    fileId: prop(result.properties.FileId, "rich_text").rich_text[0].plain_text,
                    fileName: prop(result.properties.FileName, "title").title[0].plain_text,
                    title: prop(result.properties.Title, "rich_text").rich_text[0].plain_text,
                    authors: prop(result.properties.Author, "multi_select").multi_select.map((select) => select.name),
                    publisher: prop(result.properties.Publisher, "select").select?.name,
                    currentPage: prop(result.properties.CurrentPage, "number").number ?? 0,
                    totalPage: prop(result.properties.TotalPage, "number").number ?? 0
                };
                const bookItem =
                    viewerType === "epub:bibi"
                        ? {
                              ...commonBookItem,
                              viewer: viewerType,
                              lastMarker: decodeBookMarker<BibiPositionMarker>(
                                  prop(result.properties.LastMarker, "rich_text").rich_text[0].plain_text
                              )
                          }
                        : {
                              ...commonBookItem,
                              viewer: viewerType,
                              lastMarker: decodeBookMarker<PdfJsPositionMarker>(
                                  prop(result.properties.LastMarker, "rich_text").rich_text[0].plain_text
                              )
                          };
                await mutateCurrentBook(bookItem, {
                    populateCache: true, // No revoke fetch again after mutate
                    revalidate: false
                });
            } else {
                // update item
                const result = (await notionClient.pages.update({
                    page_id: currentBook.pageId,
                    properties: properties
                })) as PageObjectResponse;
                console.debug("⭐ Update book 📚", result);
                const viewerType = prop(result.properties.Viewer, "select").select?.name;
                if (!supportedViewerType(viewerType)) {
                    throw new Error("not supported viewer type:" + viewerType);
                }
                const commonBookItem: CommonBookItemProps = {
                    pageId: result.id,
                    fileId: prop(result.properties.FileId, "rich_text").rich_text[0].plain_text,
                    fileName: prop(result.properties.FileName, "title").title[0].plain_text,
                    title: prop(result.properties.Title, "rich_text").rich_text[0].plain_text,
                    authors: prop(result.properties.Author, "multi_select").multi_select.map((select) => select.name),
                    publisher: prop(result.properties.Publisher, "select").select?.name,
                    currentPage: prop(result.properties.CurrentPage, "number").number ?? 0,
                    totalPage: prop(result.properties.TotalPage, "number").number ?? 0
                };
                const bookItem =
                    viewerType === "epub:bibi"
                        ? {
                              ...commonBookItem,
                              viewer: viewerType,
                              lastMarker: decodeBookMarker<BibiPositionMarker>(
                                  prop(result.properties.LastMarker, "rich_text").rich_text[0].plain_text
                              )
                          }
                        : {
                              ...commonBookItem,
                              viewer: viewerType,
                              lastMarker: decodeBookMarker<PdfJsPositionMarker>(
                                  prop(result.properties.LastMarker, "rich_text").rich_text[0].plain_text
                              )
                          };
                await mutateCurrentBook(bookItem, {
                    populateCache: true, // No revoke fetch again after mutate
                    revalidate: false
                });
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
            console.debug("⭐ New Memo", properties);
            // create new book
            const result = (await notionClient.pages.create({
                parent: {
                    database_id: notionSetting.bookMemoDatabaseId
                },
                // @ts-ignore
                properties: properties
            })) as PageObjectResponse;
            console.debug("created new memo", result);
        }
    );
    return {
        hasCompletedNotionSettings,
        currentBook,
        updateBookStatus,
        addMemo
    } as const;
};
