"use client";
import { useEffect, useState } from "react";
import { isPWAStandaloneMode } from "./pwa";
import { LastReadInfo, typedStorage, typedSessionStorage } from "./storageKeys";

export type { LastReadInfo };

/**
 * 最後に読んだ書籍の情報をlocalStorageに保存
 */
export const saveLastRead = (info: Omit<LastReadInfo, "timestamp">): void => {
    typedStorage.set("mubook-hon-last-read", {
        ...info,
        timestamp: Date.now()
    });
};

/**
 * 最後に読んだ書籍の情報をlocalStorageから取得
 */
export const getLastRead = (): LastReadInfo | null => {
    return typedStorage.get("mubook-hon-last-read");
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
        const hasFlag = typedSessionStorage.get("mubook-hon-pwa-session-active");

        if (!hasFlag) {
            // フラグがない = 新規起動
            setIsFreshLaunch(true);
            typedSessionStorage.set("mubook-hon-pwa-session-active", "true");
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
