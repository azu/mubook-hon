"use client";
import { useEffect, useState } from "react";
import { isPWAStandaloneMode } from "./pwa";
import { LastReadInfo, typedStorage, typedSessionStorage } from "./storageKeys";

export type { LastReadInfo };

/**
 * 最後に読んだ書籍の情報をlocalStorageに保存
 */
export function saveLastRead(info: Omit<LastReadInfo, "timestamp">): void {
    typedStorage.set("mubook-hon-last-read", {
        ...info,
        timestamp: Date.now()
    });
}

/**
 * PWAの新規起動かどうかを判定するフック
 *
 * sessionStorageはタブ/ウィンドウを閉じるとクリアされるため、
 * PWAを閉じて再度開くと「新規起動」として扱われる
 */
export function usePWAFreshLaunch(): boolean {
    const [isFreshLaunch, setIsFreshLaunch] = useState(false);

    useEffect(() => {
        if (!isPWAStandaloneMode()) return;

        const hasFlag = typedSessionStorage.get("mubook-hon-pwa-session-active");
        if (!hasFlag) {
            setIsFreshLaunch(true);
            typedSessionStorage.set("mubook-hon-pwa-session-active", "true");
        }
    }, []);

    return isFreshLaunch;
}

/**
 * 最後に読んだ書籍の情報を取得するフック
 */
export function useLastRead(): LastReadInfo | null {
    const [lastRead, setLastRead] = useState<LastReadInfo | null>(null);

    useEffect(() => {
        setLastRead(typedStorage.get("mubook-hon-last-read"));
    }, []);

    return lastRead;
}
