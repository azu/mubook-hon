import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookMarker, isBibiPositionMaker, isPdfJsPositionMarker } from "../notion/useNotion";
import * as Toast from "@radix-ui/react-toast";

type ToastProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    current: number | "<none>";
    last: number | "<none>";
};
export const ToastComponent: FC<
    ToastProps & {
        onClickJumpLastPage: () => void;
    }
> = (props) => {
    const { open, setOpen, current, last } = props;
    return (
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
    );
};

export const useToast = (): ToastProps & {
    bookInfo: { current: BookMarker; lastRead: BookMarker } | undefined;
    showToast: (bookMakers: { current: BookMarker; lastRead: BookMarker }) => void;
    hideToast: () => void;
} => {
    const [open, setOpen] = useState(false);
    const timerRef = useRef(0);
    const [restoreMakers, setRestoreMakers] = useState<{ current: BookMarker; lastRead: BookMarker }>();
    const current = useMemo(() => {
        if (!restoreMakers?.current) {
            return "<none>";
        }
        return isBibiPositionMaker(restoreMakers?.current)
            ? restoreMakers?.current.ItemIndex
            : isPdfJsPositionMarker(restoreMakers?.current)
            ? restoreMakers?.current.currentPage
            : "<none>";
    }, [restoreMakers]);
    const last = useMemo(() => {
        if (!restoreMakers?.lastRead) {
            return "<none>";
        }
        return isBibiPositionMaker(restoreMakers?.lastRead)
            ? restoreMakers?.lastRead.ItemIndex
            : isPdfJsPositionMarker(restoreMakers?.lastRead)
            ? restoreMakers?.lastRead.currentPage
            : "<none>";
    }, [restoreMakers]);
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
    return {
        open,
        setOpen,
        bookInfo: restoreMakers,
        showToast: show,
        hideToast: hide,
        last,
        current
    };
};
