import { useRouter } from "next/navigation";
import { useLocalStorage } from "react-use";
import { useEffect, useMemo, useState } from "react";
import { Dropbox, DropboxAuth } from "dropbox";

type DropboxTokens = {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
};
const DROPBOX_AUTH_REDIRECT_URI =
    process.env.NODE_ENV === "production" ? "https://mubook-hon.vercel.app/" : "http://localhost:3000/";
export const useDropbox = (props: { code?: string } = {}) => {
    const router = useRouter();
    const [tokens, setTokens] = useLocalStorage<DropboxTokens>("mubook-hon-dropbox-tokens");
    const [accessTokenStatus, setAccessTokenStatus] = useState<"none" | "valid" | "invalid">("none");
    const dropboxAuth = useMemo(() => {
        console.debug("create dropbox auth");
        return new DropboxAuth({
            clientId: "gzx6eue9upkkcow",
            accessToken: tokens?.accessToken,
            refreshToken: tokens?.refreshToken,
            accessTokenExpiresAt: tokens?.accessTokenExpiresAt ? new Date(tokens.accessTokenExpiresAt) : undefined
        });
    }, [tokens?.refreshToken, tokens?.accessToken, tokens?.accessTokenExpiresAt]);
    const dropboxClient = useMemo(() => {
        if (!accessTokenStatus) return null;
        console.debug("new dropbox client");
        return new Dropbox({
            clientId: "gzx6eue9upkkcow",
            accessToken: tokens?.accessToken,
            refreshToken: tokens?.refreshToken,
            accessTokenExpiresAt: tokens ? new Date(tokens.accessTokenExpiresAt) : undefined
        });
    }, [tokens, accessTokenStatus]);
    useEffect(() => {
        dropboxAuth
            .checkAndRefreshAccessToken()
            // @ts-expect-error https://github.com/dropbox/dropbox-sdk-js/issues/606
            .then(() => {
                const accessToken = dropboxAuth.getAccessToken();
                const refreshToken = dropboxAuth.getRefreshToken();
                const accessTokenExpiresAt = dropboxAuth.getAccessTokenExpiresAt();
                const b = Boolean(accessToken && refreshToken);
                setAccessTokenStatus(b ? "valid" : "invalid");
                console.debug("checkAndRefreshAccessToken", b);
                setTokens({
                    accessToken,
                    refreshToken,
                    accessTokenExpiresAt: accessTokenExpiresAt?.toISOString()
                });
            })
            .catch((e: Error) => {
                console.error(e);
                setTokens(undefined);
            });
    }, [dropboxAuth, setTokens]);
    useEffect(() => {
        if (!props.code) return;
        const codeVerifier = window.sessionStorage.getItem("codeVerifier");
        if (!codeVerifier) {
            console.debug("No codeVerifier");
            return;
        }
        dropboxAuth.setCodeVerifier(codeVerifier);
        dropboxAuth
            .getAccessTokenFromCode(DROPBOX_AUTH_REDIRECT_URI, props.code)
            .then((response) => {
                console.debug("getAccessTokenFromCode", response);
                const result = response.result;
                setTokens({
                    // @ts-ignore
                    accessToken: result.access_token,
                    // @ts-ignore
                    refreshToken: result.refresh_token,
                    // @ts-ignore
                    accessTokenExpiresAt: new Date(Date.now() + result.expires_in * 1000).toISOString()
                });
                router.replace("/");
                window.sessionStorage.removeItem("codeVerifier");
            })
            .catch((error) => {
                console.error(error);
            });
    }, [dropboxAuth, props.code, router, setTokens]);
    const AuthUrl = useMemo(() => {
        return function AuthURL() {
            const [url, setUrl] = useState("");
            useEffect(() => {
                dropboxAuth
                    .getAuthenticationUrl(
                        DROPBOX_AUTH_REDIRECT_URI,
                        undefined,
                        "code",
                        "offline",
                        undefined,
                        undefined,
                        true
                    )
                    .then((ret) => {
                        window.sessionStorage.setItem("codeVerifier", dropboxAuth.getCodeVerifier());
                        setUrl(ret.toString());
                    });
            }, []);
            return <a href={url}>Authorize</a>;
        };
    }, [dropboxAuth]);
    return {
        dropboxClient,
        accessTokenStatus,
        AuthUrl
    } as const;
};
