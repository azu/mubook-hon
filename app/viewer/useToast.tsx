import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookMarker, isBibiPositionMaker, isFoliatePositionMarker, isPdfJsPositionMarker } from "../notion/useNotion";
import * as Toast from "@radix-ui/react-toast";

const formatMarkerPosition = (marker: BookMarker | undefined): string | number => {
    if (!marker) {
        return "<none>";
    }
    if (isBibiPositionMaker(marker)) {
        return marker.ItemIndex;
    }
    if (isFoliatePositionMarker(marker)) {
        return `${Math.round(marker.fraction * 100)}%`;
    }
    if (isPdfJsPositionMarker(marker)) {
        return marker.currentPage;
    }
    return "";
};

export const useToast = () => {
    const [open, setOpen] = useState(false);
    const timerRef = useRef(0);
    const [restoreMakers, setRestoreMakers] = useState<{ current: BookMarker; lastRead: BookMarker }>();
    const currentMarker = restoreMakers?.current;
    const lastReadMarker = restoreMakers?.lastRead;
    const current = useMemo(() => formatMarkerPosition(currentMarker), [currentMarker]);
    const last = useMemo(() => formatMarkerPosition(lastReadMarker), [lastReadMarker]);
    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);
    const show = useCallback((bookMakers: { current: BookMarker; lastRead: BookMarker }) => {
        setRestoreMakers(bookMakers);
        setOpen(true);
        clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            setOpen(false);
        }, 5000);
    }, []);
    const hide = useCallback(() => {
        setOpen(false);
        clearTimeout(timerRef.current);
    }, []);
    const ToastComponent: FC<{ onClickJumpLastPage: () => void }> = (props) => {
        return (
            <Toast.Provider swipeDirection="right">
                <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
                    <Toast.Title className="ToastTitle">Found last read page</Toast.Title>
                    <Toast.Description>
                        <ul>
                            <li>Current: {current}</li>
                            <li>Last read: {last}</li>
                        </ul>
                        <p>You can Jump to last read page.</p>
                    </Toast.Description>
                    <Toast.Action className="ToastAction" asChild altText="Goto to last read page">
                        <button className="Button small green" onClick={props.onClickJumpLastPage}>
                            Jump
                        </button>
                    </Toast.Action>
                </Toast.Root>
                <Toast.Viewport className="ToastViewport" />
            </Toast.Provider>
        );
    };
    return {
        open,
        setOpen,
        bookInfo: restoreMakers,
        showToast: show,
        hideToast: hide,
        ToastComponent
    } as const;
};
