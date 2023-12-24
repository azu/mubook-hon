Bibi.x({
    id: "Extension",
    description: "Utilities for Tracking and Logging with Google Analytics.",
    author: "azu",
    version: "1.2.0-demo"
})(function () {
    const d = E.dispatch.bind(E);
    E.dispatch = function (...args) {
        // console.debug(args)
        d(...args);
    };
    // last loaded
    console.debug({
        E,
        O,
        I
    });
    globalThis.bibiInternal = {
        E,
        O,
        I
    };
    E.add("bibi:played:by-button", () => {
        console.debug("click", S["parent-uri"].replace(/#.+$/, ""));
    });

    function wrapSelectedText(_s) {
        const selection = _s.getRangeAt(0);
        const selectedText = selection.extractContents();
        const span = document.createElement("span");
        span.style.display = "contents";
        span.style.backgroundColor = "yellow";
        span.appendChild(selectedText);
        selection.insertNode(span);
    }
    function onSelect(callback) {
        // console.debug(element, callback);
        let isSelecting = false;
        let selection = null;

        function handleSelectStart(event) {
            // console.debug(event);
            isSelecting = true;
        }

        function handleMouseUp(event) {
            const currentSelection = event.view.document.getSelection();
            if (isSelecting && !currentSelection.isCollapsed) {
                callback((selection = currentSelection.toString()));
                wrapSelectedText(currentSelection);
                isSelecting = false;
            }
        }

        E.add("bibi:downs-pointer", handleSelectStart);
        E.add("bibi:upped-pointer", handleMouseUp);
        return function destroy() {
            E.remove("bibi:downs-pointer", handleSelectStart);
            E.remove("bibi:upped-pointer", handleMouseUp);
        };
    }

    // onSelect((selection) => {
    //     console.debug(selection);
    // })
});
