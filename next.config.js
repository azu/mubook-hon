/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: false,
    webpack: (config) => {
        // Avoid: Can't resolve 'canvas'
        config.externals.push({
            canvas: "canvas"
        });

        // Fix MSW browser imports in production build
        // See: https://mswjs.io/blog/introducing-msw-2.0
        // MSW 2.0 uses Node.js package exports conditions, we need to ensure
        // webpack resolves the browser exports correctly
        config.resolve = {
            ...config.resolve,
            conditionNames: ['browser', 'import', 'require', 'node', 'default', '...']
        };

        return config;
    }
};
