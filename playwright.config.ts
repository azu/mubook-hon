import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./app",
    testMatch: "**/*.play.ts",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI ? [["github"], ["blob", { outputDir: "playwright-blob-report" }]] : "html",
    outputDir: "playwright-results",
    use: {
        baseURL: "http://localhost:3000",
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
        video: process.env.CI ? "retain-on-failure" : "off"
    },
    // CI環境でのタイムアウト設定
    globalTimeout: process.env.CI ? 10 * 60 * 1000 : undefined, // 10分
    timeout: process.env.CI ? 60 * 1000 : 30 * 1000, // テスト1つあたり60秒/30秒

    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] }
        }
        // その他のブラウザは必要に応じてコメントアウト
        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },
        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },
    ],

    webServer: {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI
    }
});
