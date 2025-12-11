"use client";
import { useState, useEffect } from "react";
import type { Cache, State } from "swr";

type CacheEntry<Data = unknown> = {
    state: State<Data>;
    timestamp: number;
};

const openDB = (dbName: string, storeName: string): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName);
            }
        };
    });
};

const createIDBCache = <Data = unknown>(db: IDBDatabase, storeName: string): Cache<Data> => {
    const memoryCache = new Map<string, CacheEntry<Data>>();

    // Load all data from IndexedDB into memory cache
    const loadFromDB = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.openCursor();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    memoryCache.set(cursor.key as string, cursor.value as CacheEntry<Data>);
                    cursor.continue();
                } else {
                    resolve();
                }
            };
        });
    };

    const saveToDB = (key: string, value: CacheEntry<Data>): void => {
        try {
            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            store.put(value, key);
        } catch (e) {
            console.error("Failed to save to IndexedDB:", e);
        }
    };

    const deleteFromDB = (key: string): void => {
        try {
            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            store.delete(key);
        } catch (e) {
            console.error("Failed to delete from IndexedDB:", e);
        }
    };

    // Initialize by loading from DB
    loadFromDB().catch((e) => console.error("Failed to load from IndexedDB:", e));

    return {
        get(key: string): State<Data> | undefined {
            const entry = memoryCache.get(key);
            return entry?.state;
        },
        set(key: string, value: State<Data>): void {
            const entry: CacheEntry<Data> = {
                state: value,
                timestamp: Date.now()
            };
            memoryCache.set(key, entry);
            saveToDB(key, entry);
        },
        delete(key: string): void {
            memoryCache.delete(key);
            deleteFromDB(key);
        },
        keys(): IterableIterator<string> {
            return memoryCache.keys();
        }
    };
};

type UseIDBCacheProviderOptions = {
    dbName: string;
    storeName: string;
};

export const useIDBCacheProvider = <Data = unknown>(options: UseIDBCacheProviderOptions): Cache<Data> | undefined => {
    const [cache, setCache] = useState<Cache<Data>>();

    useEffect(() => {
        let mounted = true;

        openDB(options.dbName, options.storeName)
            .then((db) => {
                if (mounted) {
                    setCache(createIDBCache<Data>(db, options.storeName));
                }
            })
            .catch((e) => {
                console.error("Failed to open IndexedDB:", e);
            });

        return () => {
            mounted = false;
        };
    }, [options.dbName, options.storeName]);

    return cache;
};
