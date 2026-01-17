/**
 * Check if the app is running in PWA standalone mode
 * (installed to home screen and launched as a standalone app)
 */
export function isPWAStandaloneMode(): boolean {
    if (typeof window === "undefined") return false;
    return (
        // Safari iOS: launched from home screen
        ("standalone" in navigator && (navigator as Navigator & { standalone: boolean }).standalone) ||
        // W3C standard: installed PWA launch
        window.matchMedia("(display-mode: standalone)").matches ||
        // Fullscreen PWA
        window.matchMedia("(display-mode: fullscreen)").matches
    );
}
