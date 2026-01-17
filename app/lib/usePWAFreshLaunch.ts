"use client";
import { useState, useEffect } from "react";
import { isPWAStandaloneMode } from "./pwa";

const SESSION_KEY = "mubook-hon-pwa-session-active";

/**
 * Hook to detect if this is a fresh PWA launch (not an in-app navigation)
 *
 * Uses sessionStorage to distinguish between:
 * - Fresh PWA launch: sessionStorage is empty → returns true, sets flag
 * - In-app navigation back to TOP: sessionStorage has flag → returns false
 * - PWA closed and reopened: sessionStorage is cleared → returns true
 * - Browser access (non-PWA): returns false (PWA check fails)
 */
export const usePWAFreshLaunch = (): boolean => {
    const [isFreshLaunch, setIsFreshLaunch] = useState(false);

    useEffect(() => {
        // Skip if not PWA mode
        if (!isPWAStandaloneMode()) return;

        // Check session flag
        const hasFlag = sessionStorage.getItem(SESSION_KEY);

        if (!hasFlag) {
            // No flag = fresh launch
            setIsFreshLaunch(true);
            sessionStorage.setItem(SESSION_KEY, "true");
        }
        // Has flag = in-app navigation (do nothing)
    }, []);

    return isFreshLaunch;
};
