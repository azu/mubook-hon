// one time read and clear using session storage
export const useOnetimeStorage = () => {
    const set = (key: string, value: unknown) => {
        sessionStorage.setItem(key, JSON.stringify(value));
    };
    const get = (key: string): null | any => {
        const value = sessionStorage.getItem(key);
        if (value === null) {
            return null;
        }
        sessionStorage.removeItem(key);
        return JSON.parse(value);
    };
    return { set, get } as const;
};
