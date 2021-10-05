// Import React dependencies.
import React, { useMemo, useState, useCallback } from "react"
import { createEditor } from "slate"
import { Slate, Editable, withReact } from "slate-react"
import type { Descendant } from "slate"
import type { RenderElementProps, RenderLeafProps } from "slate-react"
import { EditorCommands } from "./commands"
import "./App.css"

const initialValue: Descendant[] = JSON.parse(
  localStorage.getItem("content") as string
) || [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
]

const App = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useMemo(() => withReact(createEditor()), [])

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />
  }, [])

  return (
    <div className="App">
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
          const content = JSON.stringify(newValue)
          console.log(content)
          localStorage.setItem("content", content)
        }}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={(event) => {
            if (!event.ctrlKey) {
              return
            }
            switch (event.key) {
              case "`": {
                event.preventDefault()
                EditorCommands.toggleCodeBlock(editor)
                break
              }

              case "b": {
                event.preventDefault()
                EditorCommands.toggleBoldMark(editor)
                break
              }
              default:
                break
            }
          }}
        />
      </Slate>
    </div>
  )
}

const CodeElement = (props: RenderElementProps) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>
}

// Define a React component to render leaves with bold text.
const Leaf = (props: RenderLeafProps) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  )
}

export default App
