Bibi.x({
    id: "Extension",
    description: "Utilities for Tracking and Logging with Google Analytics.",
    author: "azu",
    version: "1.2.0-demo"
})(function (...args) {
    const createPatches = () => {
        let isPatched = false;
        return {
            patch: () => {
                if (isPatched) {
                    return;
                }
                isPatched = true;
                // patches
                /*
                    bibi.js:369 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'style')
                    at Object.setStyle (bibi.js:369:102)
                    at g.style (bibi.js:428:51)
                    at Object.renderReflowableItem (bibi.js:3455:25)
                    at bibi.js:3437:33
                    at new Promise (<anonymous>)
                    at Object.layOutItem (bibi.js:3434:24)
                    at Object.layOutSpreadAndItsItems (bibi.js:3322:29)
                    at bibi.js:2156:71
                 */
                {
                    const s = sML.CSS.setStyle;
                    sML.CSS.setStyle = function () {
                        // ignore `e` is undefined
                        if (!arguments[0]) {
                            return Promise.resolve();
                        }
                        return s.apply(this, arguments);
                    };
                    const orig_get_sMLStyle_sheet = sML.CSS._get_sMLStyle_sheet;
                    sML.CSS._get_sMLStyle_sheet = function () {
                        if (!arguments[0]) {
                            // return null proxy that does not throw error when call methods.
                            return new Proxy(
                                {},
                                {
                                    get: function (target, prop) {
                                        return () => {
                                            return null;
                                        };
                                    }
                                }
                            );
                        }
                        return orig_get_sMLStyle_sheet.apply(this, arguments);
                    };
                }
            }
        };
    };
    const patcher = createPatches();
    // loop to apply patches
    console.log(sML);
    patcher.patch();
    //
    // const d = E.dispatch.bind(E);
    // E.dispatch = function (...args) {
    //     // console.debug(args)
    //     d(...args);
    // };
    // // last loaded
    // console.debug({
    //     E,
    //     O,
    //     I
    // });
    // globalThis.bibiInternal = {
    //     E,
    //     O,
    //     I
    // };
    // E.add("bibi:played:by-button", () => {
    //     console.debug("click", S["parent-uri"].replace(/#.+$/, ""));
    // });
    //
    // function wrapSelectedText(_s) {
    //     const selection = _s.getRangeAt(0);
    //     const selectedText = selection.extractContents();
    //     const span = document.createElement("span");
    //     span.style.display = "contents";
    //     span.style.backgroundColor = "yellow";
    //     span.appendChild(selectedText);
    //     selection.insertNode(span);
    // }
    // function onSelect(callback) {
    //     // console.debug(element, callback);
    //     let isSelecting = false;
    //     let selection = null;
    //
    //     function handleSelectStart(event) {
    //         // console.debug(event);
    //         isSelecting = true;
    //     }
    //
    //     function handleMouseUp(event) {
    //         const currentSelection = event.view.document.getSelection();
    //         if (isSelecting && !currentSelection.isCollapsed) {
    //             callback((selection = currentSelection.toString()));
    //             wrapSelectedText(currentSelection);
    //             isSelecting = false;
    //         }
    //     }
    //
    //     E.add("bibi:downs-pointer", handleSelectStart);
    //     E.add("bibi:upped-pointer", handleMouseUp);
    //     return function destroy() {
    //         E.remove("bibi:downs-pointer", handleSelectStart);
    //         E.remove("bibi:upped-pointer", handleMouseUp);
    //     };
    // }

    // onSelect((selection) => {
    //     console.debug(selection);
    // })
});
