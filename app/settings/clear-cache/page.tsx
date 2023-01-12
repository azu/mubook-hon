"use client";
import { useEffect, useState } from "react";
import { openDB } from "idb";

export default function Page() {
    const [isMigrating, setIsMigrating] = useState(false);
    useEffect(() => {
        async function main() {
            try {
                setIsMigrating(true);
                const db = await openDB("mubook-hon", 1, {
                    upgrade(db) {
                        db.createObjectStore("mubook-book");
                    }
                });
                await db.clear("mubook-book");
            } catch (error: any) {
                console.error(error);
                alert(error.message);
            } finally {
                setIsMigrating(false);
            }
        }
        main();
    }, []);
    return <div className={"main"}>{isMigrating ? "Clearing..." : "Cleared"}</div>;
}
