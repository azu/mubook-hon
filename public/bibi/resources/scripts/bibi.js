/*!
 *                                                                                                                          (℠)
 *  # Bibi | EPUB Reader on your website.
 *
 *  * Copyright (c) Satoru MATSUSHIMA - https://bibi.epub.link or https://github.com/satorumurmur/bibi
 *  * Licensed under the MIT License. - https://opensource.org/licenses/mit-license.php
 *
 *  * Including:
 *      - sML.js ... Copyright (c) Satoru MATSUSHIMA - https://github.com/satorumurmur/sML (Licensed under the MIT License.)
 *
 */
!function (e) {
    var t = {};
    
    function n(i) {
        if (t[i]) return t[i].exports;
        var o = t[i] = { i: i, l: !1, exports: {} };
        return e[i].call(o.exports, o, o.exports, n), o.l = !0, o.exports
    }
    
    n.m = e, n.c = t, n.d = function (e, t, i) {
        n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: i })
    }, n.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 })
    }, n.t = function (e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var i = Object.create(null);
        if (n.r(i), Object.defineProperty(i, "default", {
            enumerable: !0,
            value: e
        }), 2 & t && "string" != typeof e) for (var o in e) n.d(i, o, function (t) {
            return e[t]
        }.bind(null, o));
        return i
    }, n.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 28)
}({
    0: function (e, t) {
        function n(e) {
            return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            })(e)
        }
        
        var i;
        i = function () {
            return this
        }();
        try {
            i = i || new Function("return this")()
        } catch (e) {
            "object" === ("undefined" == typeof window ? "undefined" : n(window)) && (i = window)
        }
        e.exports = i
    }, 1: function (e, t, n) {
        "use strict";
        var i, o = function () {
            return void 0 === i && (i = Boolean(window && document && document.all && !window.atob)), i
        }, r = function () {
            var e = {};
            return function (t) {
                if (void 0 === e[t]) {
                    var n = document.querySelector(t);
                    if (window.HTMLIFrameElement && n instanceof window.HTMLIFrameElement) try {
                        n = n.contentDocument.head
                    } catch (e) {
                        n = null
                    }
                    e[t] = n
                }
                return e[t]
            }
        }(), a = {};
        
        function s(e, t, n) {
            for (var i = 0; i < t.length; i++) {
                var o = { css: t[i][1], media: t[i][2], sourceMap: t[i][3] };
                a[e][i] ? a[e][i](o) : a[e].push(g(o, n))
            }
        }
        
        function c(e) {
            var t = document.createElement("style"), i = e.attributes || {};
            if (void 0 === i.nonce) {
                var o = n.nc;
                o && (i.nonce = o)
            }
            if (Object.keys(i).forEach((function (e) {
                t.setAttribute(e, i[e])
            })), "function" == typeof e.insert) e.insert(t); else {
                var a = r(e.insert || "head");
                if (!a) throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
                a.appendChild(t)
            }
            return t
        }
        
        var l, u = (l = [], function (e, t) {
            return l[e] = t, l.filter(Boolean).join("\n")
        });
        
        function d(e, t, n, i) {
            var o = n ? "" : i.css;
            if (e.styleSheet) e.styleSheet.cssText = u(t, o); else {
                var r = document.createTextNode(o), a = e.childNodes;
                a[t] && e.removeChild(a[t]), a.length ? e.insertBefore(r, a[t]) : e.appendChild(r)
            }
        }
        
        function p(e, t, n) {
            var i = n.css, o = n.media, r = n.sourceMap;
            if (o ? e.setAttribute("media", o) : e.removeAttribute("media"), r && btoa && (i += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(r)))), " */")), e.styleSheet) e.styleSheet.cssText = i; else {
                for (; e.firstChild;) e.removeChild(e.firstChild);
                e.appendChild(document.createTextNode(i))
            }
        }
        
        var f = null, h = 0;
        
        function g(e, t) {
            var n, i, o;
            if (t.singleton) {
                var r = h++;
                n = f || (f = c(t)), i = d.bind(null, n, r, !1), o = d.bind(null, n, r, !0)
            } else n = c(t), i = p.bind(null, n, t), o = function () {
                !function (e) {
                    if (null === e.parentNode) return !1;
                    e.parentNode.removeChild(e)
                }(n)
            };
            return i(e), function (t) {
                if (t) {
                    if (t.css === e.css && t.media === e.media && t.sourceMap === e.sourceMap) return;
                    i(e = t)
                } else o()
            }
        }
        
        e.exports = function (e, t, n) {
            return (n = n || {}).singleton || "boolean" == typeof n.singleton || (n.singleton = o()), e = n.base ? e + n.base : e, t = t || [], a[e] || (a[e] = []), s(e, t, n), function (t) {
                if (t = t || [], "[object Array]" === Object.prototype.toString.call(t)) {
                    a[e] || (a[e] = []), s(e, t, n);
                    for (var i = t.length; i < a[e].length; i++) a[e][i]();
                    a[e].length = t.length, 0 === a[e].length && delete a[e]
                }
            }
        }
    }, 12: function (module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, "Bibi", (function () {
            return Bibi
        })), __webpack_require__.d(__webpack_exports__, "B", (function () {
            return B
        })), __webpack_require__.d(__webpack_exports__, "L", (function () {
            return L
        })), __webpack_require__.d(__webpack_exports__, "R", (function () {
            return R
        })), __webpack_require__.d(__webpack_exports__, "I", (function () {
            return I
        })), __webpack_require__.d(__webpack_exports__, "P", (function () {
            return P
        })), __webpack_require__.d(__webpack_exports__, "H", (function () {
            return H
        })), __webpack_require__.d(__webpack_exports__, "U", (function () {
            return U
        })), __webpack_require__.d(__webpack_exports__, "S", (function () {
            return S
        })), __webpack_require__.d(__webpack_exports__, "C", (function () {
            return C
        })), __webpack_require__.d(__webpack_exports__, "O", (function () {
            return O
        })), __webpack_require__.d(__webpack_exports__, "E", (function () {
            return E
        })), __webpack_require__.d(__webpack_exports__, "M", (function () {
            return M
        })), __webpack_require__.d(__webpack_exports__, "X", (function () {
            return X
        }));
        var _arguments = arguments;
        
        function _slicedToArray(e, t) {
            return _arrayWithHoles(e) || _iterableToArrayLimit(e, t) || _nonIterableRest()
        }
        
        function _nonIterableRest() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        }
        
        function _iterableToArrayLimit(e, t) {
            if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) {
                var n = [], i = !0, o = !1, r = void 0;
                try {
                    for (var a, s = e[Symbol.iterator](); !(i = (a = s.next()).done) && (n.push(a.value), !t || n.length !== t); i = !0) ;
                } catch (e) {
                    o = !0, r = e
                } finally {
                    try {
                        i || null == s.return || s.return()
                    } finally {
                        if (o) throw r
                    }
                }
                return n
            }
        }
        
        function _arrayWithHoles(e) {
            if (Array.isArray(e)) return e
        }
        
        function _defineProperty(e, t, n) {
            return t in e ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = n, e
        }
        
        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        
        function _possibleConstructorReturn(e, t) {
            return !t || "object" !== _typeof(t) && "function" != typeof t ? _assertThisInitialized(e) : t
        }
        
        function _assertThisInitialized(e) {
            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return e
        }
        
        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    writable: !0,
                    configurable: !0
                }
            }), t && _setPrototypeOf(e, t)
        }
        
        function _wrapNativeSuper(e) {
            var t = "function" == typeof Map ? new Map : void 0;
            return (_wrapNativeSuper = function (e) {
                if (null === e || !_isNativeFunction(e)) return e;
                if ("function" != typeof e) throw new TypeError("Super expression must either be null or a function");
                if (void 0 !== t) {
                    if (t.has(e)) return t.get(e);
                    t.set(e, n)
                }
                
                function n() {
                    return _construct(e, arguments, _getPrototypeOf(this).constructor)
                }
                
                return n.prototype = Object.create(e.prototype, {
                    constructor: {
                        value: n,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), _setPrototypeOf(n, e)
            })(e)
        }
        
        function isNativeReflectConstruct() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], (function () {
                }))), !0
            } catch (e) {
                return !1
            }
        }
        
        function _construct(e, t, n) {
            return (_construct = isNativeReflectConstruct() ? Reflect.construct : function (e, t, n) {
                var i = [null];
                i.push.apply(i, t);
                var o = new (Function.bind.apply(e, i));
                return n && _setPrototypeOf(o, n.prototype), o
            }).apply(null, arguments)
        }
        
        function _isNativeFunction(e) {
            return -1 !== Function.toString.call(e).indexOf("[native code]")
        }
        
        function _setPrototypeOf(e, t) {
            return (_setPrototypeOf = Object.setPrototypeOf || function (e, t) {
                return e.__proto__ = t, e
            })(e, t)
        }
        
        function _getPrototypeOf(e) {
            return (_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
                return e.__proto__ || Object.getPrototypeOf(e)
            })(e)
        }
        
        function _typeof(e) {
            return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                return typeof e
            } : function (e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            })(e)
        }
        
        function _toConsumableArray(e) {
            return _arrayWithoutHoles(e) || _iterableToArray(e) || _nonIterableSpread()
        }
        
        function _nonIterableSpread() {
            throw new TypeError("Invalid attempt to spread non-iterable instance")
        }
        
        function _iterableToArray(e) {
            if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) return Array.from(e)
        }
        
        function _arrayWithoutHoles(e) {
            if (Array.isArray(e)) {
                for (var t = 0, n = new Array(e.length); t < e.length; t++) n[t] = e[t];
                return n
            }
        }
        
        /*!
 *                                                                                                                          (℠)
 *  ## Bibi (heart) | Heart of Bibi.
 *
 */
        var Bibi = {
            version: "1.0.0", href: "https://bibi.epub.link", TimeOrigin: Date.now(), hello: function () {
                return new Promise((function (e) {
                    O.log.initialize(), O.log("Hello!", "<b:>"), O.log("[ja] ".concat(Bibi.href)), O.log("[en] https://github.com/satorumurmur/bibi"), e()
                })).then(Bibi.initialize).then(Bibi.loadExtensions).then(Bibi.ready).then(Bibi.getBookData).then(Bibi.loadBook).then(Bibi.bindBook).then(Bibi.openBook).catch((function (e) {
                    throw I.note(e, 99999999999, "ErrorOccured"), e
                }))
            }, initialize: function () {
                var e;
                if (O.Origin = location.origin || location.protocol + "//" + (location.host || location.hostname + (location.port ? ":" + location.port : "")), O.RequestedURL = location.href, O.BookURL = O.Origin + location.pathname + location.search, O.contentWindow = window, O.contentDocument = document, O.HTML = document.documentElement, O.Head = document.head, O.Body = document.body, O.Info = document.getElementById("bibi-info"), O.Title = document.getElementsByTagName("title")[0], (e = O.HTML.classList).add.apply(e, _toConsumableArray(sML.Environments).concat(["Bibi", "welcome"])), (O.TouchOS = sML.OS.iOS || sML.OS.Android) && (O.HTML.classList.add("touch"), sML.OS.iOS && (O.Head.appendChild(sML.create("meta", {
                    name: "apple-mobile-web-app-capable",
                    content: "yes"
                })), O.Head.appendChild(sML.create("meta", {
                    name: "apple-mobile-web-app-status-bar-style",
                    content: "white"
                })))), Bibi.Dev && O.HTML.classList.add("dev"), Bibi.Debug && O.HTML.classList.add("debug"), O.HTML.classList.add("default-lang-" + (O.Language = function (e) {
                    navigator.languages instanceof Array && (e = e.concat(navigator.languages)), navigator.language && navigator.language != e[0] && e.unshift(navigator.language);
                    for (var t = e.length, n = 0; n < t; n++) {
                        var i = e[n].split ? e[n].split("-")[0] : "";
                        if ("ja" == i) return "ja";
                        if ("en" == i) break
                    }
                    return "en"
                }([]))), E.initialize(), O.Biscuits.initialize(), R.initialize(), I.initialize(), P.initialize(), H.initialize(), U.initialize(), S.initialize((function () {
                    return O.Embedded = function () {
                        if (window.parent == window) return O.HTML.classList.add("window-direct"), 0;
                        O.HTML.classList.add("window-embedded");
                        try {
                            if (location.host == parent.location.host || parent.location.href) return 1
                        } catch (e) {
                        }
                        return -1
                    }()
                }), (function () {
                    return O.FullscreenTarget = (e = function () {
                        if (0 == O.Embedded) return sML.Fullscreen.polyfill(window), O.HTML;
                        if (1 == O.Embedded) {
                            sML.Fullscreen.polyfill(window.parent);
                            try {
                                return window.parent.document.getElementById(S["parent-holder-id"]).Bibi.Frame
                            } catch (e) {
                            }
                        }
                    }() || null) && e.ownerDocument.fullscreenEnabled ? (O.HTML.classList.add("fullscreen-enabled"), e) : (O.HTML.classList.add("fullscreen-disabled"), null);
                    var e
                })), sML.UA.Trident && !(sML.UA.Trident[0] >= 7)) return I.note("Your Browser Is Not Compatible", 99999999999, "ErrorOccured"), O.error(I.Veil.byebye({
                    en: "<span>Sorry....</span> <span>Your Browser Is</span> <span>Not Compatible.</span>",
                    ja: "<span>大変申し訳ありません。</span> <span>お使いのブラウザでは、</span><span>動作しません。</span>"
                }));
                I.note('<span class="non-visual">Welcome!</span>'), O.WritingModeProperty = (t = getComputedStyle(O.HTML), /^(vertical|horizontal)-/.test(t["writing-mode"]) || sML.UA.Trident ? "writing-mode" : /^(vertical|horizontal)-/.test(t["-webkit-writing-mode"]) ? "-webkit-writing-mode" : /^(vertical|horizontal)-/.test(t["-epub-writing-mode"]) ? "-epub-writing-mode" : void 0);
                var t, n = O.Body.appendChild(sML.create("div", {
                    id: "bibi-style-checker",
                    innerHTML: " aAａＡあ亜　",
                    style: { width: "auto", height: "auto", left: "-1em", top: "-1em" }
                }));
                O.VerticalTextEnabled = n.offsetWidth < n.offsetHeight, O.DefaultFontSize = Math.min(n.offsetWidth, n.offsetHeight), n.style.fontSize = "0.01px", O.MinimumFontSize = Math.min(n.offsetWidth, n.offsetHeight), n.setAttribute("style", ""), n.innerHTML = "", I.Slider.Size = S["use-slider"] ? n.offsetWidth : 0, I.Menu.Height = S["use-menubar"] ? n.offsetHeight : 0, document.body.removeChild(n), O.Body.style.width = "101vw", O.Body.style.height = "101vh", O.Scrollbars = {
                    Width: window.innerWidth - O.HTML.offsetWidth,
                    Height: window.innerHeight - O.HTML.offsetHeight
                }, O.HTML.style.width = O.Body.style.width = "100%", O.Body.style.height = "", O.HTML.classList.toggle("book-full-height", S["use-full-height"]), O.HTML.classList.remove("welcome"), E.dispatch("bibi:initialized")
            }, loadExtensions: function () {
                return new Promise((function (e, t) {
                    var n = [], i = !1, o = !1;
                    S.book ? (O.isToBeExtractedIfNecessary(S.book) && (i = !0), "Zine" == B.Type && (o = !0)) : (S["accept-local-file"] || S["accept-blob-converted-data"]) && (i = o = !0), o && n.unshift("zine.js"), (i ? (S.book ? O.tryRangeRequest().then((function () {
                        return "on-the-fly"
                    })) : Promise.reject()).catch((function () {
                        return "at-once"
                    })).then((function (e) {
                        return n.unshift("extractor/" + e + ".js")
                    })) : Promise.resolve()).then((function () {
                        if (n.length && n.forEach((function (e) {
                            return S.extensions.unshift({ src: new URL("../../extensions/" + e, Bibi.Script.src).href })
                        })), 0 == S.extensions.length) return t();
                        O.log("Loading Extension".concat(S.extensions.length > 1 ? "s" : "", "..."), "<g:>");
                        !function t(n) {
                            X.load(S.extensions[n]).then((function (e) {
                            })).catch((function (e) {
                                O.log(e)
                            })).then((function () {
                                S.extensions[n + 1] ? t(n + 1) : e()
                            }))
                        }(0)
                    }))
                })).then((function () {
                    O.log("Extensions: %O", X.Extensions), O.log(X.Extensions.length ? "Loaded. (".concat(X.Extensions.length, " Extension").concat(X.Extensions.length > 1 ? "s" : "", ")") : "No Extension.", "</g>")
                })).catch((function () {
                    return !1
                }))
            }, ready: function () {
                return new Promise((function (e) {
                    O.HTML.classList.add("ready"), O.ReadiedURL = location.href, E.add("bibi:readied", e), E.dispatch("bibi:readied")
                })).then((function () {
                    O.HTML.classList.remove("ready")
                }))
            }, getBookData: function () {
                return S.book ? Promise.resolve({ BookData: S.book }) : S.BookDataElement ? Promise.resolve({
                    BookData: S.BookDataElement.innerText.trim(),
                    BookDataType: S.BookDataElement.getAttribute("data-bibi-book-mimetype")
                }) : S["accept-local-file"] ? new Promise((function (e) {
                    Bibi.getBookData.resolve = function (t) {
                        e(t), O.HTML.classList.remove("waiting-file")
                    }, O.HTML.classList.add("waiting-file")
                })) : Promise.reject("Tell me EPUB name via ".concat(O.Embedded ? "embedding tag" : "URI", "."))
            }, busyHerself: function () {
                return new Promise((function (e) {
                    O.Busy = !0, O.HTML.classList.add("busy"), O.HTML.classList.add("loading"), window.addEventListener(E.resize, R.resetBibiHeight), Bibi.busyHerself.resolve = function () {
                        e(), delete Bibi.busyHerself
                    }
                })).then((function () {
                    window.removeEventListener(E.resize, R.resetBibiHeight), O.Busy = !1, O.HTML.classList.remove("busy"), O.HTML.classList.remove("loading")
                }))
            }, loadBook: function (e) {
                return Promise.resolve().then((function () {
                    return Bibi.busyHerself(), I.note("Loading..."), O.log("Initializing Book...", "<g:>"), L.initializeBook(e).then((function (e) {
                        O.log("".concat(e, ": %O"), B), O.log("Initialized.", "</g>")
                    }))
                })).then((function () {
                    S.update(), R.updateOrientation(), R.resetStage()
                })).then((function () {
                    return O.log("Creating Cover...", "<g:>"), B.CoverImageItem ? (O.log("Cover Image: %O", B.CoverImageItem), O.log("Will Be Created.", "</g>")) : O.log("Will Be Created. (w/o Image)", "</g>"), L.createCover()
                })).then((function () {
                    return B.NavItem ? (O.log("Loading Navigation...", "<g:>"), L.loadNavigation().then((function (e) {
                        O.log("".concat(B.NavItem.NavType, ": %O"), B.NavItem), O.log("Loaded.", "</g>"), E.dispatch("bibi:loaded-navigation", B.NavItem)
                    }))) : (O.log("No Navigation."), resolve())
                })).then((function () {
                    if (E.dispatch("bibi:prepared"), !S.autostart && !L.Played) return L.wait()
                })).then((function () {
                    return L.preprocessResources()
                })).then((function () {
                    O.log("Loading Items in Spreads...", "<g:>");
                    var e = [], t = {
                        TargetSpreadIndex: 0, Destination: { Edge: "head" }, resetter: function () {
                            t.Reset = !0, t.removeResetter()
                        }, addResetter: function () {
                            window.addEventListener("resize", t.resetter)
                        }, removeResetter: function () {
                            window.removeEventListener("resize", t.resetter)
                        }
                    };
                    "object" == _typeof(S.to) && (t.TargetSpreadIndex = "number" == typeof S.to.SpreadIndex ? S.to.SpreadIndex : "number" == typeof S.to.ItemIndexInSpine ? B.Package.Spine.Items[S.to.ItemIndexInSpine].Spread.Index : S.to["SI-PPiS"] ? S.to["SI-PPiS"].split("-")[0] : 0, t.Destination = S.to), t.addResetter();
                    var n = 0;
                    return R.Spreads.forEach((function (i) {
                        return e.push(new Promise((function (e) {
                            return L.loadSpread(i, { AllowPlaceholderItems: S["allow-placeholders"] && i.Index != t.TargetSpreadIndex }).then((function () {
                                n += i.Items.length, I.note("Loading... (".concat(n, "/").concat(R.Items.length, " Items Loaded.)")), t.Reset ? e() : R.layOutSpread(i).then(e)
                            }))
                        })))
                    })), Promise.all(e).then((function () {
                        return O.log("Loaded. (".concat(R.Items.length, " in ").concat(R.Spreads.length, ")"), "</g>"), t
                    }))
                }))
            }, bindBook: function (e) {
                return e.Reset || (R.organizePages(), R.layOutStage()), R.layOut(e).then((function () {
                    return e.removeResetter(), R.IntersectingPages = [R.Spreads[e.TargetSpreadIndex].Pages[0]], Bibi.Eyes.wearGlasses(), e
                }))
            }, openBook: function (e) {
                return new Promise((function (e) {
                    Bibi.busyHerself.resolve(), I.Veil.close(), L.Opened = !0, document.body.click(), I.note(""), O.log("Enjoy Readings!", "</b>"), E.dispatch("bibi:opened"), e()
                })).then((function () {
                    E.bind(["bibi:changed-intersection", "bibi:scrolled"], R.updateCurrent), R.updateCurrent();
                    var t = R.hatchPage(e.Destination);
                    I.History.List.length || (I.History.List = [{
                        UI: Bibi,
                        Spread: t.Spread,
                        PageProgressInSpread: t.IndexInSpread / t.Spread.Pages.length
                    }], I.History.update()), S["allow-placeholders"] && (R.turnSpreads({ Origin: t.Spread }), setTimeout((function () {
                        R.turnSpreads()
                    }), 123), E.add("bibi:scrolled", (function () {
                        return setTimeout((function () {
                            return R.turnSpreads()
                        }), 123)
                    })), E.add("bibi:changed-intersection", (function () {
                        return !I.Slider.Touching && R.turnSpreads()
                    }))), S["resume-from-last-position"] && E.add("bibi:changed-intersection", (function () {
                        try {
                            var e = R.Current.List[0].Page;
                            O.Biscuits.memorize("Book", { Position: { "SI-PPiS": e.Spread.Index + "-" + e.IndexInSpread / e.Spread.Pages.length } })
                        } catch (e) {
                        }
                    })), E.add("bibi:commands:move-by", R.moveBy), E.add("bibi:commands:scroll-by", R.scrollBy), E.add("bibi:commands:focus-on", R.focusOn), E.add("bibi:commands:change-view", R.changeView), window.addEventListener("message", M.gate, !1), Bibi.Dev && !/:61671/.test(location.href) ? Bibi.createDevNote() : delete Bibi.createDevNote
                }))
            }, createDevNote: function () {
                var e = Bibi.IsDevMode = O.Body.appendChild(sML.create("div", { id: "bibi-is-dev-mode" }));
                Bibi.createDevNote.logBorderLine(), Bibi.createDevNote.appendParagraph("<strong>This Bibi seems to be a</strong> <strong>Development Version</strong>"), Bibi.createDevNote.appendParagraph("<span>Please don't forget</span> <span>to create a production version</span> <span>before publishing on the Internet.</span>"), Bibi.createDevNote.appendParagraph('<span class="non-visual">(To create a production version, run it on terminal: `</span><code>npm run build</code><span class="non-visual">`)</span>'), Bibi.createDevNote.appendParagraph("<em>Close</em>", "NoLog").addEventListener("click", (function () {
                    return e.className = "hide"
                })), Bibi.createDevNote.logBorderLine(), [E.pointerdown, E.pointerup, E.pointermove, E.pointerover, E.pointerout, "click"].forEach((function (t) {
                    return e.addEventListener(t, (function (e) {
                        return e.preventDefault(), e.stopPropagation(), !1
                    }))
                })), setTimeout((function () {
                    return e.className = "show"
                }), 0), delete Bibi.createDevNote
            }
        };
        Bibi.createDevNote.logBorderLine = function (e, t) {
            O.log("========================", "<*/>")
        }, Bibi.createDevNote.appendParagraph = function (e, t) {
            var n = Bibi.IsDevMode.appendChild(sML.create("p", { innerHTML: e }));
            return t || O.log(e.replace(/<[^<>]*>/g, ""), "<*/>"), n
        }, Bibi.Eyes = {
            watch: function (e) {
                var t = e.target, n = !1;
                e.isIntersecting ? R.IntersectingPages.includes(t) || (n = !0, R.IntersectingPages.push(t)) : R.IntersectingPages.includes(t) && (n = !0, R.IntersectingPages = R.IntersectingPages.filter((function (e) {
                    return e != t
                }))), n && (R.IntersectingPages.length && R.IntersectingPages.sort((function (e, t) {
                    return e.Index - t.Index
                })), E.dispatch("bibi:changes-intersection", R.IntersectingPages), clearTimeout(Bibi.Eyes.Timer_IntersectionChange), Bibi.Eyes.Timer_IntersectionChange = setTimeout((function () {
                    E.dispatch("bibi:changed-intersection", R.IntersectingPages)
                }), 9))
            }, wearGlasses: function () {
                Bibi.Glasses = new IntersectionObserver((function (e) {
                    return e.forEach(Bibi.Eyes.watch)
                }), { root: R.Main, rootMargin: "0px", threshold: [0, .5, 1] }), Bibi.Eyes.observe = function (e) {
                    return Bibi.Glasses.observe(e)
                }, Bibi.Eyes.unobserve = function (e) {
                    return Bibi.Glasses.unobserve(e)
                }, Bibi.Eyes.PagesToBeObserved.forEach((function (e) {
                    return Bibi.Glasses.observe(e)
                })), delete Bibi.Eyes.PagesToBeObserved
            }, PagesToBeObserved: [], observe: function (e) {
                return Bibi.Eyes.PagesToBeObserved.includes(e) ? Bibi.Eyes.PagesToBeObserved.length : Bibi.Eyes.PagesToBeObserved.push(e)
            }, unobserve: function (e) {
                return (Bibi.Eyes.PagesToBeObserved = Bibi.Eyes.PagesToBeObserved.filter((function (t) {
                    return t != e
                }))).length
            }
        }, Bibi.createElement = function () {
            for (var e, t = arguments.length, n = new Array(t), i = 0; i < t; i++) n[i] = arguments[i];
            var o = n[0];
            if (Bibi.Elements || (Bibi.Elements = {}), window.customElements) Bibi.Elements[o] || (Bibi.Elements[o] = function (e) {
                function t() {
                    return _classCallCheck(this, t), _possibleConstructorReturn(this, _getPrototypeOf(t).call(this))
                }
                
                return _inherits(t, e), t
            }(_wrapNativeSuper(HTMLElement)), window.customElements.define(o, Bibi.Elements[o])); else if (document.registerElement) return Bibi.Elements[o] || (Bibi.Elements[o] = document.registerElement(o)), sML.edit(new (Bibi.Elements[n.shift()]), n);
            return (e = sML).create.apply(e, n)
        };
        var B = {
            Path: "",
            PathDelimiter: " > ",
            Container: { Path: "META-INF/container.xml" },
            Package: { Manifest: { Items: {} }, Spine: { Items: [] } },
            FileDigit: 0
        }, L = {
            Opened: !1, wait: function () {
                return L.Waiting = !0, O.Busy = !1, O.HTML.classList.remove("busy"), O.HTML.classList.add("waiting"), E.dispatch("bibi:waits"), O.log("(Waiting...)", "<i/>"), I.note(""), new Promise((function (e) {
                    return L.wait.resolve = e
                })).then((function () {
                    return L.Waiting = !1, O.Busy = !0, O.HTML.classList.add("busy"), O.HTML.classList.remove("waiting"), I.note("Loading..."), new Promise((function (e) {
                        return setTimeout(e, 99)
                    }))
                }))
            }, play: function () {
                if (S["start-in-new-window"]) return window.open(location.href);
                L.Played = !0, R.resetStage(), L.wait.resolve(), E.dispatch("bibi:played")
            }, initializeBook: function (e) {
                return new Promise((function (t, n) {
                    if (!e || !e.BookData) return n("Book Data Is Undefined.");
                    var i = e.BookData,
                        o = "string" == typeof i ? /^https?:\/\//.test(i) ? "URI" : "Base64" : "object" == _typeof(i) ? i instanceof File ? "File" : i instanceof Blob ? "BLOB" : "" : "";
                    if (!o) return n("Book Data Is Unknown.");
                    if ("URI" == o) {
                        if (B.Path = i, !S["trustworthy-origins"].includes(new URL(B.Path).origin)) return n("The Origin of the Path of the Book Is Not Allowed.");
                        var r;
                        switch (B.Type) {
                            case"EPUB":
                                r = B.Container;
                                break;
                            case"Zine":
                                r = B.ZineData
                        }
                        var a = function (e) {
                            return {
                                Promised: ("Folder" == e ? O.download(r).then((function () {
                                    return (B.PathDelimiter = "/") && ""
                                })) : O.RangeLoader ? O.extract(r).then((function () {
                                    return "on-the-fly"
                                })) : O.loadZippedBookData(B.Path).then((function () {
                                    return "at-once"
                                }))).then((function (n) {
                                    B.ExtractionPolicy = n, t("".concat(B.Type, " ").concat(e))
                                })).catch((function (t) {
                                    return t.BookTypeError ? n(t.BookTypeError) : (O.log("Failed to Open as ".concat(B.Type, " ").concat(e, ".") + "\n" + "... ".concat(t)), Promise.reject())
                                })), or: function (e) {
                                    return this.Promised.catch((function (t) {
                                        return e(t)
                                    }))
                                }, or_reject: function (e) {
                                    return this.or((function () {
                                        return n(e)
                                    }))
                                }
                            }
                        };
                        O.isToBeExtractedIfNecessary(B.Path) ? a("File").or((function () {
                            return a("Folder").or_reject("Failed to Open Both as ".concat(B.Type, " File and ").concat(B.Type, " Folder."))
                        })) : a("Folder").or_reject('Changing "extract-if-necessary" May Be Required to Open This Book as '.concat(B.Type, " File."))
                    } else {
                        var s,
                            c = { EPUB: /^application\/epub\+zip$/, Zine: /^application\/(zip|x-zip(-compressed)?)$/ };
                        if ("File" == o) {
                            if (!S["accept-local-file"]) return n('To Open Local Files, Changing "accept-local-file" in default.js Is Required.');
                            if (!i.name) return n("Book File Is Invalid.");
                            if (!/\.[\w\d]+$/.test(i.name)) return n("Can Not Open Local Files without Extension.");
                            if (!O.isToBeExtractedIfNecessary(i.name)) return n('To Open This File, Changing "extract-if-necessary" in default.js Is Required.');
                            if (i.type && (/\.epub$/i.test(i.name) ? !c.EPUB.test(i.type) : !/\.zip$/i.test(i.name) || !c.Zine.test(i.type))) return n("Can Not Open This Type of File.");
                            s = "File", B.Path = "[Local File] " + i.name
                        } else {
                            if ("Base64" == o) {
                                if (!S["accept-base64-encoded-data"]) return n('To Open Base64 Encoded Data, Changing "accept-base64-encoded-data" in default.js Is Required.');
                                try {
                                    for (var l = atob(i.replace(/^.*,/, "")), u = new Uint8Array(l.length), d = l.length, p = 0; p < d; p++) u[p] = l.charCodeAt(p);
                                    if (!((i = new Blob([u.buffer], { type: e.BookDataType })) && i instanceof Blob)) throw""
                                } catch (e) {
                                    return n("Book Data Is Invalid.")
                                }
                                B.Path = "[Base64 Encoded Data]"
                            } else {
                                if (!S["accept-blob-converted-data"]) return n('To Open BLOB Converted Data, Changing "accept-blob-converted-data" in default.js Is Required.');
                                B.Path = "[BLOB Converted Data]"
                            }
                            if (!c.EPUB.test(i.type) && !c.Zine.test(i.type)) return n("Can Not Open This Type of File.");
                            s = "Data"
                        }
                        if (!i.size) return n("Book ".concat(s, " Is Empty."));
                        O.loadZippedBookData(i).then((function () {
                            switch (B.Type) {
                                case"EPUB":
                                case"Zine":
                                    return B.ExtractionPolicy = "at-once", t("".concat(B.Type, " ").concat(s));
                                default:
                                    return n("Book ".concat(s, " Is Invalid."))
                            }
                        })).catch(n)
                    }
                })).then((function (e) {
                    return new Promise((function (e) {
                        switch (B.Type) {
                            case"EPUB":
                                return L.loadContainer().then(L.loadPackage).then(e);
                            case"Zine":
                                return X.Zine.loadZineData().then(e)
                        }
                    })).then((function () {
                        return E.dispatch("bibi:initialized-book"), e
                    }))
                })).catch((function (e) {
                    var t = "Failed to Open the Book.";
                    return O.error(t + "\n* " + e), Promise.reject(t)
                }))
            }, loadContainer: function () {
                return O.openDocument(B.Container).then(L.loadContainer.process).then((function () {
                    return E.dispatch("bibi:loaded-container")
                }))
            }
        };
        L.loadContainer.process = function (e) {
            B.Package.Path = e.getElementsByTagName("rootfile")[0].getAttribute("full-path"), B.Package.Dir = B.Package.Path.replace(/\/?[^\/]+$/, "")
        }, L.loadPackage = function () {
            return O.openDocument(B.Package).then(L.loadPackage.process).then((function () {
                return E.dispatch("bibi:loaded-package-document")
            }))
        }, L.loadPackage.process = function (e) {
            var t = e.getElementsByTagName("metadata")[0], n = B.Package.Metadata = {},
                i = e.getElementsByTagName("manifest")[0], o = B.Package.Manifest,
                r = e.getElementsByTagName("spine")[0], a = B.Package.Spine, s = {}, c = t.getAttribute("xmlns:dc");
            if (["identifier", "language", "title", "creator", "publisher"].forEach((function (t) {
                return sML.forEach(e.getElementsByTagNameNS(c, t))((function (e) {
                    return (n[t] ? n[t] : n[t] = []).push(e.textContent.trim())
                }))
            })), sML.forEach(t.getElementsByTagName("meta"))((function (e) {
                if (!e.getAttribute("refines")) {
                    var t = e.getAttribute("property");
                    if (t) /^dcterms:/.test(t) ? (n[t] || (n[t] = []), n[t].push(e.textContent.trim())) : n[t] = e.textContent.trim(); else {
                        var i = e.getAttribute("name");
                        i && (n[i] = e.getAttribute("content").trim())
                    }
                }
            })), n.identifier || (n.identifier = n["dcterms:identifier"] || [O.BookURL]), n.language || (n.language = n["dcterms:language"] || ["en"]), n.title || (n.title = n["dcterms:title"] || n.identifier), n["rendition:layout"] || (n["rendition:layout"] = "reflowable"), n["omf:version"] && (n["rendition:layout"] = "pre-paginated"), n["rendition:orientation"] && "auto" != n["rendition:orientation"] || (n["rendition:orientation"] = "portrait"), n["rendition:spread"] && "auto" != n["rendition:spread"] || (n["rendition:spread"] = "landscape"), n["original-resolution"] && (n["original-resolution"] = O.getViewportByOriginalResolution(n["original-resolution"])), n["rendition:viewport"] && (n["rendition:viewport"] = O.getViewportByMetaContent(n["rendition:viewport"])), n["fixed-layout-jp:viewport"] && (n["fixed-layout-jp:viewport"] = O.getViewportByMetaContent(n["fixed-layout-jp:viewport"])), n["omf:viewport"] && (n["omf:viewport"] = O.getViewportByMetaContent(n["omf:viewport"])), B.ICBViewport = n["original-resolution"] || n["rendition:viewport"] || n["fixed-layout-jp:viewport"] || n["omf:viewport"] || null, sML.forEach(i.getElementsByTagName("item"))((function (e) {
                var t = {
                    id: e.getAttribute("id"),
                    href: e.getAttribute("href"),
                    "media-type": e.getAttribute("media-type")
                };
                if (!t.id || !t.href || !t["media-type"] && "EPUB" == B.Type) return !1;
                t.Path = O.getPath(B.Package.Dir, t.href), o.Items[t.Path] && (t = sML.edit(o.Items[t.Path], t)), t.Content || (t.Content = "");
                var n = e.getAttribute("properties");
                n && ((n = n.trim().replace(/\s+/g, " ").split(" ")).includes("cover-image") ? B.CoverImageItem = t : n.includes("nav") && (B.NavItem = t, t.NavType = "Navigation Document"));
                var i = e.getAttribute("fallback");
                i && (t.fallback = i), o.Items[t.Path] = t, s[t.id] = t.Path
            })), !B.NavItem) {
                var l = o.Items[s[r.getAttribute("toc")]];
                l && (B.NavItem = l, l.NavType = "TOC-NCX")
            }
            a["page-progression-direction"] = r.getAttribute("page-progression-direction"), a["page-progression-direction"] && /^(ltr|rtl)$/.test(a["page-progression-direction"]) || (a["page-progression-direction"] = S["default-page-progression-direction"]), B.PPD = a["page-progression-direction"];
            var u, d, p = /^((rendition:)?(layout|orientation|spread|page-spread))-(.+)$/;
            "rtl" == B.PPD ? (u = "right", d = "left") : (u = "left", d = "right"), a.SpreadsDocumentFragment = document.createDocumentFragment(), sML.forEach(r.getElementsByTagName("itemref"))((function (e) {
                var t = { idref: e.getAttribute("idref") };
                if (!t.idref) return !1;
                var i = o.Items[s[t.idref]];
                if (!i) return !1;
                var r = [];
                if (S["prioritise-fallbacks"]) for (; i.fallback;) {
                    var c = o.Items[s[i.fallback]];
                    c ? (r.push(i.Path), i = c) : delete i.fallback
                }
                i.RefChain = r.concat(i.Path), t.linear = e.getAttribute("linear"), "no" != t.linear && (t.linear = "yes");
                var l = e.getAttribute("properties");
                l && (l = l.trim().replace(/\s+/g, " ").split(" ")).forEach((function (t) {
                    p.test(t) && (e[t.replace(p, "$1")] = t.replace(p, "$4"))
                })), t["rendition:layout"] = e["rendition:layout"] || n["rendition:layout"], t["rendition:orientation"] = e["rendition:orientation"] || n["rendition:orientation"], t["rendition:spread"] = e["rendition:spread"] || n["rendition:spread"];
                var f = e["rendition:page-spread"] || e["page-spread"] || void 0;
                if (f && (t["rendition:page-spread"] = f), (i = sML.create("iframe", i, {
                    className: "item",
                    scrolling: "no",
                    allowtransparency: "true",
                    TimeCard: {},
                    stamp: function (e) {
                        O.stamp(e, this.TimeCard)
                    },
                    IndexInSpine: a.Items.length,
                    Ref: t,
                    Pages: []
                })).Box = sML.create("div", {
                    className: "item-box " + t["rendition:layout"],
                    Content: i,
                    Item: i
                }), i.RefChain.forEach((function (e) {
                    return o.Items[e] = i
                })), a.Items.push(i), "yes" != t.linear) i.IndexInNonLinearItems = R.NonLinearItems.length, R.NonLinearItems.push(i); else {
                    i.Index = R.Items.length, R.Items.push(i);
                    var h = null;
                    if (t["rendition:page-spread"] == d && i.Index > 0) {
                        var g = R.Items[i.Index - 1];
                        g.Ref["rendition:page-spread"] == u && (g.SpreadPair = i, i.SpreadPair = g, (h = i.Spread = g.Spread).Box.classList.remove("single-item-spread-before", "single-item-spread-" + u), h.Box.classList.add(t["rendition:layout"]))
                    }
                    if (!h) {
                        if ((h = i.Spread = sML.create("div", {
                            className: "spread",
                            Items: [],
                            Pages: [],
                            Index: R.Spreads.length
                        })).Box = sML.create("div", {
                            className: "spread-box " + t["rendition:layout"],
                            Content: h,
                            Spread: h
                        }), t["rendition:page-spread"]) switch (h.Box.classList.add("single-item-spread-" + t["rendition:page-spread"]), t["rendition:page-spread"]) {
                            case u:
                                h.Box.classList.add("single-item-spread-before");
                                break;
                            case d:
                                h.Box.classList.add("single-item-spread-after")
                        }
                        R.Spreads.push(a.SpreadsDocumentFragment.appendChild(h.Box).appendChild(h))
                    }
                    if (i.IndexInSpread = h.Items.length, h.Items.push(i), h.appendChild(i.Box), "pre-paginated" == t["rendition:layout"]) {
                        i.PrePaginated = !0, 0 == i.IndexInSpread && (h.PrePaginated = !0);
                        var b = sML.create("span", { className: "page", Spread: h, Item: i, IndexInItem: 0 });
                        i.Pages.push(i.Box.appendChild(b)), Bibi.Eyes.observe(b)
                    } else i.PrePaginated = h.PrePaginated = !1
                }
            })), R.Main.Book.appendChild(B.Package.Spine.SpreadsDocumentFragment), B.FileDigit = (a.Items.length + "").length, B.ID = n.identifier[0], B.Language = n.language[0].split("-")[0], B.Title = n.title.join(", "), B.Creator = n.creator ? n.creator.join(", ") : "", B.Publisher = n.publisher ? n.publisher.join(", ") : "";
            var f = [B.Title];
            B.Creator && f.push(B.Creator), B.Publisher && f.push(B.Publisher), B.FullTitle = f.join(" - ").replace(/&amp;?/gi, "&").replace(/&lt;?/gi, "<").replace(/&gt;?/gi, ">"), O.Title.innerHTML = "", O.Title.appendChild(document.createTextNode(B.FullTitle + " | " + (S["website-name-in-title"] ? S["website-name-in-title"] : "Published with Bibi")));
            try {
                O.Info.querySelector("h1").innerHTML = document.title
            } catch (e) {
            }
            B.WritingMode = /^(zho?|chi|kor?|ja|jpn)$/.test(B.Language) ? "rtl" == B.PPD ? "tb-rl" : "lr-tb" : /^(aze?|ara?|ui?g|urd?|kk|kaz|ka?s|ky|kir|kur?|sn?d|ta?t|pu?s|bal|pan?|fas?|per|ber|msa?|may|yid?|heb?|arc|syr|di?v)$/.test(B.Language) ? "rl-tb" : /^(mo?n)$/.test(B.Language) ? "tb-lr" : "lr-tb", B.AllowPlaceholderItems = "at-once" != B.ExtractionPolicy && "pre-paginated" == n["rendition:layout"], [B.Container.Path, B.Package.Path].forEach((function (e) {
                var t = B.Package.Manifest.Items[e];
                delete t.Path, delete t.Content, delete t.DataType, delete B.Package.Manifest.Items[e]
            })), E.dispatch("bibi:processed-package")
        }, L.createCover = function () {
            var e, t = I.Veil.Cover, n = I.Panel.BookInfo.Cover;
            return t.Info.innerHTML = n.Info.innerHTML = (e = [], B.Title && e.push("<strong>".concat(L.createCover.optimizeString(B.Title), "</strong>")), B.Creator && e.push("<em>".concat(L.createCover.optimizeString(B.Creator), "</em>")), B.Publisher && e.push("<span>".concat(L.createCover.optimizeString(B.Publisher), "</span>")), e.join(" ")), Promise.resolve(new Promise((function (e, t) {
                if (!B.CoverImageItem || !B.CoverImageItem.Path) return t();
                var n = !1, i = setTimeout((function () {
                    n = !0, t()
                }), 5e3);
                O.file(B.CoverImageItem, { URI: !0 }).then((function (t) {
                    n || e(t.URI)
                })).catch((function () {
                    n || t()
                })).then((function () {
                    return clearTimeout(i)
                }))
            })).then((function (e) {
                t.className = n.className = "with-cover-image", sML.style(t, { "background-image": "url(" + e + ")" }), n.insertBefore(sML.create("img", { src: e }), n.Info)
            })).catch((function () {
                t.className = n.className = "without-cover-image", t.insertBefore(I.getBookIcon(), t.Info), n.insertBefore(I.getBookIcon(), n.Info)
            })))
        }, L.createCover.optimizeString = function (e) {
            return "<span>" + e.replace(/([ 　・／]+)/g, "</span><span>$1") + "</span>"
        }, L.loadNavigation = function () {
            return O.openDocument(B.NavItem).then((function (e) {
                var t = I.Panel.BookInfo.Navigation = I.Panel.BookInfo.insertBefore(sML.create("div", { id: "bibi-panel-bookinfo-navigation" }), I.Panel.BookInfo.firstElementChild);
                t.innerHTML = "";
                var n = document.createDocumentFragment();
                if ("Navigation Document" == B.NavItem.NavType) sML.forEach(e.querySelectorAll("nav"))((function (e) {
                    switch (e.getAttribute("epub:type")) {
                        case"toc":
                            e.classList.add("bibi-nav-toc");
                            break;
                        case"landmarks":
                            e.classList.add("bibi-nav-landmarks");
                            break;
                        case"page-list":
                            e.classList.add("bibi-nav-page-list")
                    }
                    sML.forEach(e.getElementsByTagName("*"))((function (e) {
                        return e.removeAttribute("style")
                    })), n.appendChild(e)
                })); else {
                    var i = function e(t) {
                        for (var n = t.childNodes, i = void 0, o = n.length, r = 0; r < o; r++) if (1 == n[r].nodeType && /^navPoint$/i.test(n[r].tagName)) {
                            var a = n[r],
                                s = (a.getElementsByTagName("navLabel")[0], a.getElementsByTagName("content")[0]),
                                c = a.getElementsByTagName("text")[0];
                            i || (i = document.createElement("ul"));
                            var l = sML.create("li", { id: a.getAttribute("id") });
                            l.setAttribute("playorder", a.getAttribute("playorder"));
                            var u = sML.create("a", { href: s.getAttribute("src"), innerHTML: c.innerHTML.trim() });
                            i.appendChild(l).appendChild(u);
                            var d = e(a);
                            d && l.appendChild(d)
                        }
                        return i
                    }(e.getElementsByTagName("navMap")[0]);
                    i && n.appendChild(document.createElement("nav")).appendChild(i)
                }
                return t.appendChild(n), L.coordinateLinkages(B.NavItem.Path, t, "InNav"), B.NavItem.Content = "", t
            }))
        }, L.coordinateLinkages = function (e, t, n) {
            var i = t.getElementsByTagName("a");
            if (i) for (var o = function (t, o) {
                var r = i[o];
                n && (r.NavANumber = o + 1, r.addEventListener(E.pointerdown, (function (e) {
                    return e.stopPropagation()
                })), r.addEventListener(E.pointerup, (function (e) {
                    return e.stopPropagation()
                })));
                var a = r.getAttribute("href"), s = "href";
                if (!a) {
                    if (!(a = r.getAttribute("xlink:href"))) return n && (r.addEventListener("click", (function (e) {
                        return e.preventDefault(), e.stopPropagation(), !1
                    })), r.classList.add("bibi-bookinfo-inactive-link")), "continue";
                    s = "xlink:href"
                }
                if (/^[a-zA-Z]+:/.test(a)) {
                    if (a.split("#")[0] != location.href.split("#")[0]) return r.setAttribute("target", r.getAttribute("target") || "_blank"), "continue";
                    var c = a.split("#")[1];
                    a = c ? "#" + c : R.Items[0].RefChain[0]
                }
                var l = O.getPath(e.replace(/\/?([^\/]+)$/, ""), (/^\.*\/+/.test(a) ? "" : "./") + (/^#/.test(a) ? e.replace(/^.+?([^\/]+)$/, "$1") : "") + a),
                    u = l.split("#"), d = u[0] ? u[0] : e, p = u[1] ? u[1] : "";
                sML.forEach(R.Items)((function (e) {
                    if (d == e.RefChain[0]) return r.setAttribute("data-bibi-original-href", a), r.setAttribute(s, B.Path + "/" + l), r.InNav = n, r.Destination = "pre-paginated" == e.Ref["rendition:layout"] ? { Page: e.Pages[0] } : {
                        Item: e,
                        ElementSelector: p ? "#" + p : void 0
                    }, L.coordinateLinkages.setJump(r), "break"
                })), p && /^epubcfi\(.+\)$/.test(p) && (r.setAttribute("data-bibi-original-href", a), r.setAttribute(s, B.Path + "/#" + p), X.EPUBCFI ? (r.InNav = n, r.Destination = X.EPUBCFI.getDestination(p), L.coordinateLinkages.setJump(r)) : r.addEventListener("click", (function (e) {
                    return e.preventDefault(), e.stopPropagation(), I.note("ja" == O.Language ? "<small>このリンクの利用には EPUBCFI エクステンションが必要です</small>" : '"EPUBCFI" extension is required to use this link.'), !1
                }))), n && _typeof(S.nav) == o + 1 && r.Destination && (S.to = r.Destination)
            }, r = i.length, a = 0; a < r; a++) o(0, a)
        }, L.coordinateLinkages.setJump = function (e) {
            return e.addEventListener("click", (function (t) {
                return t.preventDefault(), t.stopPropagation(), e.Destination && new Promise((function (t) {
                    return e.InNav ? I.Panel.toggle().then(t) : t()
                })).then((function () {
                    const url = location.href + (location.hash ? "," : "#") + "jo(nav:" + e.NavANumber + ")";
                    return L.Opened ? R.focusOn({ Destination: e.Destination, Duration: 0 }).then((function (e) {
                        return I.History.add({ UI: B, SumUp: !1, Destination: e })
                    })) : !!L.Waiting && (S["start-in-new-window"] ? window.open(url) : (S.to = e.Destination, void L.play()))
                })), !1
            }))
        }, L.preprocessResources = function () {
            return new Promise((function (e, t) {
                E.dispatch("bibi:is-going-to:preprocess-resources");
                var n = [], i = [], o = function (e, t) {
                    return n.push(O.file(e, { Preprocess: !0, URI: t }).then((function () {
                        return i.push(e)
                    })))
                };
                if (B.ExtractionPolicy) for (var r in B.Package.Manifest.Items) {
                    var a = B.Package.Manifest.Items[r];
                    /\/(css|javascript)$/.test(a["media-type"]) && (n.length || O.log("Preprocessing Resources...", "<g:>"), o(a, !0))
                }
                Promise.all(n).then((function () {
                    i.length && (O.log("Preprocessed: %O", i), O.log("Preprocessed. (".concat(i.length, " Resource").concat(i.length > 1 ? "s" : "", ")"), "</g>")), E.dispatch("bibi:preprocessed-resources"), e()
                }))
            }))
        }, L.loadSpread = function (e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            return new Promise((function (n, i) {
                e.AllowPlaceholderItems = S["allow-placeholders"] && t.AllowPlaceholderItems;
                var o = 0, r = 0;
                e.Items.forEach((function (i) {
                    L.loadItem(i, { AllowPlaceholder: t.AllowPlaceholderItems }).then((function () {
                        return o++
                    })).catch((function () {
                        return r++
                    })).then((function () {
                        o + r == e.Items.length && n(e)
                    }))
                }))
            }))
        }, L.loadItem = function (e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                n = S["allow-placeholders"] && "pre-paginated" == e.Ref["rendition:layout"] && t.AllowPlaceholder;
            if (void 0 !== e.IsPlaceholder && e.IsPlaceholder == n) return Promise.reject(e);
            e.IsPlaceholder = n;
            var i = e.Box;
            return i.classList.toggle("placeholder", e.IsPlaceholder), e.IsPlaceholder ? (e.parentElement && e.parentElement.removeChild(e), e.onload = e.onLoaded = void 0, e.src = "", e.HTML = e.Head = e.Body = e.Pages[0], Promise.resolve(e)) : (i.classList.remove("loaded"), new Promise((function (t, n) {
                return e.BlobURL ? t({}) : /\.(html?|xht(ml)?|xml)$/i.test(e.Path) ? B.ExtractionPolicy ? O.file(e, { Preprocess: !0 }).then((function (e) {
                    return t({ HTML: e.Content.replace(/^<\?.+?\?>/, "") })
                })).catch(n) : t({ URL: O.fullPath(e.Path) }) : /\.(gif|jpe?g|png)$/i.test(e.Path) ? O.file(e, { URI: !0 }).then((function (e) {
                    return t({
                        Head: "pre-paginated" == e.Ref["rendition:layout"] && B.ICBViewport ? '<meta name="viewport" content="width='.concat(B.ICBViewport.Width, ", height=").concat(B.ICBViewport.Height, '" />') : "",
                        Body: '<img class="bibi-spine-item-image" alt="" src="'.concat(e.URI, '" />')
                    })
                })).catch(n) : /\.(svg)$/i.test(e.Path) ? O.file(e, { Preprocess: !0 }).then((function (e) {
                    var n = /<\?xml-stylesheet\s*(.+?)\s*\?>/g, i = e.Content.match(n), o = "", r = e.Content;
                    i && (o = i.map((function (e) {
                        return e.replace(n, '<link rel="stylesheet" $1 />')
                    })).join(""), r = r.replace(n, "")), t({
                        Head: (B.ExtractionPolicy ? "" : '<base href="'.concat(O.fullPath(e.Path), '" />')) + o,
                        Body: r
                    })
                })).catch(n) : void t({})
            })).then((function (t) {
                return new Promise((function (n) {
                    if (t.URL) e.onload = function () {
                        var t = e.contentDocument.getElementsByTagName("head")[0], i = sML.create("link", {
                            rel: "stylesheet",
                            id: "bibi-default-style",
                            href: Bibi.BookStyleURL,
                            onload: n
                        });
                        t.insertBefore(i, t.firstChild)
                    }, e.src = t.URL; else {
                        if (!e.BlobURL) {
                            var o = t.HTML || '<!DOCTYPE html>\n<html><head><meta charset="utf-8" /><title>'.concat(B.FullTitle, " - #").concat(e.Index + 1, "/").concat(R.Items.length, "</title>").concat(t.Head || "", "</head><body>").concat(t.Body || "", "</body></html>");
                            if (o = o.replace(/(<head(\s[^>]+)?>)/i, '$1<link rel="stylesheet" id="'.concat("bibi-default-style", '" href="').concat(Bibi.BookStyleURL, '" />')), sML.UA.Trident || sML.UA.EdgeHTML) return o = o.replace("</head>", "<script id=\"bibi-onload\">window.addEventListener('load', function() { parent.R.Items[".concat(e.Index, "].onLoaded(); return false; });<\/script></head>")), e.onLoaded = function () {
                                n();
                                var t = e.contentDocument.getElementById("bibi-onload");
                                t.parentNode.removeChild(t), delete e.onLoaded
                            }, e.src = "", i.insertBefore(e, i.firstChild), e.contentDocument.open(), e.contentDocument.write(o), void e.contentDocument.close();
                            e.BlobURL = URL.createObjectURL(new Blob([o], { type: "text/html" })), e.Content = ""
                        }
                        e.onload = n, e.src = e.BlobURL
                    }
                    i.insertBefore(e, i.firstChild)
                }))
            })).then((function () {
                return L.postprocessItem(e)
            })).then((function () {
                return e.Loaded = !0, i.classList.add("loaded"), E.dispatch("bibi:loaded-item", e), e.stamp("Loaded"), e
            })).catch((function () {
                return Promise.reject()
            })))
        }, L.postprocessItem = function (e) {
            var t;
            e.stamp("Postprocess"), e.HTML = e.contentDocument.getElementsByTagName("html")[0], (t = e.HTML.classList).add.apply(t, _toConsumableArray(sML.Environments)), e.Head = e.contentDocument.getElementsByTagName("head")[0], e.Body = e.contentDocument.getElementsByTagName("body")[0], e.HTML.Item = e.Head.Item = e.Body.Item = e;
            var n = e.HTML.getAttribute("xml:lang"), i = e.HTML.getAttribute("lang");
            n || i ? n ? i || e.HTML.setAttribute("lang", n) : e.HTML.setAttribute("xml:lang", i) : (e.HTML.setAttribute("xml:lang", B.Language), e.HTML.setAttribute("lang", B.Language)), sML.forEach(e.Body.getElementsByTagName("link"))((function (t) {
                return e.Head.appendChild(t)
            })), sML.appendCSSRule(e.contentDocument, "html", "-webkit-text-size-adjust: 100%;"), sML.UA.Trident && sML.forEach(e.Body.getElementsByTagName("svg"))((function (e) {
                var t = e.getElementsByTagName("image");
                if (1 == t.length) {
                    var n = t[0];
                    n.getAttribute("width") && n.getAttribute("height") && (e.setAttribute("width", n.getAttribute("width")), e.setAttribute("height", n.getAttribute("height")))
                }
            })), O.TouchOS || sML.UA.Gecko || e.contentDocument.addEventListener("wheel", R.Main.listenWheel, {
                capture: !0,
                passive: !1
            }), I.observeTap(e.HTML), e.HTML.addTapEventListener("tap", R.onTap), e.HTML.addEventListener(E.pointermove, R.onPointerMove), e.HTML.addEventListener(E.pointerdown, R.onPointerDown), e.HTML.addEventListener(E.pointerup, R.onPointerUp), L.coordinateLinkages(e.Path, e.Body);
            var o = e.contentDocument.querySelectorAll("body>*:not(script):not(style)");
            if (o && 1 == o.length) {
                var r = e.contentDocument.querySelector("body>*:not(script):not(style)");
                /^svg$/i.test(r.tagName) ? e.Outsourcing = e.OnlySingleSVG = !0 : /^img$/i.test(r.tagName) ? e.Outsourcing = e.OnlySingleIMG = !0 : /^iframe$/i.test(r.tagName) ? e.Outsourcing = !0 : O.getElementInnerText(e.Body) || (e.Outsourcing = !0)
            }
            return ("pre-paginated" == e.Ref["rendition:layout"] ? Promise.resolve() : L.patchItemStyles(e)).then((function () {
                return E.dispatch("bibi:postprocessed-item", e), e.stamp("Postprocessed"), e
            }))
        }, L.patchItemStyles = function (e) {
            return new Promise((function (t) {
                e.StyleSheets = [], sML.forEach(e.HTML.querySelectorAll("link, style"))((function (t) {
                    if (/^link$/i.test(t.tagName)) {
                        if (!/^(alternate )?stylesheet$/.test(t.rel)) return;
                        if ((sML.UA.Safari || sML.OS.iOS) && "alternate stylesheet" == t.rel) return
                    }
                    e.StyleSheets.push(t)
                }));
                var n = function () {
                    return !(e.contentDocument.styleSheets.length < e.StyleSheets.length) && (clearInterval(e.CSSLoadingTimerID), delete e.CSSLoadingTimerID, t(), !0)
                };
                n() || (e.CSSLoadingTimerID = setInterval(n, 33))
            })).then((function () {
                if (!e.Preprocessed) {
                    if (B.Package.Metadata["ebpaj:guide-version"]) {
                        var t = B.Package.Metadata["ebpaj:guide-version"].split(".");
                        1 * t[0] == 1 && 1 * t[1] == 1 && 1 * t[2] <= 3 && (e.Body.style.textUnderlinePosition = "under left")
                    }
                    if (sML.UA.Trident) {
                        var n = /^(zho?|chi|kor?|ja|jpn)$/.test(B.Language);
                        O.editCSSRules(e.contentDocument, (function (e) {
                            /(-(epub|webkit)-)?column-count: 1; /.test(e.cssText) && (e.style.columnCount = e.style.msColumnCount = "auto"), /(-(epub|webkit)-)?writing-mode: vertical-rl; /.test(e.cssText) && (e.style.writingMode = "tb-rl"), /(-(epub|webkit)-)?writing-mode: vertical-lr; /.test(e.cssText) && (e.style.writingMode = "tb-lr"), /(-(epub|webkit)-)?writing-mode: horizontal-tb; /.test(e.cssText) && (e.style.writingMode = "lr-tb"), /(-(epub|webkit)-)?(text-combine-upright|text-combine-horizontal): all; /.test(e.cssText) && (e.style.msTextCombineHorizontal = "all"), n && / text-align: justify; /.test(e.cssText) && (e.style.textJustify = "inter-ideograph")
                        }))
                    } else O.editCSSRules(e.contentDocument, (function (e) {
                        /(-(epub|webkit)-)?column-count: 1; /.test(e.cssText) && (e.style.columnCount = e.style.webkitColumnCount = "auto")
                    }))
                }
                var i = getComputedStyle(e.HTML), o = getComputedStyle(e.Body);
                i[O.WritingModeProperty] != o[O.WritingModeProperty] && (e.HTML.style.writingMode = o[O.WritingModeProperty]), e.WritingMode = O.getWritingMode(e.HTML), /-rl$/.test(e.WritingMode) ? e.HTML.classList.add("bibi-vertical-text") : /-lr$/.test(e.WritingMode) && e.HTML.classList.add("bibi-horizontal-text"), [[e.Box, i, e.HTML], [e, o, e.Body]].forEach((function (e) {
                    ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundPosition", "backgroundSize"].forEach((function (t) {
                        return e[0].style[t] = e[1][t]
                    })), e[2].style.background = "transparent"
                })), sML.forEach(e.Body.querySelectorAll("svg, img"))((function (e) {
                    e.BibiDefaultStyle = {
                        width: e.style.width ? e.style.width : "",
                        height: e.style.height ? e.style.height : "",
                        maxWidth: e.style.maxWidth ? e.style.maxWidth : "",
                        maxHeight: e.style.maxHeight ? e.style.maxHeight : ""
                    }
                }))
            }))
        };
        var R = {
            Spreads: [],
            Items: [],
            Pages: [],
            NonLinearItems: [],
            IntersectingPages: [],
            Current: {},
            initialize: function () {
                R.Main = O.Body.insertBefore(sML.create("main", {
                    id: "bibi-main",
                    Transformation: { Scale: 1, TranslateX: 0, TranslateY: 0 }
                }), O.Body.firstElementChild), R.Main.Book = R.Main.appendChild(sML.create("div", { id: "bibi-main-book" })), E.bind("bibi:readied", (function () {
                    R.Main.listenWheel = function (e) {
                        "paged" != S.RVM && (e.preventDefault(), e.stopPropagation(), R.Main.scrollLeft = R.Main.scrollLeft + e.deltaX, R.Main.scrollTop = R.Main.scrollTop + e.deltaY)
                    }, I.observeTap(O.HTML), O.HTML.addTapEventListener("tap", R.onTap), O.HTML.addEventListener(E.pointermove, R.onPointerMove), O.HTML.addEventListener(E.pointerdown, R.onPointerDown), O.HTML.addEventListener(E.pointerup, R.onPointerUp), E.add("bibi:tapped", (function (e) {
                        if (I.isPointerStealth()) return !1;
                        var t = O.getBibiEvent(e);
                        switch (S.RVM) {
                            case"horizontal":
                                if (t.Coord.Y > window.innerHeight - O.Scrollbars.Height) return !1;
                                break;
                            case"vertical":
                                if (t.Coord.X > window.innerWidth - O.Scrollbars.Width) return !1
                        }
                        if (t.Target.tagName) {
                            if (I.Slider.UI && (I.Slider.contains(t.Target) || t.Target == I.Slider)) return !1;
                            if (O.isAnchorContent(t.Target)) return !1
                        }
                        return I.OpenedSubpanel ? I.OpenedSubpanel.close() : "center" == t.Division.X && "middle" == t.Division.Y ? E.dispatch("bibi:tapped-center", e) : E.dispatch("bibi:tapped-not-center", e)
                    })), E.add("bibi:tapped-center", (function (e) {
                        I.OpenedSubpanel ? E.dispatch("bibi:commands:close-utilities", e) : E.dispatch("bibi:commands:toggle-utilities", e)
                    }))
                }))
            },
            resetBibiHeight: function () {
                var e = window.innerHeight;
                return O.HTML.style.height = O.Body.style.height = e + "px", e
            },
            resetStage: function () {
                var e, t = R.resetBibiHeight(t);
                R.Stage = {}, R.Columned = !1, R.Main.style.padding = R.Main.style.width = R.Main.style.height = "", R.Main.Book.style.padding = R.Main.Book.style.width = R.Main.Book.style.height = "";
                var n = (S["use-slider"] && "paged" == S.RVM && O.Scrollbars[C.A_SIZE_B] ? O.Scrollbars[C.A_SIZE_B] : 0) + 2 * S["spread-margin"];
                sML.style(R.Main.Book, (_defineProperty(e = {}, C.A_SIZE_b, n > 0 ? "calc(100% - " + n + "px)" : ""), _defineProperty(e, C.A_SIZE_l, ""), e)), R.Stage.Width = O.Body.clientWidth, R.Stage.Height = t, R.Stage[C.A_SIZE_B] -= (S["use-slider"] || "paged" != S.RVM ? O.Scrollbars[C.A_SIZE_B] : 0) + 2 * S["spread-margin"], window.scrollTo(0, 0), S["use-full-height"] || (R.Stage.Height -= I.Menu.Height), S["spread-margin"] > 0 && (R.Main.Book.style["padding" + C.L_BASE_S] = R.Main.Book.style["padding" + C.L_BASE_E] = S["spread-margin"] + "px"), R.Main.style.background = S["book-background"] ? S["book-background"] : ""
            },
            layOutSpread: function (e) {
                return new Promise((function (t) {
                    E.dispatch("bibi:is-going-to:reset-spread", e), e.Pages = [], R.layOutItem(e.Items[0]).then((function (n) {
                        if (n.Pages.forEach((function (t) {
                            return t.IndexInSpread = e.Pages.push(t) - 1
                        })), 1 == e.Items.length) return t();
                        R.layOutItem(e.Items[1]).then((function (n) {
                            n.Pages.forEach((function (t) {
                                return t.IndexInSpread = e.Pages.push(t) - 1
                            })), t()
                        }))
                    }))
                })).then((function () {
                    var t = { Width: 0, Height: 0 }, n = e.Items, i = e.Box;
                    return e.Spreaded = !!(n[0].Spreaded || n[1] && n[1].Spreaded), i.classList.toggle("spreaded", e.Spreaded), 1 == n.length ? (t.Width = n[0].Box.offsetWidth, t.Height = n[0].Box.offsetHeight, e.Spreaded && "pre-paginated" == n[0].Ref["rendition:layout"] && /^(left|right)$/.test(n[0].Ref["rendition:page-spread"]) && (t.Width *= 2)) : "pre-paginated" == n[0].Ref["rendition:layout"] && "pre-paginated" == n[1].Ref["rendition:layout"] ? e.Spreaded || "vertical" != S.RVM ? (t.Width = n[0].Box.offsetWidth + n[1].Box.offsetWidth, t.Height = Math.max(n[0].Box.offsetHeight, n[1].Box.offsetHeight)) : (t.Width = Math.max(n[0].Box.offsetWidth, n[1].Box.offsetWidth), t.Height = n[0].Box.offsetHeight + n[1].Box.offsetHeight) : "horizontal" == S.SLA ? (t.Width = n[0].Box.offsetWidth + n[1].Box.offsetWidth, t.Height = Math.max(n[0].Box.offsetHeight, n[1].Box.offsetHeight), Bibi.Dev && (O.log("Paired Items incl/Reflowable (Horizontal)", "<g:>"), O.log("[0] w".concat(n[0].Box.offsetWidth, "/h").concat(n[0].Box.offsetHeight, " %O"), n[0]), O.log("[1] w".concat(n[1].Box.offsetWidth, "/h").concat(n[1].Box.offsetHeight, " %O"), n[1]), O.log("-=> w".concat(t.Width, "/h").concat(t.Height, " %O"), e, "</g>"))) : (t.Width = Math.max(n[0].Box.offsetWidth, n[1].Box.offsetWidth), t.Height = n[0].Box.offsetHeight + n[1].Box.offsetHeight, Bibi.Dev && (O.log("Paired Items incl/Reflowable (Vertical)", "<g:>"), O.log("[0] w".concat(n[0].Box.offsetWidth, "/h").concat(n[0].Box.offsetHeight, " %O"), n[0]), O.log("[1] w".concat(n[1].Box.offsetWidth, "/h").concat(n[1].Box.offsetHeight, " %O"), n[1]), O.log("-=> w".concat(t.Width, "/h").concat(t.Height, " %O"), e, "</g>"))), O.Scrollbars.Height && "vertical" == S.SLA && "vertical" != S.ARA ? (i.style.minHeight = "paged" == S.RVM ? "calc(100vh - " + O.Scrollbars.Height + "px)" : "", i.style.marginBottom = e.Index == R.Spreads.length - 1 ? O.Scrollbars.Height + "px" : "") : i.style.minHeight = i.style.marginBottom = "", i.style[C.L_SIZE_b] = "", e.style[C.L_SIZE_b] = Math.ceil(t[C.L_SIZE_B]) + "px", i.style[C.L_SIZE_l] = e.style[C.L_SIZE_l] = Math.ceil(t[C.L_SIZE_L]) + "px", sML.style(e, {
                        "border-radius": S["spread-border-radius"],
                        "box-shadow": S["spread-box-shadow"]
                    }), E.dispatch("bibi:reset-spread", e), e
                }))
            },
            layOutItem: function (e) {
                return new Promise((function (t) {
                    O.stamp("Reset...", e.TimeCard), E.dispatch("bibi:is-going-to:reset-item", e), e.Scale = 1, "pre-paginated" != e.Ref["rendition:layout"] ? R.renderReflowableItem(e) : R.renderPrePaginatedItem(e), E.dispatch("bibi:reset-item", e), O.stamp("Reset.", e.TimeCard), t(e)
                }))
            },
            renderReflowableItem: function (e) {
                var t, n, i, o = S["item-padding-" + C.L_BASE_s] + S["item-padding-" + C.L_BASE_e],
                    r = S["item-padding-" + C.L_BASE_b] + S["item-padding-" + C.L_BASE_a], a = R.Stage[C.L_SIZE_B] - o,
                    s = R.Stage[C.L_SIZE_L] - r, c = r;
                if (["b", "a", "s", "e"].forEach((function (t) {
                    var n = C["L_BASE_" + t];
                    e.style["padding-" + n] = S["item-padding-" + n] + "px"
                })), sML.style(e.HTML, {
                    width: "",
                    height: ""
                }), e.WithGutters && (e.HTML.classList.remove("bibi-with-gutters"), e.Neck.parentNode && e.Neck.parentNode.removeChild(e.Neck), e.Neck.innerHTML = "", delete e.Neck), e.Columned && (sML.style(e.HTML, {
                    "column-fill": "",
                    "column-width": "",
                    "column-gap": "",
                    "column-rule": ""
                }), e.HTML.classList.remove("bibi-columned"), O.ReverseItemPaginationDirectionIfNecessary && e.ReversedColumned && (e.HTML.style.direction = "", sML.forEach(e.contentDocument.querySelectorAll("body > *"))((function (e) {
                    return e.style.direction = ""
                })))), e.WithGutters = !1, e.Columned = !1, e.ColumnBreadth = 0, e.ColumnLength = 0, e.ReversedColumned = !1, e.Half = !1, S["double-spread-for-reflowable"] && "horizontal" == S.SLA && (O.PaginateWithCSSShapes || /-tb$/.test(e.WritingMode))) {
                    var l = Math.floor((s - c) / 2);
                    l >= Math.floor(a * S["orientation-border-ratio"] / 2) && (s = l, e.Half = !0)
                }
                sML.style(e, (_defineProperty(t = {}, C.L_SIZE_b, a + "px"), _defineProperty(t, C.L_SIZE_l, s + "px"), t));
                var u = sML.appendCSSRule(e.contentDocument, "*", "word-wrap: break-word;");
                sML.forEach(e.Body.querySelectorAll("img, svg"))((function (t) {
                    var n;
                    if (t.BibiDefaultStyle && (["width", "height", "maxWidth", "maxHeight"].forEach((function (e) {
                        return t.style[e] = t.BibiDefaultStyle[e]
                    })), !("horizontal" == S.RVM && /-(rl|lr)$/.test(e.WritingMode) || "vertical" == S.RVM && /-tb$/.test(e.WritingMode)))) {
                        var i = parseFloat(getComputedStyle(t)[C.L_SIZE_b]),
                            o = Math.floor(Math.min(parseFloat(getComputedStyle(e.Body)[C.L_SIZE_b]), a)),
                            r = parseFloat(getComputedStyle(t)[C.L_SIZE_l]),
                            c = Math.floor(Math.min(parseFloat(getComputedStyle(e.Body)[C.L_SIZE_l]), s));
                        (i > o || r > c) && sML.style(t, (_defineProperty(n = {}, C.L_SIZE_b, Math.floor(parseFloat(getComputedStyle(t)[C.L_SIZE_b]) * Math.min(o / i, c / r)) + "px"), _defineProperty(n, C.L_SIZE_l, "auto"), _defineProperty(n, "maxWidth", "100vw"), _defineProperty(n, "maxHeight", "100vh"), n))
                    }
                }));
                var d = "";
                switch (e.Outsourcing || (O.PaginateWithCSSShapes ? "paged" == S.RVM && e.HTML["offset" + C.L_SIZE_L] > s ? d = "S" : e.HTML["offset" + C.L_SIZE_B] > a && (d = "C") : ("paged" == S.RVM || e.HTML["offset" + C.L_SIZE_B] > a) && (d = "C")), d) {
                    case"S":
                        e.HTML.classList.add("bibi-columned"), sML.style(e.HTML, (_defineProperty(n = {}, C.L_SIZE_b, "auto"), _defineProperty(n, C.L_SIZE_l, s + "px"), _defineProperty(n, "column-fill", "auto"), _defineProperty(n, "column-width", a + "px"), _defineProperty(n, "column-gap", 0), _defineProperty(n, "column-rule", ""), n));
                        var p = Math.ceil((sML.UA.Trident ? e.Body.clientHeight : e.HTML.scrollHeight) / a);
                        sML.style(e.HTML, {
                            width: "",
                            height: "",
                            "column-fill": "",
                            "column-width": "",
                            "column-gap": "",
                            "column-rule": ""
                        }), e.HTML.classList.remove("bibi-columned"), e.HTML.classList.add("bibi-with-gutters");
                        var f = (s + c) * p - c;
                        e.HTML.style[C.L_SIZE_L] = f + "px";
                        for (var h = [0, 0], g = 1; g < p; g++) {
                            var b = (s + c) * g, m = b - c;
                            h.push(0), h.push(m), h.push(a), h.push(m), h.push(a), h.push(b), h.push(0), h.push(b)
                        }
                        /^tb-/.test(e.WritingMode) && h.reverse();
                        for (var v = [], y = "", L = h.length, I = 0; I < L; I++) I % 2 == 0 ? y = h[I] + "px" : v.push(y + " " + h[I] + "px");
                        var E = Bibi.createElement("bibi-neck"), T = E.appendChild(Bibi.createElement("bibi-throat")),
                            B = T.attachShadow ? T.attachShadow({ mode: "open" }) : T.createShadowRoot ? T.createShadowRoot() : T;
                        B.appendChild(document.createElement("style")).textContent = (B != T ? ":host" : "bibi-throat") + " { ".concat(C.L_SIZE_b, ": ").concat(a, "px; ").concat(C.L_SIZE_l, ": ").concat(f, "px; shape-outside: polygon(").concat(v.join(", "), "); }"), e.Neck = e.Head.appendChild(E), e.WithGutters = !0;
                        break;
                    case"C":
                        if (e.HTML.classList.add("bibi-columned"), sML.style(e.HTML, (_defineProperty(i = {}, C.L_SIZE_b, a + "px"), _defineProperty(i, "column-fill", "auto"), _defineProperty(i, "column-width", s + "px"), _defineProperty(i, "column-gap", c + "px"), _defineProperty(i, "column-rule", ""), i)), R.Columned = !0, e.Columned = !0, e.ColumnBreadth = a, e.ColumnLength = s, O.ReverseItemPaginationDirectionIfNecessary) {
                            var w = !1;
                            switch (e.WritingMode) {
                                case"lr-tb":
                                case"tb-lr":
                                    "ltr" != S["page-progression-direction"] && (w = !0);
                                    break;
                                case"rl-tb":
                                case"tb-rl":
                                    "rtl" != S["page-progression-direction"] && (w = !0)
                            }
                            w && (e.ReversedColumned = !0, sML.forEach(e.contentDocument.querySelectorAll("body > *"))((function (e) {
                                return e.style.direction = getComputedStyle(e).direction
                            })), e.HTML.style.direction = S["page-progression-direction"])
                        }
                }
                sML.deleteCSSRule(e.contentDocument, u);
                var P = sML.UA.Trident ? e.Body["client" + C.L_SIZE_L] : e.HTML["scroll" + C.L_SIZE_L],
                    M = Math.ceil((P + c) / (s + c));
                P = (s + c) * M - c, e.style[C.L_SIZE_l] = e.HTML.style[C.L_SIZE_l] = P + "px", sML.UA.Trident && (e.HTML.style[C.L_SIZE_l] = "100%");
                var _ = a + o, k = P + r;
                e.Box.style[C.L_SIZE_b] = _ + "px", e.Box.style[C.L_SIZE_l] = k + "px", e.Pages.forEach((function (t) {
                    Bibi.Eyes.unobserve(t), e.Box.removeChild(t)
                })), e.Pages = [];
                for (var x = 0; x < M; x++) {
                    var A = e.Box.appendChild(sML.create("span", { className: "page" }));
                    A.Item = e, A.Spread = e.Spread, A.IndexInItem = e.Pages.length, e.Pages.push(A), Bibi.Eyes.observe(A)
                }
                return e
            },
            renderPrePaginatedItem: function (e) {
                sML.style(e, { width: "", height: "", transform: "" });
                var t = R.Stage[C.L_SIZE_B], n = R.Stage[C.L_SIZE_L];
                e.Spreaded = !("paged" != S.RVM && S["full-breadth-layout-in-scroll"] || "both" != e.Ref["rendition:spread"] && R.Orientation != e.Ref["rendition:spread"] && "landscape" != R.Orientation), e.Viewport || (e.Viewport = R.getItemViewport(e));
                var i = null;
                if (e.Spreaded) if (i = R.getItemLayoutViewport(e), e.SpreadPair) {
                    var o = e.SpreadPair;
                    o.Spreaded = !0, o.Viewport || (o.Viewport = R.getItemViewport(o));
                    var r = R.getItemLayoutViewport(o), a = null, s = null, c = null, l = null;
                    o.Index > e.Index ? (a = e, s = i, c = o, l = r) : (a = o, s = r, c = e, l = i), c.Scale = s.Height / l.Height;
                    var u = { Width: s.Width + l.Width * c.Scale, Height: s.Height };
                    a.Scale = Math.min(t / u[C.L_SIZE_B], n / u[C.L_SIZE_L]), c.Scale *= a.Scale
                } else {
                    var d = {
                        Width: i.Width * (/^(left|right)$/.test(e.Ref["rendition:page-spread"]) ? 2 : 1),
                        Height: i.Height
                    };
                    e.Scale = Math.min(t / d[C.L_SIZE_B], n / d[C.L_SIZE_L])
                } else i = R.getItemLayoutViewport(e), "paged" != S.RVM && S["full-breadth-layout-in-scroll"] ? e.Scale = t / i[C.L_SIZE_B] : e.Scale = Math.min(t / i[C.L_SIZE_B], n / i[C.L_SIZE_L]);
                var p = Math.floor(i[C.L_SIZE_L] * e.Scale), f = Math.floor(i[C.L_SIZE_B] * (p / i[C.L_SIZE_L]));
                return e.Box.style[C.L_SIZE_l] = p + "px", e.Box.style[C.L_SIZE_b] = f + "px", sML.style(e, {
                    width: i.Width + "px",
                    height: i.Height + "px",
                    transform: "scale(" + e.Scale + ")"
                }), e
            },
            getItemViewport: function (e) {
                return e.IsPlaceholder ? null : (t = e.Head.querySelector('meta[name="viewport"]')) ? O.getViewportByMetaContent(t.getAttribute("content")) : e.OnlySingleSVG ? O.getViewportByViewBox(e.Body.firstElementChild.getAttribute("viewBox")) : e.OnlySingleIMG ? O.getViewportByImage(e.Body.firstElementChild) : null;
                var t
            },
            getItemLayoutViewport: function (e) {
                return e.Viewport ? e.Viewport : B.ICBViewport ? B.ICBViewport : {
                    Width: R.Stage.Height * S["orientation-border-ratio"] / (/^(left|right)$/.test(e.Ref["rendition:page-spread"]) ? 2 : 1),
                    Height: R.Stage.Height
                }
            },
            turnSpreads: function () {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                return new Promise((function (t) {
                    if (!S["allow-placeholders"]) return t();
                    var n = [-1, 2],
                        i = R.ScrollHistory.length > 1 && R.ScrollHistory[1] * C.L_AXIS_D > R.ScrollHistory[0] * C.L_AXIS_D ? -1 : 1,
                        o = e.Origin || (R.Current.List.length ? (i > 0 ? R.Current.List.slice(-1) : R.Current.List)[0].Page.Spread : R.IntersectingPages.length ? (i > 0 ? R.IntersectingPages.slice(-1) : R.IntersectingPages)[0].Spread : null);
                    if (!o) return t();
                    for (var r = [], a = [], s = n[0]; s <= n[1]; s++) {
                        var c = R.Spreads[o.Index + s * i];
                        c && ("Up" != c.Turned && "Up" != c.Turning && (clearTimeout(c.Timer_TurningFaceUp), a.push(c)))
                    }
                    for (; a.length < 2;) {
                        var l = ++n[1];
                        if (l > 9) break;
                        var u = R.Spreads[o.Index + l * i];
                        if (!u) break;
                        "Up" != u.Turned && "Up" != u.Turning && (clearTimeout(u.Timer_TurningFaceUp), a.push(u))
                    }
                    var d = [];
                    R.turnSpreads.SpreadsTurnedFaceUp && R.turnSpreads.SpreadsTurnedFaceUp.forEach((function (e) {
                        "Up" == e.Turned || "Up" == e.Turning || a.includes(e) || (clearTimeout(e.Timer_TurningFaceUp), setTimeout((function () {
                            return R.turnSpread(e, !1)
                        }), 0), d.push(e))
                    })), R.turnSpreads.SpreadsTurnedFaceUp = [], [a, d].forEach((function (e, t) {
                        return e.forEach((function (e, n) {
                            e.Items.length;
                            e == o || t + n == 0 ? r.push(R.turnSpread(e, !0)) : e.Timer_TurningFaceUp = setTimeout((function () {
                                return R.turnSpread(e, !0)
                            }), 88 * (t + .1 * n)), R.turnSpreads.SpreadsTurnedFaceUp.push(e)
                        }))
                    })), (r.length ? Promise.all(r) : Promise.resolve()).then(t)
                }))
            },
            turnSpread: function (e, t) {
                return new Promise((function (n) {
                    e.Turning = t ? "Up" : "Down", e.Turned = !1;
                    var i = !t;
                    if (!S["allow-placeholders"] || e.AllowPlaceholderItems == i) return n();
                    Bibi.Debug && t && sML.style(e.Box, { transition: "" }, { background: "rgba(255,0,0,0.5)" });
                    var o = e.Box["offset" + C.L_SIZE_L], r = e.Pages.reduce((function (e, t) {
                        return e.push(t), e
                    }), []);
                    t || R.cancelSpreadRetlieving(e), L.loadSpread(e, { AllowPlaceholderItems: i }).then((function (e) {
                        n(), R.layOutSpread(e).then((function () {
                            e.PrePaginated || R.replacePages(r, e.Pages);
                            var t = e.Box["offset" + C.L_SIZE_L] - o;
                            0 != t && (R.Main.Book.style[C.L_SIZE_l] = parseFloat(getComputedStyle(R.Main.Book)[C.L_SIZE_l]) + t + "px")
                        }))
                    })).catch((function (e) {
                        return n()
                    }))
                })).then((function () {
                    Bibi.Debug && t && sML.style(e.Box, { transition: "background linear .5s" }, { background: "" }), e.Turning = !1, e.Turned = t ? "Up" : "Down"
                }))
            },
            cancelSpreadRetlieving: function (e) {
                return !!O.RangeLoader && e.Items.forEach((function (e) {
                    e.ResItems && e.ResItems.forEach((function (e) {
                        return O.cancelExtraction(e)
                    })), O.cancelExtraction(e)
                }))
            },
            organizePages: function () {
                var e = [];
                return R.Spreads.forEach((function (t) {
                    return t.Pages.forEach((function (t) {
                        t.Index = e.length, e.push(t)
                    }))
                })), R.Pages = e
            },
            replacePages: function (e, t) {
                var n, i = e[0].Index, o = e.length, r = t.length;
                if (t.forEach((function (e, t) {
                    return e.Index = i + t
                })), r != o) for (var a = r - o, s = e[o - 1].Index + 1; R.Pages[s];) R.Pages[s].Index += a, s++;
                return (n = R.Pages).splice.apply(n, [i, o].concat(_toConsumableArray(t))), R.Pages
            },
            layOutStage: function () {
                var e = 0;
                R.Spreads.forEach((function (t) {
                    return e += t.Box["offset" + C.L_SIZE_L]
                })), "pre-paginated" != S["book-rendition-layout"] && "paged" == S["reader-view-mode"] || (e += S["spread-gap"] * (R.Spreads.length - 1)), R.Main.Book.style[C.L_SIZE_l] = e + "px"
            },
            layOut: function (e) {
                return new Promise((function (t, n) {
                    if (R.LayingOut) return n();
                    if (R.ScrollHistory = [], R.LayingOut = !0, O.log("Laying out...", "<g:>"), e ? O.log("Option: %O", e) : e = {}, e.DoNotCloseUtilities || E.dispatch("bibi:closes-utilities"), E.dispatch("bibi:is-going-to:lay-out", e), window.removeEventListener(E.resize, R.onResize), R.Main.removeEventListener("scroll", R.onScroll), O.Busy = !0, O.HTML.classList.add("busy"), O.HTML.classList.add("laying-out"), e.NoNotification || I.note("Laying out..."), !e.Destination) {
                        var i = R.Current.List.length ? R.Current.List[0].Page : R.Pages[0];
                        e.Destination = {
                            SpreadIndex: i.Spread.Index,
                            PageProgressInSpread: i.IndexInSpread / i.Spread.Pages.length
                        }
                    }
                    e.Setting && S.update(e.Setting);
                    var o = {};
                    if (["reader-view-mode", "spread-layout-direction", "apparent-reading-direction"].forEach((function (e) {
                        return o[e] = S[e]
                    })), O.log("Layout: %O", o), "function" == typeof e.before && e.before(), e.Reset) {
                        R.resetStage();
                        var r = [];
                        R.Spreads.forEach((function (e) {
                            return r.push(R.layOutSpread(e))
                        })), Promise.all(r).then((function () {
                            R.organizePages(), R.layOutStage(), t()
                        }))
                    } else t()
                })).then((function () {
                    return R.focusOn({ Destination: e.Destination, Duration: 0 })
                })).then((function () {
                    O.Busy = !1, O.HTML.classList.remove("busy"), O.HTML.classList.remove("laying-out"), e.NoNotification || I.note(""), window.addEventListener(E.resize, R.onResize), R.Main.addEventListener("scroll", R.onScroll), R.LayingOut = !1, E.dispatch("bibi:laid-out"), O.log("Laid out.", "</g>")
                }))
            },
            updateOrientation: function () {
                var e = R.Orientation;
                if (void 0 !== window.orientation) R.Orientation = 0 == window.orientation || 180 == window.orientation ? "portrait" : "landscape"; else {
                    var t = window.innerWidth - ("vertical" == S.ARA ? O.Scrollbars.Width : 0),
                        n = window.innerHeight - ("horizontal" == S.ARA ? O.Scrollbars.Height : 0);
                    R.Orientation = t / n < S["orientation-border-ratio"] ? "portrait" : "landscape"
                }
                R.Orientation != e && (e && E.dispatch("bibi:changes-orientation", R.Orientation), O.HTML.classList.remove("orientation-" + e), O.HTML.classList.add("orientation-" + R.Orientation), e && E.dispatch("bibi:changed-orientation", R.Orientation))
            },
            ScrollHistory: [],
            onScroll: function (e) {
                L.Opened && (R.Scrolling || (R.Scrolling = !0, O.HTML.classList.add("scrolling")), E.dispatch("bibi:scrolls"), R.ScrollHistory.unshift(R.Main["scroll" + C.L_OOBL_L]), R.ScrollHistory.length > 2 && R.ScrollHistory.pop(), 8 == ++R.onScroll.Count && (R.onScroll.Count = 0, E.dispatch("bibi:scrolled")), clearTimeout(R.Timer_onScrollEnd), R.Timer_onScrollEnd = setTimeout((function () {
                    R.Scrolling = !1, R.onScroll.Count = 0, O.HTML.classList.remove("scrolling"), E.dispatch("bibi:scrolled")
                }), 123))
            }
        };
        R.onScroll.Count = 0, R.onResize = function (e) {
            L.Opened && (R.Resizing || (R.Resizing = !0, R.onResize.TargetPageAfterResizing = R.Current.List[0] ? R.Current.List[0].Page : null, O.Busy = !0, O.HTML.classList.add("busy"), O.HTML.classList.add("resizing")), clearTimeout(R.Timer_onResizeEnd), R.Timer_onResizeEnd = setTimeout((function () {
                R.updateOrientation();
                var t = R.onResize.PageAfterResizing;
                R.layOut({
                    Reset: !0,
                    Destination: t ? {
                        SpreadIndex: t.Spread.Index,
                        PageProgressInSpread: t.IndexInSpread / t.Spread.Pages.length
                    } : null
                }).then((function () {
                    E.dispatch("bibi:resized", e), O.HTML.classList.remove("resizing"), O.HTML.classList.remove("busy"), O.Busy = !1, R.Resizing = !1
                }))
            }), sML.UA.Trident ? 1200 : O.TouchOS ? 600 : 300))
        }, R.onTap = function (e) {
            E.dispatch("bibi:taps", e), E.dispatch("bibi:tapped", e)
        }, R.PreviousPointerCoord = { X: 0, Y: 0 }, R.onPointerMove = function (e) {
            var t = O.getBibiEventCoord(e), n = R.PreviousPointerCoord;
            n.X != t.X || n.Y != t.Y ? E.dispatch("bibi:moved-pointer", e) : E.dispatch("bibi:stopped-pointer", e), R.PreviousPointerCoord = t, e.stopPropagation()
        }, R.onPointerDown = function (e) {
            E.dispatch("bibi:downs-pointer", e), R.PointerIsDowned = !0, E.dispatch("bibi:downed-pointer", e)
        }, R.onPointerUp = function (e) {
            E.dispatch("bibi:ups-pointer", e), R.PointerIsDowned = !1, E.dispatch("bibi:upped-pointer", e)
        }, R.changeView = function (e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            if (S["fix-reader-view-mode"] || !e || "string" != typeof e.Mode || !/^(paged|horizontal|vertical)$/.test(e.Mode) || S.RVM == e.Mode && !e.Force) return !1;
            if (L.Opened) {
                E.dispatch("bibi:changes-view"), O.Busy = !0, O.HTML.classList.add("busy"), O.HTML.classList.add("changing-view");
                var n = [O.TouchOS ? 99 : 3, O.TouchOS ? 99 : 33];
                setTimeout((function () {
                    E.dispatch("bibi:closes-utilities")
                }), n[0]), setTimeout((function () {
                    R.layOut({
                        Reset: !0,
                        NoNotification: t.NoNotification,
                        Setting: { "reader-view-mode": e.Mode }
                    }).then((function () {
                        O.HTML.classList.remove("changing-view"), O.HTML.classList.remove("busy"), O.Busy = !1, setTimeout((function () {
                            return E.dispatch("bibi:changed-view", e.Mode)
                        }), 0)
                    }))
                }), n[0] + n[1])
            } else S.update({ "reader-view-mode": e.Mode }), L.play();
            S["keep-settings"] && O.Biscuits.memorize("Book", { RVM: e.Mode })
        }, R.Current = { List: [], Frame: {} }, R.updateCurrent = function () {
            var e = {};
            e.Length = R.Main["offset" + C.L_SIZE_L], e[C.L_OOBL_L] = R.Main["scroll" + C.L_OOBL_L], e["Top" == C.L_OOBL_L ? "Bottom" : "Right"] = e[C.L_OOBL_L] + e.Length, R.Current.Frame = {
                Before: e[C.L_BASE_B],
                After: e[C.L_BASE_A],
                Length: e.Length
            };
            var t = R.updateCurrent.getList();
            return t && (R.Current.List = t, R.updateCurrent.classify()), R.Current
        }, R.updateCurrent.getList = function () {
            for (var e = [], t = [], n = void 0, i = Math.ceil(R.Stage.Width / 4), o = Math.ceil(R.Stage.Height / 4), r = [5, 6, 4, 2, 8], a = r.length, s = 0; s < a; s++) {
                var c = r[s], l = document.elementFromPoint(i * (c % 3 || 3), o * Math.ceil(c / 3));
                if (l && (l.IndexInItem ? n = [l] : l.Pages ? n = l.Pages : l.Content && (n = l.Content.Pages)), n) break
            }
            if (!n && R.IntersectingPages.length && (n = R.IntersectingPages), !n || !n[0] || "number" != typeof n[0].Index) return null;
            for (var u = sML.limitMin(n[0].Index - 2, 0), d = sML.limitMax(n[n.length - 1].Index + 2, R.Pages.length - 1), p = 0, f = u; f <= d; f++) {
                var h = R.Pages[f], g = R.updateCurrent.getIntersectionStatus(h, "WithDetail");
                if (g.Ratio < p) {
                    if (e.length) break
                } else {
                    var b = { Page: h, PageIntersectionStatus: g };
                    if (e.length) {
                        var m = e[e.length - 1];
                        m.Page.Item == h.Item && (b.ItemIntersectionStatus = m.ItemIntersectionStatus), m.Page.Spread == h.Spread && (b.SpreadIntersectionStatus = m.SpreadIntersectionStatus)
                    }
                    b.ItemIntersectionStatus || (b.ItemIntersectionStatus = R.updateCurrent.getIntersectionStatus(h.Item.Box)), b.SpreadIntersectionStatus || (b.SpreadIntersectionStatus = R.updateCurrent.getIntersectionStatus(h.Spread)), 1 == b.SpreadIntersectionStatus.Ratio && t.push(b), g.Ratio > p ? (e = [b], p = g.Ratio) : e.push(b)
                }
            }
            return t.length ? t : e.length ? e : null
        }, R.updateCurrent.getIntersectionStatus = function (e, t) {
            var n = sML.getCoord(e), i = C.L_AXIS_D,
                o = Math.min(R.Current.Frame.After * i, n[C.L_BASE_A] * i) - Math.max(R.Current.Frame.Before * i, n[C.L_BASE_B] * i),
                r = o <= 0 || !n[C.L_SIZE_L] || isNaN(o) ? 0 : o / n[C.L_SIZE_L], a = { Ratio: r };
            if (r <= 0) ; else if (t) if (r >= 1) a.Contained = !0; else {
                var s = R.Current.Frame.Before * i, c = R.Current.Frame.After * i, l = n[C.L_BASE_B] * i,
                    u = n[C.L_BASE_A] * i;
                s < l ? a.Entering = !0 : s == l ? a.Headed = !0 : u == c ? a.Footed = !0 : u < c && (a.Passing = !0), R.Main["offset" + L] < n[C.L_SIZE_L] && (a.Oversize = !0)
            }
            return a
        }, R.updateCurrent.classify = function () {
            var e = [], t = R.Main.Book.querySelectorAll(".current");
            R.Current.List.forEach((function (t) {
                var n = t.Page, i = n.Item.Box, o = n.Spread.Box;
                e.includes(o) || (o.classList.add("current"), e.push(o)), e.includes(i) || (i.classList.add("current"), e.push(i)), n.classList.add("current"), e.push(n)
            })), sML.forEach(t)((function (t) {
                e.includes(t) || t.classList.remove("current")
            }))
        }, R.focusOn = function (e) {
            return new Promise((function (t, n) {
                if (R.Moving) return n();
                if (!e) return n();
                if ("number" == typeof e && (e = { Destination: e }), e.Destination = R.hatchDestination(e.Destination), !e.Destination) return n();
                E.dispatch("bibi:is-going-to:focus-on", e), R.Moving = !0, e.FocusPoint = 0, "reflowable" == S["book-rendition-layout"] ? (e.FocusPoint = O.getElementCoord(e.Destination.Page)[C.L_AXIS_L], "after" == e.Destination.Side && (e.FocusPoint += (e.Destination.Page["offset" + C.L_SIZE_L] - R.Stage[C.L_SIZE_L]) * C.L_AXIS_D), "rtl" == S.SLD && (e.FocusPoint += e.Destination.Page.offsetWidth - R.Stage.Width)) : (S["allow-placeholders"] && 0 != e.Turn && R.turnSpreads({ Origin: e.Destination.Page.Spread }), R.Stage[C.L_SIZE_L] >= e.Destination.Page.Spread["offset" + C.L_SIZE_L] ? (e.FocusPoint = O.getElementCoord(e.Destination.Page.Spread)[C.L_AXIS_L], e.FocusPoint -= Math.floor((R.Stage[C.L_SIZE_L] - e.Destination.Page.Spread["offset" + C.L_SIZE_L]) / 2)) : (e.FocusPoint = O.getElementCoord(e.Destination.Page)[C.L_AXIS_L], R.Stage[C.L_SIZE_L] > e.Destination.Page["offset" + C.L_SIZE_L] ? e.FocusPoint -= Math.floor((R.Stage[C.L_SIZE_L] - e.Destination.Page["offset" + C.L_SIZE_L]) / 2) : "after" == e.Destination.Side && (e.FocusPoint += (e.Destination.Page["offset" + C.L_SIZE_L] - R.Stage[C.L_SIZE_L]) * C.L_AXIS_D))), "number" == typeof e.Destination.TextNodeIndex && R.selectTextLocation(e.Destination);
                var i = { Frame: R.Main, X: 0, Y: 0 };
                return i[C.L_AXIS_L] = e.FocusPoint, S["use-full-height"] || "vertical" != S.RVM || (i.Y -= I.Menu.Height), sML.scrollTo(i, {
                    ForceScroll: !0,
                    Duration: "number" == typeof e.Duration ? e.Duration : S.SLA != S.ARA || "paged" == S.RVM && !S["animate-page-flipping"] ? 0 : 222,
                    Easing: function (e) {
                        return 1 === e ? 1 : -1 * Math.pow(2, -10 * e) + 1
                    }
                }).then((function () {
                    R.Moving = !1, t(e.Destination), E.dispatch("bibi:focused-on", e)
                }))
            })).catch((function () {
                return Promise.resolve()
            }))
        }, R.hatchDestination = function (e) {
            if (!e) return null;
            if (e.Page) return e;
            if ("number" == typeof e || "string" == typeof e && /^\d+$/.test(e)) e = R.getBibiToDestination(e); else if ("string" == typeof e) "head" == e || "foot" == e ? e = { Edge: e } : X.EPUBCFI && (e = X.EPUBCFI.getDestination(e)); else if (e.tagName) {
                if ("number" == typeof e.IndexInItem) return { Page: e };
                if ("number" == typeof e.Index) return { Page: e.Pages[0] };
                e = { Element: e }
            }
            return e.Page = R.hatchPage(e), e
        }, R.hatchPage = function (e) {
            if (e.Page) return e.Page;
            if ("head" == e.Edge) return R.Pages[0];
            if ("foot" == e.Edge) return R.Pages[R.Pages.length - 1];
            if ("number" == typeof e.PageIndex) return R.Pages[e.PageIndex];
            if ("number" != typeof e.PageProgressInSpread && "number" != typeof e.SpreadIndex && !e.Spread && "string" == typeof e["SI-PPiS"]) {
                var t = _slicedToArray(e["SI-PPiS"].split("-").map((function (e) {
                    return 1 * e
                })), 2);
                e.SpreadIndex = t[0], e.PageProgressInSpread = t[1]
            }
            try {
                return "number" == typeof e.PageIndexInItem ? R.hatchItem(e).Pages[e.PageIndexInItem] : "number" == typeof e.PageIndexInSpread ? R.hatchSpread(e).Pages[e.PageIndexInSpread] : "number" == typeof e.PageProgressInSpread ? (n = R.hatchSpread(e)).Pages[Math.floor(n.Pages.length * e.PageProgressInSpread)] : ("string" == typeof e.ElementSelector && (e.Element = R.hatchItem(e).contentDocument.querySelector(e.ElementSelector)), e.Element ? R.hatchNearestPageOfElement(e.Element) : (R.hatchItem(e) || R.hatchSpread(e)).Pages[0])
            } catch (e) {
            }
            var n;
            return null
        }, R.hatchItem = function (e) {
            if (e.Item) return e.Item;
            if ("number" == typeof e.ItemIndex) return R.Items[e.ItemIndex];
            if ("number" == typeof e.ItemIndexInSpine) return B.Package.Spine.Items[e.ItemIndexInSpine];
            if ("number" == typeof e.ItemIndexInSpread) try {
                return R.hatchSpread(e).Items[e.ItemIndexInSpread]
            } catch (e) {
                return null
            }
            return null
        }, R.hatchSpread = function (e) {
            return e.Spread ? e.Spread : "number" == typeof e.SpreadIndex ? R.Spreads[e.SpreadIndex] : null
        }, R.hatchNearestPageOfElement = function (e) {
            if (!e || !e.tagName) return null;
            var t, n, i = e.ownerDocument.body.Item;
            if (!i) return null;
            if (i.Columned) sML.style(i.HTML, { "column-width": "" }), n = O.getElementCoord(e)[C.L_AXIS_B], "rtl" == S.PPD && "vertical" == S.SLA && (n = i.offsetWidth - (S["item-padding-left"] + S["item-padding-right"]) - n - e.offsetWidth), sML.style(i.HTML, { "column-width": i.ColumnLength + "px" }), t = i.Pages[Math.ceil(n / i.ColumnBreadth)]; else {
                n = O.getElementCoord(e)[C.L_AXIS_L], "rtl" == S.SLD && "horizontal" == S.SLA && (n = i.HTML.offsetWidth - n - e.offsetWidth), t = i.Pages[0];
                for (var o = i.Pages.length, r = 0; r < o; r++) if ((n -= i.Pages[r]["offset" + C.L_SIZE_L]) <= 0) {
                    t = i.Pages[r];
                    break
                }
            }
            return t
        }, R.getBibiToDestination = function (e) {
            if ("number" == typeof e && (e = "" + e), "string" != typeof e || !/^[1-9][0-9]*(-[1-9][0-9]*(\.[1-9][0-9]*)*)?$/.test(e)) return null;
            var t = "", n = e.split("-"), i = parseInt(n[0]) - 1, o = n[1] ? n[1] : null;
            return o && o.split(".").forEach((function (e) {
                return t += ">*:nth-child(" + e + ")"
            })), { ItemIndexInSpine: i, ElementSelector: t ? "body" + t : void 0 }
        }, R.selectTextLocation = function (e) {
            if ("number" != typeof e.TextNodeIndex || !e.Element) return !1;
            var t = e.Element.childNodes[e.TextNodeIndex];
            if (t && t.textContent) {
                var n = { Start: { Node: t, Index: 0 }, End: { Node: t, Index: t.textContent.length } };
                if (e.TermStep) if (e.TermStep.Preceding || e.TermStep.Following) {
                    if (n.Start.Index = e.TermStep.Index, n.End.Index = e.TermStep.Index, e.TermStep.Preceding && (n.Start.Index -= e.TermStep.Preceding.length), e.TermStep.Following && (n.End.Index += e.TermStep.Following.length), n.Start.Index < 0 || t.textContent.length < n.End.Index) return;
                    if (t.textContent.substr(n.Start.Index, n.End.Index - n.Start.Index) != e.TermStep.Preceding + e.TermStep.Following) return
                } else if (e.TermStep.Side && "a" == e.TermStep.Side) {
                    for (n.Start.Node = t.parentNode.firstChild; n.Start.Node.childNodes.length;) n.Start.Node = n.Start.Node.firstChild;
                    n.End.Index = e.TermStep.Index - 1
                } else {
                    for (n.Start.Index = e.TermStep.Index, n.End.Node = t.parentNode.lastChild; n.End.Node.childNodes.length;) n.End.Node = n.End.Node.lastChild;
                    n.End.Index = n.End.Node.textContent.length
                }
                return sML.Ranges.selectRange(sML.Ranges.getRange(n))
            }
        }, R.moveBy = function (e) {
            return new Promise((function (t, n) {
                if (R.Moving || !L.Opened) return n();
                if (!e) return n();
                if ("number" == typeof e && (e = { Distance: e }), !e.Distance || "number" != typeof e.Distance) return n();
                if (e.Distance *= 1, 0 == e.Distance || isNaN(e.Distance)) return n();
                e.Distance = e.Distance < 0 ? -1 : 1, E.dispatch("bibi:is-going-to:move-by", e);
                var i = (e.Distance > 0 ? R.Current.List.slice(-1) : R.Current.List)[0], o = i.Page,
                    r = (o.Item, e.Distance > 0 ? "before" : "after");
                i.PageIntersectionStatus.Oversize ? e.Distance > 0 ? i.PageIntersectionStatus.Entering ? (e.Distance = 0, r = "before") : i.PageIntersectionStatus.Headed && (e.Distance = 0, r = "after") : i.PageIntersectionStatus.Footed ? (e.Distance = 0, r = "before") : i.PageIntersectionStatus.Passing && (e.Distance = 0, r = "before") : e.Distance > 0 ? i.PageIntersectionStatus.Entering && (e.Distance = 0, r = "before") : i.PageIntersectionStatus.Passing && (e.Distance = 0, r = "before");
                var a = o.Index + e.Distance;
                a < 0 ? (a = 0, r = "before") : a > R.Pages.length - 1 && (a = R.Pages.length - 1, r = "after");
                var s = R.Pages[a];
                "pre-paginated" == S.BRL && s.Item.SpreadPair && "horizontal" == S.SLA && R.Stage[C.L_SIZE_L] > s.Spread["offset" + C.L_SIZE_L] && (e.Distance < 0 && 0 == s.IndexInSpread && (s = s.Spread.Pages[1]), e.Distance > 0 && 1 == s.IndexInSpread && (s = s.Spread.Pages[0])), e.Destination = {
                    Page: s,
                    Side: r
                }, R.focusOn(e).then((function () {
                    return e.Destination
                })).then((function (n) {
                    t(n), E.dispatch("bibi:moved-by", e)
                }))
            })).catch((function () {
                return Promise.resolve()
            }))
        }, R.scrollBy = function (e) {
            return new Promise((function (t, n) {
                if (!e) return n();
                if ("number" == typeof e && (e = { Distance: e }), !e.Distance || "number" != typeof e.Distance) return n();
                E.dispatch("bibi:is-going-to:scroll-by", e), R.Moving = !0;
                var i = { Frame: R.Main, X: 0, Y: 0 };
                switch (S.SLD) {
                    case"ttb":
                        i.Y = R.Main.scrollTop + R.Stage.Height * e.Distance;
                        break;
                    case"ltr":
                        i.X = R.Main.scrollLeft + R.Stage.Width * e.Distance;
                        break;
                    case"rtl":
                        i.X = R.Main.scrollLeft + R.Stage.Width * e.Distance * -1
                }
                sML.scrollTo(i, {
                    ForceScroll: !0,
                    Duration: "paged" != S.RVM && S.SLA == S.ARA ? 100 : 0
                }).then((function () {
                    R.Moving = !1, t()
                }))
            })).then((function () {
                return E.dispatch("bibi:scrolled-by", e)
            }))
        };
        var I = {
            initialize: function () {
                I.Notifier.create(), I.Veil.create(), E.bind("bibi:readied", (function () {
                    I.Catcher.create(), I.Menu.create(), I.Panel.create(), I.Help.create(), I.PoweredBy.create(), I.FontSizeChanger.create(), I.Loupe.create()
                })), E.bind("bibi:prepared", (function () {
                    I.Nombre.create(), I.Slider.create(), I.Turner.create(), I.Arrows.create(), I.SwipeListener.create(), I.KeyListener.create(), I.Spinner.create()
                })), E.bind("bibi:initialized-book", (function () {
                    I.BookmarkManager.create()
                })), I.Utilities = I.setToggleAction({}, {
                    onopened: function () {
                        return E.dispatch("bibi:opens-utilities")
                    }, onclosed: function () {
                        return E.dispatch("bibi:closes-utilities")
                    }
                }), E.add("bibi:commands:open-utilities", (function () {
                    return I.Utilities.open()
                })), E.add("bibi:commands:close-utilities", (function () {
                    return I.Utilities.close()
                })), E.add("bibi:commands:toggle-utilities", (function () {
                    return I.Utilities.toggle()
                }))
            }
        };
        I.Notifier = {
            create: function () {
                var e = I.Notifier = O.Body.appendChild(sML.create("div", {
                    id: "bibi-notifier", show: function (t, n) {
                        clearTimeout(e.Timer_hide), e.P.className = n ? "error" : "", e.P.innerHTML = t, O.HTML.classList.add("notifier-shown"), L.Opened && !n && e.addEventListener(O.TouchOS ? E.pointerdown : E.pointerover, e.hide)
                    }, hide: function () {
                        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                        clearTimeout(e.Timer_hide), e.Timer_hide = setTimeout((function () {
                            L.Opened && e.removeEventListener(O.TouchOS ? E.pointerdown : E.pointerover, e.hide), O.HTML.classList.remove("notifier-shown")
                        }), t)
                    }, note: function (t, n, i) {
                        if (!t) return e.hide();
                        e.show(t, i), void 0 === n && (n = O.Busy ? 9999 : 2222), "number" == typeof n && e.hide(n)
                    }
                }));
                e.P = e.appendChild(document.createElement("p")), I.note = e.note, E.dispatch("bibi:created-notifier")
            }
        }, I.note = function () {
            return !1
        }, I.Veil = {
            create: function () {
                var e = I.Veil = I.setToggleAction(O.Body.appendChild(sML.create("div", { id: "bibi-veil" })), {
                    onopened: function () {
                        O.HTML.classList.add("veil-opened"), this.classList.remove("closed")
                    }, onclosed: function () {
                        this.classList.add("closed"), O.HTML.classList.remove("veil-opened")
                    }
                });
                e.open();
                var t = (O.TouchOS ? "Tap" : "Click") + " to Open";
                e.PlayButton = e.appendChild(sML.create("p", {
                    id: "bibi-veil-play",
                    title: t,
                    innerHTML: '<span class="non-visual">'.concat(t, "</span>"),
                    play: function (e) {
                        e.stopPropagation(), L.play(), E.dispatch("bibi:played:by-button")
                    },
                    hide: function () {
                        var e = this;
                        sML.style(this, { opacity: 0, cursor: "default" }).then((function (t) {
                            return e.parentNode.removeChild(e)
                        }))
                    },
                    on: {
                        click: function (e) {
                            this.play(e)
                        }
                    }
                })), E.add("bibi:played", (function () {
                    return e.PlayButton.hide()
                })), e.byebye = function () {
                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    return e.innerHTML = "", e.ByeBye = e.appendChild(sML.create("p", { id: "bibi-veil-byebye" })), ["en", "ja"].forEach((function (n) {
                        return e.ByeBye.innerHTML += '<span lang="'.concat(n, '">').concat(t[n], "</span>")
                    })), O.HTML.classList.remove("welcome"), e.open(), t.en ? t.en.replace(/<[^>]*>/g, "") : ""
                }, e.Cover = e.appendChild(sML.create("div", { id: "bibi-veil-cover" })), e.Cover.Info = e.Cover.appendChild(sML.create("p", { id: "bibi-veil-cover-info" })), E.dispatch("bibi:created-veil")
            }
        }, I.Catcher = {
            create: function () {
                if (!S.book && !S.BookDataElement && S["accept-local-file"]) {
                    var e = I.Catcher = O.Body.appendChild(sML.create("div", { id: "bibi-catcher" }));
                    if (e.insertAdjacentHTML("afterbegin", I.distillLabels.distillLanguage({
                        default: ['<div class="pgroup" lang="en">', "<p><strong>Pass Me Your EPUB File!</strong></p>", "<p><em>You Can Open Your Own EPUB.</em></p>", "<p><span>Please ".concat(O.TouchOS ? "Tap Screen" : "Drag & Drop It Here. <br />Or Click Screen", " and Choose It.</span></p>"), "<p><small>(Open in Your Device without Uploading)</small></p>", "</div>"].join(""),
                        ja: ['<div class="pgroup" lang="ja">', "<p><strong>EPUBファイルをここにください！</strong></p>", "<p><em>お持ちの EPUB ファイルを<br />開くことができます。</em></p>", "<p><span>".concat(O.TouchOS ? "画面をタップ" : "ここにドラッグ＆ドロップするか、<br />画面をクリック", "して選択してください。</span></p>"), "<p><small>（外部に送信されず、この端末の中で開きます）</small></p>", "</div>"].join("")
                    })[O.Language]), e.title = e.querySelector("span").innerHTML.replace(/<br( ?\/)?>/g, "\n").replace(/<[^>]+>/g, "").trim(), e.Input = e.appendChild(sML.create("input", { type: "file" })), !S["extract-if-necessary"].includes("*") && S["extract-if-necessary"].length) {
                        var t = [];
                        S["extract-if-necessary"].includes(".epub") && t.push("application/epub+zip"), S["extract-if-necessary"].includes(".zip") && (t.push("application/zip"), t.push("application/x-zip"), t.push("application/x-zip-compressed")), t.length && e.Input.setAttribute("accept", t.join(","))
                    }
                    e.Input.addEventListener("change", (function (e) {
                        var t = {};
                        try {
                            t = e.target.files[0]
                        } catch (e) {
                        }
                        Bibi.getBookData.resolve({ BookData: t })
                    })), e.addEventListener("click", (function (t) {
                        return e.Input.click(t)
                    })), O.TouchOS || (e.addEventListener("dragenter", (function (e) {
                        e.preventDefault(), O.HTML.classList.add("dragenter")
                    }), 1), e.addEventListener("dragover", (function (e) {
                        e.preventDefault()
                    }), 1), e.addEventListener("dragleave", (function (e) {
                        e.preventDefault(), O.HTML.classList.remove("dragenter")
                    }), 1), e.addEventListener("drop", (function (e) {
                        e.preventDefault();
                        var t = {};
                        try {
                            t = e.dataTransfer.files[0]
                        } catch (e) {
                        }
                        console.log("File", t), Bibi.getBookData.resolve({ BookData: t })
                    }), 1)), e.appendChild(I.getBookIcon())
                }
            }
        }, I.Menu = {
            create: function () {
                S["use-menubar"] || O.HTML.classList.add("without-menubar");
                var e = I.Menu = O.Body.appendChild(sML.create("div", { id: "bibi-menu" }, I.Menu));
                delete e.create, I.setHoverActions(e), I.setToggleAction(e, {
                    onopened: function () {
                        O.HTML.classList.add("menu-opened"), E.dispatch("bibi:opened-menu")
                    }, onclosed: function () {
                        O.HTML.classList.remove("menu-opened"), E.dispatch("bibi:closed-menu")
                    }
                }), E.add("bibi:commands:open-menu", e.open), E.add("bibi:commands:close-menu", e.close), E.add("bibi:commands:toggle-menu", e.toggle), E.add("bibi:opens-utilities", (function (e) {
                    return E.dispatch("bibi:commands:open-menu", e)
                })), E.add("bibi:closes-utilities", (function (e) {
                    return E.dispatch("bibi:commands:close-menu", e)
                })), E.add("bibi:opened", e.close), O.TouchOS || E.add("bibi:opened", (function () {
                    E.add("bibi:moved-pointer", (function (t) {
                        if (I.isPointerStealth()) return !1;
                        var n = O.getBibiEvent(t);
                        clearTimeout(e.Timer_close), "top" == n.Division.Y ? E.dispatch(e, "bibi:hovers", t) : e.Hover && (e.Timer_close = setTimeout((function () {
                            return E.dispatch(e, "bibi:unhovers", t)
                        }), 123))
                    })), sML.UA.Gecko || e.addEventListener("wheel", R.Main.listenWheel, { capture: !0, passive: !1 })
                })), e.L = e.appendChild(sML.create("div", { id: "bibi-menu-l" })), e.R = e.appendChild(sML.create("div", { id: "bibi-menu-r" })), [e.L, e.R].forEach((function (e) {
                    e.ButtonGroups = [], e.addButtonGroup = function (e) {
                        var t = I.createButtonGroup(e);
                        return t ? (this.ButtonGroups.push(t), this.appendChild(t)) : null
                    }
                }));
                var t = "html.appearance-vertical:not(.veil-opened):not(.slider-opened)", n = " div#bibi-menu";
                sML.appendCSSRule(t + n, "width: calc(100% - " + O.Scrollbars.Width + "px);"), sML.appendCSSRule([t + ".panel-opened" + n, t + ".subpanel-opened" + n].join(", "), "padding-right: " + O.Scrollbars.Width + "px;"), I.OpenedSubpanel = null, I.Subpanels = [], e.Config.create(), E.dispatch("bibi:created-menu")
            }
        }, I.Menu.Config = {
            create: function () {
                var e = I.Menu, t = [];
                if (S["fix-reader-view-mode"] || t.push("ViewModeSection"), O.Embedded && t.push("NewWindowButton"), O.FullscreenTarget && !O.TouchOS && t.push("FullscreenButton"), S["website-href"] && /^https?:\/\/[^\/]+/.test(S["website-href"]) && S["website-name-in-menu"] && t.push("WebsiteLink"), S["remove-bibi-website-link"] || t.push("BibiWebsiteLink"), t.length) {
                    var n = e.Config = sML.applyRtL(I.createSubpanel({ id: "bibi-subpanel_config" }), e.Config);
                    delete n.create;
                    n.bindOpener(e.R.addButtonGroup({ Sticky: !0 }).addButton({
                        Type: "toggle",
                        Labels: {
                            default: { default: "Configure Setting", ja: "設定を変更" },
                            active: { default: "Close Setting-Menu", ja: "設定メニューを閉じる" }
                        },
                        Help: !0,
                        Icon: '<span class="bibi-icon bibi-icon-config"></span>'
                    }));
                    t.includes("ViewModeSection") ? n.ViewModeSection.create() : delete n.ViewModeSection, t.includes("NewWindowButton") || t.includes("FullscreenButton") ? n.WindowSection.create(t) : delete n.WindowSection, t.includes("WebsiteLink") || t.includes("BibiWebsiteLink") ? n.LinkageSection.create(t) : delete n.LinkageSection, E.dispatch("bibi:created-config")
                } else delete I.Menu.Config
            }
        }, I.Menu.Config.ViewModeSection = {
            create: function () {
                var e, t, n = I.Menu.Config,
                    i = (e = '<span class="bibi-shape bibi-shape-spread">'.concat((t = '<span class="bibi-shape bibi-shape-item"></span>') + t, "</span>")) + e + e,
                    o = n.ViewModeSection = n.addSection({
                        Labels: { default: { default: "View Mode", ja: "表示モード" } }, ButtonGroups: [{
                            ButtonType: "radio",
                            Buttons: [{
                                Mode: "paged",
                                Labels: {
                                    default: {
                                        default: "Paged <small>(Flip with ".concat(O.TouchOS ? "Tap/Swipe" : "Click/Wheel", ")</small>"),
                                        ja: "ページ単位<small>（".concat(O.TouchOS ? "タップ／スワイプ" : "クリック／ホイール", "で移動）</small>")
                                    }
                                },
                                Icon: '<span class="bibi-icon bibi-icon-view bibi-icon-view-paged"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-paged">'.concat(i, "</span></span>")
                            }, {
                                Mode: "horizontal",
                                Labels: { default: { default: "Horizontal Scroll", ja: "横スクロール" } },
                                Icon: '<span class="bibi-icon bibi-icon-view bibi-icon-view-horizontal"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-horizontal">'.concat(i, "</span></span>")
                            }, {
                                Mode: "vertical",
                                Labels: { default: { default: "Vertical Scroll", ja: "縦スクロール" } },
                                Icon: '<span class="bibi-icon bibi-icon-view bibi-icon-view-vertical"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-vertical">'.concat(i, "</span></span>")
                            }].map((function (e) {
                                return sML.edit(e, {
                                    Notes: !0, action: function () {
                                        return R.changeView(e, { NoNotification: !0 })
                                    }
                                })
                            }))
                        }, {
                            Buttons: [{
                                Name: "full-breadth-layout-in-scroll",
                                Type: "toggle",
                                Notes: !1,
                                Labels: {
                                    default: {
                                        default: "Full Width for Each Page <small>(in Scrolling Mode)</small>",
                                        ja: "スクロール表示で各ページを幅一杯に</small>"
                                    }
                                },
                                Icon: '<span class="bibi-icon bibi-icon-full-breadth-layout"></span>',
                                action: function () {
                                    var e = "active" == this.UIState;
                                    S.update({ "full-breadth-layout-in-scroll": e }), e ? O.HTML.classList.add("book-full-breadth") : O.HTML.classList.remove("book-full-breadth"), "horizontal" != S.RVM && "vertical" != S.RVM || R.changeView({
                                        Mode: S.RVM,
                                        Force: !0
                                    }), S["keep-settings"] && O.Biscuits.memorize("Book", { FBL: S["full-breadth-layout-in-scroll"] })
                                }
                            }]
                        }]
                    });
                E.add("bibi:updated-settings", (function () {
                    o.ButtonGroups[0].Buttons.forEach((function (e) {
                        return I.setUIState(e, e.Mode == S.RVM ? "active" : "default")
                    }))
                })), E.add("bibi:updated-settings", (function () {
                    var e = o.ButtonGroups[o.ButtonGroups.length - 1];
                    e.style.display = "pre-paginated" == S.BRL ? "" : "none", e.Buttons.forEach((function (e) {
                        return I.setUIState(e, S[e.Name] ? "active" : "default")
                    }))
                }))
            }
        }, I.Menu.Config.WindowSection = {
            create: function (e) {
                var t = I.Menu.Config, n = [];
                (e.includes("NewWindowButton") && n.push({
                    Type: "link",
                    Labels: { default: { default: "Open in New Window", ja: "あたらしいウィンドウで開く" } },
                    Icon: '<span class="bibi-icon bibi-icon-open-newwindow"></span>',
                    id: "bibi-button-open-newwindow",
                    href: O.RequestedURL,
                    target: "_blank"
                }), e.includes("FullscreenButton") && (n.push({
                    Type: "toggle",
                    Labels: {
                        default: { default: "Enter Fullscreen", ja: "フルスクリーンモード" },
                        active: { default: "Exit Fullscreen", ja: "フルスクリーンモード解除" }
                    },
                    Icon: '<span class="bibi-icon bibi-icon-toggle-fullscreen"></span>',
                    id: "bibi-button-toggle-fullscreen",
                    action: function () {
                        O.Fullscreen ? O.FullscreenTarget.ownerDocument.exitFullscreen() : O.FullscreenTarget.requestFullscreen(), t.close()
                    }
                }), O.FullscreenTarget.ownerDocument.addEventListener("fullscreenchange", (function () {
                    O.FullscreenButton || (O.FullscreenButton = document.getElementById("bibi-button-toggle-fullscreen")), this.fullscreenElement == O.FullscreenTarget ? (O.Fullscreen = !0, O.HTML.classList.add("fullscreen"), I.setUIState(O.FullscreenButton, "active")) : O.Fullscreen && (O.Fullscreen = !1, O.HTML.classList.remove("fullscreen"), I.setUIState(O.FullscreenButton, "default"))
                }))), n.length) && (t.WindowSection = t.addSection({
                    Labels: {
                        default: {
                            default: "Window Control",
                            ja: "ウィンドウ制御"
                        }
                    }
                })).addButtonGroup({ Buttons: n })
            }
        }, I.Menu.Config.LinkageSection = {
            create: function (e) {
                var t = I.Menu.Config, n = [];
                (e.includes("WebsiteLink") && n.push({
                    Type: "link",
                    Labels: { default: { default: S["website-name-in-menu"].replace(/&/gi, "&amp;").replace(/</gi, "&lt;").replace(/>/gi, "&gt;") } },
                    Icon: '<span class="bibi-icon bibi-icon-open-newwindow"></span>',
                    href: S["website-href"],
                    target: "_blank"
                }), e.includes("BibiWebsiteLink") && n.push({
                    Type: "link",
                    Labels: { default: { default: "Bibi | Official Website" } },
                    Icon: '<span class="bibi-icon bibi-icon-open-newwindow"></span>',
                    href: Bibi.href,
                    target: "_blank"
                }), n.length) && (t.LinkageSection = t.addSection({
                    Labels: {
                        default: {
                            default: "Link".concat(n.length > 1 ? "s" : ""),
                            ja: "リンク"
                        }
                    }
                })).addButtonGroup({ Buttons: n })
            }
        }, I.Panel = {
            create: function () {
                var e = I.Panel = O.Body.appendChild(sML.create("div", { id: "bibi-panel" }));
                I.setToggleAction(e, {
                    onopened: function () {
                        O.HTML.classList.add("panel-opened"), E.dispatch("bibi:opened-panel")
                    }, onclosed: function () {
                        O.HTML.classList.remove("panel-opened"), E.dispatch("bibi:closed-panel")
                    }
                }), E.add("bibi:commands:open-panel", e.open), E.add("bibi:commands:close-panel", e.close), E.add("bibi:commands:toggle-panel", e.toggle), E.add("bibi:closes-utilities", e.close), I.setFeedback(e, { StopPropagation: !0 }), e.addTapEventListener("tapped", (function () {
                    return E.dispatch("bibi:commands:toggle-panel")
                })), e.BookInfo = e.appendChild(sML.create("div", { id: "bibi-panel-bookinfo" })), e.BookInfo.Cover = e.BookInfo.appendChild(sML.create("div", { id: "bibi-panel-bookinfo-cover" })), e.BookInfo.Cover.Info = e.BookInfo.Cover.appendChild(sML.create("p", { id: "bibi-panel-bookinfo-cover-info" }));
                var t = e.Opener = I.Menu.L.addButtonGroup({ Sticky: !0 }).addButton({
                    Type: "toggle",
                    Labels: {
                        default: { default: "Open Index", ja: "目次を開く" },
                        active: { default: "Close Index", ja: "目次を閉じる" }
                    },
                    Help: !0,
                    Icon: '<span class="bibi-icon bibi-icon-toggle-panel">'.concat(function (e) {
                        for (var t = 1; t <= 6; t++) e += "<span></span>";
                        return e
                    }(""), "</span>"),
                    action: function () {
                        return e.toggle()
                    }
                });
                E.add("bibi:opened-panel", (function () {
                    return I.setUIState(t, "active")
                })), E.add("bibi:closed-panel", (function () {
                    return I.setUIState(t, "")
                })), E.add("bibi:started", (function () {
                    return sML.style(t, { display: "block" })
                })), E.dispatch("bibi:created-panel")
            }
        }, I.Help = {
            create: function () {
                var e = I.Help = O.Body.appendChild(sML.create("div", { id: "bibi-help" }));
                e.Message = e.appendChild(sML.create("p", {
                    className: "hidden",
                    id: "bibi-help-message"
                })), e.show = function (t) {
                    clearTimeout(e.Timer_deactivate1), clearTimeout(e.Timer_deactivate2), e.classList.add("active"), e.Message.innerHTML = t, setTimeout((function () {
                        return e.classList.add("shown")
                    }), 0)
                }, e.hide = function () {
                    e.Timer_deactivate1 = setTimeout((function () {
                        e.classList.remove("shown"), e.Timer_deactivate2 = setTimeout((function () {
                            return e.classList.remove("active")
                        }), 200)
                    }), 100)
                }
            }
        }, I.PoweredBy = {
            create: function () {
                I.PoweredBy = O.Body.appendChild(sML.create("div", {
                    id: "bibi-poweredby",
                    innerHTML: '<p><a href="'.concat(Bibi.href, '" target="_blank" title="Bibi | Official Website">Bibi</a></p>')
                }))
            }
        }, I.FontSizeChanger = {
            create: function () {
                var e = I.FontSizeChanger = {};
                if (("number" != typeof S["font-size-scale-per-step"] || S["font-size-scale-per-step"] <= 1) && (S["font-size-scale-per-step"] = 1.25), S["use-font-size-changer"] && S["keep-settings"]) {
                    var t = O.Biscuits.remember("Bibi");
                    t && t.FontSize && null != t.FontSize.Step && (e.Step = 1 * t.FontSize.Step)
                }
                if (("number" != typeof e.Step || e.Step < -2 || 2 < e.Step) && (e.Step = 0), E.bind("bibi:postprocessed-item", (function (t) {
                    if ("pre-paginated" == t.Ref["rendition:layout"]) return !1;
                    if (t.changeFontSize = function (e) {
                        t.FontSizeStyleRule && sML.deleteCSSRule(t.contentDocument, t.FontSizeStyleRule), t.FontSizeStyleRule = sML.appendCSSRule(t.contentDocument, "html", "font-size: " + e + "px !important;")
                    }, t.changeFontSizeStep = function (e) {
                        return t.changeFontSize(t.FontSize.Base * Math.pow(S["font-size-scale-per-step"], e))
                    }, t.FontSize = { Default: 1 * getComputedStyle(t.HTML).fontSize.replace(/[^\d]*$/, "") }, t.FontSize.Base = t.FontSize.Default, t.Preprocessed && (sML.UA.Chrome || sML.UA.Trident) ? sML.forEach(t.HTML.querySelectorAll("body, body *"))((function (e) {
                        return e.style.fontSize = parseInt(getComputedStyle(e).fontSize) / t.FontSize.Base + "rem"
                    })) : O.editCSSRules(t.contentDocument, (function (e) {
                        if (e && e.selectorText && !/^@/.test(e.selectorText)) {
                            try {
                                if (t.contentDocument.querySelector(e.selectorText) == t.HTML) return
                            } catch (e) {
                            }
                            var n = { pt: / font-size: (\d[\d\.]*)pt; /, px: / font-size: (\d[\d\.]*)px; / };
                            n.pt.test(e.cssText) && (e.style.fontSize = e.cssText.match(n.pt)[1] * (96 / 72) / t.FontSize.Base + "rem"), n.px.test(e.cssText) && (e.style.fontSize = e.cssText.match(n.px)[1] / t.FontSize.Base + "rem")
                        }
                    })), "number" == typeof S["base-font-size"] && S["base-font-size"] > 0) {
                        var n = 0, i = {};
                        sML.forEach(t.Body.querySelectorAll("p, p *"))((function (e) {
                            if (e.innerText.replace(/\s/g, "")) {
                                var t = Math.round(100 * getComputedStyle(e).fontSize.replace(/[^\d]*$/, "")) / 100;
                                i[t] || (i[t] = []), i[t].push(e)
                            }
                        }));
                        var o = 0;
                        for (var r in i) i[r].length > o && (o = i[r].length, n = r);
                        n && (t.FontSize.Base = t.FontSize.Base * (S["base-font-size"] / n)), t.changeFontSizeStep(e.Step)
                    } else 0 != e.Step && t.changeFontSizeStep(e.Step)
                })), e.changeFontSizeStep = function (t, n) {
                    "pre-paginated" != S.BRL && t != e.Step && (n || (n = {}), E.dispatch("bibi:changes-font-size"), "function" == typeof n.before && n.before(), e.Step = t, S["use-font-size-changer"] && S["keep-settings"] && O.Biscuits.memorize("Book", { FontSize: { Step: t } }), setTimeout((function () {
                        R.layOut({
                            before: function () {
                                return R.Items.forEach((function (e) {
                                    e.changeFontSizeStep && e.changeFontSizeStep(t)
                                }))
                            }, Reset: !0, DoNotCloseUtilities: !0, NoNotification: !0
                        }).then((function () {
                            E.dispatch("bibi:changed-font-size", { Step: t }), "function" == typeof n.after && n.after()
                        }))
                    }), 88))
                }, S["use-font-size-changer"]) {
                    var n = function () {
                        var t = this;
                        e.changeFontSizeStep(t.Step, {
                            before: function () {
                                return t.ButtonGroup.Busy = !0
                            }, after: function () {
                                return t.ButtonGroup.Busy = !1
                            }
                        })
                    };
                    I.createSubpanel({
                        Opener: I.Menu.R.addButtonGroup({
                            Sticky: !0,
                            id: "bibi-buttongroup_font-size"
                        }).addButton({
                            Type: "toggle",
                            Labels: {
                                default: { default: "Change Font Size", ja: "文字サイズを変更" },
                                active: { default: "Close Font Size Menu", ja: "文字サイズメニューを閉じる" }
                            },
                            Icon: '<span class="bibi-icon bibi-icon-change-fontsize"></span>',
                            Help: !0
                        }), id: "bibi-subpanel_font-size", open: function () {
                        }
                    }).addSection({
                        Labels: {
                            default: {
                                default: "Choose Font Size",
                                ja: "文字サイズを選択"
                            }
                        }
                    }).addButtonGroup({
                        ButtonType: "radio",
                        Buttons: [{
                            Labels: {
                                default: {
                                    default: '<span class="non-visual-in-label">Font Size:</span> Ex-Large',
                                    ja: '<span class="non-visual-in-label">文字サイズ：</span>最大'
                                }
                            },
                            Icon: '<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-exlarge"></span>',
                            action: n,
                            Step: 2
                        }, {
                            Labels: {
                                default: {
                                    default: '<span class="non-visual-in-label">Font Size:</span> Large',
                                    ja: '<span class="non-visual-in-label">文字サイズ：</span>大'
                                }
                            },
                            Icon: '<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-large"></span>',
                            action: n,
                            Step: 1
                        }, {
                            Labels: {
                                default: {
                                    default: '<span class="non-visual-in-label">Font Size:</span> Medium <small>(default)</small>',
                                    ja: '<span class="non-visual-in-label">文字サイズ：</span>中<small>（初期値）</small>'
                                }
                            },
                            Icon: '<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-medium"></span>',
                            action: n,
                            Step: 0
                        }, {
                            Labels: {
                                default: {
                                    default: '<span class="non-visual-in-label">Font Size:</span> Small',
                                    ja: '<span class="non-visual-in-label">文字サイズ：</span>小'
                                }
                            },
                            Icon: '<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-small"></span>',
                            action: n,
                            Step: -1
                        }, {
                            Labels: {
                                default: {
                                    default: '<span class="non-visual-in-label">Font Size:</span> Ex-Small',
                                    ja: '<span class="non-visual-in-label">文字サイズ：</span>最小'
                                }
                            },
                            Icon: '<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-exsmall"></span>',
                            action: n,
                            Step: -2
                        }]
                    }).Buttons.forEach((function (t) {
                        t.Step == e.Step && I.setUIState(t, "active")
                    }))
                }
                E.dispatch("bibi:created-font-size-changer")
            }
        }, I.Loupe = {
            create: function () {
                S["loupe-max-scale"] <= 2 && (S["loupe-max-scale"] = 4);
                var e = I.Loupe = {
                    scale: function (t, n) {
                        if ("number" != typeof t) return !1;
                        var i = R.Main.Transformation;
                        if ((t = Math.round(100 * t) / 100) != i.Scale) {
                            if (E.dispatch("bibi:changes-scale", t), t < 1) e.transform({
                                Scale: t,
                                TranslateX: R.Main.offsetWidth * (1 - t) / 2,
                                TranslateY: R.Main.offsetHeight * (1 - t) / 2
                            }); else if (1 == t) e.transform({ Scale: 1, TranslateX: 0, TranslateY: 0 }); else {
                                if ("active" != e.UIState) return !1;
                                n || (n = {
                                    Coord: {
                                        X: window.innerWidth / 2,
                                        Y: window.innerHeight / 2
                                    }
                                }), e.transform({
                                    Scale: t,
                                    TranslateX: i.TranslateX + (n.Coord.X - window.innerWidth / 2 - i.TranslateX) * (1 - t / i.Scale),
                                    TranslateY: i.TranslateY + (n.Coord.Y - window.innerHeight / 2 - i.TranslateY) * (1 - t / i.Scale)
                                })
                            }
                            E.dispatch("bibi:changed-scale", R.Main.Transformation.Scale)
                        }
                    }, transform: function (t, n) {
                        return new Promise((function (i, o) {
                            if (!t) return o();
                            n || (n = {}), e.Transforming = !0, clearTimeout(e.Timer_onTransformEnd), O.HTML.classList.add("transforming");
                            var r, a = R.Main.Transformation;
                            if ("number" != typeof t.Scale && (t.Scale = a.Scale), "number" != typeof t.TranslateX && (t.TranslateX = a.TranslateX), "number" != typeof t.TranslateY && (t.TranslateY = a.TranslateY), t.Scale > 1) {
                                var s = window.innerWidth * (.5 * (t.Scale - 1)),
                                    c = window.innerHeight * (.5 * (t.Scale - 1));
                                t.TranslateX = sML.limitMinMax(t.TranslateX, -1 * s, s), t.TranslateY = sML.limitMinMax(t.TranslateY, -1 * c, c)
                            }
                            sML.style(R.Main, { transform: (r = [], t.TranslateX && t.TranslateY ? r.push("translate(" + t.TranslateX + "px, " + t.TranslateY + "px)") : t.TranslateX ? r.push("translateX(" + t.TranslateX + "px)") : t.TranslateY && r.push("translateY(" + t.TranslateY + "px)"), 1 != t.Scale && r.push("scale(" + t.Scale + ")"), r.length ? r.join(" ") : "") }), R.Main.PreviousTransformation = R.Main.Transformation, R.Main.Transformation = t, e.Timer_onTransformEnd = setTimeout((function () {
                                1 == R.Main.Transformation.Scale ? (O.HTML.classList.remove("zoomed-in"), O.HTML.classList.remove("zoomed-out")) : R.Main.Transformation.Scale < 1 ? (O.HTML.classList.remove("zoomed-in"), O.HTML.classList.add("zoomed-out")) : (O.HTML.classList.add("zoomed-in"), O.HTML.classList.remove("zoomed-out")), O.HTML.classList.remove("transforming"), e.Transforming = !1, i(), E.dispatch("bibi:transformed-book", {
                                    Transformation: t,
                                    Temporary: n.Temporary
                                })
                            }), 345)
                        }))
                    }, transformBack: function (t) {
                        return e.transform(R.Main.PreviousTransformation, t) || e.transformReset(t)
                    }, transformReset: function (t) {
                        return e.transform({ Scale: 1, TranslateX: 0, TranslateY: 0 }, t)
                    }, BookStretchingEach: 0, defineZoomOutPropertiesForUtilities: function () {
                        var t = S["use-menubar"] && S["use-full-height"] ? I.Menu.Height : 0,
                            n = "vertical" == S.ARA ? I.Slider.Size : 0, i = "horizontal" == S.ARA ? I.Slider.Size : 0,
                            o = {};
                        "horizontal" == S.ARA ? (o.Scale = (R.Main.offsetHeight - (t + i)) / (R.Main.offsetHeight - (S.ARA != S.SLA || "paged" == S.RVM && !I.Slider.UI ? 0 : O.Scrollbars.Height)), o.TranslateX = 0) : (o.Scale = Math.min((R.Main.offsetWidth - n) / (R.Main.offsetWidth - O.Scrollbars.Width), (R.Main.offsetHeight - t) / R.Main.offsetHeight), o.TranslateX = 0), o.TranslateY = t - R.Main.offsetHeight * (1 - o.Scale) / 2;
                        var r = O.Body["offset" + C.A_SIZE_L] / o.Scale - R.Main["offset" + C.A_SIZE_L], a = {};
                        a[C.A_BASE_B] = r / 2 + (S["use-full-height"] || "vertical" != S.ARA ? 0 : I.Menu.Height), a[C.A_BASE_A] = r / 2;
                        var s = {};
                        S.ARA == S.SLA && (s["horizontal" == S.ARA ? "Right" : "Bottom"] = r / 2), e.ZoomOutPropertiesForUtilities = {
                            Transformation: o,
                            Stretch: r,
                            OuterPadding: a,
                            InnerPadding: s
                        }
                    }, zoomOutForUtilities: function () {
                        e.defineZoomOutPropertiesForUtilities();
                        var t = e.ZoomOutPropertiesForUtilities, n = t.OuterPadding, i = t.InnerPadding;
                        for (var o in n) R.Main.style["padding" + o] = n[o] + "px";
                        for (var r in i) R.Main.Book.style["padding" + r] = i[r] + "px";
                        return e.BookStretchingEach = t.Stretch / 2, e.transform(t.Transformation, { Temporary: !0 }).then((function () {
                            I.Slider.UI && I.Slider.progress()
                        }))
                    }, resetZoomingOutForUtilities: function () {
                        return e.transformReset().then((function () {
                            R.Main.style.padding = R.Main.Book.style.padding = "", e.BookStretchingEach = 0, I.Slider.UI && I.Slider.progress()
                        }))
                    }, isAvailable: function (t) {
                        if (!L.Opened) return !1;
                        if ("active" != e.UIState) return !1;
                        if ("reflowable" == S.BRL) return !1;
                        if ("TAP" == t) {
                            if (!I.KeyListener.ActiveKeys || !I.KeyListener.ActiveKeys.Space) return !1;
                            if ("active" == I.Slider.UIState) return !1
                        } else if ("MOVE" == t) {
                            if (1 == R.Main.Transformation.Scale) return !1;
                            if ("active" == I.Slider.UIState) return !1
                        } else if (!R.PointerIsDowned) return !1;
                        return !0
                    }, adjustScale: function (e) {
                        return sML.limitMinMax(e, 1, S["loupe-max-scale"])
                    }, onTapped: function (t) {
                        if (!e.isAvailable("TAP")) return !1;
                        var n = O.getBibiEvent(t);
                        if (n.Target.tagName) {
                            if (/bibi-menu|bibi-slider/.test(n.Target.id)) return !1;
                            if (O.isAnchorContent(n.Target)) return !1;
                            if ("horizontal" == S.RVM && n.Coord.Y > window.innerHeight - O.Scrollbars.Height) return !1
                        }
                        e.scale(e.adjustScale(R.Main.Transformation.Scale + .5 * (t.shiftKey ? -1 : 1) * 2), n)
                    }, onPointerDown: function (t) {
                        e.PointerDownCoord = O.getBibiEvent(t).Coord, e.PointerDownTransformation = {
                            Scale: R.Main.Transformation.Scale,
                            TranslateX: R.Main.Transformation.TranslateX,
                            TranslateY: R.Main.Transformation.TranslateY
                        }
                    }, onPointerUp: function (t) {
                        O.HTML.classList.remove("dragging"), e.Dragging = !1, delete e.PointerDownCoord, delete e.PointerDownTransformation
                    }, onPointerMove: function (t) {
                        if (!e.isAvailable("MOVE", t)) return !1;
                        if (1 != R.Main.Transformation.Scale && e.PointerDownCoord) {
                            e.Dragging = !0, O.HTML.classList.add("dragging");
                            var n = O.getBibiEvent(t);
                            clearTimeout(e.Timer_TransitionRestore), sML.style(R.Main, { transition: "none" }, { cursor: "move" }), e.transform({
                                Scale: R.Main.Transformation.Scale,
                                TranslateX: e.PointerDownTransformation.TranslateX + (n.Coord.X - e.PointerDownCoord.X),
                                TranslateY: e.PointerDownTransformation.TranslateY + (n.Coord.Y - e.PointerDownCoord.Y)
                            }), e.Timer_TransitionRestore = setTimeout((function () {
                                return sML.style(R.Main, { transition: "" }, { cursor: "" })
                            }), 234)
                        }
                    }, lock: function () {
                        E.dispatch("bibi:locked-loupe"), e.Locked = !0
                    }, unlock: function () {
                        e.Locked = !1, E.dispatch("bibi:unlocked-loupe")
                    }
                };
                if (I.isPointerStealth.addChecker((function () {
                    return !!e.Dragging || !(!I.KeyListener.ActiveKeys || !I.KeyListener.ActiveKeys.Space)
                })), I.setToggleAction(e, {
                    onopened: function () {
                        O.HTML.classList.add("loupe-active")
                    }, onclosed: function () {
                        e.scale(1), O.HTML.classList.remove("loupe-active")
                    }
                }), E.add("bibi:commands:activate-loupe", (function () {
                    return e.open()
                })), E.add("bibi:commands:deactivate-loupe", (function () {
                    return e.close()
                })), E.add("bibi:commands:toggle-loupe", (function () {
                    return e.toggle()
                })), E.add("bibi:commands:scale", (function (t) {
                    return e.scale(t)
                })), E.add("bibi:tapped", (function (t) {
                    return e.onTapped(t)
                })), E.add("bibi:downed-pointer", (function (t) {
                    return e.onPointerDown(t)
                })), E.add("bibi:upped-pointer", (function (t) {
                    return e.onPointerUp(t)
                })), E.add("bibi:moved-pointer", (function (t) {
                    return e.onPointerMove(t)
                })), E.add("bibi:changed-scale", (function (e) {
                    return O.log("Changed Scale: ".concat(e))
                })), S["zoom-out-for-utilities"] && (E.add("bibi:opens-utilities", (function () {
                    return e.zoomOutForUtilities()
                })), E.add("bibi:closes-utilities", (function () {
                    return e.resetZoomingOutForUtilities()
                }))), E.add("bibi:opened", (function () {
                    if (e.open(), S["use-loupe"] && S["keep-settings"]) {
                        var t = O.Biscuits.remember("Book").Transformation;
                        t && e.transform(t)
                    }
                })), E.add("bibi:transformed-book", (function (e) {
                    if (e.Temporary) return !1;
                    S["use-loupe"] && S["keep-settings"] && O.Biscuits.memorize("Book", { Transformation: e.Transformation })
                })), E.add("bibi:changes-view", (function () {
                    return e.scale(1)
                })), E.add("bibi:opened-slider", (function () {
                    return e.lock()
                })), E.add("bibi:closed-slider", (function () {
                    return e.unlock()
                })), S["use-loupe"]) {
                    var t = I.Menu.R.addButtonGroup({
                        Sticky: !0,
                        Tiled: !0,
                        id: "bibi-buttongroup_loupe",
                        Buttons: [{
                            Labels: { default: { default: "Zoom-in", ja: "拡大する" } },
                            Icon: '<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-zoomin"></span>',
                            Help: !0,
                            action: function () {
                                return e.scale(e.adjustScale(R.Main.Transformation.Scale + .5))
                            },
                            updateState: function (e) {
                                I.setUIState(this, "string" == typeof e ? e : R.Main.Transformation.Scale >= S["loupe-max-scale"] ? "disabled" : "default")
                            }
                        }, {
                            Labels: { default: { default: "Reset Zoom-in/out", ja: "元のサイズに戻す" } },
                            Icon: '<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-reset"></span>',
                            Help: !0,
                            action: function () {
                                return e.scale(1)
                            },
                            updateState: function (e) {
                                I.setUIState(this, "string" == typeof e ? e : 1 == R.Main.Transformation.Scale ? "disabled" : "default")
                            }
                        }, {
                            Labels: { default: { default: "Zoom-out", ja: "縮小する" } },
                            Icon: '<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-zoomout"></span>',
                            Help: !0,
                            action: function () {
                                return e.scale(e.adjustScale(R.Main.Transformation.Scale - .5))
                            },
                            updateState: function (e) {
                                I.setUIState(this, "string" == typeof e ? e : R.Main.Transformation.Scale <= 1 ? "disabled" : "default")
                            }
                        }]
                    });
                    e.updateButtonState = function (e) {
                        return t.Buttons.forEach((function (t) {
                            return t.updateState(e)
                        }))
                    }, E.add("bibi:opened", (function () {
                        return e.updateButtonState()
                    })), E.add("bibi:transformed-book", (function () {
                        return e.updateButtonState(e.Locked ? "disabled" : null)
                    })), E.add("bibi:locked-loupe", (function () {
                        return e.updateButtonState("disabled")
                    })), E.add("bibi:unlocked-loupe", (function () {
                        return e.updateButtonState()
                    }))
                }
                E.dispatch("bibi:created-loupe")
            }
        }, I.Nombre = {
            create: function () {
                if (S["use-nombre"]) {
                    var e = I.Nombre = O.Body.appendChild(sML.create("div", {
                        id: "bibi-nombre", show: function () {
                            clearTimeout(e.Timer_hot), clearTimeout(e.Timer_vanish), e.classList.add("active"), e.Timer_hot = setTimeout((function () {
                                return e.classList.add("hot")
                            }), 10)
                        }, hide: function () {
                            clearTimeout(e.Timer_hot), clearTimeout(e.Timer_vanish), e.classList.remove("hot"), e.Timer_vanish = setTimeout((function () {
                                return e.classList.remove("active")
                            }), 255)
                        }, progress: function (t) {
                            if (clearTimeout(e.Timer_hide), t || (t = R.Current), t.List.length) {
                                var n, i = t.List[0].Page.Index + 1, o = t.List.slice(-1)[0].Page.Index + 1,
                                    r = Math.floor(o / R.Pages.length * 100);
                                e.Current.innerHTML = (n = i, i != o && (n += '<span class="delimiter">-</span>' + o), n), e.Delimiter.innerHTML = "/", e.Total.innerHTML = R.Pages.length, e.Percent.innerHTML = "(".concat(r, '<span class="unit">%</span>)'), e.show(), e.Timer_hide = setTimeout(e.hide, 1234)
                            }
                        }
                    }));
                    e.Current = e.appendChild(sML.create("span", { id: "bibi-nombre-current" })), e.Delimiter = e.appendChild(sML.create("span", { id: "bibi-nombre-delimiter" })), e.Total = e.appendChild(sML.create("span", { id: "bibi-nombre-total" })), e.Percent = e.appendChild(sML.create("span", { id: "bibi-nombre-percent" })), E.add("bibi:opened", (function () {
                        setTimeout((function () {
                            e.progress(), E.add("bibi:changed-intersection", (function () {
                                return e.progress()
                            }))
                        }), 321)
                    })), sML.appendCSSRule("html.view-paged div#bibi-nombre", "bottom: " + (O.Scrollbars.Height + 2) + "px;"), sML.appendCSSRule("html.view-horizontal div#bibi-nombre", "bottom: " + (O.Scrollbars.Height + 2) + "px;"), sML.appendCSSRule("html.view-vertical div#bibi-nombre", "right: " + (O.Scrollbars.Height + 2) + "px;"), E.dispatch("bibi:created-nombre")
                }
            }
        }, I.History = {
            List: [], Updaters: [], update: function () {
                return I.History.Updaters.forEach((function (e) {
                    return e()
                }))
            }, add: function () {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                e.UI || (e.UI = Bibi);
                var t = e.Destination ? R.hatchPage(e.Destination) : (R.updateCurrent(), R.Current.List[0].Page),
                    n = R.hatchPage(I.History.List[I.History.List.length - 1]);
                if (t != n) {
                    e.SumUp && I.History.List[I.History.List.length - 1].UI == e.UI && I.History.List.pop();
                    var i = t.Spread;
                    if (I.History.List.push({
                        UI: e.UI,
                        Spread: i,
                        PageProgressInSpread: t.IndexInSpread / i.Pages.length
                    }), I.History.List.length - 1 > S["max-history"]) {
                        var o = I.History.List.shift();
                        I.History.List.shift(), I.History.List.unshift(o)
                    }
                }
                I.History.update()
            }, back: function () {
                if (I.History.List.length <= 1) return Promise.reject();
                R.hatchPage(I.History.List.pop());
                var e = R.hatchPage(I.History.List[I.History.List.length - 1]);
                return I.History.update(), R.focusOn({ Destination: e, Duration: 0 })
            }
        }, I.Slider = {
            create: function () {
                if (!S["use-slider"]) return !1;
                var e = I.Slider = O.Body.appendChild(sML.create("div", {
                    id: "bibi-slider", Size: I.Slider.Size, initialize: function () {
                        "bookmap" != S["slider-mode"] && (S["slider-mode"] = "edgebar"), e.UI = ("edgebar" == S["slider-mode"] ? e.Edgebar : e.Bookmap).create().initialize();
                        var t = e.appendChild(e.UI.Box);
                        e.Rail = t.appendChild(sML.create("div", { id: "bibi-slider-rail" })), e.Rail.Progress = e.Rail.appendChild(sML.create("div", { id: "bibi-slider-rail-progress" })), e.Thumb = t.appendChild(sML.create("div", {
                            id: "bibi-slider-thumb",
                            Labels: { default: { default: "Slider Thumb", ja: "スライダー上の好きな位置からドラッグを始められます" } }
                        })), I.setFeedback(e.Thumb), S["use-history"] && (e.classList.add("bibi-slider-with-history"), e.History = e.appendChild(sML.create("div", { id: "bibi-slider-history" })), e.History.add = function (t) {
                            return I.History.add({ UI: e, SumUp: !1, Destination: t })
                        }, e.History.Button = e.History.appendChild(I.createButtonGroup()).addButton({
                            id: "bibi-slider-history-button",
                            Type: "normal",
                            Labels: { default: { default: "History Back", ja: "移動履歴を戻る" } },
                            Help: !1,
                            Icon: '<span class="bibi-icon bibi-icon-history"></span>',
                            action: function () {
                                return I.History.back()
                            },
                            update: function () {
                                this.Icon.style.transform = "rotate(".concat(360 * (I.History.List.length - 1), "deg)"), I.History.List.length <= 1 ? I.setUIState(this, "disabled") : "disabled" == this.UIState && I.setUIState(this, "default")
                            }
                        }), I.History.Updaters.push((function () {
                            return e.History.Button.update()
                        })))
                    }, resetThumbAndRailSize: function () {
                        var t = R.Main["scroll" + C.L_SIZE_L];
                        S.ARA == S.SLA && (t -= I.Loupe.BookStretchingEach * ("horizontal" == S.SLA ? 2 : 3));
                        var n = R.Stage[C.L_SIZE_L] / t * 100;
                        e.Thumb.style[C.A_SIZE_l] = n + "%", e.Rail.style[C.A_SIZE_l] = 100 - n + "%", e.Thumb.style[C.A_SIZE_b] = e.Rail.style[C.A_SIZE_b] = "", e.resetRailCoords()
                    }, resetRailCoords: function () {
                        e.Rail.Coords = [O.getElementCoord(e.Rail)[C.A_AXIS_L]], e.Rail.Coords.push(e.Rail.Coords[0] + e.Rail["offset" + C.A_SIZE_L])
                    }, progress: function () {
                        if (!e.Touching) {
                            e.Thumb.style.top = e.Thumb.style.right = e.Thumb.style.bottom = e.Thumb.style.left = "";
                            var t = R.Main["scroll" + C.L_OOBL_L], n = R.Main["scroll" + C.L_SIZE_L];
                            S.ARA == S.SLA ? n -= I.Loupe.BookStretchingEach * ("horizontal" == S.SLA ? 2 : 3) : "rtl" == S.ARD && (t = n - t - R.Stage.Height), e.Thumb.style[C.A_OOBL_l] = t / n * 100 + "%", e.Rail.Progress.style.width = e.Rail.Progress.style.height = "";
                            var i = O.getElementCoord(e.Thumb)[C.A_AXIS_L] + e.Thumb["offset" + C.A_SIZE_L] / 2 - O.getElementCoord(e.Rail)[C.A_AXIS_L];
                            "rtl" == S.ARD && (i = e.Rail["offset" + C.A_SIZE_L] - i), e.Rail.Progress.style[C.A_SIZE_l] = i / e.Rail["offset" + C.A_SIZE_L] * 100 + "%"
                        }
                    }, onTouchStart: function (t) {
                        t.preventDefault(), e.History && e.History.add({ Page: R.Current.List[0].Page }), e.Touching = !0, e.TouchStartThumbCenterCoord = O.getElementCoord(e.Thumb)[C.A_AXIS_L] + e.Thumb["offset" + C.A_SIZE_L] / 2, e.TouchStartCoord = e.TouchingCoord = e.getTouchStartCoord(t), clearTimeout(e.Timer_onTouchEnd), O.HTML.classList.add("slider-sliding"), E.add("bibi:moved-pointer", e.onTouchMove)
                    }, getTouchStartCoord: function (t) {
                        return t.target == e.Thumb ? O.getBibiEventCoord(t)[C.A_AXIS_L] : O.getElementCoord(e.Thumb)[C.A_AXIS_L] + e.Thumb["offset" + C.A_SIZE_L] / 2
                    }, onTouchMove: function (t) {
                        e.TouchingCoord = O.getBibiEventCoord(t)[C.A_AXIS_L], e.flip(t)
                    }, onTouchEnd: function (t) {
                        e.Touching && (e.Touching = !1, E.remove("bibi:moved-pointer", e.onTouchMove), e.onTouchMove(t), e.Timer_onTouchEnd = setTimeout((function () {
                            return O.HTML.classList.remove("slider-sliding")
                        }), 125))
                    }, flip: function (t) {
                        if (e.Touching) {
                            var n = e.TouchingCoord - e.TouchStartCoord, i = e.TouchStartThumbCenterCoord + n;
                            i < e.Rail.Coords[0] ? n = e.Rail.Coords[0] - e.TouchStartThumbCenterCoord : i > e.Rail.Coords[1] && (n = e.Rail.Coords[1] - e.TouchStartThumbCenterCoord);
                            var o = e.Thumb["offset" + C.A_OOBL_L] + n;
                            "rtl" == S.ARD && (o = e.Rail["offset" + C.A_SIZE_L] - o), sML.style(e.Thumb, { transform: "translate" + C.A_AXIS_L + "(" + n + "px)" }), sML.style(e.Rail.Progress, _defineProperty({}, C.A_SIZE_l, o + "px")), setTimeout((function () {
                                return e.focus(t, { Turn: !1, History: !1 })
                            }), 9)
                        } else e.focus(t).then((function (t) {
                            sML.style(e.Thumb, { transform: "" }), sML.style(e.Rail.Progress, _defineProperty({}, C.A_SIZE_l, "")), e.progress(), e.History && e.History.add(t)
                        }))
                    }, focus: function (t) {
                        var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                            i = e.UI.identifyPage(t);
                        n.Destination = i;
                        for (var o = R.Current.List.length, r = 0; r < o; r++) if (R.Current.List[r].Page == i) return Promise.resolve();
                        return n.Duration = 0, R.focusOn(n)
                    }, getTouchEndCoord: function () {
                        var t = {};
                        return t[C.A_AXIS_L] = sML.limitMinMax(e.TouchingCoord, e.Rail.Coords[0], e.Rail.Coords[1]), t[C.A_AXIS_B] = O.getElementCoord(e)[C.A_AXIS_B] + e["offset" + C.A_SIZE_B] / 2, t
                    }
                }));
                e.Edgebar = {
                    create: function () {
                        return sML.create("div", {
                            id: "bibi-slider-edgebar", initialize: function () {
                                var t = this;
                                return (this.Box = sML.create("div", { id: "bibi-slider-edgebar-box" })).appendChild(this), O.TouchOS || this.addEventListener(E.pointermove, (function (e) {
                                    return I.Nombre.progress({
                                        List: [{
                                            Page: t.getPointedPage({
                                                X: e.offsetX,
                                                Y: e.offsetY
                                            })
                                        }]
                                    })
                                })), e.Edgebar = this
                            }, getPointedPage: function (t) {
                                var n = t[C.A_AXIS_L] / e.Edgebar["offset" + C.A_SIZE_L],
                                    i = R.Main.Book["offset" + C.L_SIZE_L] * ("rtl" != S.ARD || "ttb" != S.SLD ? n : 1 - n),
                                    o = Math.max(Math.round(R.Pages.length * ("rtl" != S.ARD ? n : 1 - n)) - 1, 0),
                                    r = R.Pages[o],
                                    a = i - O.getElementCoord(r, R.Main.Book)[C.L_AXIS_L] + .5 * r["offset" + C.L_SIZE_L];
                                if (Math.abs(a) < window["inner" + C.L_SIZE_L] / 4) return r;
                                var s = ("rtl" == S.SLD ? -1 : 1) * a < 0 ? -1 : 1;
                                a = Math.abs(a);
                                for (var c = o + s; R.Pages[c]; c += s) {
                                    var l = R.Pages[c],
                                        u = Math.abs(i - O.getElementCoord(l, R.Main.Book)[C.L_AXIS_L] + .5 * l["offset" + C.L_SIZE_L]);
                                    if (!(u < a)) break;
                                    a = u, r = l
                                }
                                return r
                            }, identifyPage: function () {
                                var t = e.getTouchEndCoord();
                                return t[C.A_AXIS_L] -= e.Edgebar.Box["offset" + C.A_OOBL_L], e.Edgebar.getPointedPage(t)
                            }
                        })
                    }
                }, e.Bookmap = {
                    create: function () {
                        return sML.create("div", {
                            id: "bibi-slider-bookmap", initialize: function () {
                                var t = this;
                                return this.Box = sML.create("div", { id: "bibi-slider-bookmap-box" }), R.Spreads.forEach((function (e) {
                                    e.BookmapSpread = sML.create("div", {
                                        className: "bookmap-spread",
                                        Box: t.appendChild(document.createElement("div"))
                                    }), e.Items.forEach((function (t) {
                                        return t.BookmapItem = { Box: e.BookmapSpread.appendChild(document.createElement("div")) }
                                    })), e.BookmapSpread.Box.appendChild(e.BookmapSpread)
                                })), e.Bookmap = this
                            }, putAway: function (t) {
                                return clearTimeout(e.Bookmap.Timer_putIn), !e.Bookmap.Locked && (e.Bookmap.Locked = t, !!e.Bookmap.parentElement && e.Bookmap.Box.removeChild(e.Bookmap))
                            }, putIn: function (t) {
                                return t && (e.Bookmap.Locked = !1), !e.Bookmap.Locked && (!e.Bookmap.parentElement && (e.Bookmap.Timer_putIn = setTimeout((function () {
                                    e.Bookmap.Box.appendChild(e.Bookmap), e.resetThumbAndRailSize()
                                }), t ? 0 : 456)))
                            }, reset: function () {
                                return setTimeout((function () {
                                    e.Bookmap.putAway("Lock"), R.Spreads.forEach((function (t) {
                                        return setTimeout(e.Bookmap.resetSpread, 0, t)
                                    })), e.Bookmap.putIn("Unlock")
                                }), 456)
                            }, resetSpread: function (t) {
                                e.Bookmap.putAway();
                                var n = t.Box, i = t.BookmapSpread, o = i.Box;
                                sML.forEach(i.querySelectorAll("span.bookmap-page"))((function (e) {
                                    return e.parentElement.removeChild(e)
                                })), o.className = "bookmap-spread-box", sML.forEach(n.classList)((function (e) {
                                    "spread-box" != e && o.classList.add(e)
                                })), o.style[C.A_SIZE_b] = i.style[C.A_SIZE_b] = "", o.style[C.A_SIZE_l] = n["offset" + C.L_SIZE_L] / R.Main["scroll" + C.L_SIZE_L] * 100 + "%", i.style[C.A_SIZE_l] = t["offset" + C.L_SIZE_L] / n["offset" + C.L_SIZE_L] * 100 + "%", t.Items.forEach((function (n) {
                                    var i = n.Box, o = n.BookmapItem.Box;
                                    o.className = "bookmap-item-box", sML.forEach(i.classList)((function (e) {
                                        "item-box" != e && o.classList.add(e)
                                    })), o.style[C.A_SIZE_b] = i["offset" + C.L_SIZE_B] / t["offset" + C.L_SIZE_B] * 100 + "%", o.style[C.A_SIZE_l] = i["offset" + C.L_SIZE_L] / t["offset" + C.L_SIZE_L] * 100 + "%", n.Pages.forEach((function (t) {
                                        var i = t.BookmapPage = sML.create("span", {
                                            className: "bookmap-page",
                                            Page: t
                                        });
                                        i.style[C.A_SIZE_l] = 1 / n.Pages.length * 100 + "%", I.Nombre.progress && (i.addEventListener(E.pointerover, (function () {
                                            e.Touching || (clearTimeout(e.Timer_BookmapPagePointerOut), I.Nombre.progress({ List: [{ Page: t }] }))
                                        })), i.addEventListener(E.pointerout, (function () {
                                            e.Touching || (e.Timer_BookmapPagePointerOut = setTimeout((function () {
                                                clearTimeout(I.Nombre.Timer_hide), I.Nombre.hide()
                                            }), 200))
                                        }))), I.setFeedback(i), n.SpreadPair && "pre-paginated" == n.Ref["rendition:layout"] && "pre-paginated" == n.SpreadPair.Ref["rendition:layout"] && (E.add(i, "bibi:hovers", (function (e) {
                                            this.Page.Item.SpreadPair.Pages[0].BookmapPage.classList.add("hover")
                                        })), E.add(i, "bibi:unhovers", (function (e) {
                                            this.Page.Item.SpreadPair.Pages[0].BookmapPage.classList.remove("hover")
                                        }))), o.appendChild(i)
                                    }))
                                })), e.Bookmap.putIn()
                            }, identifyPage: function (t) {
                                var n;
                                if (O.TouchOS || t.target != e.Bookmap && !e.Bookmap.contains(t.target)) {
                                    var i = e.getTouchEndCoord();
                                    n = document.elementFromPoint(i.X, i.Y)
                                } else n = t.target;
                                return e.Bookmap.narrowDownToPage(n)
                            }, narrowDownToPage: function (t) {
                                if (t.classList.contains("bookmap-page")) return t.Page;
                                for (var n = t.classList.contains("bookmap-item") || t.classList.contains("bookmap-spread") ? t.querySelectorAll("span.bookmap-page") : e.Bookmap.querySelectorAll("div.bookmap-spread"), i = e.TouchingCoord * C.A_AXIS_D, o = n[n.length - 1], r = null, a = 0, s = n.length, c = 0; c < s; c++) {
                                    var l = n[c], u = O.getElementCoord(l)[C.A_AXIS_L],
                                        d = (u + ("rtl" != S.ARD ? l["offset" + C.A_SIZE_L] : 0)) * C.A_AXIS_D;
                                    if (d < i) r = l, a = d; else {
                                        var p = (u + ("rtl" == S.ARD ? l["offset" + C.A_SIZE_L] : 0)) * C.A_AXIS_D;
                                        o = i < p && r && i - a < p - i ? r : l
                                    }
                                }
                                return e.Bookmap.narrowDownToPage(o)
                            }
                        })
                    }
                }, e.initialize(), I.setToggleAction(e, {
                    onopened: function () {
                        O.HTML.classList.add("slider-opened"), setTimeout(e.resetRailCoords, 0), E.dispatch("bibi:opened-slider")
                    }, onclosed: function () {
                        new Promise((function (e) {
                            return setTimeout(e, S["zoom-out-for-utilities"] ? 111 : 0)
                        })).then((function () {
                            e.UI.reset && e.UI.reset()
                        })), O.HTML.classList.remove("slider-opened"), setTimeout(e.resetRailCoords, 0), E.dispatch("bibi:closed-slider")
                    }
                }), E.add("bibi:commands:open-slider", e.open), E.add("bibi:commands:close-slider", e.close), E.add("bibi:commands:toggle-slider", e.toggle), E.add("bibi:opens-utilities", (function (e) {
                    return E.dispatch("bibi:commands:open-slider", e)
                })), E.add("bibi:closes-utilities", (function (e) {
                    return E.dispatch("bibi:commands:close-slider", e)
                })), E.add("bibi:loaded-item", (function (t) {
                    return t.HTML.addEventListener(E.pointerup, e.onTouchEnd)
                })), E.add("bibi:opened", (function () {
                    e.UI.addEventListener(E.pointerdown, e.onTouchStart), e.Thumb.addEventListener(E.pointerdown, e.onTouchStart), O.HTML.addEventListener(E.pointerup, e.onTouchEnd), E.add("bibi:changed-intersection", (function () {
                        return e.progress()
                    })), e.progress()
                })), e.UI.reset && E.add(["bibi:opened", "bibi:changed-view"], e.UI.reset), E.add("bibi:laid-out", (function () {
                    S["zoom-out-for-utilities"] && I.Loupe.resetZoomingOutForUtilities(), e.resetThumbAndRailSize(), e.progress()
                })), O.TouchOS || sML.UA.Gecko || e.addEventListener("wheel", R.Main.listenWheel, {
                    capture: !0,
                    passive: !1
                });
                var t = "div#bibi-slider", n = "html.appearance-horizontal " + t, i = O.Scrollbars.Height,
                    o = Math.ceil(i / 2), r = "html.appearance-vertical " + t, a = O.Scrollbars.Width,
                    s = Math.ceil(a / 2), c = function (e) {
                        return ["top", "right", "bottom", "left"].reduce((function (t, n) {
                            return t + n + ": " + -1 * e + "px; "
                        }), "").trim()
                    };
                sML.appendCSSRule(n, "height: " + i + "px;"), sML.appendCSSRule("html.appearance-horizontal div#bibi-slider-thumb:before", c(o) + " border-radius: " + o / 2 + "px; min-width: " + o + "px;"), sML.appendCSSRule(r, "width: " + a + "px;"), sML.appendCSSRule("html.appearance-vertical div#bibi-slider-thumb:before", c(s) + " border-radius: " + s / 2 + "px; min-height: " + s + "px;"), E.dispatch("bibi:created-slider")
            }
        }, I.BookmarkManager = {
            create: function () {
                if (S["use-bookmarks"]) {
                    var e = I.BookmarkManager = {
                        Bookmarks: [], initialize: function () {
                            e.Subpanel = I.createSubpanel({
                                Opener: I.Menu.L.addButtonGroup({
                                    Sticky: !0,
                                    id: "bibi-buttongroup_bookmarks"
                                }).addButton({
                                    Type: "toggle",
                                    Labels: {
                                        default: { default: "Manage Bookmarks", ja: "しおりメニューを開く" },
                                        active: { default: "Close Bookmarks Menu", ja: "しおりメニューを閉じる" }
                                    },
                                    Icon: '<span class="bibi-icon bibi-icon-manage-bookmarks"></span>',
                                    Help: !0
                                }), Position: "left", id: "bibi-subpanel_bookmarks", onopened: function () {
                                    E.add("bibi:scrolled", (function () {
                                        return e.update()
                                    })), e.update()
                                }, onclosed: function () {
                                    E.remove("bibi:scrolled", (function () {
                                        return e.update()
                                    }))
                                }
                            }), e.ButtonGroup = e.Subpanel.addSection({
                                id: "bibi-subpanel-section_bookmarks",
                                Labels: { default: { default: "Bookmarks", ja: "しおり" } }
                            }).addButtonGroup();
                            var t = O.Biscuits.remember("Book", "Bookmarks");
                            t instanceof Array && t.length && (e.Bookmarks = t), delete e.initialize
                        }, exists: function (t) {
                            for (var n = e.Bookmarks.length, i = 0; i < n; i++) if (e.Bookmarks[i]["SI-PPiS"] == t["SI-PPiS"]) return e.Bookmarks[i];
                            return null
                        }, add: function (t) {
                            e.exists(t) ? e.update() : (t.IsHot = !0, e.Bookmarks.push(t), e.update({ Added: t }))
                        }, remove: function (t) {
                            e.Bookmarks = e.Bookmarks.filter((function (e) {
                                return e["SI-PPiS"] != t["SI-PPiS"]
                            })), e.update({ Removed: t })
                        }, update: function () {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                            e.Subpanel.Opener.ButtonGroup.style.display = "", e.ButtonGroup.Buttons && (e.ButtonGroup.Buttons = [], e.ButtonGroup.innerHTML = "");
                            var n = null, i = null;
                            if (t.Added) n = t.Added; else if (L.Opened) {
                                R.updateCurrent();
                                var o = R.Current.List[0].Page;
                                n = {
                                    "SI-PPiS": o.Spread.Index + "-" + o.IndexInSpread / o.Spread.Pages.length,
                                    "%": Math.floor((o.Index + 1) / R.Pages.length * 100)
                                }
                            }
                            e.Bookmarks.length ? e.Bookmarks.forEach((function (t) {
                                var o = "", r = "", a = "bibi-bookmark", s = R.hatchPage({ "SI-PPiS": t["SI-PPiS"] });
                                if (s && "number" == typeof s.Index) {
                                    var c = s.Index + 1;
                                    t["%"] = Math.floor(c / R.Pages.length * 100), o += '<span class="'.concat(a, '-page"><span class="').concat(a, '-unit">P.</span><span class="').concat(a, '-number">').concat(c, "</span></span>"), o += '<span class="'.concat(a, '-total-pages">/<span class="').concat(a, '-number">').concat(R.Pages.length, "</span></span>"), o += ' <span class="'.concat(a, '-percent"><span class="').concat(a, '-parenthesis">(</span><span class="').concat(a, '-number">').concat(t["%"], '</span><span class="').concat(a, '-unit">%</span><span class="').concat(a, '-parenthesis">)</span></span>')
                                } else o += '<span class="'.concat(a, '-percent">') + '<span class="'.concat(a, '-number">').concat(t["%"], '</span><span class="').concat(a, '-unit">%</span>') + "</span>";
                                var l = { default: { default: o, ja: o } };
                                n && t["SI-PPiS"] == n["SI-PPiS"] && (i = t, r = "bibi-button-bookmark-is-current", l.default.default += ' <span class="'.concat(a, '-is-current"></span>'), l.default.ja += ' <span class="'.concat(a, "-is-current ").concat(a, '-is-current-ja"></span>'));
                                var u = e.ButtonGroup.addButton({
                                    className: r,
                                    Type: "normal",
                                    Labels: l,
                                    Icon: '<span class="bibi-icon bibi-icon-bookmark bibi-icon-a-bookmark"></span>',
                                    Bookmark: t,
                                    action: function () {
                                        return L.Opened ? R.focusOn({ Destination: t }).then((function (t) {
                                            return I.History.add({ UI: e, SumUp: !1, Destination: t })
                                        })) : !!L.Waiting && (S["start-in-new-window"] ? window.open(location.href + (location.hash ? "," : "#") + "jo(si-ppis:" + t["SI-PPiS"] + ")") : (S.to = { "SI-PPiS": t["SI-PPiS"] }, void L.play()))
                                    },
                                    remove: function () {
                                        return e.remove(t)
                                    }
                                }), d = u.appendChild(sML.create("span", {
                                    className: "bibi-remove-bookmark",
                                    title: "しおりを削除"
                                }));
                                I.setFeedback(d, { StopPropagation: !0 }).addTapEventListener("tapped", (function () {
                                    return u.remove()
                                })), d.addEventListener(E["pointer-over"], (function (e) {
                                    return e.stopPropagation()
                                })), t.IsHot ? (delete t.IsHot, I.setUIState(u, "active"), setTimeout((function () {
                                    I.setUIState(u, i == t ? "disabled" : "default")
                                }), 234)) : i == t ? I.setUIState(u, "disabled") : I.setUIState(u, "default")
                            })) : L.Opened || (e.Subpanel.Opener.ButtonGroup.style.display = "none"), e.Bookmarks.length < S["max-bookmarks"] && (e.AddButton = e.ButtonGroup.addButton({
                                id: "bibi-button-add-a-bookmark",
                                Type: "normal",
                                Labels: {
                                    default: {
                                        default: "Add a Bookmark to Current Page",
                                        ja: "現在のページにしおりを挟む"
                                    }
                                },
                                Icon: '<span class="bibi-icon bibi-icon-bookmark bibi-icon-add-a-bookmark"></span>',
                                action: function () {
                                    return !!n && e.add(n)
                                }
                            }), n && !i || I.setUIState(e.AddButton, "disabled")), O.Biscuits.memorize("Book", {
                                Bookmarks: e.Bookmarks.map((function (e) {
                                    return { "SI-PPiS": e["SI-PPiS"], "%": e["%"] }
                                }))
                            })
                        }
                    };
                    e.initialize(), E.dispatch("bibi:created-bookmark-manager")
                }
            }
        }, I.Turner = {
            create: function () {
                var e = I.Turner = {
                    Back: { Distance: -1 }, Forward: { Distance: 1 }, initialize: function () {
                        if (e[-1] = e.Back, e[1] = e.Forward, S["accept-orthogonal-input"]) switch (e.top = e.Back, e.bottom = e.Forward, B.PPD) {
                            case"ltr":
                                e.left = e.Back, e.right = e.Forward;
                                break;
                            case"rtl":
                                e.right = e.Back, e.left = e.Forward
                        }
                    }, update: function () {
                        if (!S["accept-orthogonal-input"]) switch (S.ARD) {
                            case"ltr":
                                e.left = e.Back, e.right = e.Forward, e.top = e.bottom = void 0;
                                break;
                            case"rtl":
                                e.right = e.Back, e.left = e.Forward, e.top = e.bottom = void 0;
                                break;
                            case"ttb":
                                e.top = e.Back, e.bottom = e.Forward, e.left = e.right = void 0
                        }
                    }, getDirection: function (e) {
                        switch (S.ARA) {
                            case"horizontal":
                                return "center" != e.X ? e.X : e.Y;
                            case"vertical":
                                return "middle" != e.Y ? e.Y : e.X
                        }
                    }, isAbleToTurn: function (t) {
                        if (I.OpenedSubpanel) return !1;
                        if ("number" != typeof t.Distance && "string" == typeof t.Direction && e[t.Direction] && (t.Distance = e[t.Direction].Distance), "number" == typeof t.Distance && (R.Current.List.length || R.updateCurrent(), R.Current.List.length)) {
                            var n, i, o;
                            switch (t.Distance) {
                                case-1:
                                    n = R.Current.List[0], i = R.Pages[0], o = "Headed";
                                    break;
                                case 1:
                                    n = R.Current.List.slice(-1)[0], i = R.Pages.slice(-1)[0], o = "Footed"
                            }
                            if (L.Opened && (n.Page != i || !n.PageIntersectionStatus.Contained && !n.PageIntersectionStatus[o])) {
                                switch (t.Direction) {
                                    case"left":
                                    case"right":
                                        return "horizontal" == S.ARA ? 1 : -1;
                                    case"top":
                                    case"bottom":
                                        return "vertical" == S.ARA ? 1 : -1
                                }
                                return !0
                            }
                        }
                        return !1
                    }, turn: function (t) {
                        var n = t == e.PreviousDistance;
                        if (e.PreviousDistance = t, "pre-paginated" == S["book-rendition-layout"]) {
                            var i = [R.Current.List[0].Page.Index, R.Current.List.slice(-1)[0].Page.Index],
                                o = i[t < 0 ? 0 : 1] + t;
                            i.forEach((function (e) {
                                try {
                                    R.Pages[e].Spread.Box.classList.remove("current")
                                } catch (e) {
                                }
                            }));
                            try {
                                R.Pages[o].Spread.Box.classList.add("current")
                            } catch (e) {
                            }
                        }
                        return R.moveBy({ Distance: t }).then((function (t) {
                            return I.History.add({ UI: e, SumUp: n, Destination: t })
                        }))
                    }
                };
                E.add("bibi:opened", (function () {
                    e.initialize(), e.update(), E.add("bibi:changed-view", (function () {
                        return e.update()
                    }))
                }))
            }
        }, I.Arrows = {
            create: function () {
                if (S["use-arrows"]) {
                    var e, t = I.Arrows = {
                        navigate: function () {
                            setTimeout((function () {
                                [t.Back, t.Forward].forEach((function (e) {
                                    return !!I.Turner.isAbleToTurn({ Distance: e.Turner.Distance }) && e.classList.add("glowing")
                                })), setTimeout((function () {
                                    return [t.Back, t.Forward].forEach((function (e) {
                                        return e.classList.remove("glowing")
                                    }))
                                }), 1234)
                            }), 400)
                        }, check: function () {
                            [t.Back, t.Forward].forEach((function (e) {
                                return I.Turner.isAbleToTurn({ Distance: e.Turner.Distance }) ? sML.replaceClass(e, "unavailable", "available") : sML.replaceClass(e, "available", "unavailable")
                            }))
                        }, areAvailable: function (e) {
                            if (!L.Opened) return !1;
                            if (I.OpenedSubpanel) return !1;
                            if (I.Panel && "active" == I.Panel.UIState) return !1;
                            if ("paged" == S.RVM) {
                                if (e.Coord.Y > window.innerHeight - (I.Slider.UI ? I.Slider.offsetHeight : 0)) return !1
                            } else if ("horizontal" == S.RVM) {
                                if (e.Coord.Y > window.innerHeight - O.Scrollbars.Height) return !1
                            } else if ("vertical" == S.RVM && e.Coord.X > window.innerWidth - O.Scrollbars.Width) return !1;
                            return e.Target.ownerDocument.documentElement != O.HTML ? !O.isAnchorContent(e.Target) : e.Target == O.HTML || e.Target == O.Body || e.Target == I.Menu || (!!/^(bibi-main|bibi-arrow|bibi-help|bibi-poweredby)/.test(e.Target.id) || !!/^(spread|item|page)( |-|$)/.test(e.Target.className))
                        }
                    };
                    O.HTML.classList.add("arrows-active"), t.Back = I.Turner.Back.Arrow = O.Body.appendChild(sML.create("div", {
                        className: "bibi-arrow",
                        id: "bibi-arrow-back",
                        Labels: { default: { default: "Back", ja: "戻る" } },
                        Turner: I.Turner.Back
                    })), t.Forward = I.Turner.Forward.Arrow = O.Body.appendChild(sML.create("div", {
                        className: "bibi-arrow",
                        id: "bibi-arrow-forward",
                        Labels: { default: { default: "Forward", ja: "進む" } },
                        Turner: I.Turner.Forward
                    })), t.Back.Pair = t.Forward, t.Forward.Pair = t.Back, [t.Back, t.Forward].forEach((function (e) {
                        I.setFeedback(e);
                        var t = [e.showHelp, e.hideHelp, e.onBibiTap];
                        O.TouchOS || t.push(e.onBibiHover), t.forEach((function (e) {
                        }))
                    })), O.TouchOS || (E.add("bibi:moved-pointer", (function (e) {
                        if (!L.Opened) return !1;
                        if (I.isPointerStealth()) return !1;
                        var n = O.getBibiEvent(e);
                        if (t.areAvailable(n)) {
                            var i = I.Turner.getDirection(n.Division);
                            if (I.Turner.isAbleToTurn({ Direction: i })) {
                                var o = I.Turner[i].Arrow;
                                return E.dispatch(o, "bibi:hovers", e), E.dispatch(o.Pair, "bibi:unhovers", e), void n.Target.ownerDocument.documentElement.setAttribute("data-bibi-cursor", i)
                            }
                        }
                        E.dispatch(t.Back, "bibi:unhovers", e), E.dispatch(t.Forward, "bibi:unhovers", e), R.Items.concat(O).forEach((function (e) {
                            return e.HTML.removeAttribute("data-bibi-cursor")
                        }))
                    })), E.add("bibi:opened", (function () {
                        return R.Items.concat(O).forEach((function (e) {
                            return sML.forEach(e.Body.querySelectorAll("img"))((function (e) {
                                return e.addEventListener(E.pointerdown, O.preventDefault)
                            }))
                        }))
                    }))), E.add("bibi:tapped-not-center", (function (e) {
                        if (!L.Opened) return !1;
                        if (I.isPointerStealth()) return !1;
                        var n = O.getBibiEvent(e);
                        if (!t.areAvailable(n)) return !1;
                        var i = I.Turner.getDirection(n.Division);
                        if (I.Turner.isAbleToTurn({ Direction: i })) {
                            var o = I.Turner[i], r = o.Arrow;
                            E.dispatch(r, "bibi:taps", e), E.dispatch(r, "bibi:tapped", e), I.Turner.turn(o.Distance)
                        }
                    })), E.add("bibi:commands:move-by", (function (e) {
                        if (!L.Opened || !e || "number" != typeof e.Distance) return !1;
                        switch (e.Distance) {
                            case-1:
                                return E.dispatch(t.Back, "bibi:tapped", null);
                            case 1:
                                return E.dispatch(t.Forward, "bibi:tapped", null)
                        }
                        return !1
                    })), E.add("bibi:loaded-item", (function (e) {
                        sML.appendCSSRule(e.contentDocument, "html[data-bibi-cursor]", "cursor: pointer;")
                    })), E.add("bibi:opened", (function () {
                        return setTimeout((function () {
                            t.check(), t.navigate()
                        }), 123)
                    })), E.add("bibi:changed-view", (function () {
                        return t.navigate()
                    })), E.add("bibi:scrolled", (function () {
                        return t.check()
                    })), E.dispatch("bibi:created-arrows"), (e = function (e, t, n) {
                        return sML.appendCSSRule("".concat(e, " div#bibi-arrow-back, ").concat(e, " div#bibi-arrow-forward"), "".concat(t, ": calc(100% - ").concat(n, "px); ").concat(t, ": calc(100v").concat(t.charAt(0), " - ").concat(n, "px);"))
                    })("html.appearance-horizontal.book-full-height:not(.slider-opened)", "height", O.Scrollbars.Width), e("html.appearance-horizontal:not(.book-full-height):not(.slider-opened)", "height", O.Scrollbars.Width + I.Menu.Height), e("html.appearance-vertical:not(.slider-opened)", "width", O.Scrollbars.Width)
                }
            }
        }, I.SwipeListener = {
            create: function () {
                var e = I.SwipeListener = {
                    update: function () {
                        return "paged" == S.RVM ? e.open() : e.close(), e.State
                    }, activateElement: function (t) {
                        t.addEventListener("touchstart", e.onTouchStart), t.addEventListener("touchmove", e.onTouchMove), t.addEventListener("touchend", e.onTouchEnd), O.TouchOS || (t.addEventListener("wheel", e.onWheel, {
                            capture: !0,
                            passive: !1
                        }), sML.forEach(t.querySelectorAll("img"))((function (e) {
                            return e.addEventListener(E.pointerdown, O.preventDefault)
                        })))
                    }, deactivateElement: function (t) {
                        t.removeEventListener("touchstart", e.onTouchStart), t.removeEventListener("touchmove", e.onTouchMove), t.removeEventListener("touchend", e.onTouchEnd), O.TouchOS || (t.removeEventListener("wheel", e.onWheel, {
                            capture: !0,
                            passive: !1
                        }), sML.forEach(t.querySelectorAll("img"))((function (e) {
                            return e.removeEventListener(E.pointerdown, O.preventDefault)
                        })))
                    }, PreviousWheels: [], onWheel: function (t) {
                        t.preventDefault();
                        var n = Math.abs(t.deltaX) > Math.abs(t.deltaY) ? "X" : "Y";
                        e.PreviousWheels.length && e.PreviousWheels[e.PreviousWheels.length - 1].Axis != n && (e.PreviousWheels = []);
                        var i = {}, o = e.PreviousWheels, r = o.length;
                        i.Axis = n, i.Distance = (t["delta" + n] < 0 ? -1 : 1) * ("X" == n && "rtl" == S.ARD ? -1 : 1), i.Delta = {
                            X: 0,
                            Y: 0
                        }, i.Delta[n] = Math.abs(t["delta" + n]), o[r - 1] ? i.Distance != o[r - 1].Distance ? (i.Accel = 1, r >= 3 && o[r - 2].Distance != i.Distance && o[r - 3].Distance != i.Distance && (i.Wheeled = "reverse")) : i.Delta[n] > o[r - 1].Delta[n] ? (i.Accel = 1, r >= 3 && -1 == o[r - 1].Accel && -1 == o[r - 2].Accel && -1 == o[r - 3].Accel && (i.Wheeled = "serial")) : i.Delta[n] < o[r - 1].Delta[n] ? i.Accel = -1 : i.Accel = o[r - 1].Accel : (i.Accel = 1, i.Wheeled = "start"), i.Wheeled && (e.Hot || (clearTimeout(e.Timer_coolDown), e.Hot = !0, e.Timer_coolDown = setTimeout((function () {
                            return e.Hot = !1
                        }), 192), R.moveBy({ Distance: i.Distance }))), r >= 3 && o.shift(), o.push(i), clearTimeout(e.Timer_resetWheeling), e.Timer_resetWheeling = setTimeout((function () {
                            return e.PreviousWheels = []
                        }), 192)
                    }, onTouchStart: function (t) {
                        if (!I.Loupe || !I.Loupe.Transforming) {
                            var n = O.getBibiEventCoord(t);
                            e.TouchStartedOn = {
                                X: n.X,
                                Y: n.Y,
                                T: t.timeStamp,
                                SL: R.Main.scrollLeft,
                                ST: R.Main.scrollTop
                            }
                        }
                    }, onTouchMove: function (e) {
                        1 == e.touches.length && document.body.clientWidth / window.innerWidth <= 1 && e.preventDefault()
                    }, onTouchEnd: function (t) {
                        if (!I.Loupe || !I.Loupe.Transforming) {
                            if (e.TouchStartedOn) {
                                if (e.TouchStartedOn.SL != R.Main.scrollLeft || e.TouchStartedOn.ST != R.Main.scrollTop) return;
                                if (document.body.clientWidth / window.innerWidth <= 1 && t.timeStamp - e.TouchStartedOn.T <= 300) {
                                    var n = O.getBibiEventCoord(t), i = n.X - e.TouchStartedOn.X,
                                        o = n.Y - e.TouchStartedOn.Y;
                                    if (Math.sqrt(Math.pow(i, 2) + Math.pow(o, 2)) >= 10) {
                                        var r = 180 * Math.atan2(o ? -1 * o : 0, i) / Math.PI, a = "";
                                        120 >= r && r >= 60 ? (a = "bottom", "top") : 30 >= r && r >= -30 ? (a = "left", "right") : -60 >= r && r >= -120 ? (a = "top", "bottom") : (-150 >= r || r >= 150) && (a = "right", "left"), I.Turner.isAbleToTurn({ Direction: a }) && I.Turner.turn(I.Turner[a].Distance)
                                    }
                                }
                            }
                            delete e.TouchStartedOn
                        }
                    }
                };
                I.setToggleAction(e, {
                    onopened: function () {
                        O.HTML.classList.add("swipe-active"), e.activateElement(R.Main), R.Items.forEach((function (t) {
                            return e.activateElement(t.HTML)
                        }))
                    }, onclosed: function () {
                        O.HTML.classList.remove("swipe-active"), e.deactivateElement(R.Main), R.Items.forEach((function (t) {
                            return e.deactivateElement(t.HTML)
                        }))
                    }
                }), E.add("bibi:opened", (function () {
                    e.update(), E.add("bibi:updated-settings", (function () {
                        return e.update()
                    })), E.add("bibi:loaded-item", (function (t) {
                        "paged" == S.RVM && e.activateElement(t.HTML)
                    }))
                })), E.add("bibi:commands:activate-swipe", (function () {
                    return e.open()
                })), E.add("bibi:commands:deactivate-swipe", (function () {
                    return e.close()
                })), E.add("bibi:commands:toggle-swipe", (function () {
                    return e.toggle()
                })), E.dispatch("bibi:created-swipelistener")
            }
        }, I.KeyListener = {
            create: function () {
                if (S["use-keys"]) {
                    var e = I.KeyListener = {
                        ActiveKeys: {},
                        KeyCodes: { keydown: {}, keyup: {}, keypress: {} },
                        updateKeyCodes: function (t, n) {
                            "function" != typeof t.join && (t = [t]), "function" == typeof n && (n = n()), t.forEach((function (t) {
                                return e.KeyCodes[t] = sML.edit(e.KeyCodes[t], n)
                            }))
                        },
                        MovingParameters: {},
                        initializeMovingParameters: function () {
                            var t = {};
                            if (S["accept-orthogonal-input"]) switch (B.PPD) {
                                case"ltr":
                                    t = { "Up Arrow": -1, "Down Arrow": 1, "Left Arrow": -1, "Right Arrow": 1 };
                                    break;
                                case"rtl":
                                    t = { "Up Arrow": -1, "Down Arrow": 1, "Left Arrow": 1, "Right Arrow": -1 }
                            }
                            for (var n in sML.applyRtL(t, {
                                End: "foot",
                                Home: "head"
                            }), t) t[n.toUpperCase()] = -1 == t[n] ? "head" : 1 == t[n] ? "foot" : "head" == t[n] ? "foot" : "foot" == t[n] ? "head" : 0;
                            return e.MovingParameters = t
                        },
                        updateMovingParameters: function () {
                            if (!S["accept-orthogonal-input"]) {
                                var t = {};
                                switch (S.ARD) {
                                    case"ltr":
                                        t = { "Up Arrow": 0, "Down Arrow": 0, "Left Arrow": -1, "Right Arrow": 1 };
                                        break;
                                    case"rtl":
                                        t = { "Up Arrow": 0, "Down Arrow": 0, "Left Arrow": 1, "Right Arrow": -1 };
                                        break;
                                    case"ttb":
                                        t = { "Up Arrow": -1, "Down Arrow": 1, "Left Arrow": 0, "Right Arrow": 0 }
                                }
                                for (var n in t) t[n.toUpperCase()] = -1 == t[n] ? "head" : 1 == t[n] ? "foot" : 0;
                                sML.applyRtL(e.MovingParameters, t)
                            }
                        },
                        getBibiKeyName: function (t) {
                            var n = e.KeyCodes[t.type][t.keyCode];
                            return n || ""
                        },
                        onEvent: function (t) {
                            return !!L.Opened && (t.BibiKeyName = e.getBibiKeyName(t), t.BibiModifierKeys = [], t.shiftKey && t.BibiModifierKeys.push("Shift"), t.ctrlKey && t.BibiModifierKeys.push("Control"), t.altKey && t.BibiModifierKeys.push("Alt"), t.metaKey && t.BibiModifierKeys.push("Meta"), t.BibiKeyName && t.preventDefault(), !0)
                        },
                        onKeyDown: function (t) {
                            if (!e.onEvent(t)) return !1;
                            t.BibiKeyName && (e.ActiveKeys[t.BibiKeyName] ? E.dispatch("bibi:is-holding-key", t) : e.ActiveKeys[t.BibiKeyName] = Date.now()), E.dispatch("bibi:downs-key", t)
                        },
                        onKeyUp: function (t) {
                            if (!e.onEvent(t)) return !1;
                            e.ActiveKeys[t.BibiKeyName] && Date.now() - e.ActiveKeys[t.BibiKeyName] < 300 && (E.dispatch("bibi:touches-key", t), E.dispatch("bibi:touched-key", t)), t.BibiKeyName && e.ActiveKeys[t.BibiKeyName] && delete e.ActiveKeys[t.BibiKeyName], E.dispatch("bibi:ups-key", t)
                        },
                        onKeyPress: function (t) {
                            if (!e.onEvent(t)) return !1;
                            E.dispatch("bibi:presses-key", t)
                        },
                        observe: function (t) {
                            ["keydown", "keyup", "keypress"].forEach((function (n) {
                                return t.addEventListener(n, e["onKey" + sML.capitalise(n.replace("key", ""))], !1)
                            }))
                        },
                        tryMoving: function (t) {
                            if (!t.BibiKeyName) return !1;
                            var n = e.MovingParameters[t.shiftKey ? t.BibiKeyName.toUpperCase() : t.BibiKeyName];
                            if (!n) return !1;
                            if (t.preventDefault(), "string" == typeof n) return R.focusOn({
                                Destination: n,
                                Duration: 0
                            });
                            if ("number" == typeof n && I.Turner.isAbleToTurn({ Distance: n })) {
                                var i = I.Turner[n], o = i.Arrow;
                                E.dispatch(o, "bibi:taps", t), E.dispatch(o, "bibi:tapped", t), I.Turner.turn(i.Distance)
                            }
                        }
                    };
                    e.updateKeyCodes(["keydown", "keyup", "keypress"], { 32: "Space" }), e.updateKeyCodes(["keydown", "keyup"], {
                        33: "Page Up",
                        34: "Page Down",
                        35: "End",
                        36: "Home",
                        37: "Left Arrow",
                        38: "Up Arrow",
                        39: "Right Arrow",
                        40: "Down Arrow"
                    }), E.add("bibi:postprocessed-item", (function (t) {
                        return !t.IsPlaceholder && e.observe(t.contentDocument)
                    })), E.add("bibi:opened", (function () {
                        e.initializeMovingParameters(), e.updateMovingParameters(), E.add("bibi:changed-view", (function () {
                            return e.updateMovingParameters()
                        })), e.observe(document), E.add(["bibi:touched-key", "bibi:is-holding-key"], (function (t) {
                            return e.tryMoving(t)
                        }))
                    })), E.dispatch("bibi:created-keylistener")
                }
            }
        }, I.Spinner = {
            create: function () {
                for (var e = I.Spinner = O.Body.appendChild(sML.create("div", { id: "bibi-spinner" })), t = 1; t <= 12; t++) e.appendChild(document.createElement("span"));
                E.dispatch("bibi:created-spinner")
            }
        }, I.createButtonGroup = function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            if (e.Area && e.Area.tagName) {
                var t = e.Area;
                return delete e.Area, t.addButtonGroup(e)
            }
            "string" == typeof e.className && e.className || delete e.className, "string" == typeof e.id && e.id || delete e.id;
            var n = ["bibi-buttongroup"];
            e.Tiled && n.push("bibi-buttongroup-tiled"), e.Sticky && n.push("sticky"), e.className && n.push(e.className), e.className = n.join(" ");
            var i = e.Buttons instanceof Array ? e.Buttons : e.Button ? [e.Button] : [];
            delete e.Buttons, delete e.Button;
            var o = sML.create("ul", e);
            return o.Buttons = [], o.addButton = function (e) {
                var t = I.createButton(e);
                return t ? (t.ButtonGroup = this, t.ButtonBox = t.ButtonGroup.appendChild(sML.create("li", { className: "bibi-buttonbox bibi-buttonbox-" + t.Type })), O.TouchOS || I.setHoverActions(I.observeHover(t.ButtonBox)), t.ButtonBox.appendChild(t), t.ButtonGroup.Buttons.push(t), t) : null
            }, i.forEach((function (t) {
                !t.Type && e.ButtonType && (t.Type = e.ButtonType), o.addButton(t)
            })), o.Busy = !1, o
        }, I.createButton = function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            "string" == typeof e.className && e.className || delete e.className, "string" == typeof e.id && e.id || delete e.id, e.Type = "string" == typeof e.Type && /^(normal|toggle|radio|link)$/.test(e.Type) ? e.Type : "normal";
            var t = ["bibi-button", "bibi-button-" + e.Type];
            e.className && t.push(e.className), e.className = t.join(" "), void 0 === e.Icon || e.Icon.tagName || ("string" == typeof e.Icon && e.Icon ? e.Icon = sML.hatch(e.Icon) : delete e.Icon);
            var n = sML.create("string" == typeof e.href ? "a" : "span", e);
            return n.Icon && (n.IconBox = n.appendChild(sML.create("span", { className: "bibi-button-iconbox" })), n.IconBox.appendChild(n.Icon), n.Icon = n.IconBox.firstChild, n.IconBox.Button = n.Icon.Button = n), n.Label = n.appendChild(sML.create("span", { className: "bibi-button-label" })), I.setFeedback(n, {
                Help: e.Help,
                Checked: e.Checked,
                StopPropagation: !0,
                PreventDefault: !n.href
            }), n.isAvailable = function () {
                return !n.Busy && ((!n.ButtonGroup || !n.ButtonGroup.Busy) && "disabled" != n.UIState)
            }, "function" == typeof n.action && n.addTapEventListener("tapped", (function () {
                return n.isAvailable() ? n.action.apply(n, _arguments) : null
            })), n.Busy = !1, n
        }, I.createSubpanel = function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            "string" == typeof e.className && e.className || delete e.className, "string" == typeof e.id && e.id || delete e.id;
            var t = ["bibi-subpanel", "bibi-subpanel-" + ("left" == e.Position ? "left" : "right")];
            e.className && t.push(e.className), e.className = t.join(" ");
            var n = e.Sections instanceof Array ? e.Sections : e.Section ? [e.Section] : [];
            delete e.Sections, delete e.Section;
            var i = O.Body.appendChild(sML.create("div", e));
            return i.Sections = [], i.addEventListener(E.pointerdown, (function (e) {
                return e.stopPropagation()
            })), i.addEventListener(E.pointerup, (function (e) {
                return e.stopPropagation()
            })), I.setToggleAction(i, {
                onopened: function (t) {
                    I.Subpanels.forEach((function (e) {
                        return e == i || e.close({ ForAnotherSubpanel: !0 })
                    })), I.OpenedSubpanel = this, this.classList.add("opened"), O.HTML.classList.add("subpanel-opened"), i.Opener && I.setUIState(i.Opener, "active"), e.onopened && e.onopened.apply(i, arguments)
                }, onclosed: function (t) {
                    this.classList.remove("opened"), I.OpenedSubpanel == this && setTimeout((function () {
                        return I.OpenedSubpanel = null
                    }), 222), t && t.ForAnotherSubpanel || O.HTML.classList.remove("subpanel-opened"), i.Opener && I.setUIState(i.Opener, "default"), e.onclosed && e.onclosed.apply(i, arguments)
                }
            }), i.bindOpener = function (e) {
                return e.addTapEventListener("tapped", (function () {
                    return i.toggle()
                })), i.Opener = e, i.Opener
            }, i.Opener && i.bindOpener(i.Opener), E.add("bibi:opened-panel", i.close), E.add("bibi:closes-utilities", i.close), I.Subpanels.push(i), i.addSection = function () {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                    t = I.createSubpanelSection(e);
                return t ? (t.Subpanel = this, this.appendChild(t), this.Sections.push(t), t) : null
            }, n.forEach((function (e) {
                return i.addSection(e)
            })), i
        }, I.createSubpanelSection = function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            "string" == typeof e.className && e.className || delete e.className, "string" == typeof e.id && e.id || delete e.id;
            var t = ["bibi-subpanel-section"];
            e.className && t.push(e.className), e.className = t.join(" ");
            e.PGroups instanceof Array ? e.PGroups : e.PGroup && e.PGroup;
            delete e.PGroups, delete e.PGroup;
            var n = e.ButtonGroups instanceof Array ? e.ButtonGroups : e.ButtonGroup ? [e.ButtonGroup] : [];
            delete e.ButtonGroups, delete e.ButtonGroup;
            var i = sML.create("div", e);
            return i.Labels && (i.Labels = I.distillLabels(i.Labels), i.appendChild(sML.create("div", { className: "bibi-hgroup" })).appendChild(sML.create("p", { className: "bibi-h" })).appendChild(sML.create("span", {
                className: "bibi-h-label",
                innerHTML: i.Labels.default[O.Language]
            }))), i.ButtonGroups = [], i.addButtonGroup = function () {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = I.createButtonGroup(e);
                return this.appendChild(t), this.ButtonGroups.push(t), t
            }, n.forEach((function (e) {
                e && i.addButtonGroup(e)
            })), i
        }, I.setToggleAction = function (e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            return sML.edit(e, {
                UIState: "default", open: function (n) {
                    return new Promise((function (i) {
                        "default" == e.UIState && (I.setUIState(e, "active"), t.onopened && t.onopened.call(e, n)), i(n)
                    }))
                }, close: function (n) {
                    return new Promise((function (i) {
                        "active" == e.UIState && (I.setUIState(e, "default"), t.onclosed && t.onclosed.call(e, n)), i(n)
                    }))
                }, toggle: function (t) {
                    return "default" == e.UIState ? e.open(t) : e.close(t)
                }
            })
        }, I.observeHover = function (e) {
            return e.onBibiHover = function (t, n) {
                return E.dispatch(e, t ? "bibi:hovers" : "bibi:unhovers", n)
            }, e.addEventListener(E.pointerover, (function (t) {
                return e.onBibiHover(!0, t)
            })), e.addEventListener(E.pointerout, (function (t) {
                return e.onBibiHover(!1, t)
            })), e
        }, I.setHoverActions = function (e) {
            return E.add(e, "bibi:hovers", (function (t) {
                return e.Hover ? e : e.isAvailable && !e.isAvailable(t) ? e : (e.Hover = !0, e.classList.add("hover"), e.showHelp && e.showHelp(), e)
            })), E.add(e, "bibi:unhovers", (function (t) {
                return e.Hover ? (e.Hover = !1, e.classList.remove("hover"), e.hideHelp && e.hideHelp(), e) : e
            })), e
        }, I.observeTap = function (e, t) {
            return t || (t = {}), e.addTapEventListener || (e.addTapEventListener = function (t, n) {
                return "tap" == t && (t = "taps"), E.add(e, "bibi:" + t, (function (t) {
                    return n.call(e, t)
                })), e
            }, e.onBibiTap = function (n, i) {
                if (t.PreventDefault && n.preventDefault(), t.StopPropagation && n.stopPropagation(), "down" == i) clearTimeout(e.Timer_tap), e.TouchStart = {
                    Time: Date.now(),
                    Event: n,
                    Coord: O.getBibiEventCoord(n)
                }, e.Timer_tap = setTimeout((function () {
                    return delete e.TouchStart
                }), 333); else if (e.TouchStart) {
                    if (Date.now() - e.TouchStart.Time < 300) {
                        var o = O.getBibiEventCoord(n);
                        Math.abs(o.X - e.TouchStart.Coord.X) < 5 && Math.abs(o.Y - e.TouchStart.Coord.Y) < 5 && (E.dispatch(e, "bibi:taps", e.TouchStart.Event), E.dispatch(e, "bibi:tapped", e.TouchStart.Event))
                    }
                    delete e.TouchStart
                }
            }, e.addEventListener(E.pointerdown, (function (t) {
                return e.onBibiTap(t, "down")
            })), e.addEventListener(E.pointerup, (function (t) {
                return e.onBibiTap(t, "up")
            }))), e
        }, I.setTapAction = function (e) {
            var t = function () {
                switch (e.Type) {
                    case"toggle":
                        return function (t) {
                            if ("disabled" == e.UIState) return !1;
                            I.setUIState(e, "default" == e.UIState ? "active" : "default")
                        };
                    case"radio":
                        return function (t) {
                            if ("disabled" == e.UIState) return !1;
                            e.ButtonGroup.Buttons.forEach((function (t) {
                                t != e && I.setUIState(t, "")
                            })), I.setUIState(e, "active")
                        };
                    default:
                        return function (t) {
                            if ("disabled" == e.UIState) return !1;
                            I.setUIState(e, "active"), clearTimeout(e.Timer_deactivate), e.Timer_deactivate = setTimeout((function () {
                                return I.setUIState(e, "disabled" == e.UIState ? "disabled" : "")
                            }), 200)
                        }
                }
            }();
            return e.addTapEventListener("tapped", (function (n) {
                return e.isAvailable && !e.isAvailable(n) ? e : "disabled" == e.UIState ? e : "active" == e.UIState && "radio" == e.Type ? e : (t(n), e.hideHelp && e.hideHelp(), e.note && setTimeout(e.note, 0), e)
            })), e
        }, I.setFeedback = function (e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            return e.Labels = I.distillLabels(e.Labels), e.Labels && (t.Help && (e.showHelp = function () {
                return I.Help && e.Labels[e.UIState] && I.Help.show(e.Labels[e.UIState][O.Language]), e
            }, e.hideHelp = function () {
                return I.Help && I.Help.hide(), e
            }), e.Notes && (e.note = function () {
                return e.Labels[e.UIState] && setTimeout((function () {
                    return I.note(e.Labels[e.UIState][O.Language])
                }), 0), e
            })), O.TouchOS || I.observeHover(e), I.setHoverActions(e), I.observeTap(e, t), I.setTapAction(e), e.addTapEventListener("tap", (function (t) {
                return !(e.isAvailable && !e.isAvailable()) && E.dispatch("bibi:is-going-to:tap:ui", e)
            })), e.addTapEventListener("tapped", (function (t) {
                return E.dispatch("bibi:tapped:ui", e)
            })), I.setUIState(e, t.Checked ? "active" : "default"), e
        }, I.setUIState = function (e, t) {
            if (t || (t = "default"), e.PreviousUIState = e.UIState, t != e.UIState) return e.UIState = t, e.tagName && (e.Labels && e.Labels[e.UIState] && e.Labels[e.UIState][O.Language] && (e.title = e.Labels[e.UIState][O.Language].replace(/<[^>]+>/g, ""), e.Label && (e.Label.innerHTML = e.Labels[e.UIState][O.Language])), sML.replaceClass(e, e.PreviousUIState, e.UIState)), e.UIState
        }, I.isPointerStealth = function () {
            var e = !1;
            return I.isPointerStealth.Checkers.forEach((function (t) {
                return e = !!t() || e
            })), e
        }, I.isPointerStealth.Checkers = [], I.isPointerStealth.addChecker = function (e) {
            return "function" != typeof e || I.isPointerStealth.Checkers.includes(e) ? I.isPointerStealth.Checkers.length : I.isPointerStealth.Checkers.push(e)
        }, I.distillLabels = function (e) {
            for (var t in "object" == _typeof(e) && e || (e = {}), e) e[t] = I.distillLabels.distillLanguage(e[t]);
            return e.default || (e.default = I.distillLabels.distillLanguage()), !e.active && e.default && (e.active = e.default), !e.disabled && e.default && (e.disabled = e.default), e
        }, I.distillLabels.distillLanguage = function (e) {
            return "object" == _typeof(e) && e || (e = { default: e }), "string" != typeof e.default && ("string" == typeof e.en ? e.default = e.en : "string" == typeof e[O.Language] ? e.default = e[O.Language] : e.default = ""), "string" != typeof e[O.Language] && ("string" == typeof e.default ? e[O.Language] = e.default : "string" == typeof e.en ? e[O.Language] = e.en : e[O.Language] = ""), e
        }, I.getBookIcon = function () {
            return sML.create("div", { className: "book-icon", innerHTML: "<span></span>" })
        };
        var P = {};
        Bibi.preset = function (e) {
            sML.applyRtL(P, e, "ExceptFunctions"), P.Script = document.getElementById("bibi-preset")
        }, P.initialize = function (e) {
            O.SettingTypes.boolean.concat(O.SettingTypes_PresetOnly.boolean).forEach((function (e) {
                !0 !== P[e] && (P[e] = !1)
            })), O.SettingTypes["yes-no"].concat(O.SettingTypes_PresetOnly["yes-no"]).forEach((function (e) {
                "string" == typeof P[e] ? P[e] = /^(yes|no|mobile|desktop)$/.test(P[e]) ? P[e] : "no" : P[e] = P[e] ? "yes" : "no"
            })), O.SettingTypes.string.concat(O.SettingTypes_PresetOnly.string).forEach((function (e) {
                "string" != typeof P[e] && (P[e] = "")
            })), O.SettingTypes.integer.concat(O.SettingTypes_PresetOnly.integer).forEach((function (e) {
                P[e] = "number" != typeof P[e] || P[e] < 0 ? 0 : Math.round(P[e])
            })), O.SettingTypes.number.concat(O.SettingTypes_PresetOnly.number).forEach((function (e) {
                "number" != typeof P[e] && (P[e] = 0)
            })), O.SettingTypes.array.concat(O.SettingTypes_PresetOnly.array).forEach((function (e) {
                P[e] instanceof Array || (P[e] = [])
            })), /^(horizontal|vertical|paged)$/.test(P["reader-view-mode"]) || (P["reader-view-mode"] = "paged"), P.bookshelf = P.bookshelf && "string" == typeof P.bookshelf ? new URL(P.bookshelf, P.Script.src).href : "", P.extensions = P.extensions instanceof Array ? P.extensions.filter((function (e) {
                return !!(!e.hasOwnProperty("-spell-of-activation-") || e["-spell-of-activation-"] && "string" == typeof e["-spell-of-activation-"] && U.hasOwnProperty(e["-spell-of-activation-"])) && (!(!e || !e.src || "string" != typeof e.src) && (e.src = new URL(e.src, P.Script.src).href))
            })) : []
        };
        var H = {
            initialize: function () {
                document.getElementById("bibi-script").getAttribute("data-bibi-extensions");
                var e = document.getElementById("bibi-preset").getAttribute("data-bibi-bookshelf"),
                    t = O.Body.getAttribute("data-bibi-book");
                e && (H.bookshelf = new URL(e, location.href.split("?")[0]).href), t && (H.book = t);
                var n = document.getElementById("bibi-book-data");
                if (n) {
                    if (n.innerText.trim()) {
                        var i = n.getAttribute("data-bibi-book-mimetype");
                        "string" == typeof i && /^application\/(epub\+zip|zip|x-zip(-compressed)?)$/i.test(i) && (H.BookDataElement = n)
                    }
                    H.BookDataElement || (n.innerHTML = "", n.parentNode.removeChild(n))
                }
            }
        }, U = function (e) {
            if ("string" != typeof e) return {};
            e = e.replace(/^\?/, "");
            var t = {};
            return e.split("&").forEach((function (e) {
                e = e.split("="), /^[a-zA-Z0-9_\-]+$/.test(e[0]) && (t[e[0]] = e[1])
            })), t.hasOwnProperty("debug") && (Bibi.Debug = !0, t.log = 9), t
        }(location.search);
        U.initialize = function () {
            U.book && (U.book = decodeURIComponent(U.book).trim() || ""), U.book || delete U.book;
            var e = U.parseHash(location.hash);
            e.bibi && U.importFromDataString(e.bibi), e.jo && (U.importFromDataString(e.jo), U["parent-origin"] && U["parent-origin"] != O.Origin && P["trustworthy-origins"].push(U["parent-origin"]), history.replaceState && history.replaceState(null, null, location.href.replace(/[\,#]jo\([^\)]*\)$/g, ""))), e.epubcfi && (U.epubcfi = e.epubcfi, E.add("bibi:readied", (function () {
                X.EPUBCFI && (S.to = U.to = X.EPUBCFI.getDestination(H.epubcfi))
            })))
        }, U.parseHash = function (e) {
            var t = {}, n = "([a-z_]+)\\(([^\\(\\)]+)\\)";
            if ("string" != typeof e) return t;
            var i = e.match(new RegExp(n, "g"));
            return i && i.length ? (i.forEach((function (e) {
                var i = e.match(new RegExp(n));
                t[i[1]] = i[2]
            })), t) : t
        }, U.importFromDataString = function (e) {
            return "string" == typeof e && (e.replace(" ", "").split(",").forEach((function (e) {
                if (2 == (e = e.split(":")).length) {
                    switch (e[0]) {
                        case"parent-title":
                        case"parent-uri":
                        case"parent-origin":
                        case"parent-jo-path":
                        case"parent-bibi-label":
                        case"parent-holder-id":
                            e[1] = decodeURIComponent(e[1].replace("_BibiKakkoClose_", ")").replace("_BibiKakkoOpen_", "(")), e[1] || (e[1] = "");
                            break;
                        case"to":
                            if (e[1] = R.getBibiToDestination(e[1]), !e[1]) return;
                            break;
                        case"nav":
                            if (!/^[1-9][0-9]*$/.test(e[1])) return;
                            e[1] *= 1;
                            break;
                        case"si-ppis":
                            if (!/^\d+\-(0(\.\d+)*|1)$/.test(e[1])) return;
                            e[1] = { "SI-PPiS": Pnv[1] };
                            break;
                        case"horizontal":
                        case"vertical":
                        case"paged":
                            e = ["reader-view-mode", e[0]];
                            break;
                        case"reader-view-mode":
                            if (!/^(horizontal|vertical|paged)$/.test(e[1])) return;
                            break;
                        case"default-page-progression-direction":
                            if (!/^(ltr|rtl)$/.test(e[1])) return;
                            break;
                        default:
                            if (O.SettingTypes.boolean.concat(O.SettingTypes_UserOnly.boolean).includes(e[0])) if ("true" == e[1]) e[1] = !0; else {
                                if ("false" != e[1]) return;
                                e[1] = !1
                            } else if (O.SettingTypes["yes-no"].concat(O.SettingTypes_UserOnly["yes-no"]).includes(e[0])) {
                                if (!/^(yes|no|mobile|desktop)$/.test(e[1])) return
                            } else if (O.SettingTypes.integer.concat(O.SettingTypes_UserOnly.integer).includes(e[0])) {
                                if (!/^(0|[1-9][0-9]*)$/.test(e[1])) return;
                                e[1] *= 1
                            } else {
                                if (!O.SettingTypes.number.concat(O.SettingTypes_UserOnly.number).includes(e[0])) return;
                                if (!/^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(e[1])) return;
                                e[1] *= 1
                            }
                    }
                    e[0] && void 0 !== e[1] && (U[e[0]] = e[1])
                }
            })), U["si-ppis"] ? (delete U.nav, U.to = U["si-ppis"]) : U.nav && delete U.to, U)
        };
        var S = {
            initialize: function (e, t) {
                for (var n in e && e(), S) "function" != typeof S[n] && delete S[n];
                sML.applyRtL(S, P, "ExceptFunctions"), sML.applyRtL(S, H, "ExceptFunctions"), sML.applyRtL(S, U, "ExceptFunctions"), O.SettingTypes["yes-no"].concat(O.SettingTypes_PresetOnly["yes-no"]).concat(O.SettingTypes_UserOnly["yes-no"]).forEach((function (e) {
                    S[e] = "string" == typeof S[e] && ("yes" == S[e] || "mobile" == S[e] && O.TouchOS || "desktop" == S[e] && !O.TouchOS)
                })), S.bookshelf = "string" == typeof S.bookshelf && S.bookshelf ? S.bookshelf.replace(/\/$/, "") : "", S.book = "string" == typeof S.book && S.book ? new URL(S.book, S.bookshelf + "/").href : "", B.Type = S.book ? U.hasOwnProperty("zine") ? "Zine" : "EPUB" : "", S["extract-if-necessary"] = function () {
                    if (!S["extract-if-necessary"].length) return [];
                    if (S["extract-if-necessary"].includes("*")) return ["*"];
                    for (var e = [], t = S["extract-if-necessary"].length, n = 0; n < t; n++) {
                        var i = S["extract-if-necessary"][n];
                        "string" == typeof i && /^(\.[\w\d]+)*$/.test(i) && (i = i.toLowerCase(), e.includes(i) || e.push(i))
                    }
                    return e
                }(), S.book || !window.File ? (S["accept-local-file"] = !1, S["accept-blob-converted-data"] = !1, S["accept-base64-encoded-data"] = !1) : S["accept-local-file"] = !(!S["accept-local-file"] || !(S["extract-if-necessary"].includes("*") || S["extract-if-necessary"].includes(".epub") || S["extract-if-necessary"].includes(".zip"))), S["trustworthy-origins"].includes(O.Origin) || S["trustworthy-origins"].unshift(O.Origin), S.autostart = !S.wait && (!S.book || (O.Embedded ? S["autostart-embedded"] : S.autostart)), S["start-in-new-window"] = !(!O.Embedded || S.autostart) && S["start-embedded-in-new-window"], S["default-page-progression-direction"] = "rtl" == S["default-page-progression-direction"] ? "rtl" : "ltr";
                var i = { history: 19, bookmarks: 9 };
                ["history", "bookmarks"].forEach((function (e) {
                    S["max-" + e] = S["use-" + e] ? S["max-" + e] > i[e] ? i[e] : S["max-" + e] : 0, 0 == S["max-" + e] && (S["use-" + e] = !1)
                })), S["use-menubar"] || (S["use-full-height"] = !0), E.bind("bibi:initialized-book", (function () {
                    var e = O.Biscuits.remember("Book");
                    S["keep-settings"] && (!U["reader-view-mode"] && e.RVM && (S["reader-view-mode"] = e.RVM), !U["full-breadth-layout-in-scroll"] && e.FBL && (S["full-breadth-layout-in-scroll"] = e.FBL)), S["resume-from-last-position"] && !U.to && e.Position && (S.to = sML.clone(e.Position))
                })), t && t(), S.Modes = {
                    "book-rendition-layout": { SH: "BRL", CNP: "book" },
                    "reader-view-mode": { SH: "RVM", CNP: "view" },
                    "page-progression-direction": { SH: "PPD", CNP: "page" },
                    "spread-layout-axis": { SH: "SLA", CNP: "spread" },
                    "spread-layout-direction": { SH: "SLD", CNP: "spread" },
                    "apparent-reading-axis": { SH: "ARA", CNP: "appearance" },
                    "apparent-reading-direction": { SH: "ARD", CNP: "appearance" },
                    "navigation-layout-direction": { SH: "NLD", CNP: "nav" }
                };
                var o = function (e) {
                    var t = S.Modes[e];
                    Object.defineProperty(S, t.SH, {
                        get: function () {
                            return S[e]
                        }, set: function (t) {
                            return S[e] = t
                        }
                    }), delete t.SH
                };
                for (var r in S.Modes) o(r);
                E.dispatch("bibi:initialized-settings"), O.PaginateWithCSSShapes = !sML.UA.Trident && !sML.UA.EdgeHTML, O.ReverseItemPaginationDirectionIfNecessary = !sML.UA.Trident && !sML.UA.EdgeHTML
            }, update: function (e) {
                var t = {};
                for (var n in S.Modes) t[n] = S[n];
                if ("object" == _typeof(e)) for (var i in e) "function" != typeof S[i] && (S[i] = e[i]);
                for (var o in S["book-rendition-layout"] = B.Package.Metadata["rendition:layout"], S["allow-placeholders"] = S["allow-placeholders"] && B.AllowPlaceholderItems, S.FontFamilyStyleIndex && sML.deleteCSSRule(S.FontFamilyStyleIndex), S["ui-font-family"] && (S.FontFamilyStyleIndex = sML.appendCSSRule("html", "font-family: " + S["ui-font-family"] + " !important;")), S["page-progression-direction"] = B.PPD, O.PaginateWithCSSShapes ? S["spread-layout-axis"] = "vertical" == S["reader-view-mode"] ? "vertical" : "horizontal" : S["spread-layout-axis"] = function () {
                    if ("paged" != S["reader-view-mode"]) return S["reader-view-mode"];
                    if ("reflowable" == S["book-rendition-layout"]) switch (B.WritingMode) {
                        case"tb-rl":
                        case"tb-lr":
                            return "vertical"
                    }
                    return "horizontal"
                }(), S["spread-layout-direction"] = "vertical" == S["spread-layout-axis"] ? "ttb" : S["page-progression-direction"], S["apparent-reading-axis"] = "paged" == S["reader-view-mode"] ? "horizontal" : S["reader-view-mode"], S["apparent-reading-direction"] = "vertical" == S["reader-view-mode"] ? "ttb" : S["page-progression-direction"], S["navigation-layout-direction"] = S["fix-nav-ttb"] || "rtl" != S["page-progression-direction"] ? "ttb" : "rtl", S.Modes) {
                    var r = S.Modes[o].CNP + "-", a = r + t[o], s = r + S[o];
                    a != s && O.HTML.classList.remove(a), O.HTML.classList.add(s)
                }
                C.update(), E.dispatch("bibi:updated-settings", S)
            }
        }, C = {
            update: function () {
                C.probe("L", S["spread-layout-axis"]), C.probe("A", S["apparent-reading-axis"])
            }, probe: function (e, t) {
                var n = ["left", "right"];
                "ltr" != S.PPD && n.reverse(), "horizontal" == t ? (C._app(e, "BASE", {
                    b: n[0],
                    a: n[1],
                    s: "top",
                    e: "bottom"
                }), C._app(e, "SIZE", { b: "height", l: "width" }), C._app(e, "OOBL", {
                    b: "top",
                    l: "left"
                }), C._app(e, "AXIS", {
                    b: "y",
                    l: "x"
                }), C[e + "_AXIS_D"] = "ltr" == S.PPD ? 1 : -1) : (C._app(e, "BASE", {
                    b: "top",
                    a: "bottom",
                    s: n[0],
                    e: n[1]
                }), C._app(e, "SIZE", { b: "width", l: "height" }), C._app(e, "OOBL", {
                    b: "left",
                    l: "top"
                }), C._app(e, "AXIS", { b: "x", l: "y" }), C[e + "_AXIS_D"] = 1)
            }, _app: function (e, t, n) {
                for (var i in n) C[[e, t, i].join("_")] = n[i], C[[e, t, sML.capitalise(i)].join("_")] = sML.capitalise(n[i])
            }
        }, O = {
            log: function (e, t, n) {
                var i = "", o = "";
                switch (n ? (i = t, o = n) : /^<..>$/.test(t) ? o = t : t && (i = t), o) {
                    case"<e/>":
                        throw"\n" + e;
                    case"</g>":
                        O.log.Depth--
                }
                if ((e || i) && (O.log.Depth <= O.log.Limit || "<b:>" == o || "</b>" == o || "<*/>" == o)) {
                    var r = O.log.Depth <= 1 ? O.stamp(e) : 0, a = [], s = [];
                    if (e) switch (o) {
                        case"<b:>":
                            a.unshift("📕"), a.push("%c" + e), s.push(O.log.BStyle), a.push("%c(v".concat(Bibi.version, ")") + (Bibi.Dev ? ":%cDEV" : "")), s.push(O.log.NStyle), Bibi.Dev && s.push(O.log.BStyle);
                            break;
                        case"</b>":
                            a.unshift("📖"), a.push("%c" + e), s.push(O.log.BStyle), O.log.Limit && (a.push("%c(".concat(Math.floor(r / 1e3) + "." + (r % 1e3 + "").padStart(3, 0), "sec)")), s.push(O.log.NStyle));
                            break;
                        case"<g:>":
                            a.unshift("┌"), a.push(e);
                            break;
                        case"</g>":
                            a.unshift("└"), a.push(e);
                            break;
                        default:
                            a.unshift("-"), a.push(e)
                    }
                    for (var c = O.log.Depth; c > 1; c--) a.unshift("│");
                    a.unshift("%cBibi:"), s.unshift(O.log.NStyle), O.log.log("log", a, s, i)
                }
                switch (o) {
                    case"<g:>":
                        O.log.Depth++
                }
            }
        };
        O.log.initialize = function () {
            if (parent && parent != window) return O.log = function () {
                return !0
            };
            O.log.Limit = U.hasOwnProperty("log") ? /^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(U.log) ? U.log : 1 : 0, O.log.Depth = 1, O.log.NStyle = "font: normal normal 10px/1 Menlo, Consolas, monospace;", O.log.BStyle = "font: normal bold   10px/1 Menlo, Consolas, monospace;", O.log.distill = sML.UA.Trident || sML.UA.EdgeHTML ? function (e, t) {
                return [e.join(" ").replace(/%c/g, "")]
            } : function (e, t) {
                return [e.join(" ")].concat(t)
            }, O.log.log = function (e, t, n, i) {
                var o = O.log.distill(t, n);
                i && o.push(i), console[e].apply(console, o)
            }
        }, O.logSets = function () {
            var Repeats = [], Sets = [];
            Sets.length = 1;
            for (var _len2 = arguments.length, Args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) Args[_key2] = arguments[_key2];
            Args.reverse();
            for (var i = 0; i < Args.length; i++) Args[i].map || (Args[i] = [Args[i]]), Repeats[i] = Sets.length, Sets.length = Sets.length * Args[i].length;
            Args.reverse(), Repeats.reverse();
            for (var _i5 = 0; _i5 < Sets.length; _i5++) Sets[_i5] = "";
            Args.forEach((function (e, t) {
                for (var n = 0; n < Sets.length;) e.forEach((function (e) {
                    for (var i = Repeats[t]; i--;) Sets[n++] += e
                }))
            })), Sets.forEach((function (Set) {
                return console.log("- " + Set + ": " + eval(Set))
            }))
        }, O.error = function (e) {
            O.Busy = !1, O.HTML.classList.remove("busy"), O.HTML.classList.remove("loading"), O.HTML.classList.remove("waiting"), E.dispatch("bibi:x_x", e), O.log(e, "<e/>")
        }, O.TimeCard = {}, O.getTimeLabel = function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Date.now() - Bibi.TimeOrigin;
            return [e / 1e3 / 60 / 60, e / 1e3 / 60 % 60, e / 1e3 % 60].map((function (e) {
                return (Math.floor(e) + "").padStart(2, 0)
            })).join(":") + "." + (e % 1e3 + "").padStart(3, 0)
        }, O.stamp = function (e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : O.TimeCard,
                n = Date.now() - Bibi.TimeOrigin, i = O.getTimeLabel(n);
            return t[i] || (t[i] = []), t[i].push(e), n
        }, O.isToBeExtractedIfNecessary = function (e) {
            if (!e || !S["extract-if-necessary"].length) return !1;
            if (S["extract-if-necessary"].includes("*")) return !0;
            if (S["extract-if-necessary"].includes("")) return !/(\.[\w\d]+)+$/.test(e);
            for (var t = S["extract-if-necessary"].length, n = 0; n < t; n++) if (new RegExp(S["extract-if-necessary"][n].replace(/\./g, "\\.") + "$", "i").test(e)) return !0;
            return !1
        }, O.item = function (e) {
            if (!e.Path) throw"Path Not Defined";
            return B.Package.Manifest.Items[e.Path] || (B.Package.Manifest.Items[e.Path] = e), B.Package.Manifest.Items[e.Path]
        }, O.RangeLoader = null, O.cancelExtraction = function (e) {
            try {
                return O.RangeLoader.abort(e.Path)
            } catch (e) {
            }
            return !1
        }, O.extract = function (e) {
            return e = O.item(e), O.RangeLoader.getBuffer(e.Path).then((function (t) {
                return O.isBin(e) ? (e.DataType = "Blob", e.Content = new Blob([t], { type: e["media-type"] })) : (e.DataType = "Text", e.Content = new TextDecoder("utf-8").decode(new Uint8Array(t))), e
            })).catch((function () {
                return Promise.reject()
            }))
        }, O.download = function (e) {
            return new Promise((function (t, n) {
                if ((e = O.item(e)).Content) return t(e);
                var i = O.isBin(e), o = new XMLHttpRequest,
                    r = (/^([a-z]+:\/\/|\/)/.test(e.Path) ? "" : B.Path + "/") + e.Path;
                o.open("GET", r, !0), o.responseType = i ? "blob" : "text", o.onerror = function () {
                    return n("".concat(404 === o.status ? "File Not Found" : "Could Not Download File", ': "').concat(r, '"'))
                }, o.onloadend = function () {
                    if (200 !== o.status) return o.onerror();
                    e.Content = o.response, e.DataType = i ? "Blob" : "Text", t(e)
                }, o.send(null)
            }))
        }, O.tryRangeRequest = function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Bibi.Script.src,
                t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "0-0";
            return new Promise((function (n, i) {
                var o = new XMLHttpRequest;
                o.onloadend = function () {
                    return 206 != o.status ? i() : n()
                }, o.open("GET", e, !0), o.setRequestHeader("Range", "bytes=" + t), o.send(null)
            }))
        }, O.file = function (e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            return new Promise((function (n, i) {
                if (e = O.item(e), t.URI && e.URI) return n(e);
                (function () {
                    if (e.Content) return Promise.resolve(e);
                    switch (B.ExtractionPolicy) {
                        case"at-once":
                            return Promise.reject('File Not Included: "'.concat(e.Path, '"'));
                        case"on-the-fly":
                            return O.extract(e)
                    }
                    return O.download(e)
                })().then((function (e) {
                    return t.Preprocess && !e.Preprocessed ? O.preprocess(e) : e
                })).then((function () {
                    t.URI ? O.getBlobURL(e).then((function (e) {
                        e.Content = "", n(e)
                    })) : n(e)
                })).catch(i)
            }))
        }, O.isBin = function (e) {
            return /\.(aac|gif|jpe?g|m4[av]|mp[g34]|ogg|[ot]tf|pdf|png|web[mp]|woff2?)$/i.test(e.Path)
        }, O.getBlobURL = function (e) {
            return new Promise((function (t) {
                (e = O.item(e)).URI || (e.URI = URL.createObjectURL("Blob" == e.DataType ? e.Content : new Blob([e.Content], { type: e["media-type"] }))), t(e)
            }))
        }, O.getDataURI = function (e) {
            return new Promise((function (t) {
                if ((e = O.item(e)).URI) t(e); else if ("Text" == e.DataType) e.URI = "data:" + e["media-type"] + ";base64," + btoa(unescape(encodeURIComponent(e.Content))), t(e); else {
                    var n = new FileReader;
                    n.onload = function () {
                        e.URI = n.result, t(e)
                    }, n.readAsDataURL(e.Content)
                }
            }))
        }, O.ContentTypes = {
            pdf: "application/pdf",
            "xht(ml)?": "application/xhtml+xml",
            xml: "application/xml",
            aac: "audio/aac",
            mp3: "audio/mpeg",
            otf: "font/opentype",
            ttf: "font/truetype",
            woff: "font/woff",
            woff2: "font/woff2",
            gif: "image/gif",
            "jpe?g": "image/jpeg",
            png: "image/png",
            svg: "image/svg+xml",
            webp: "image/webp",
            css: "text/css",
            js: "text/javascript",
            "html?": "text/html",
            mp4: "video/mp4",
            webm: "video/webm"
        }, O.preprocess = function (e) {
            e = O.item(e);
            var t = [], n = O.preprocess.getSetting(e.Path);
            if (!n) return Promise.resolve(e.Content);
            var i = [];
            if (n.ReplaceRules && (e.Content = n.ReplaceRules.reduce((function (e, t) {
                return e.replace(t[0], t[1])
            }), e.Content)), n.ResolveRules) {
                var o = e.Path.replace(/\/?[^\/]+$/, "");
                n.ResolveRules.forEach((function (n) {
                    return n.Patterns.forEach((function (r) {
                        var a = n.getRE(r.Attribute), s = e.Content.match(a);
                        if (s) {
                            var c = new RegExp("\\.(" + r.Extensions + ")$", "i");
                            s.forEach((function (r) {
                                var s = r.replace(a, n.PathRef),
                                    l = O.getPath(o, (/^(\.*\/+|#)/.test(s) ? "" : "./") + s).split("#");
                                if (c.test(l[0])) {
                                    t.push(O.item({ Path: l[0] }));
                                    var u = O.file({ Path: l[0] }, { Preprocess: !0, URI: !0 });
                                    i.push(u.then((function (t) {
                                        l[0] = t.URI, e.Content = e.Content.replace(r, r.replace(s, l.join("#")))
                                    })))
                                }
                            }))
                        }
                    }))
                }))
            }
            return Promise.all(i).then((function () {
                return e.Preprocessed = !0, e.ResItems = t, e
            }))
        }, O.preprocess.getSetting = function (e) {
            var t = O.preprocess.Settings;
            for (var n in t) if (new RegExp("\\.(" + n + ")$", "i").test(e)) return "function" == typeof t[n].init ? t[n].init() : t[n];
            return null
        }, O.preprocess.Settings = {
            css: {
                ReplaceRules: [[/\/\*[.\s\S]*?\*\/|[^\{\}]+\{\s*\}/gm, ""]], ResolveRules: [{
                    getRE: function () {
                        return /@import\s+["'](?!(?:https?|data):)(.+?)['"]/g
                    }, PathRef: "$1", Patterns: [{ Extensions: "css", ForceURI: !0 }]
                }, {
                    getRE: function () {
                        return /url\(["']?(?!(?:https?|data):)(.+?)['"]?\)/g
                    }, PathRef: "$1", Patterns: [{ Extensions: "gif|png|jpe?g|svg|ttf|otf|woff" }]
                }], init: function () {
                    var e = this.ReplaceRules;
                    return e.push([/(-(epub|webkit)-)?column-count\s*:\s*1\s*([;\}])/gm, "column-count: auto$3"]), e.push([/(-(epub|webkit)-)?text-underline-position\s*:/gm, "text-underline-position:"]), sML.UA.Chromium || sML.UA.WebKit ? this : (e.push([/-(epub|webkit)-/gm, ""]), sML.UA.Gecko ? (e.push([/text-combine-horizontal\s*:\s*([^;\}]+)\s*([;\}])/gm, "text-combine-upright: $1$2"]), e.push([/text-combine\s*:\s*horizontal\s*([;\}])/gm, "text-combine-upright: all$1"]), this) : (sML.UA.EdgeHTML && (e.push([/text-combine-(upright|horizontal)\s*:\s*([^;\}\s]+)\s*([;\}])/gm, "text-combine-horizontal: $2; text-combine-upright: $2$3"]), e.push([/text-combine\s*:\s*horizontal\s*([;\}])/gm, "text-combine-horizontal: all; text-combine-upright: all$1"])), sML.UA.Trident && (e.push([/writing-mode\s*:\s*vertical-rl\s*([;\}])/gm, "writing-mode: tb-rl$1"]), e.push([/writing-mode\s*:\s*vertical-lr\s*([;\}])/gm, "writing-mode: tb-lr$1"]), e.push([/writing-mode\s*:\s*horizontal-tb\s*([;\}])/gm, "writing-mode: lr-tb$1"]), e.push([/text-combine-(upright|horizontal)\s*:\s*([^;\}\s]+)\s*([;\}])/gm, "-ms-text-combine-horizontal: $2$3"]), e.push([/text-combine\s*:\s*horizontal\s*([;\}])/gm, "-ms-text-combine-horizontal: all$1"])), /^(zho?|chi|kor?|ja|jpn)$/.test(B.Language) && e.push([/text-align\s*:\s*justify\s*([;\}])/gm, "text-align: justify; text-justify: inter-ideograph$1"]), this))
                }
            },
            svg: {
                ReplaceRules: [[/<!--\s+[.\s\S]*?\s+-->/gm, ""]], ResolveRules: [{
                    getRE: function (e) {
                        return new RegExp("<\\??[a-zA-Z:\\-]+[^>]*? (" + e + ")\\s*=\\s*[\"'](?!(?:https?|data):)(.+?)['\"]", "g")
                    },
                    PathRef: "$2",
                    Patterns: [{ Attribute: "href", Extensions: "css", ForceURI: !0 }, {
                        Attribute: "src",
                        Extensions: "svg",
                        ForceURI: !0
                    }, { Attribute: "src|xlink:href", Extensions: "gif|png|jpe?g" }]
                }]
            },
            "html?|xht(ml)?|xml": {
                ReplaceRules: [[/<!--\s+[.\s\S]*?\s+-->/gm, ""]],
                ResolveRules: [{
                    getRE: function (e) {
                        return new RegExp("<\\??[a-zA-Z:\\-]+[^>]*? (" + e + ")\\s*=\\s*[\"'](?!(?:https?|data):)(.+?)['\"]", "g")
                    },
                    PathRef: "$2",
                    Patterns: [{ Attribute: "href", Extensions: "css", ForceURI: !0 }, {
                        Attribute: "src",
                        Extensions: "js|svg",
                        ForceURI: !0
                    }, { Attribute: "src|xlink:href", Extensions: "gif|png|jpe?g" }]
                }]
            }
        }, O.parseDocument = function (e) {
            return (new DOMParser).parseFromString(e.Content, /\.(xml|opf|ncx)$/i.test(e.Path) ? "text/xml" : "text/html")
        }, O.openDocument = function (e) {
            return O.file(e).then(O.parseDocument).catch(O.error)
        }, O.editCSSRules = function () {
            var e, t;
            "function" == typeof arguments[0] ? (e = arguments[1], t = arguments[0]) : "function" == typeof arguments[1] && (e = arguments[0], t = arguments[1]), e || (e = document), e.styleSheets && "function" == typeof t && sML.forEach(e.styleSheets)((function (e) {
                return O.editCSSRulesOfStyleSheet(e, t)
            }))
        }, O.editCSSRulesOfStyleSheet = function (e, t) {
            try {
                if (!e.cssRules) return
            } catch (e) {
                return
            }
            for (var n = e.cssRules.length, i = 0; i < n; i++) {
                var o = e.cssRules[i];
                o.cssRules ? O.editCSSRulesOfStyleSheet(o, t) : o.styleSheet ? O.editCSSRulesOfStyleSheet(o.styleSheet, t) : t(o)
            }
        }, O.getWritingMode = function (e) {
            var t = getComputedStyle(e);
            return O.WritingModeProperty ? /^vertical-/.test(t[O.WritingModeProperty]) ? ("rtl" == t.direction ? "bt" : "tb") + "-" + (/-lr$/.test(t[O.WritingModeProperty]) ? "lr" : "rl") : /^horizontal-/.test(t[O.WritingModeProperty]) ? ("rtl" == t.direction ? "rl" : "lr") + "-" + (/-bt$/.test(t[O.WritingModeProperty]) ? "bt" : "tb") : /^(lr|rl|tb|bt)-/.test(t[O.WritingModeProperty]) ? t[O.WritingModeProperty] : void 0 : "rtl" == t.direction ? "rl-tb" : "lr-tb"
        }, O.getElementInnerText = function (e) {
            var t = "InnerText", n = document.createElement("div");
            return n.innerHTML = e.innerHTML.replace(/ (src(set)?|source|(xlink:)?href)=/g, " data-$1="), sML.forEach(n.querySelectorAll("svg"))((function (e) {
                return e.parentNode.removeChild(e)
            })), sML.forEach(n.querySelectorAll("video"))((function (e) {
                return e.parentNode.removeChild(e)
            })), sML.forEach(n.querySelectorAll("audio"))((function (e) {
                return e.parentNode.removeChild(e)
            })), sML.forEach(n.querySelectorAll("img"))((function (e) {
                return e.parentNode.removeChild(e)
            })), sML.forEach(n.querySelectorAll("script"))((function (e) {
                return e.parentNode.removeChild(e)
            })), sML.forEach(n.querySelectorAll("style"))((function (e) {
                return e.parentNode.removeChild(e)
            })), void 0 !== n.textContent ? t = n.textContent : void 0 !== n.innerText && (t = n.innerText), t.replace(/[\r\n\s\t ]/g, "")
        }, O.getElementCoord = function (e, t) {
            var n = { X: e.offsetLeft, Y: e.offsetTop };
            for (t = t && t.tagName ? t : null; e.offsetParent != t;) e = e.offsetParent, n.X += e.offsetLeft, n.Y += e.offsetTop;
            return n
        }, O.getPath = function () {
            var e = "", t = arguments[0];
            if (2 == arguments.length && /^[\w\d]+:\/\//.test(arguments[1])) t = arguments[1]; else for (var n = arguments.length, i = 1; i < n; i++) t += "/" + arguments[i];
            for (t.replace(/^([a-zA-Z]+:\/\/[^\/]+)?\/*(.*)$/, (function (n, i, o) {
                e = i, t = o
            })); /([^:\/])\/{2,}/.test(t);) t = t.replace(/([^:\/])\/{2,}/g, "$1/");
            for (; /\/\.\//.test(t);) t = t.replace(/\/\.\//g, "/");
            for (; /[^\/]+\/\.\.\//.test(t);) t = t.replace(/[^\/]+\/\.\.\//g, "");
            return t = t.replace(/^(\.\/)+/g, ""), e && (t = e + "/" + t), t
        }, O.fullPath = function (e) {
            return B.Path + B.PathDelimiter + e
        }, O.getViewportByMetaContent = function (e) {
            if ("string" == typeof e && /width/.test(e) && /height/.test(e)) {
                var t = 1 * (e = e.replace(/\s+/g, "")).replace(/^.*?width=(\d+).*$/, "$1"),
                    n = 1 * e.replace(/^.*?height=(\d+).*$/, "$1");
                if (!isNaN(t) && !isNaN(n)) return { Width: t, Height: n }
            }
            return null
        }, O.getViewportByViewBox = function (e) {
            if ("string" == typeof e) {
                var t = e.replace(/^\s+/, "").replace(/\s+$/, "").split(/\s+/);
                if (4 == t.length) {
                    var n = 1 * t[2], i = 1 * t[3];
                    if (!isNaN(n) && !isNaN(i)) return { Width: n, Height: i }
                }
            }
            return null
        }, O.getViewportByImage = function (e) {
            if (e && /^img$/i.test(e.tagName)) {
                var t = getComputedStyle(e);
                return { Width: parseInt(t.width), Height: parseInt(t.height) }
            }
            return null
        }, O.getViewportByOriginalResolution = function (e) {
            if ("string" == typeof e) {
                var t = e.replace(/\s+/, "").split("x");
                if (2 == t.length) {
                    var n = 1 * t[0], i = 1 * t[1];
                    if (!isNaN(n) && !isNaN(i)) return { Width: n, Height: i }
                }
            }
            return null
        }, O.isAnchorContent = function (e) {
            for (; e;) {
                if (/^a$/i.test(e.tagName)) return !0;
                e = e.parentElement
            }
            return !1
        }, O.stopPropagation = function (e) {
            return e.stopPropagation(), !1
        }, O.preventDefault = function (e) {
            return e.preventDefault(), !1
        }, O.getBibiEvent = function (e) {
            if (!e) return {};
            var t, n, i, o, r = O.getBibiEventCoord(e), a = S["flipper-width"],
                s = { X: r.X / window.innerWidth, Y: r.Y / window.innerHeight };
            a < 1 ? (o = t = a, n = i = 1 - a) : (n = 1 - (o = a / window.innerWidth), i = 1 - (t = a / window.innerHeight));
            var c = {};
            return c.X = s.X < o ? "left" : n < s.X ? "right" : "center", c.Y = s.Y < t ? "top" : i < s.Y ? "bottom" : "middle", {
                Target: e.target,
                Coord: r,
                Ratio: s,
                Division: c
            }
        }, O.getBibiEventCoord = function (e) {
            var t = { X: 0, Y: 0 };
            if (/^touch/.test(e.type) ? (t.X = e.changedTouches[0].pageX, t.Y = e.changedTouches[0].pageY) : (t.X = e.pageX, t.Y = e.pageY), e.target.ownerDocument.documentElement == O.HTML) t.X -= O.Body.scrollLeft, t.Y -= O.Body.scrollTop; else {
                var n = R.Main, i = n.Transformation.Scale, o = n.offsetWidth / 2, r = n.offsetHeight / 2,
                    a = n.Transformation.TranslateX, s = n.Transformation.TranslateY,
                    c = e.target.ownerDocument.documentElement.Item, l = c.Scale, u = O.getElementCoord(c, n);
                "pre-paginated" == c.Ref["rendition:layout"] || c.Outsourcing || (u.X += S["item-padding-left"], u.Y += S["item-padding-top"]), t.X = Math.floor(n.offsetLeft + (o + a + (u.X + t.X * l - n.scrollLeft - o) * i)), t.Y = Math.floor(n.offsetTop + (r + s + (u.Y + t.Y * l - n.scrollTop - r) * i))
            }
            return t
        }, O.Cookies = {
            Label: "bibi", remember: function (e) {
                var t = JSON.parse(sML.Cookies.read(O.Cookies.Label) || "{}");
                return console.log("Cookies:", t), "string" == typeof e && e ? t[e] : t
            }, eat: function (e, t, n) {
                if ("string" != typeof e || !e) return !1;
                if ("object" != _typeof(t)) return !1;
                var i = O.Cookies.remember();
                for (var o in "object" != _typeof(i[e]) && (i[e] = {}), t) {
                    var r = t[o];
                    "function" != typeof r && (i[e][o] = r)
                }
                n || (n = {}), n.Path = location.pathname.replace(/[^\/]+$/, ""), n.Expires || (n.Expires = S["cookie-expires"]), sML.Cookies.write(O.Cookies.Label, JSON.stringify(i), n)
            }
        }, O.Biscuits = {
            Memories: {}, Labels: {}, initialize: function (e) {
                if ("string" != typeof e) return O.Biscuits.__forget_about_cookies(), O.Biscuits.LabelBase = "BibiBiscuits:" + P.Script.src.replace(new RegExp("^" + O.Origin.replace(/([\/\.])/g, "\\$1")), ""), E.bind("bibi:initialized", (function () {
                    return O.Biscuits.initialize("Bibi")
                })), E.bind("bibi:initialized-book", (function () {
                    return O.Biscuits.initialize("Book")
                })), null;
                if ("Bibi" != e && "Book" != e) return null;
                var t = O.Biscuits.Labels[e] = O.Biscuits.LabelBase + ("Book" == e ? "#" + B.ID.replace(/^urn:uuid:/, "") : ""),
                    n = localStorage.getItem(t);
                return O.Biscuits.Memories[t] = n ? JSON.parse(n) : {}, O.Biscuits.Memories[t]
            }, remember: function (e, t) {
                if (!e || "string" != typeof e || !O.Biscuits.Labels[e]) return O.Biscuits.Memories;
                var n = O.Biscuits.Labels[e];
                return t && "string" == typeof t ? O.Biscuits.Memories[n][t] : O.Biscuits.Memories[n]
            }, memorize: function (e, t) {
                if (!e || "string" != typeof e || !O.Biscuits.Labels[e]) return !1;
                var n = O.Biscuits.Labels[e];
                if (t && "object" == _typeof(t)) for (var i in t) {
                    var o = t[i];
                    try {
                        if (!o || "function" == typeof o || void 0 === JSON.parse(JSON.stringify(_defineProperty({}, i, o)))[i]) throw"";
                        O.Biscuits.Memories[n][i] = o
                    } catch (e) {
                        delete O.Biscuits.Memories[n][i]
                    }
                }
                return localStorage.setItem(n, JSON.stringify(O.Biscuits.Memories[n]))
            }, forget: function (e, t) {
                if (e) if ("string" == typeof e && O.Biscuits.Labels[e]) {
                    var n = O.Biscuits.Labels[e];
                    t ? ("string" == typeof t && (t = [t]), t instanceof Array && t.forEach((function (e) {
                        return !("string" != typeof e || !e) && delete O.Biscuits.Memories[n][e]
                    })), localStorage.setItem(n, JSON.stringify(O.Biscuits.Memories[n]))) : (localStorage.removeItem(n), delete O.Biscuits.Memories[n])
                } else ; else localStorage.removeItem(O.Biscuits.Labels.Bibi), localStorage.removeItem(O.Biscuits.Labels.Book), O.Biscuits.Memories = {};
                return O.Biscuits.Memories
            }, __forget_about_cookies: function () {
                return setTimeout((function () {
                    try {
                        sML.Cookies.write(O.Cookies.Label, "", { Expires: 0 })
                    } catch (e) {
                    }
                }), 999)
            }
        }, O.SettingTypes = {
            boolean: ["prioritise-fallbacks"],
            "yes-no": ["accept-orthogonal-input", "allow-placeholders", "animate-page-flipping", "autostart", "autostart-embedded", "double-spread-for-reflowable", "fix-nav-ttb", "fix-reader-view-mode", "start-embedded-in-new-window", "use-arrows", "use-bookmarks", "use-font-size-changer", "use-full-height", "use-history", "use-keys", "use-loupe", "use-menubar", "use-nombre", "use-slider", "zoom-out-for-utilities"],
            string: ["slider-mode", "default-page-progression-direction"],
            integer: ["item-padding-bottom", "item-padding-left", "item-padding-right", "item-padding-top", "spread-gap", "spread-margin"],
            number: ["base-font-size", "flipper-width", "font-size-scale-per-step", "loupe-max-scale", "orientation-border-ratio"],
            array: []
        }, O.SettingTypes_PresetOnly = {
            boolean: ["accept-base64-encoded-data", "accept-blob-converted-data", "remove-bibi-website-link"],
            "yes-no": ["accept-local-file", "keep-settings", "resume-from-last-position"],
            string: [],
            integer: ["max-history", "max-bookmarks"],
            number: [],
            array: ["trustworthy-origins", "extract-if-necessary"]
        }, O.SettingTypes_UserOnly = { boolean: ["wait"], "yes-no": [], integer: ["nav"], number: [], array: [] };
        var E = {
            initialize: function () {
                sML.applyRtL(E, new sML.CustomEvents("bibi")), void 0 !== document.onpointerdown ? (E.pointerdown = "pointerdown", E.pointermove = "pointermove", E.pointerup = "pointerup", E.pointerover = "pointerover", E.pointerout = "pointerout") : O.TouchOS && void 0 !== document.ontouchstart ? (E.pointerdown = "touchstart", E.pointermove = "touchmove", E.pointerup = "touchend") : (E.pointerdown = "mousedown", E.pointermove = "mousemove", E.pointerup = "mouseup", E.pointerover = "mouseover", E.pointerout = "mouseout"), E.resize = O.TouchOS ? "orientationchange" : "resize"
            }
        }, M = {
            post: function (e, t) {
                return !!O.Embedded && (!("string" != typeof e || !e) && ("string" == typeof t && t || (t = "*"), window.parent.postMessage(e, t)))
            }, receive: function (e) {
                try {
                    if ("object" != _typeof(e = JSON.parse(e)) || !e) return !1;
                    for (var t in e) /^bibi:commands:/.test(t) && E.dispatch(t, e[t]);
                    return !0
                } catch (e) {
                }
                return !1
            }, gate: function (e) {
                if (e && e.data) for (var t = S["trustworthy-origins"].length, n = 0; n < t; n++) if (S["trustworthy-origins"][n] == e.origin) return M.receive(e.data)
            }
        }, X = {
            Extensions: [], Bibi: {}, load: function (e) {
                return new Promise((function (t, n) {
                    if (!e.src || "string" != typeof e.src) return n('"path" of the Extension Seems to Be Invalid. ("'.concat(e.src, '")'));
                    var i = new URL(e.src).origin;
                    if (!S["trustworthy-origins"].includes(i)) return n('The Origin Is Not Allowed. ("'.concat(e.src, '")'));
                    e.Script = document.head.appendChild(sML.create("script", {
                        className: "bibi-extension-script",
                        src: e.src,
                        Extension: e,
                        resolve: t,
                        reject: function () {
                            n(), document.head.removeChild(this)
                        }
                    }))
                }))
            }, add: function (e) {
                var t = document.currentScript;
                if (void 0 === e.id) return t.reject('"id" of the extension is undefined.');
                if ("string" != typeof e.id) return t.reject('"id" of the extension is invalid.');
                if (!e.id) return t.reject('"id" of the extension is blank.');
                if (X[e.id]) return t.reject('"id" of the extension is reserved or already used by another. ("'.concat(e.id, '")'));
                t.setAttribute("data-bibi-extension-id", e.id), X[e.id] = t.Extension = sML.applyRtL(e, t.Extension), X[e.id].Index = X.Extensions.length, X.Extensions.push(X[e.id]), t.resolve(X[e.id]);
                var n = X[e.id];
                return function (e) {
                    return n && "function" == typeof e && E.bind("bibi:readied", (function () {
                        return e.call(n, n)
                    })), function (e) {
                        return n && "function" == typeof e && E.bind("bibi:prepared", (function () {
                            return e.call(n, n)
                        })), function (e) {
                            n && "function" == typeof e && E.bind("bibi:opened", (function () {
                                return e.call(n, n)
                            }))
                        }
                    }
                }
            }
        };
        Bibi.x = X.add
    }, 2: function (e, t, n) {
        "use strict";
        e.exports = function (e) {
            var t = [];
            return t.toString = function () {
                return this.map((function (t) {
                    var n = function (e, t) {
                        var n = e[1] || "", i = e[3];
                        if (!i) return n;
                        if (t && "function" == typeof btoa) {
                            var o = (a = i, s = btoa(unescape(encodeURIComponent(JSON.stringify(a)))), c = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(s), "/*# ".concat(c, " */")),
                                r = i.sources.map((function (e) {
                                    return "/*# sourceURL=".concat(i.sourceRoot).concat(e, " */")
                                }));
                            return [n].concat(r).concat([o]).join("\n")
                        }
                        var a, s, c;
                        return [n].join("\n")
                    }(t, e);
                    return t[2] ? "@media ".concat(t[2], " {").concat(n, "}") : n
                })).join("")
            }, t.i = function (e, n) {
                "string" == typeof e && (e = [[null, e, ""]]);
                for (var i = 0; i < e.length; i++) {
                    var o = [].concat(e[i]);
                    n && (o[2] ? o[2] = "".concat(n, " and ").concat(o[2]) : o[2] = n), t.push(o)
                }
            }, t
        }
    }, 28: function (e, t, n) {
        "use strict";
        n.r(t);
        var i = n(4), o = n.n(i), r = n(12);
        for (var a in self.sML = o.a, r) self[a] = r[a];
        n(29), document.addEventListener("DOMContentLoaded", (function () {
            Bibi.Script = document.getElementById("bibi-script"), function (e) {
                if (!window.Promise) return document.head.insertBefore(o.a.create("script", {
                    className: "bibi-polyfill",
                    src: Bibi.Script.src.replace(/\/bibi\.js$/, "/polyfills/bundle.js"),
                    onload: e
                }), Bibi.Script);
                var t = [], n = new URL("./polyfills", Bibi.Script.src).href;
                if (window.TextDecoder || t.push(n + "/encoding.js"), window.IntersectionObserver || t.push(n + "/intersection-observer.js"), !t.length) return e();
                var i = [];
                t.forEach((function (e) {
                    return i.push(new Promise((function (t) {
                        return document.head.insertBefore(o.a.create("script", {
                            className: "bibi-polyfill",
                            src: e,
                            onload: t
                        }), Bibi.Script)
                    })))
                })), Promise.all(i).then(e)
            }((function () {
                for (var e = "", t = Bibi.Script.nextElementSibling; t;) {
                    if (/^style$/i.test(t.tagName) && /^\/\*! Bibi Book Style \*\//.test(t.textContent)) {
                        e = t.textContent.replace(/\/*.*?\*\//g, "").trim(), t.innerHTML = "", document.head.removeChild(t);
                        break
                    }
                    t = t.nextElementSibling
                }
                Bibi.BookStyleURL = URL.createObjectURL(new Blob([e], { type: "text/css" })), Bibi.hello()
            }))
        }))
    }, 29: function (e, t, n) {
        var i = n(1), o = n(30);
        "string" == typeof (o = o.__esModule ? o.default : o) && (o = [[e.i, o, ""]]);
        var r = { insert: "head", singleton: !1 }, a = (i(e.i, o, r), o.locals ? o.locals : {});
        e.exports = a
    }, 30: function (e, t, n) {
        (t = n(2)(!1)).push([e.i, "/*! Bibi Book Style */body,html,img.bibi-spine-item-image{margin:0;padding:0;border:0}img.bibi-spine-item-image{display:block;width:auto;height:auto}html.bibi-columned iframe,html.bibi-columned image,html.bibi-columned img,html.bibi-columned picture,html.bibi-columned svg,html.bibi-columned video{-webkit-column-break-inside:avoid;page-break-inside:avoid;break-inside:avoid}html.bibi-with-gutters>head{display:block}html.bibi-with-gutters>head>:not(bibi-neck){display:none}html.bibi-with-gutters>head>bibi-neck{display:block;position:relative;z-index:-99999999999;margin:0;border:0;padding:0}html.bibi-with-gutters>head>bibi-neck>bibi-throat{display:block;float:left;margin:0;border:0;padding:0}", ""]), e.exports = t
    }, 4: function (e, t, n) {
        (function (t) {
            var n = this;
            
            function i(e) {
                throw new Error('"' + e + '" is read-only')
            }
            
            function o(e) {
                return (o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                    return typeof e
                } : function (e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                })(e)
            }
            
            /*!
 *                                                                                                                         (℠)
 *  # sML.js | I'm a Simple and Middling Library.
 *
 *  * Copyright (c) Satoru MATSUSHIMA - https://github.com/satorumurmur/sML
 *  * Licensed under the MIT license. - https://www.opensource.org/licenses/mit-license.php
 *
 */
            !function (i) {
                e.exports ? e.exports = i : (void 0 !== t ? t : void 0 !== n ? n : self).sML = i
            }(function () {
                "use strict";
                var e, t, n, r = { version: "1.0.22" }, a = navigator.userAgent, s = function (e) {
                    var t, n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "$1";
                    return e ? (t = new RegExp("^.*" + e + "[ :\\/]?(\\d+([\\._]\\d+)*).*$")).test(a) ? a.replace(t, n).replace(/_/g, ".").split(".").map((function (e) {
                        return parseInt(e) || 0
                    })) : [] : []
                };
                return r.OperatingSystem = (e = {}, /Mac OS X/.test(a) ? /\(iP(hone|ad|od touch);/.test(a) ? e.iOS = s("CPU (iPhone )?OS", "$2") : void 0 !== document.ontouchend ? e.iPadOS = e.iOS = s() : /Mac OS X 10[\._]\d/.test(a) && (e.macOS = s("Mac OS X ")) : /Windows( NT)? \d/.test(a) ? e.Windows = 6 != (t = s("Windows( NT)?", "$2"))[0] ? t : t[1] >= 3 ? [8, 1] : t[1] >= 2 ? [8] : t[1] >= 1 ? [7] : t : /Android \d/.test(a) ? e.Android = s("Android") : /CrOS/.test(a) ? e.Chrome = s() : /X11;/.test(a) ? e.Linux = s() : /Firefox/.test(a) && (e.Firefox = s()), e), r.UserAgent = (n = {}, /Gecko\/\d/.test(a) ? (n.Gecko = s("rv"), /Waterfox\/\d/.test(a) ? n.Waterfox = s("Waterfox") : /Firefox\/\d/.test(a) && (n.Firefox = s("Firefox"))) : /Edge\/\d/.test(a) ? n.EdgeHTML = n.Edge = s("Edge") : /Chrom(ium|e)\/\d/.test(a) ? (n.Blink = n.Chromium = function (e) {
                    return e[0] ? e : s("Chrome")
                }(s("Chromium")), /Edg\/\d/.test(a) ? n.Edge = s("Edg") : /OPR\/\d/.test(a) ? n.Opera = s("OPR") : /Silk\/\d/.test(a) ? n.Silk = s("Silk") : /Vivaldi\/\d/.test(a) ? n.Vivaldi = s("Vivaldi") : /Phoebe\/\d/.test(a) ? n.Phoebe = s("Phoebe") : n.Chrome = function (e) {
                    return e[0] ? e : n.Chromium
                }(s("Chrome"))) : /AppleWebKit\/\d/.test(a) ? (n.WebKit = s("AppleWebKit"), /CriOS \d/.test(a) ? n.Chrome = s("CriOS") : /FxiOS \d/.test(a) ? n.Firefox = s("FxiOS") : /EdgiOS\/\d/.test(a) ? n.Edge = s("EdgiOS") : /Version\/\d/.test(a) && (n.Safari = s("Version"))) : /Trident\/\d/.test(a) && (n.Trident = s("Trident"), n.InternetExplorer = function (e) {
                    return e[0] ? e : s("MSIE")
                }(s("rv"))), n), r.Environments = [r.OperatingSystem, r.UserAgent].reduce((function (e, t) {
                    for (var n in t) t[n] && e.push(n);
                    return e
                }), []), Object.defineProperties(r, {
                    OS: {
                        get: function () {
                            return r.OperatingSystem
                        }
                    }, UA: {
                        get: function () {
                            return r.UserAgent
                        }
                    }
                }), r.forEach = function (e) {
                    return function (t) {
                        for (var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : window || self, i = e.length, o = 0; o < i && "break" != t.call(n, e[o], o, e); o++) ;
                    }
                }, r.replace = function (e, t) {
                    if (!(t[0] instanceof Array)) return e.replace(t[0], t[1]);
                    for (var n = t.length, i = 0; i < n; i++) e = e.replace(t[i][0], t[i][1]);
                    return e
                }, r.capitalise = function (e) {
                    return e.charAt(0).toUpperCase() + e.slice(1)
                }, r.capitalize = function (e) {
                    return e.charAt(0).toUpperCase() + e.slice(1)
                }, r.limitMin = function (e, t) {
                    return e < t ? t : e
                }, r.limitMax = function (e, t) {
                    return t < e ? t : e
                }, r.limitMinMax = function (e, t, n) {
                    return n < t ? NaN : e < t ? t : n < e ? n : e
                }, r.random = function (e, t) {
                    isNaN(e) && isNaN(t) ? (e = 0, t = 1) : isNaN(e) ? e = 0 : isNaN(t) && (t = 0);
                    var n = Math.min(e, t), i = Math.max(e, t);
                    return Math.floor(Math.random() * (i - n + 1)) + n
                }, r.edit = function (e) {
                    var t = arguments.length <= 1 ? 0 : arguments.length - 1;
                    if (e.tagName) for (var n = 0; n < t; n++) {
                        var i = n + 1 < 1 || arguments.length <= n + 1 ? void 0 : arguments[n + 1];
                        for (var o in i) "data" != o && "on" != o && "style" != o && (e[o] = i[o]);
                        if (i.data) for (var a in i.data) e.setAttribute("data-" + a, i.data[a]);
                        if (i.on) for (var s in i.on) e.addEventListener(s, i.on[s]);
                        i.style && r.CSS.setStyle(e, i.style)
                    } else for (var c = 0; c < t; c++) {
                        var l = c + 1 < 1 || arguments.length <= c + 1 ? void 0 : arguments[c + 1];
                        for (var u in l) e[u] = l[u]
                    }
                    return e
                }, r.create = function (e) {
                    for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
                    return r.edit.apply(r, [document.createElement(e)].concat(n))
                }, r.hatch = function (e) {
                    var t = r.create("div", { innerHTML: e }), n = document.createDocumentFragment();
                    return Array.prototype.forEach.call(t.childNodes, (function () {
                        return n.appendChild(t.firstChild)
                    })), n
                }, r.clone = function (e) {
                    var t = new Function;
                    return t.prototype = e, new t
                }, r.apply = function () {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                        t = arguments.length > 1 ? arguments[1] : void 0;
                    if (e.From && e.To) if (t) for (var n in e.From) "function" != typeof e.To[n] && "function" != typeof e.From[n] && (e.To[n] = e.From[n]); else for (var i in e.From) e.To[i] = e.From[i];
                    return e.To
                }, r.applyLtR = function (e, t, n) {
                    return r.apply({ From: e, To: t }, n)
                }, r.applyRtL = function (e, t, n) {
                    return r.apply({ From: t, To: e }, n)
                }, r.replaceClass = function (e, t, n) {
                    return e.classList.contains(t) && e.classList.remove(t), e.classList.add(n)
                }, r.CSS = {
                    _get_sMLStyle_sheet: function () {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : document;
                        return e.sMLStyle || (e.sMLStyle = e.createElement("style"), e.sMLStyle.appendChild(e.createTextNode("")), e.head.appendChild(e.sMLStyle)), e.sMLStyle.sheet
                    }, appendRule: function (e, t) {
                        var n = document;
                        "string" != typeof arguments[0] && (n = arguments[0], e = arguments[1], t = arguments[2]);
                        var i = this._get_sMLStyle_sheet(n);
                        return i.insertRule((e instanceof Array ? e.join(", ") : e) + " { " + (t instanceof Array ? t.join(" ") : t) + " }", i.cssRules.length)
                    }, deleteRule: function (e) {
                        var t = document;
                        "number" != typeof arguments[0] && (t = arguments[0], e = arguments[1]);
                        var n = this._get_sMLStyle_sheet(t);
                        if (n) return n.deleteRule(e)
                    }, setStyle: function (e) {
                        for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
                        if (e instanceof Array) for (var o = e.length, a = 0; a < o; a++) {
                            var s;
                            (s = r.CSS).setStyle.apply(s, [e[a]].concat(n))
                        } else for (var c = n.length, l = 0; l < c; l++) for (var u in n[l]) e.style[u] = n[l][u];
                        return Promise.resolve()
                    }, _add_sMLTransitionEndListener: function (e, t) {
                        var n = this;
                        e._sMLTransitionEndListener && this._remove_sMLTransitionEndListener(e), e._sMLTransitionEndListener = function (i) {
                            return t.call(e, i) && n._remove_sMLTransitionEndListener(e)
                        }, e.addEventListener("transitionend", e._sMLTransitionEndListener)
                    }, _remove_sMLTransitionEndListener: function (e) {
                        e._sMLTransitionEndListener && (e.removeEventListener("transitionend", e._sMLTransitionEndListener), delete e._sMLTransitionEndListener)
                    }, setTransition: function (e) {
                        for (var t = this, n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++) i[o - 1] = arguments[o];
                        if (e instanceof Array) {
                            for (var a = [], s = e.length, c = 0; c < s; c++) {
                                var l;
                                a.push((l = r.CSS).setTransition.apply(l, [e[c]].concat(i)))
                            }
                            return Promise.all(a)
                        }
                        return new Promise((function (n) {
                            for (var o = e.getAttribute("style"), r = [o ? o.trim() : ""], a = i.length, s = 0; s < a; s++) for (var c in i[s]) {
                                var l = i[s][c];
                                "" !== l ? r.push(c + ": " + l + ";") : r[0] && (r[0] = r[0].replace(new RegExp(c + "[ :\\-].+?(; *|$)", "g"), "").trim())
                            }
                            t._add_sMLTransitionEndListener(e, (function (e) {
                                return n(e)
                            })), e.style = r.join(" ")
                        }))
                    }
                }, r.appendCSSRule = function () {
                    return r.CSS.appendRule.apply(r.CSS, arguments)
                }, r.deleteCSSRule = function () {
                    return r.CSS.deleteRule.apply(r.CSS, arguments)
                }, r.style = function () {
                    return r.CSS.setStyle.apply(r.CSS, arguments)
                }, r.transition = function () {
                    return r.CSS.setTransition.apply(r.CSS, arguments)
                }, r.Coords = {
                    getXY: function (e, t) {
                        return { X: e, Y: t }
                    }, getWidthHeight: function (e, t) {
                        return { Width: e, Height: t }
                    }, getScreenSize: function () {
                        return this.getWidthHeight(screen.availWidth, screen.availHeight)
                    }, getScrollSize: function (e) {
                        return e && e != window && e != document || (e = document.documentElement), this.getWidthHeight(e.scrollWidth, e.scrollHeight)
                    }, getOffsetSize: function (e) {
                        return e && e != window || (e = document.documentElement), e == document ? this.getScrollSize(document.documentElement) : this.getWidthHeight(e.offsetWidth, e.offsetHeight)
                    }, getClientSize: function (e) {
                        return e && e != window || (e = document.documentElement), e == document ? this.getScrollSize(document.documentElement) : this.getWidthHeight(e.clientWidth, e.clientHeight)
                    }, getDocumentSize: function () {
                        return this.getScrollSize(document.documentElement)
                    }, getWindowSize: function () {
                        return this.getOffsetSize(document.documentElement)
                    }, getElementSize: function (e) {
                        return this.getOffsetSize(e)
                    }, getWindowCoord: function (e) {
                        return this.getXY(window.screenLeft || window.screenX, window.screenTop || window.screenY)
                    }, getElementCoord: function (e) {
                        for (var t = e.offsetLeft, n = e.offsetTop; e.offsetParent;) t += (e = e.offsetParent).offsetLeft, n += e.offsetTop;
                        return this.getXY(t, n)
                    }, getScrollCoord: function (e) {
                        return e && e != window ? this.getXY(e.scrollLeft, e.scrollTop) : this.getXY(window.scrollX || window.pageXOffset || document.documentElement.scrollLeft, window.scrollY || window.pageYOffset || document.documentElement.scrollTop)
                    }, getScrollLimitCoord: function (e) {
                        e && e != window || (e = document.documentElement);
                        var t = this.getScrollSize(e), n = this.getClientSize(e);
                        return this.getXY(t.Width - n.Width, t.Height - n.Height)
                    }, getEventCoord: function (e) {
                        return e ? this.getXY(e.pageX, e.pageY) : this.getXY(0, 0)
                    }, getCoord: function (e) {
                        var t, n;
                        return e.tagName ? (t = this.getElementCoord(e), n = this.getOffsetSize(e)) : e == window ? (t = this.getScrollCoord(), n = this.getOffsetSize(document.documentElement)) : e == document ? (t = {
                            X: 0,
                            Y: 0
                        }, n = this.getScrollSize(document.documentElement)) : e == screen && (t = {
                            X: 0,
                            Y: 0
                        }, n = this.getScreenSize()), {
                            X: t.X,
                            Y: t.Y,
                            Top: t.Y,
                            Right: t.X + n.Width,
                            Bottom: t.Y + n.Height,
                            Left: t.X,
                            Width: n.Width,
                            Height: n.Height
                        }
                    }
                }, r.getCoord = function () {
                    return r.Coords.getCoord.apply(r.Coords, arguments)
                }, r.preventDefault = function (e) {
                    return e.preventDefault()
                }, r.stopPropagation = function (e) {
                    return e.stopPropagation()
                }, r.CustomEvents = function () {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "sml",
                        t = e + "EventListener", n = e + "BindedEventListeners",
                        i = new RegExp("^" + e + ":[\\w\\d\\-:]+$");
                    return this.add = function (e, n) {
                        var r = this, a = document;
                        return arguments.length > 2 && (a = arguments[0], e = arguments[1], n = arguments[2]), e instanceof Array ? e.forEach((function (e) {
                            return r.add(a, e, n)
                        })) || n : n instanceof Array ? n.forEach((function (t) {
                            return r.add(a, e, t)
                        })) || n : !("object" != o(a) || "string" != typeof e || !i.test(e) || "function" != typeof n) && (n[t] || (n[t] = function (e) {
                            return n.call(a, e.detail)
                        }), a.addEventListener(e, n[t], !1), n)
                    }, this.remove = function (e, n) {
                        var r = this, a = document;
                        return arguments.length > 2 && (a = arguments[0], e = arguments[1], n = arguments[2]), e instanceof Array ? e.forEach((function (e) {
                            return r.remove(a, e, n)
                        })) || n : n instanceof Array ? n.forEach((function (t) {
                            return r.remove(a, e, t)
                        })) || n : !("object" != o(a) || "string" != typeof e || !i.test(e) || "function" != typeof n) && (a.removeEventListener(e, n[t]), n)
                    }, this.bind = function (e, t) {
                        var r = this, a = document;
                        return arguments.length > 2 && (a = arguments[0], e = arguments[1], t = arguments[2]), e instanceof Array ? e.forEach((function (e) {
                            return r.bind(a, e, t)
                        })) || t : t instanceof Array ? t.forEach((function (t) {
                            return r.bind(a, e, t)
                        })) || t : !("object" != o(a) || "string" != typeof e || !i.test(e) || "function" != typeof t) && (a[n] || (a[n] = {}), a[n][e] instanceof Array || (a[n][e] = []), a[n][e] = a[n][e].filter((function (e) {
                            return e != t
                        })), a[n][e].push(t), t)
                    }, this.unbind = function (e, t) {
                        var r = this, a = document;
                        return arguments.length > 2 && (a = arguments[0], e = arguments[1], t = arguments[2]), e instanceof Array ? e.forEach((function (e) {
                            return r.unbind(a, e, t)
                        })) || t : t instanceof Array ? t.forEach((function (t) {
                            return r.unbind(a, e, t)
                        })) || t : !("object" != o(a) || "string" != typeof e || !i.test(e) || "function" != typeof t) && (!!(a[n] && a[n][e] instanceof Array) && (a[n][e] = a[n][e].filter((function (e) {
                            return e != t
                        })), t))
                    }, this.dispatch = function (e, t) {
                        var r = document;
                        return arguments.length > 2 && (r = arguments[0], e = arguments[1], t = arguments[2]), !("object" != o(r) || "string" != typeof e || !i.test(e)) && (r[n] && r[n][e] instanceof Array && r[n][e].forEach((function (e) {
                            return "function" == typeof e && e.call(r, t)
                        })), r.dispatchEvent(new CustomEvent(e, { detail: t })))
                    }, this
                }, r.Scroller = {
                    scrollTo: function (e) {
                        var t, n = this, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                            a = e.Frame && e.Frame instanceof HTMLElement ? e.Frame : window, s = {};
                        if (a.sMLScrollerSetting ? (s = a.sMLScrollerSetting).cancel() : ((s = a.sMLScrollerSetting = { Frame: a }).scrollTo = s.Frame === window ? function (e, t) {
                            return window.scrollTo(e, t)
                        } : function (e, t) {
                            s.Frame.scrollLeft = e, s.Frame.scrollTop = t
                        }, s.cancel = function () {
                            s.removeScrollCancelation(), s.oncanceled && s.oncanceled()
                        }, s.addScrollCancelation = function () {
                            return ["keydown", "mousedown", "wheel"].forEach((function (e) {
                                return s.Frame.addEventListener(e, s.cancel)
                            }))
                        }, s.removeScrollCancelation = function () {
                            return ["keydown", "mousedown", "wheel"].forEach((function (e) {
                                return s.Frame.removeEventListener(e, s.cancel)
                            }))
                        }, s.preventUserScrolling = function () {
                            return ["keydown", "mousedown", "wheel"].forEach((function (e) {
                                return s.Frame.addEventListener(e, r.preventDefault)
                            }))
                        }, s.allowUserScrolling = function () {
                            return ["keydown", "mousedown", "wheel"].forEach((function (e) {
                                return s.Frame.removeEventListener(e, r.preventDefault)
                            }))
                        }), e instanceof HTMLElement ? s.Target = r.Coord.getElementCoord(e) : s.Target = "number" == typeof e ? { Y: e } : e ? {
                            X: e.X,
                            Y: e.Y
                        } : {}, s.Start = r.Coords.getScrollCoord(s.Frame), s.StartedOn = (new Date).getTime(), "number" != typeof s.Target.X && (s.Target.X = s.Start.X), "number" != typeof s.Target.Y && (s.Target.Y = s.Start.Y), s.Duration = "number" == typeof i.Duration && i.Duration >= 0 ? i.Duration : 100, !s.Duration) return s.scrollTo(s.Target.X, s.Target.Y), Promise.resolve();
                        switch (o(i.Easing)) {
                            case"function":
                                s.ease = i.Easing;
                                break;
                            case"string":
                                s.ease = r.Easing[i.Easing] ? r.Easing[i.Easing] : r.Easing.linear;
                                break;
                            case"number":
                                s.ease = r.Easing.getEaser(i.Easing);
                                break;
                            default:
                                s.ease = r.Easing.linear
                        }
                        return s.ForceScroll = i.ForceScroll, s.ForceScroll ? (s.preventUserScrolling(), t = function () {
                            return s.allowUserScrolling()
                        }) : (s.addScrollCancelation(), t = function () {
                            return s.removeScrollCancelation()
                        }), s.after = function () {
                            clearTimeout(s.Timer), delete s.oncanceled, t()
                        }, new Promise((function (e, t) {
                            s.oncanceled = function () {
                                s.after(), t()
                            }, n.scrollInProgress(s, e)
                        })).then((function () {
                            s.scrollTo(s.Target.X, s.Target.Y), s.after()
                        }))
                    }, scrollInProgress: function (e, t) {
                        var n = this, i = (new Date).getTime() - e.StartedOn;
                        if (e.Duration <= i) return t();
                        var o = e.ease(i / e.Duration);
                        e.scrollTo(Math.round(e.Start.X + (e.Target.X - e.Start.X) * o), Math.round(e.Start.Y + (e.Target.Y - e.Start.Y) * o)), e.Timer = setTimeout((function () {
                            return n.scrollInProgress(e, t)
                        }), r.limitMax(10, e.Duration - i))
                    }
                }, r.scrollTo = function () {
                    return r.Scroller.scrollTo.apply(r.Scroller, arguments)
                }, r.Easing = "object" == o(window.Easing) ? window.Easing : {}, r.Easing.linear = function (e) {
                    return e
                }, r.Easing.getEaser = function (e) {
                    return function (t) {
                        return t + e / 100 * (1 - t) * t
                    }
                }, r.Cookies = {
                    read: function (e) {
                        if ("string" != typeof e || !e) return "";
                        e = encodeURIComponent(e);
                        for (var t = document.cookie.split("; "), n = "", i = t.length, o = 0; o < i; o++) if (t[o].substr(0, e.length + 1) == e + "=") {
                            n = t[o].substr(e.length + 1, t[o].length);
                            break
                        }
                        return decodeURIComponent(n)
                    }, write: function (e, t, n) {
                        var i = new Date;
                        return !(!e || "string" != typeof e || "string" != typeof t) && ("object" != o(n) && (n = {}), e = encodeURIComponent(e), t = encodeURIComponent(t), n.Path = "string" == typeof n.Path ? n.Path : location.pathname.replace(/[^\/]+$/, ""), n.Expires = "number" == typeof n.Expires ? n.Expires : 864e5, document.cookie = [e + "=" + t, "path=" + n.Path, "expires=" + i.toGMTString(i.setTime(i.getTime() + n.Expires))].join("; "), document.cookie)
                    }
                }, r.Ranges = {
                    selectRange: function (e) {
                        if (!e) return null;
                        var t = window.getSelection();
                        return t.removeAllRanges(), t.addRange(e), e
                    }, getRange: function () {
                        var e = "object" == o(arguments[0]) ? arguments[0] : this._searchSidesOfText.apply(this, arguments);
                        if (!e) return null;
                        var t = e.Start.Node.ownerDocument.createRange();
                        return t.setStart(e.Start.Node, "number" == typeof e.Start.Index ? e.Start.Index : e.Start.Node.textContent.indexOf(e.Start.Text)), t.setEnd(e.End.Node, "number" == typeof e.End.Index ? e.End.Index : e.End.Node.textContent.indexOf(e.End.Text) + e.End.Text.length), t
                    }, _searchSidesOfText: function (e, t) {
                        if (t || (t = document.body), "string" != typeof e || !e || this._flat(t.textContent).indexOf(e) < 0) return null;
                        if (3 == t.nodeType) return { Start: { Node: t, Text: e }, End: { Node: t, Text: e } };
                        for (var n = [], o = {}, r = 0, a = t.childNodes.length - 1, s = "", c = 0; c <= a; c++) {
                            if (this._flat(t.childNodes[c].textContent).indexOf(e) >= 0) return this._searchSidesOfText(e, t.childNodes[c]);
                            n.push(t.childNodes[c].textContent)
                        }
                        for (s = this._distill(n, r + 1, a); s && this._flat(s).indexOf(e) >= 0;) r++, s = this._distill(n, r + 1, a);
                        var l = t.childNodes[r], u = 0, d = "", p = l.textContent.length - 1;
                        for (s = this._distill(l.textContent, u, p); this._flat(s) && !new RegExp("^" + this._escape(this._flat(s))).test(e);) u++, s = this._distill(l.textContent, u, p);
                        for (d = this._flat(s); 3 != l.nodeType;) i("F"), l = (o = this._find(d, l)).Start.Node, d = o.Start.Text;
                        for (s = this._distill(n, r, a - 1); s && this._flat(s).indexOf(e) >= 0;) a--, s = this._distill(n, r, a - 1);
                        var f = t.childNodes[a], h = "", g = f.textContent.length - 1;
                        for (s = this._distill(f.textContent, 0, g); this._flat(s) && !new RegExp(this._escape(this._flat(s)) + "$").test(e);) g--, s = this._distill(f.textContent, 0, g);
                        for (h = this._flat(s); 3 != f.nodeType;) i("F"), f = (o = this._searchSidesOfText(h, f)).End.Node, h = o.End.Text;
                        return { Start: { Node: l, Text: d }, End: { Node: f, Text: h } }
                    }, _flat: function (e) {
                        return e.replace(/[\r\n]/g, "")
                    }, _escape: function (e) {
                        return e.replace(/([\(\)\{\}\[\]\,\.\-\+\*\?\!\:\^\$\/\\])/g, "\\$1")
                    }, _distill: function (e, t, n) {
                        for (var i = "", o = t; o <= n; o++) i += e[o];
                        return i
                    }
                }, r.Fullscreen = {
                    polyfill: function () {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window || self,
                            t = e.document, n = e.Element.prototype;
                        if (void 0 === t.fullscreenEnabled) {
                            if ("function" != typeof Promise) throw new Error("sML.Fullscreen.polyfill requires Promise.");
                            var i = t.webkitFullscreenEnabled ? "webkit" : t.msFullscreenEnabled ? "ms" : "";
                            switch (i) {
                                case"webkit":
                                    t.addEventListener("webkitfullscreenchange", (function () {
                                        return t.dispatchEvent(new Event("fullscreenchange", {
                                            bubbles: !0,
                                            cancelable: !1
                                        }))
                                    }));
                                    break;
                                case"ms":
                                    t.onmsfullscreenchange = function () {
                                        return t.dispatchEvent((e = t.createEvent("Event")).initEvent("fullscreenchange", !0, !1) || e);
                                        var e
                                    };
                                    break;
                                default:
                                    return t.fullscreenEnabled = !1, t.fullscreenElement = null, void (t.exitFullscreen = n.requestFullscreen = function () {
                                        return Promise.reject()
                                    })
                            }
                            Object.defineProperties(t, {
                                fullscreenEnabled: {
                                    get: function () {
                                        return t[i + "FullscreenEnabled"]
                                    }
                                }, fullscreenElement: {
                                    get: function () {
                                        return t[i + "FullscreenElement"]
                                    }
                                }
                            }), t.exitFullscreen = function () {
                                var e = arguments, n = this;
                                return new Promise((function (o, r) {
                                    if (!t.fullscreenElement) return r();
                                    t.addEventListener("fullscreenchange", (function e(n) {
                                        o(n), t.removeEventListener("fullscreenchange", e)
                                    })), n[i + "ExitFullscreen"].apply(n, e)
                                }))
                            }, n.requestFullscreen = function () {
                                var e = arguments, n = this;
                                return new Promise((function (o, r) {
                                    if (t.fullscreenElement) return r();
                                    t.addEventListener("fullscreenchange", (function e(n) {
                                        o(n), t.removeEventListener("fullscreenchange", e)
                                    })), n[i + "RequestFullscreen"].apply(n, e)
                                }))
                            }
                        }
                    }
                }, r
            }())
        }).call(this, n(0))
    }
});
