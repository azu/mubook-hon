/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: false,
    runtime: "edge",
    experimental: {
        appDir: true
    },
    webpack: (config) => {
        // Avoid: Can't resolve 'canvas'
        config.externals.push({
            canvas: "canvas"
        });
        return config;
    }
};
