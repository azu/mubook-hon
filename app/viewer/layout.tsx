import "../global.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <head>
                <title>mu-book-hon</title>
            </head>
            <body className={"full-app"}>{children}</body>
        </html>
    );
}
