import React, { Suspense } from "react";
import { Loading } from "../components/Loading";
import { ViewerContent } from "./content";

export default function Page() {
    // ViewerContentコンポーネントはuseSearchParamsとDropbox認証を使用するため、
    // Suspenseで囲んでクライアントサイドレンダリングを適切に処理します
    return (
        <Suspense fallback={<Loading>Loading...</Loading>}>
            <ViewerContent />
        </Suspense>
    );
}
