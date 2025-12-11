import nextConfig from "eslint-config-next";

const config = [
    {
        ignores: [
            "**/*.test.ts",
            "**/*.test.tsx",
            "__tests__/**",
            ".next/**",
            "node_modules/**",
            "public/**",
            "playwright-report/**"
        ]
    },
    ...nextConfig
];

export default config;
