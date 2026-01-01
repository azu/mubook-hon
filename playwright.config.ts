import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./app",
    testMatch: "**/*.play.ts",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI ? [["github"], ["blob", { outputDir: "playwright-blob-report" }]] : "list",
    outputDir: "playwright-results",
    use: {
        baseURL: "http://localhost:3000",
        // ヘッドレスモードを強制（デバッグ時は false に変更）
        headless: true,
        // 失敗時に保存されるデータの設定
        // screenshotは必ずreporterに入る
        screenshot: "on",
        // Record trace only when retrying a test for the first time. See https://playwright.dev/docs/trace-viewer
        // traceは必ずreporterに入るが、成功したテストには残らない
        trace: "retain-on-failure",
        // Record video only when retrying a test for the first time.
        // videは必ずreporterに入る
        video: "on"
    },
    // CI環境でのタイムアウト設定
    globalTimeout: process.env.CI ? 10 * 60 * 1000 : undefined, // 10分
    timeout: process.env.CI ? 60 * 1000 : 30 * 1000, // テスト1つあたり60秒/30秒
    expect: {
        timeout: process.env.CI ? 30 * 1000 : 15 * 1000 // expect timeout: CI 30秒 / ローカル 15秒
    },

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
        command: "pnpm run dev:next",
        port: 3000,
        reuseExistingServer: true
    }
});
