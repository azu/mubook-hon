// one time read and clear using session storage
import { useCallback } from "react";

export const useOnetimeStorage = () => {
    const set = useCallback((key: string, value: unknown) => {
        sessionStorage.setItem(key, JSON.stringify(value));
    }, []);
    const get = useCallback((key: string): null | any => {
        const value = sessionStorage.getItem(key);
        if (value === null) {
            return null;
        }
        return JSON.parse(value);
    }, []);
    const del = useCallback((key: string) => {
        sessionStorage.removeItem(key);
    }, []);
    return { set, get, del } as const;
};
