/**
 * 表示確認用のサンプルEPUBをブラウザ上で組み立てる。
 *
 * 本文はこのリポジトリのために書いた文章で、外部の著作物は含まない。
 * EPUBはZIPなので、圧縮なし（STORE）の最小限のZIPライタで作る。
 */

export type SampleWritingMode = "vertical" | "horizontal";

type ZipEntry = { name: string; data: Uint8Array };

const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        table[n] = c >>> 0;
    }
    return table;
})();

const crc32 = (data: Uint8Array): number => {
    let crc = 0xffffffff;
    for (let i = 0; i < data.length; i++) {
        crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
};

/**
 * 圧縮なしのZIPを作る。EPUBの仕様どおり、最初のエントリは mimetype にする。
 */
export const createStoredZip = (entries: ZipEntry[]): Uint8Array => {
    const encoder = new TextEncoder();
    const localParts: Uint8Array[] = [];
    const centralParts: Uint8Array[] = [];
    let offset = 0;
    for (const entry of entries) {
        const nameBytes = encoder.encode(entry.name);
        const crc = crc32(entry.data);
        const size = entry.data.length;

        const local = new DataView(new ArrayBuffer(30));
        local.setUint32(0, 0x04034b50, true); // local file header signature
        local.setUint16(4, 20, true); // version needed to extract
        local.setUint16(6, 0x0800, true); // UTF-8 file name
        local.setUint16(8, 0, true); // STORE
        local.setUint16(10, 0, true); // mod time
        local.setUint16(12, 0x21, true); // mod date (1980-01-01)
        local.setUint32(14, crc, true);
        local.setUint32(18, size, true);
        local.setUint32(22, size, true);
        local.setUint16(26, nameBytes.length, true);
        local.setUint16(28, 0, true); // extra field length
        localParts.push(new Uint8Array(local.buffer), nameBytes, entry.data);

        const central = new DataView(new ArrayBuffer(46));
        central.setUint32(0, 0x02014b50, true); // central directory signature
        central.setUint16(4, 20, true); // version made by
        central.setUint16(6, 20, true); // version needed
        central.setUint16(8, 0x0800, true);
        central.setUint16(10, 0, true);
        central.setUint16(12, 0, true);
        central.setUint16(14, 0x21, true);
        central.setUint32(16, crc, true);
        central.setUint32(20, size, true);
        central.setUint32(24, size, true);
        central.setUint16(28, nameBytes.length, true);
        central.setUint16(30, 0, true); // extra
        central.setUint16(32, 0, true); // comment
        central.setUint16(34, 0, true); // disk number
        central.setUint16(36, 0, true); // internal attrs
        central.setUint32(38, 0, true); // external attrs
        central.setUint32(42, offset, true); // local header offset
        centralParts.push(new Uint8Array(central.buffer), nameBytes);

        offset += 30 + nameBytes.length + size;
    }
    const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); // end of central directory signature
    end.setUint16(8, entries.length, true);
    end.setUint16(10, entries.length, true);
    end.setUint32(12, centralSize, true);
    end.setUint32(16, offset, true);

    const parts = [...localParts, ...centralParts, new Uint8Array(end.buffer)];
    const total = parts.reduce((sum, part) => sum + part.length, 0);
    const out = new Uint8Array(total);
    let pos = 0;
    for (const part of parts) {
        out.set(part, pos);
        pos += part.length;
    }
    return out;
};

type Chapter = { title: string; paragraphs: string[] };

// 縦書きで確認したい要素（ルビ、縦中横、傍点、約物、欧文混じり、長い段落）を含む自作の文章
const CHAPTERS: Chapter[] = [
    {
        title: "第一章　朝の駅",
        paragraphs: [
            '午前<span class="tcy">7</span>時<span class="tcy">12</span>分、駅のホームにはまだ人がまばらだった。改札を抜けた<ruby>小春<rt>こはる</rt></ruby>は、いつものようにベンチの端に腰を下ろし、鞄から薄い文庫本を取り出した。',
            "「今日は少し寒いね」と、隣の席に座った老人が言った。小春はうなずき、手袋をはめ直した。吐く息が白く、線路の向こうの空はまだ<ruby>藍色<rt>あいいろ</rt></ruby>を残している。",
            '電車が来るまでの数分間、ページをめくる指先だけが動いていた。物語の主人公は、ちょうど長い旅に出るところだった。地図も持たず、ただ<em class="dot">北へ</em>向かうと決めて。',
            "発車ベルが鳴る。小春は本を閉じ、栞の位置を確かめた。続きは帰りの電車で読めばいい――そう思えることが、毎日の小さな楽しみだった。"
        ]
    },
    {
        title: "第二章　図書室",
        paragraphs: [
            "放課後の図書室は、ストーブの音と紙をめくる音だけが聞こえる静かな場所だった。窓際の机には、誰かが置き忘れた<ruby>万年筆<rt>まんねんひつ</rt></ruby>がひとつ転がっている。",
            "司書の先生は、返却された本を一冊ずつ確かめながら棚に戻していく。背表紙を指でなぞり、番号の順に並べる手つきは、まるで楽器を弾いているようだった。",
            '「探している本があるなら、聞いてくれればいいのに」先生はそう言って笑った。小春は少し迷ってから、メモに書いた書名を差し出した。<span class="tcy">2024</span>年に出た、星の名前についての本だ。',
            '棚の一番上、手の届かない場所にその本はあった。先生が踏み台に乗って取ってくれる。表紙には、夜空に浮かぶ小さな星座が<em class="dot">金色</em>で描かれていた。',
            "借りた本を胸に抱えて廊下に出ると、夕日が床を長く照らしていた。足音がやけに大きく響く。小春はなぜか急ぎ足になり、昇降口まで一度も振り返らなかった。"
        ]
    },
    {
        title: "第三章　夜の観測",
        paragraphs: [
            "その夜、小春はベランダに出て空を見上げた。街の明かりが強く、見える星は数えるほどしかない。それでも、本で覚えたばかりの<ruby>夏の大三角<rt>なつのだいさんかく</rt></ruby>を探すには十分だった。",
            'ベガ、アルタイル、デネブ。三つの名前を口の中で繰り返す。本によれば、ベガの光は約<span class="tcy">25</span>年前に星を出たものだという。今見ている光は、自分が生まれるよりずっと前のものなのだ。',
            "ノートに星の位置を描き写していると、母が温かい飲み物を持ってきてくれた。「風邪をひかないようにね」湯気の向こうで、月が少しずつ高く昇っていく。",
            '観測の記録は、日付と時刻、天気、見えた星の数を書くことにした。<span class="tcy">11</span>月<span class="tcy">14</span>日、晴れ、見えた星は<span class="tcy">9</span>つ。たったそれだけの記録が、なぜか誇らしく思えた。',
            "部屋に戻っても、目を閉じるとまぶたの裏に星の形が浮かんでいた。明日は図書室で、もう一冊借りてみよう。今度は、遠い国の人々が星をどう呼んでいたかについての本を。"
        ]
    },
    {
        title: "第四章　長い段落の確認",
        paragraphs: [
            'この章は、ページの端や余白の具合を確かめるために、わざと長い段落を続けています。一行の長さ、行と行の間隔、ページの上下と左右の余白、そして画面の切り欠きや角の丸みに文字がかからないかどうかを、実機で確かめることが目的です。文章そのものに大きな意味はありませんが、句読点や括弧（このような丸括弧や、「かぎ括弧」、『二重かぎ括弧』）がどの位置に来ても読みやすく並ぶかどうかも見ておきたいところです。数字の<span class="tcy">10</span>や<span class="tcy">99</span>は縦中横で、<span class="tcy">100</span>以上の数字やEPUB、iPhone、Webのような欧文はそのまま横に寝かせて表示されます。',
            "ページをめくったときに、前のページの最後の行と次のページの最初の行がきちんとつながっているかも確認してください。画面を回転させたり、折りたたみの端末を開いたり閉じたりしたあとでも、本文が途中で切れたり、余白が片側だけ広くなったりしないことが望ましいです。もし表示が崩れていたら、そのときの画面の向き、端末の開き方、文字の大きさの設定を記録しておくと、原因を探す手がかりになります。",
            "ここから先は、同じような文章がしばらく続きます。読み飛ばしてかまいません。春の終わりには雨が多く、夏の初めには風が強く、秋の半ばには空が高く、冬の始まりには朝が遅くなります。季節が変わるたびに、図書室の窓から見える景色も少しずつ変わっていきます。校庭の桜の木は、春には花を、夏には濃い緑の葉を、秋には赤や黄色の落ち葉を、冬には細い枝だけを見せてくれます。",
            "最後の段落です。ここまで読んでくださってありがとうございました。表示に気になるところがあれば、スクリーンショットと一緒に、どの端末のどの向きで見たかを書き残しておいてください。"
        ]
    }
];

const escapeXml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const buildStyle = (mode: SampleWritingMode) => `@charset "utf-8";
html {
    ${
        mode === "vertical"
            ? "writing-mode: vertical-rl;\n    -webkit-writing-mode: vertical-rl;\n    -epub-writing-mode: vertical-rl;"
            : "writing-mode: horizontal-tb;"
    }
    font-family: serif;
}
h1 { font-size: 1.4em; margin-block-end: 2em; }
p { text-indent: 1em; margin: 0; }
.tcy { text-combine-upright: all; -webkit-text-combine: horizontal; -epub-text-combine: horizontal; }
.dot { font-style: normal; text-emphasis-style: filled sesame; -webkit-text-emphasis-style: filled sesame; }
`;

const buildChapterXhtml = (chapter: Chapter) => `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="ja" lang="ja">
<head>
<meta charset="UTF-8" />
<title>${escapeXml(chapter.title)}</title>
<link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
<h1>${escapeXml(chapter.title)}</h1>
${chapter.paragraphs.map((p) => `<p>${p}</p>`).join("\n")}
</body>
</html>
`;

export const SAMPLE_BOOK_TITLE: Record<SampleWritingMode, string> = {
    vertical: "表示確認用サンプル（縦書き）",
    horizontal: "表示確認用サンプル（横書き）"
};

/**
 * サンプルEPUBを作る。
 */
export const createSampleEpub = (mode: SampleWritingMode): Blob => {
    const encoder = new TextEncoder();
    const title = SAMPLE_BOOK_TITLE[mode];
    const chapterFiles = CHAPTERS.map((chapter, index) => ({
        id: `chapter${index + 1}`,
        href: `chapter${index + 1}.xhtml`,
        chapter
    }));
    const nav = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="ja" lang="ja">
<head><meta charset="UTF-8" /><title>目次</title><link rel="stylesheet" type="text/css" href="style.css" /></head>
<body>
<nav epub:type="toc" id="toc">
<h1>目次</h1>
<ol>
${chapterFiles.map((f) => `<li><a href="${f.href}">${escapeXml(f.chapter.title)}</a></li>`).join("\n")}
</ol>
</nav>
</body>
</html>
`;
    const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid" xml:lang="ja">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="bookid">urn:mubook-hon:viewer-demo:${mode}</dc:identifier>
<dc:title>${escapeXml(title)}</dc:title>
<dc:creator>mubook-hon</dc:creator>
<dc:language>ja</dc:language>
<meta property="dcterms:modified">2026-01-01T00:00:00Z</meta>
</metadata>
<manifest>
<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" />
<item id="style" href="style.css" media-type="text/css" />
${chapterFiles.map((f) => `<item id="${f.id}" href="${f.href}" media-type="application/xhtml+xml" />`).join("\n")}
</manifest>
<spine page-progression-direction="${mode === "vertical" ? "rtl" : "ltr"}">
${chapterFiles.map((f) => `<itemref idref="${f.id}" />`).join("\n")}
</spine>
</package>
`;
    const container = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles>
<rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" />
</rootfiles>
</container>
`;
    const entries: ZipEntry[] = [
        { name: "mimetype", data: encoder.encode("application/epub+zip") },
        { name: "META-INF/container.xml", data: encoder.encode(container) },
        { name: "OEBPS/content.opf", data: encoder.encode(opf) },
        { name: "OEBPS/nav.xhtml", data: encoder.encode(nav) },
        { name: "OEBPS/style.css", data: encoder.encode(buildStyle(mode)) },
        ...chapterFiles.map((f) => ({
            name: `OEBPS/${f.href}`,
            data: encoder.encode(buildChapterXhtml(f.chapter))
        }))
    ];
    const zip = createStoredZip(entries);
    return new Blob([zip.buffer as ArrayBuffer], { type: "application/epub+zip" });
};
