/**
 * Check if the app is running in PWA standalone mode
 */
export function isPWAStandaloneMode(): boolean {
    if (typeof window === "undefined") return false;
    return (
        // Safari iOS: ホーム画面から起動した場合
        ("standalone" in navigator && (navigator as Navigator & { standalone: boolean }).standalone) ||
        // W3C標準: PWAとしてインストール起動時
        window.matchMedia("(display-mode: standalone)").matches ||
        // フルスクリーンPWA
        window.matchMedia("(display-mode: fullscreen)").matches
    );
}
