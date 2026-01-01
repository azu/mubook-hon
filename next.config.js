/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: false,
    // Static Export: API RoutesはCloudflare Workersに移行したため不要
    output: "export",
    // Turbopack configuration (Next.js 16+ default bundler)
    turbopack: {}
};
