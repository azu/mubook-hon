"use client";
import { useEffect, useState } from "react";
import { isPWAStandaloneMode } from "./pwa";

const SESSION_KEY = "mubook-hon-pwa-session-active";
const LAST_READ_KEY = "mubook-hon-last-read";

export type LastReadInfo = {
    fileId: string;
    fileName: string;
    title: string;
    viewer: string;
    timestamp: number; // Unix timestamp in milliseconds
};

/**
 * 最後に読んだ書籍の情報をlocalStorageに保存
 */
export const saveLastRead = (info: Omit<LastReadInfo, "timestamp">): void => {
    if (typeof window === "undefined") return;
    const data: LastReadInfo = {
        ...info,
        timestamp: Date.now()
    };
    localStorage.setItem(LAST_READ_KEY, JSON.stringify(data));
};

/**
 * 最後に読んだ書籍の情報をlocalStorageから取得
 */
export const getLastRead = (): LastReadInfo | null => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(LAST_READ_KEY);
    if (!data) return null;
    try {
        return JSON.parse(data) as LastReadInfo;
    } catch {
        return null;
    }
};

/**
 * PWAの新規起動かどうかを判定するフック
 *
 * 判定ロジック：
 * - PWAモードでない場合: 常にfalse
 * - PWAモードの場合:
 *   - sessionStorageにフラグがない → 新規起動(true)、フラグをセット
 *   - sessionStorageにフラグがある → アプリ内遷移(false)
 *
 * sessionStorageはタブ/ウィンドウを閉じるとクリアされるため、
 * PWAを閉じて再度開くと「新規起動」として扱われる
 */
export const usePWAFreshLaunch = (): boolean => {
    const [isFreshLaunch, setIsFreshLaunch] = useState(false);

    useEffect(() => {
        // PWAモードでなければスキップ
        if (!isPWAStandaloneMode()) return;

        // セッションフラグを確認
        const hasFlag = sessionStorage.getItem(SESSION_KEY);

        if (!hasFlag) {
            // フラグがない = 新規起動
            setIsFreshLaunch(true);
            sessionStorage.setItem(SESSION_KEY, "true");
        }
        // フラグがある = アプリ内遷移（何もしない）
    }, []);

    return isFreshLaunch;
};

/**
 * 最後に読んだ書籍の情報を取得するフック
 */
export const useLastRead = (): LastReadInfo | null => {
    const [lastRead, setLastRead] = useState<LastReadInfo | null>(null);

    useEffect(() => {
        setLastRead(getLastRead());
    }, []);

    return lastRead;
};
