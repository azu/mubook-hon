import "./global.css"

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html>
        <head>
            <title>mu-book-hon</title></head>
        <body>{children}</body>
        </html>
    )
}
