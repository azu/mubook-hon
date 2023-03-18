import React, { FC, useMemo } from "react";
import { decodeBookMarker, isKindleMarker } from "../../notion/useNotion";

export type KindleReaderProps = {
    id: string;
    initialMarker?: string;
};
export const KindleReader: FC<KindleReaderProps> = (props) => {
    const initialPage = useMemo(() => {
        if (props.initialMarker) {
            const marker = decodeBookMarker(props.initialMarker);
            if (isKindleMarker(marker)) {
                console.debug("initial page by marker", marker.locationNumber);
                return marker.locationNumber;
            }
            console.warn("invalid marker", props.initialMarker);
        }
    }, [props.initialMarker]);
    const kindleUrl = useMemo(() => {
        // kindle://book?action=open&asin={id}&location=2449
        return `kindle://book?action=open&asin=${props.id}&location=${initialPage}`;
    }, [initialPage, props.id]);
    return (
        <div>
            {kindleUrl && (
                <a href={kindleUrl} target={"_blank"} rel={"noreferrer"}>
                    Open in Kindle
                </a>
            )}
        </div>
    );
};
