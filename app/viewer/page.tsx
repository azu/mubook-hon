import React, { Suspense } from "react";
import { Loading } from "../components/Loading";
import { ViewerContent } from "./content";
export default function Page() {
    return (
        <Suspense fallback={<Loading>Loading...</Loading>}>
            <ViewerContent />
        </Suspense>
    );
}
