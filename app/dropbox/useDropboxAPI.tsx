import { Dropbox, DropboxResponse } from "dropbox";
import useSWR, { Fetcher } from "swr";
import { files } from "dropbox/types/dropbox_types";
import { useMemo } from "react";

export const useDropboxAPI = (dropboxClient: Dropbox | null, options: { path: string; filterQuery: string }) => {
    const filterQuery = options.filterQuery;
    const listFetcher: Fetcher<DropboxResponse<files.ListFolderResult>> = async () => {
        if (!dropboxClient) {
            throw new Error("no dropbox client");
        }
        return dropboxClient.filesListFolder({ path: options.path });
    };
    const { data: itemLists, error: itemListsError } = useSWR<DropboxResponse<files.ListFolderResult>>(
        () =>
            dropboxClient
                ? {
                      cacheKey: "/dropbox/filesListFolder/",
                      path: options.path
                  }
                : null,
        listFetcher,
        {
            revalidateOnFocus: true,
            revalidateIfStale: true,
            revalidateOnMount: true
        }
    );
    const bookItems = useMemo(() => {
        const files =
            itemLists?.result.entries.filter((entry) => {
                if (entry[".tag"] === "folder") {
                    return true;
                }
                return entry?.path_lower?.endsWith(".epub") || entry?.path_lower?.endsWith(".pdf");
            }) ?? [];
        if (filterQuery) {
            return files.filter((entry) => {
                return entry?.path_lower?.toLowerCase().includes(filterQuery.toLowerCase());
            });
        }
        return files;
    }, [filterQuery, itemLists?.result.entries]);
    const sortedItems = useMemo(() => {
        return bookItems.sort((a, b) => {
            if (a[".tag"] === "folder" && b[".tag"] === "folder") {
                return 0;
            }
            if (a[".tag"] === "file" && b[".tag"] === "folder") {
                return 1;
            }
            if (a[".tag"] === "folder" && b[".tag"] === "file") {
                return -1;
            }
            // @ts-expect-error: entry?.is_downloadable is not defined in the type
            return a.client_modified < b.client_modified ? 1 : -1;
        });
    }, [bookItems]);
    return {
        bookItems,
        sortedItems
    } as const;
};
