import { useLocalStorage } from "react-use";

type UserSettings = {
    openNewTab: boolean;
};
const DEFAULT_SETTINGS: UserSettings = {
    openNewTab: true
};
export const useUserSettings = () => {
    const [userSettings, setUserSettings] = useLocalStorage<UserSettings>("mubook-hon-user-settings", DEFAULT_SETTINGS);
    return {
        userSettings: userSettings,
        updateUserSettings: setUserSettings
    } as const;
};
