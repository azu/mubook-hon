import { useState, useCallback, useEffect } from "react";

type Options<T> = {
    defaultValue: T;
};

export function useLocalStorage<T>(key: string, options: Options<T>) {
    // Get from local storage then
    // parse stored json or return defaultValue
    const readValue = useCallback((): T => {
        if (typeof window === "undefined") {
            return options.defaultValue as T;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : (options.defaultValue as T);
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return options.defaultValue as T;
        }
    }, [options.defaultValue, key]);

    const [storedValue, setStoredValue] = useState<T>(readValue);

    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            if (typeof window === "undefined") {
                console.warn(`Tried setting localStorage key "${key}" even though environment is not a client`);
                return;
            }

            try {
                // Allow value to be a function so we have the same API as useState
                const newValue = value instanceof Function ? value(storedValue) : value;

                // Save to local storage
                window.localStorage.setItem(key, JSON.stringify(newValue));

                // Save state
                setStoredValue(newValue);
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, storedValue]
    );

    const removeValue = useCallback(() => {
        if (typeof window === "undefined") {
            console.warn(`Tried removing localStorage key "${key}" even though environment is not a client`);
            return;
        }

        try {
            window.localStorage.removeItem(key);
            setStoredValue(options.defaultValue as T);
        } catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, options.defaultValue]);

    useEffect(() => {
        setStoredValue(readValue());
    }, [readValue]);

    return {
        value: storedValue,
        set: setValue,
        remove: removeValue
    };
}
