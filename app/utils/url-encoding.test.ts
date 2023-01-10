import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fromCodeSequence, toCodeSequence } from "./url-encoding";

const TEST_DATA = [
    "",
    "1234567890-=!@#$%^&*()_+[]\\{}|;':\",./<>?",
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん",
    "竹取物語は、日本最古の物語といわれる。9世紀後半から10世紀前半頃に成立したとされ、かなによって書かれた最初期の物語の一つとされています。",
    "👍👎👏👀👁️👂👃👄👅👆👇👈👉👊👋👌👍👎👏👐👑👒👓👔👕👖👗👘👙👚👛👜👝👞👟👠👡👢👣👤👥👦👧👨👩👪👫👬👭👮👯👰👱👲👳👴👵👶👷👸👹👺👻👼👽👾👿💀💁💂💃💄💅💆💇💈💉💊💋💌💍💎💏💐💑💒💓💔💕💖💗💘💙💚💛💜💝💞💟💠💡💢💣💤💥💦💧💨💩💪💫💬💭💮💯💰💱💲💳💴💵💶💷💸💹💺💻💼💽💾💿📀📁📂📃📄📅📆📇📈📉📊📋📌📍📎📏📐📑📒📓📔📕📖📗📘📙📚📛📜📝📞📟📠📡📢📣📤📥📦📧📨📩📪📫📬📭📮📯📰📱📲📳📴📵📶📷📸"
];
describe("encode/decode", function () {
    for (const str of TEST_DATA) {
        it(`should decode(encode(${str})) === ${str}"`, () => {
            assert.strictEqual(fromCodeSequence(toCodeSequence(str)), str);
        });
    }
});
