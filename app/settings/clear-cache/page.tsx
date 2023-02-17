"use client";
import { useEffect, useState } from "react";

export default function Page() {
    const [isMigrating, setIsMigrating] = useState(false);
    useEffect(() => {
        async function main() {
            try {
                window.indexedDB.databases().then((r) => {
                    for (let i = 0; i < r.length; i++) {
                        // @ts-ignore
                        window.indexedDB.deleteDatabase(r[i].name);
                    }
                });
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
