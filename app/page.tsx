"use client"
import type { NextPage } from 'next'
import "./view/patch.js"
import { Dropbox, DropboxResponse } from "dropbox";
import { useLayoutEffect, useMemo, useState } from "react";
import { useLocalStorage } from "react-use";
import useSWR, { Fetcher } from "swr";
import { files } from "dropbox/types/dropbox_types";
import Link from "next/link";

const useReady = () => {
    const [ready, setReady] = useState(false);
    useLayoutEffect(() => {
        setReady(true);
    }, []);
    return ready;
}
const useDropbox = () => {
    const [apiKey, setApiKey] = useLocalStorage<string>("mubook-hon-dropbox-api-key", "");
    const hasApiKey = apiKey !== "";
    const dropboxClient = useMemo(() => {
        if (apiKey === "") return null;
        return new Dropbox({
            accessToken: apiKey
        })
    }, [apiKey]);
    const listFetcher: Fetcher<DropboxResponse<files.ListFolderResult>> = async () => {
        if (!dropboxClient) {
            throw new Error("no dropbox client");
        }
        return dropboxClient.filesListFolder({ path: '' });
    }
    const { data: itemLists, error: itemListsError } = useSWR<DropboxResponse<files.ListFolderResult>>("/",
        dropboxClient ? listFetcher : null, {
            revalidateOnFocus: true
        });
    const epubItems = useMemo(() => {
        return itemLists?.result.entries.filter((entry) => {
            return entry?.path_lower?.endsWith(".epub");
        }) ?? []
    }, [itemLists])
    return {
        hasApiKey,
        setApiKey,
        epubItems
    } as const
}
const Home: NextPage = () => {
    const ready = useReady();
    const { hasApiKey, setApiKey, epubItems } = useDropbox();
    if (!ready) {
        return null;
    }
    if (!hasApiKey) {
        return <div>
            <form>
                <input type={"password"} value={""} onChange={(e) => {
                    setApiKey(e.target.value);
                }}/>
            </form>
        </div>
    }
    return <div>{
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
    }</div>
}

export default Home
