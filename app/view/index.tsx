import { ReactReader } from "react-reader";
import { useState } from "react";

const App = () => {
    // And your own state logic to persist state
    const [location, setLocation] = useState<string | number>("")
    const locationChanged = (epubcifi: string | number) => {
        // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
        setLocation(epubcifi)
    }
    return (
        <div style={{ height: "100vh" }}>
            <ReactReader
                location={location}
                locationChanged={locationChanged}
                epubOptions={{
                    flow: "auto",
                    width: "100%",
                    height: "100vh",
                    spread: 'none',
                    allowScriptedContent: true,
                }}
                url="/demo/mymedia_lite.epub"
            />
        </div>
    )
}
export default App
