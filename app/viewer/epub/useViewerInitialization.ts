import { useCallback, useRef } from "react";
import { BibiReaderProps } from "./BibiReader";
import { BookItem } from "../../notion/useNotion";
import { waitContentWindowLoad } from "./BibiReader";
import { ContentWindow } from "./BibiReader";

type UseViewerInitializationProps = {
    contentWindow: ContentWindow;
    isInitialized: React.MutableRefObject<boolean>;
    tryToRestoreLastPositionAtFirst: () => Promise<void>;
    onClickStockMemo: () => void;
    onClickMemo: () => void;
    setMenuState: (state: "open" | "closed") => void;
    setCanMemoContent: (can: boolean) => void;
    updateBookStatus: (status: any) => Promise<void>;
    isTranslation: boolean;
    props: BibiReaderProps;
    currentBook: BookItem | null;
};

export const useViewerInitialization = ({
    contentWindow,
    isInitialized,
    tryToRestoreLastPositionAtFirst,
    onClickStockMemo,
    onClickMemo,
    setMenuState,
    setCanMemoContent,
    updateBookStatus,
    isTranslation,
    props,
    currentBook
}: UseViewerInitializationProps) => {
    const viewerControllerOnKeydownRef = useRef<() => void>();
    const viewerControllerOnChangePageRef = useRef<() => void>();
    const viewerControllerOnChangeMenuRef = useRef<() => void>();
    const viewerControllerOnSelectionChangeRef = useRef<() => void>();

    const setupEventListeners = useCallback(async () => {
        console.debug("Try to add listener to page");
        viewerControllerOnChangeMenuRef.current?.();
        viewerControllerOnChangeMenuRef.current = await contentWindow.viewerController.onChangeMenuState(
            (state: "open" | "closed") => {
                setMenuState(state);
            }
        );

        // on selection change
        viewerControllerOnSelectionChangeRef.current?.();
        viewerControllerOnSelectionChangeRef.current = await contentWindow.viewerController.onChangeSelection(
            (selection?: string) => {
                console.debug("selection change", { selection });
                if (selection) {
                    setCanMemoContent(true);
                }
            }
        );

        // on keydown
        viewerControllerOnKeydownRef.current?.();
        viewerControllerOnKeydownRef.current = await contentWindow.viewerController.onKeydown(
            (event: KeyboardEvent) => {
                if (/* Shift + A */ event.shiftKey && event.key === "A") {
                    onClickStockMemo();
                } else if (/* Shift + S */ event.shiftKey && event.key === "S") {
                    onClickMemo();
                } else if (/* J */ event.key === "j") {
                    contentWindow.viewerController.moveNextPage();
                } else if (/* K */ event.key === "k") {
                    contentWindow.viewerController.movePrevPage();
                }
            }
        );

        // on change page
        viewerControllerOnChangePageRef.current?.();
        viewerControllerOnChangePageRef.current = await contentWindow.viewerController.onChangePage(async () => {
            if (!isInitialized.current) {
                console.debug("not yet initialized");
                return;
            }
            const bookInfo = await contentWindow.viewerController.getBookInfo();
            const currentPage = await contentWindow.viewerController.getCurrentPage();
            const totalPage = await contentWindow.viewerController.getTotalPage();
            const lastMarker = await contentWindow.viewerController.getCurrentPositionMaker();
            const currentPageText = await contentWindow.viewerController.getCurrentPageText();
            console.debug("onChangePage", {
                bookInfo,
                currentBook,
                lastMarker,
                currentPage,
                totalPage,
                currentPageText: currentPageText
            });
            await updateBookStatus({
                viewer: "epub:bibi",
                pageId: bookInfo.id,
                fileId: props.id,
                fileName: props.bookFileName,
                publisher: bookInfo.publisher,
                title: bookInfo.title,
                authors: bookInfo.author
                    .split(",")
                    .map((author: string) => author.trim())
                    .filter((author: string) => author !== ""),
                currentPage,
                totalPage,
                lastMarker
            });
            // if you get current page text, can memo it
            const canMemo = Boolean(currentPageText?.text);
            setCanMemoContent(canMemo);
        });

        if (isTranslation) {
            contentWindow.viewerController.enableTranslation();
        }
    }, [
        contentWindow,
        isInitialized,
        onClickStockMemo,
        onClickMemo,
        setMenuState,
        setCanMemoContent,
        updateBookStatus,
        isTranslation,
        props.id,
        props.bookFileName,
        currentBook
    ]);

    const initialize = useCallback(async () => {
        try {
            await waitContentWindowLoad(contentWindow);
            if (!isInitialized.current) {
                await tryToRestoreLastPositionAtFirst();
            }
            await setupEventListeners();
        } catch (error) {
            console.error("Error initializing viewer:", error);
        }
    }, [contentWindow, isInitialized, tryToRestoreLastPositionAtFirst, setupEventListeners]);

    const cleanup = useCallback(() => {
        viewerControllerOnChangeMenuRef.current?.();
        viewerControllerOnChangePageRef.current?.();
        viewerControllerOnSelectionChangeRef.current?.();
        viewerControllerOnKeydownRef.current?.();
    }, []);

    return {
        initialize,
        cleanup
    };
};
