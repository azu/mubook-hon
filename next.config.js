/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: false,
    webpack: (config) => {
        // Avoid: Can't resolve 'canvas'
        config.externals.push({
            canvas: "canvas"
        });

        // Fix MSW browser imports in production build
        config.resolve = {
            ...config.resolve,
            conditionNames: ['browser', 'import', 'require', 'node', 'default', '...']
        };

        return config;
    }
};
