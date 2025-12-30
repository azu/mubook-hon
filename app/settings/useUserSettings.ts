import { useLocalStorageValue as useLocalStorage } from "@react-hookz/web";

type UserSettings = {
    openNewTab: boolean;
    uploadBookToNotion: boolean;
};
const DEFAULT_SETTINGS: UserSettings = {
    openNewTab: true,
    uploadBookToNotion: false // デフォルトOFF
};
export const useUserSettings = () => {
    const { value: userSettings, set: setUserSettings } = useLocalStorage<UserSettings>("mubook-hon-user-settings", {
        defaultValue: DEFAULT_SETTINGS
    });
    return {
        userSettings: userSettings,
        updateUserSettings: setUserSettings
    } as const;
};
