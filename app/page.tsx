"use client"
import type { NextPage } from 'next'
import { Dropbox, DropboxResponse } from "dropbox";
import { Suspense, useLayoutEffect, useMemo, useState } from "react";
import useSWR, { Fetcher } from "swr";
import { files } from "dropbox/types/dropbox_types";
import Link from "next/link";
import { useDropbox } from "./dropbox/useDropbox";

const useReady = () => {
    const [ready, setReady] = useState(false);
    useLayoutEffect(() => {
        setReady(true);
    }, []);
    return ready;
}

const useDropboxAPI = (dropboxClient: Dropbox | null) => {
    const listFetcher: Fetcher<DropboxResponse<files.ListFolderResult>> = async () => {
        console.log("listFetcher");
        if (!dropboxClient) {
            throw new Error("no dropbox client");
        }
        return dropboxClient.filesListFolder({ path: '' });
    }
    const {
        data: itemLists,
        error: itemListsError
    } = useSWR<DropboxResponse<files.ListFolderResult>>(() => dropboxClient ? "/" : null, listFetcher, {
        revalidateOnFocus: true
    });
    const epubItems = useMemo(() => {
        return itemLists?.result.entries.filter((entry) => {
            return entry?.path_lower?.endsWith(".epub");
        }) ?? []
    }, [itemLists])
    return {
        epubItems
    } as const
}
const Home: NextPage<{
    searchParams: {
        code?: string;
    }
}> = (props) => {
    const ready = useReady();
    const { dropboxClient, hasValidAccessToken, AuthUrl } = useDropbox({
        code: props.searchParams.code
    });
    const { epubItems } = useDropboxAPI(dropboxClient)
    if (!ready) {
        return null;
    }
    if (!hasValidAccessToken) {
        return <div>
            <Suspense fallback={<div>loading...</div>}>
                <AuthUrl/>
            </Suspense>
        </div>
    }
    return <div>
        <aside><Link href={"/settings"}>Settings</Link></aside>
        <h2>Book List</h2>
        <ul>
            {epubItems.map((item) => {
                return <li key={item.path_lower}><Link href={{
                    pathname: item.path_lower,
                    query: {
                        // @ts-ignore
                        id: item.id.replace("id:", "")
                    }
                }}>{item.path_display}</Link></li>
            })}
        </ul>
    </div>
}

export default Home
