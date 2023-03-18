# Import

## Kindle

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
