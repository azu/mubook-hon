# mubook-hon

epub reader + Notion Sync + Memo.

![img.png](img.png)

## Usage

- WebSite: <https://mubook-hon.vercel.app/>
- Document: <https://efcl.notion.site/mubook-hon-addce6c324d44d749a73748f92e3a1a6>

You need to set up Notion before using memo features.

## Features

- Read epub files on Dropbox
- Add memo to Notion with selected text
- Manage book list in Notion

## supported format

- [x] epub
  - bibi
- [ ] pdf
  - pdf.js

## Privacy

- Request/Response to Dropbox: No Proxy
- Request/Response to Notion: CORS Proxy
  - Notion API does not support CORS
  - The default CORS Proxy use defined in [pages/api/notion-proxy](pages/api/notion-proxy)
  - You can override it by `localStorage.setItem("USER_DEFINED_NOTION_BASE_URL", "https://your-proxy.test/")`

## LICENSE

MIT (c) azu

This project includes [Bibi](https://bibi.epub.link/).
[Bibi](https://bibi.epub.link/) is licensed under the [MIT License](https://github.com/satorumurmur/bibi/blob/master/LICENSE)

## Acknowledgements

- [Bibi](https://bibi.epub.link/)
