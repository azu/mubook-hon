# Import

## Usage

1. https://mubook-hon.vercel.app/import
2. Create import object
3. Paste to textarea
4. "Import"

## Kindle

1. Visit https://read.amazon.co.jp/notebook
2. Excute following code in console

```Js
(async function (){ 
    const { parsePage, toMarkdown } = await import('https://esm.sh/kindle-highlight-to-markdown');
    const o = parsePage(window); // JSON Object
    const result =  {
        fileId: o.asin,
        fileName: o.title,
        title: o.title,
        currentPage: 0,
        totalPage: 0,
        publisher: "",
        authors: o.author.split(/[、,]/),
        memos: o.annotations.map(annotation => {
            return {
                memo: annotation.highlight,
                currentPage: annotation.locationNumber,
                marker: { locationNumber: annotation.locationNumber }
            }
        })
    };
    console.log(result); // Copy to clipboard
})()
```
