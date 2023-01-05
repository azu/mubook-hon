"use client"
import type { NextPage } from 'next'
import "./view/patch.js"
import { Dropbox, DropboxResponse, DropboxAuth } from "dropbox";
import { Suspense, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useLocalStorage } from "react-use";
import useSWR, { Fetcher } from "swr";
import { files } from "dropbox/types/dropbox_types";
import Link from "next/link";
import { useRouter } from "next/navigation";

const useReady = () => {
    const [ready, setReady] = useState(false);
    useLayoutEffect(() => {
        setReady(true);
    }, []);
    return ready;
}
type DropboxTokens = {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
}
const DROPBOX_AUTH_REDIRECT_URI = "http://localhost:3000/";
const useDropbox = (props: { code?: string; }) => {
    const router = useRouter()
    const [tokens, setTokens] = useLocalStorage<DropboxTokens>("mubook-hon-dropbox-tokens");
    const [hasValidAccessToken, setHasValidAccessToken] = useState(false);
    const dropboxAuth = useMemo(() => {
        console.log("auth")
        return new DropboxAuth({
            clientId: "gzx6eue9upkkcow",
            accessToken: tokens?.accessToken,
            refreshToken: tokens?.refreshToken,
            accessTokenExpiresAt: tokens?.accessTokenExpiresAt ? new Date(tokens.accessTokenExpiresAt) : undefined
        })
    }, [tokens?.refreshToken, tokens?.accessToken, tokens?.accessTokenExpiresAt]);
    const dropboxClient = useMemo(() => {
        if (!hasValidAccessToken) return null;
        console.log("new client");
        return new Dropbox({
            clientId: "gzx6eue9upkkcow",
            accessToken: tokens?.accessToken,
            refreshToken: tokens?.refreshToken,
            accessTokenExpiresAt: tokens ? new Date(tokens.accessTokenExpiresAt) : undefined
        })
    }, [tokens, hasValidAccessToken]);
    useEffect(() => {
        // @ts-expect-error https://github.com/dropbox/dropbox-sdk-js/issues/606
        dropboxAuth.checkAndRefreshAccessToken().then(() => {
            const accessToken = dropboxAuth.getAccessToken();
            const refreshToken = dropboxAuth.getRefreshToken();
            const accessTokenExpiresAt = dropboxAuth.getAccessTokenExpiresAt();
            const b = Boolean(accessToken && refreshToken);
            setHasValidAccessToken(b);
            console.log("checkAndRefreshAccessToken", b)
            setTokens({
                accessToken,
                refreshToken,
                accessTokenExpiresAt: accessTokenExpiresAt?.toISOString()
            })
        }).catch((e: Error) => {
            console.error(e)
            setTokens(undefined)
        })
    }, [dropboxAuth, setTokens]);
    useEffect(() => {
        if (!props.code) return;
        const codeVerifier = window.sessionStorage.getItem('codeVerifier');
        if (!codeVerifier) {
            throw new Error("codeVerifier not found");
        }
        dropboxAuth.setCodeVerifier(codeVerifier);
        dropboxAuth.getAccessTokenFromCode(DROPBOX_AUTH_REDIRECT_URI, props.code)
            .then((response) => {
                console.log("getAccessTokenFromCode", response);
                const result = response.result;
                setTokens({
                    // @ts-ignore
                    accessToken: result.access_token,
                    // @ts-ignore
                    refreshToken: result.refresh_token,
                    // @ts-ignore
                    accessTokenExpiresAt: new Date(Date.now() + result.expires_in * 1000).toISOString()
                })
                router.replace("/")
                window.sessionStorage.removeItem('codeVerifier');
            })
            .catch((error) => {
                console.error(error)
            });
    }, [dropboxAuth, props.code, router, setTokens])
    const AuthUrl = useMemo(() => {
        return function AuthURL() {
            const [url, setUrl] = useState("");
            useEffect(() => {
                dropboxAuth.getAuthenticationUrl(DROPBOX_AUTH_REDIRECT_URI, undefined, 'code', 'offline', undefined, undefined, true).then((ret) => {
                    window.sessionStorage.clear();
                    window.sessionStorage.setItem("codeVerifier", dropboxAuth.getCodeVerifier());
                    setUrl(ret.toString());
                })
            }, [])
            return <a href={url}>Authorize</a>
        }
    }, [dropboxAuth])
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
        hasValidAccessToken,
        AuthUrl,
        epubItems
    } as const
}
const Home: NextPage<{
    searchParams: {
        code?: string;
    }
}> = (props) => {
    const ready = useReady();
    const { hasValidAccessToken, epubItems, AuthUrl } = useDropbox({
        code: props.searchParams.code
    });
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
