import { useMemo } from "react"
import { Editor } from "./Editor"
import { createEditor } from "slate"
import { withReact } from "slate-react"
import { EditorContext } from "./contexts"
import "./App.css"

const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])

  return (
    <EditorContext.Provider value={editor}>
      <div className="App">
        <Editor />
      </div>
    </EditorContext.Provider>
  )
}

export default App
