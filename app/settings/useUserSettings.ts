import { useCallback, useMemo, useState } from "react";

type UserSettings = {
    openNewTab: boolean;
};
const DEFAULT_SETTINGS: UserSettings = {
    openNewTab: true
};
export const useUserSettings = () => {
    const [memoryState, setMemoryState] = useState<UserSettings>(DEFAULT_SETTINGS);
    const userSettings = useMemo(() => {
        const settings = localStorage.getItem("mubook-hon.settings");
        if (settings) {
            return {
                ...memoryState,
                ...JSON.parse(settings)
            } as UserSettings;
        }
        return DEFAULT_SETTINGS;
    }, [memoryState]);
    const updateUserSettings = useCallback((settings: UserSettings) => {
        setMemoryState(settings);
        localStorage.setItem("mubook-hon.settings", JSON.stringify(settings));
    }, []);
    return {
        userSettings,
        updateUserSettings
    } as const;
};
