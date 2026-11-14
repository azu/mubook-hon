"use client";
import React, { useMemo, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { Loading } from "../components/Loading";
import { isDemoAllowedHost } from "./isDemoAllowedHost";
import { createSampleEpub, SAMPLE_BOOK_TITLE, SampleWritingMode } from "./createSampleEpub";

const FoliateReader = dynamic(
    () => import("../viewer/epub/FoliateReader").then((mod) => ({ default: mod.FoliateReader })),
    { ssr: false }
);

type PageState = { status: "checking" } | { status: "forbidden" } | { status: "ready"; mode?: SampleWritingMode };

const parseMode = (value: string | null): SampleWritingMode | undefined => {
    if (value === "vertical" || value === "horizontal") {
        return value;
    }
    return;
};

// Static Exportのため、ホスト名はクライアントでだけ読む（サーバー側のスナップショットはnull）
const subscribeNothing = () => () => {};
const useLocationHref = () =>
    useSyncExternalStore(
        subscribeNothing,
        () => window.location.href,
        () => null
    );

/**
 * ログイン不要の表示確認ページ
 *
 * サンプル本文から作ったEPUBを、本番と同じFoliateReaderで表示する。
 * Notion/Dropboxとは通信せず、ローカル開発環境とプレビュー環境でだけ表示する。
 */
export default function Page() {
    const href = useLocationHref();
    const state = useMemo<PageState>(() => {
        if (!href) {
            return { status: "checking" };
        }
        const url = new URL(href);
        if (!isDemoAllowedHost(url.hostname)) {
            return { status: "forbidden" };
        }
        return { status: "ready", mode: parseMode(url.searchParams.get("mode")) };
    }, [href]);

    if (state.status === "checking") {
        return <Loading>Loading...</Loading>;
    }
    if (state.status === "forbidden") {
        return (
            <div className="main">
                <p>このページはプレビュー環境とローカル開発環境でだけ利用できます。</p>
            </div>
        );
    }
    if (!state.mode) {
        return (
            <div className="main">
                <h1>ビューアーの表示確認</h1>
                <p>
                    ログインせずに、サンプル本文でEPUBビューアーの表示を確認できます。読書位置などはNotionに保存されません。
                </p>
                <ul>
                    <li>
                        <a href="?mode=vertical">{SAMPLE_BOOK_TITLE.vertical}</a>
                    </li>
                    <li>
                        <a href="?mode=horizontal">{SAMPLE_BOOK_TITLE.horizontal}</a>
                    </li>
                </ul>
            </div>
        );
    }
    return <DemoReader mode={state.mode} />;
}

const DemoReader = ({ mode }: { mode: SampleWritingMode }) => {
    const fileBlob = useMemo(() => createSampleEpub(mode), [mode]);
    const fileName = `${SAMPLE_BOOK_TITLE[mode]}.epub`;
    return (
        <FoliateReader
            id={`viewer-demo-${mode}`}
            bookFileName={fileName}
            src={undefined}
            fileBlob={fileBlob}
            disableSync={true}
        />
    );
};
