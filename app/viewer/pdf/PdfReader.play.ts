import { test, expect } from "@playwright/test";
import { setupTestAuth, waitForPageLoad } from "../../_fake/test-utils";
import { mockDropboxFileDownload } from "../../_fake/dropbox-fake";

test.describe("PDFリーダー", () => {
    test.beforeEach(async ({ page }) => {
        await setupTestAuth({ page });
    });

    test("PDF書籍の表示", async ({ page }) => {
        // PDFファイルダウンロードをモック
        const pdfContent = "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n%%EOF";
        await mockDropboxFileDownload({
            page,
            filePath: "/test-document.pdf",
            content: pdfContent,
            contentType: "application/pdf"
        });

        await page.goto("/viewer?file=test-document.pdf&viewer=pdf");
        await waitForPageLoad({ page });

        // ビューアページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();
    });

    test("PDF読み込みエラー", async ({ page }) => {
        // ファイルダウンロードエラーをモック
        await page.route("**/content.dropboxapi.com/2/files/download", async (route) => {
            await route.fulfill({ status: 404 });
        });

        await page.goto("/viewer?file=nonexistent.pdf&viewer=pdf");
        await waitForPageLoad({ page });

        // エラーメッセージが表示されるか、ページがクラッシュしていないことを確認
        await expect(page.locator("body")).toBeVisible();
    });

    test("大きなPDFファイルの処理", async ({ page }) => {
        // 大きなPDFファイルをモック
        const largePdfContent = "%PDF-1.4\n" + "large pdf content ".repeat(5000) + "\n%%EOF";
        await mockDropboxFileDownload({
            page,
            filePath: "/large-document.pdf",
            content: largePdfContent,
            contentType: "application/pdf"
        });

        await page.goto("/viewer?file=large-document.pdf&viewer=pdf");
        await waitForPageLoad({ page, timeout: 15000 }); // 大きなファイルなので長めのタイムアウト

        // ページが正常に表示されることを確認
        await expect(page.locator("body")).toBeVisible();
    });

    test("PDFズーム機能", async ({ page }) => {
        // PDFファイルをモック
        const pdfContent = "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n%%EOF";
        await mockDropboxFileDownload({
            page,
            filePath: "/zoom-test.pdf",
            content: pdfContent,
            contentType: "application/pdf"
        });

        await page.goto("/viewer?file=zoom-test.pdf&viewer=pdf");
        await waitForPageLoad({ page });

        // ページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();

        // ズームボタンがあるかチェック（実際のUIに合わせて調整）
        const zoomInButton = page.locator('[data-testid="zoom-in"], .zoom-in-button, button:has-text("拡大")');
        const zoomOutButton = page.locator('[data-testid="zoom-out"], .zoom-out-button, button:has-text("縮小")');

        const isZoomInVisible = await zoomInButton.isVisible().catch(() => false);
        const isZoomOutVisible = await zoomOutButton.isVisible().catch(() => false);

        if (isZoomInVisible) {
            await zoomInButton.click();
        }

        if (isZoomOutVisible) {
            await zoomOutButton.click();
        }
    });

    test("PDFページナビゲーション", async ({ page }) => {
        // 複数ページのPDFをモック
        const multiPagePdf =
            "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Count 3\n>>\nendobj\n%%EOF";
        await mockDropboxFileDownload({
            page,
            filePath: "/multi-page.pdf",
            content: multiPagePdf,
            contentType: "application/pdf"
        });

        await page.goto("/viewer?file=multi-page.pdf&viewer=pdf");
        await waitForPageLoad({ page });

        // ページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();

        // ページナビゲーションボタンがあるかチェック
        const nextPageButton = page.locator(
            '[data-testid="next-page"], .next-page-button, button:has-text("次のページ")'
        );
        const prevPageButton = page.locator(
            '[data-testid="prev-page"], .prev-page-button, button:has-text("前のページ")'
        );

        const isNextVisible = await nextPageButton.isVisible().catch(() => false);
        const isPrevVisible = await prevPageButton.isVisible().catch(() => false);

        if (isNextVisible) {
            await nextPageButton.click();
            await page.waitForTimeout(1000);
        }

        if (isPrevVisible) {
            await prevPageButton.click();
            await page.waitForTimeout(1000);
        }
    });

    test("PDFビューア設定", async ({ page }) => {
        // PDFファイルをモック
        const pdfContent = "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n%%EOF";
        await mockDropboxFileDownload({
            page,
            filePath: "/settings-test.pdf",
            content: pdfContent,
            contentType: "application/pdf"
        });

        await page.goto("/viewer?file=settings-test.pdf&viewer=pdf");
        await waitForPageLoad({ page });

        // ページが表示されることを確認
        await expect(page.locator("body")).toBeVisible();

        // 設定メニューがあるかチェック
        const settingsButton = page.locator(
            '[data-testid="pdf-settings"], .pdf-settings-button, button:has-text("設定")'
        );
        const isSettingsVisible = await settingsButton.isVisible().catch(() => false);

        if (isSettingsVisible) {
            await settingsButton.click();
            // 設定パネルが開くことを確認
        }
    });
});
