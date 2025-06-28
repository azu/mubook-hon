# mubook-hon

[![mubook-hon](https://mubook-hon.vercel.app/icons/icon-256x256.png)](https://mubook-hon.vercel.app)

mubook-hon is epub/PDF reader + Notion Sync + Memo.

![viewer: Ruth A. Shapiro, Manisha Mirchandani and Heesu Jang Pragmatic Philanthropy Asian Charity Explained - CC BY](docs/epub.png)

> epub viewer by [Bibi](https://bibi.epub.link/)

![viewer: Pro Git book - CC BY-NC-SA 3.0](docs/pdf.png)

> PDF viewer by [PDF.js](https://mozilla.github.io/pdf.js/)

![notion-database.png](docs/notion-database.png)

> Notion Database is created by mubook-hon

![Notion Book Page](docs/notion-book-page.png)

> You can write memo to Notion

## Usage

- WebSite: <https://mubook-hon.vercel.app/>
- Document: <https://efcl.notion.site/mubook-hon-addce6c324d44d749a73748f92e3a1a6>

You need to set up Notion before using memo features.

## Features

- Read epub/PDF files on Dropbox
- Support cross browser - Mobile and PC
- Sync progress using Notion on cross devices
- Add memo to Notion with selected text
- Manage book list in Notion

## Development

### Testing

This project uses Playwright for end-to-end testing with a modern test architecture:

- **Test Location**: Tests are colocated with their corresponding page files in the `app/` directory
- **Test Pattern**: `**/*.play.ts` files contain the tests
- **Architecture**: Uses Playwright Route API instead of MSW for better test isolation
- **Fake Utilities**: Shared test utilities are located in `app/_fake/` directory

#### Running Tests

```bash
# Run all tests
npx playwright test

# Run tests for a specific page
npx playwright test app/page.play.ts

# Run tests with UI mode
npx playwright test --ui

# Run tests in headed mode (visible browser)
npx playwright test --headed

# CI用にblobレポートで実行
npm run test:playwright:ci
```

#### CI/CD

このプロジェクトはGitHub Actionsを使用してCIを実行します:

- **typecheck**: TypeScriptの型チェック
- **build**: Next.jsのビルド
- **playwright-tests**: Playwrightテストを並列実行（2シャード）
- **merge-reports**: テスト結果をマージしてHTMLレポートを生成

CI実行結果は以下で確認できます:
- テスト結果: GitHub ActionsのSummaryページ
- 詳細レポート: ActionsのArtifactsからHTML reportをダウンロード
- スクリーンショット・動画: テスト失敗時にArtifactsに保存

#### Test Structure

- `app/_fake/types.ts` - Type definitions for test data
- `app/_fake/dropbox-fake.ts` - Dropbox API mocking utilities
- `app/_fake/notion-fake.ts` - Notion API mocking utilities  
- `app/_fake/test-utils.ts` - Common test utilities and setup functions
- `app/**/*.play.ts` - Test files for each page/component

#### Test Architecture Benefits

- **Isolation**: Each test has its own mock setup, no interference between tests
- **Parallelization**: Tests run fully parallel for better performance
- **Type Safety**: Full TypeScript support with proper type checking
- **Maintainability**: Tests are colocated with source code for easy maintenance
- **Flexibility**: Easy to create different test scenarios for each page

## supported format

- [x] epub
  - [Bibi](https://bibi.epub.link/)
- [x] pdf
  - [PDF.js](https://mozilla.github.io/pdf.js/) + [react-pdf-viewer](https://react-pdf-viewer.dev/)(use developer license)

## Application mode

You can use <https://mubook-hon.vercel.app/> as PWA apps.

- [Add & open Chrome apps - Chrome Web Store Help](https://support.google.com/chrome_webstore/answer/3060053?hl=en)
- [Add to Home screen - Progressive web apps (PWAs) | MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen)

## Shortcut Keys

- <kbd>Shift + A</kbd>: Add memo to Stock
- <kbd>Shift + S</kbd>: Save memo to Notion

## Privacy Notices

- Request/Response to Dropbox: No Proxy
- Request/Response to Notion: CORS Proxy
  - Notion API does not support CORS
  - The default CORS Proxy is defined in [pages/api/notion-proxy](pages/api/notion-proxy)
  - You can override it by `localStorage.setItem("USER_DEFINED_NOTION_BASE_URL", "https://your-proxy.test/")`

## LICENSE

MIT (c) azu

This project includes [Bibi](https://bibi.epub.link/).
[Bibi](https://bibi.epub.link/) is licensed under the [MIT License](https://github.com/satorumurmur/bibi/blob/master/LICENSE)

## Acknowledgements

- [Bibi](https://bibi.epub.link/)
