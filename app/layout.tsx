import "./global.css";
import "./sakura.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "mubook-hon",
    description: "mubook-hon is a web-based epub/pdf reader",
    manifest: "/manifest.json",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/icons/apple-touch-icon.png"
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <head></head>
            <body>{children}</body>
        </html>
    );
}
