import { useState, useCallback, useContext } from "react"
import { Slate, Editable } from "slate-react"
import type { Descendant } from "slate"
import type { RenderElementProps, RenderLeafProps } from "slate-react"
import { EditorCommands } from "./commands"
import { EditorToolbar } from "../components/EditorToolbar"
import { EditorContext } from "../contexts"
import { css } from "@emotion/css"

const initialValue: Descendant[] = JSON.parse(
  localStorage.getItem("content") as string
) || [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
]

export const Editor = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useContext(EditorContext)

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />
      case "bulletedList":
        return <ul {...props.attributes}>{props.children}</ul>
      case "numberedList":
        return <ol {...props.attributes}>{props.children}</ol>
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />
  }, [])

  return (
    <div className={baseStyle}>
      <EditorToolbar editorValue={value} />
      <div className={editorWrapperStyle}>
        {editor ? (
          <Slate
            editor={editor}
            value={value}
            onChange={(newValue) => {
              setValue(newValue)
              const content = JSON.stringify(newValue)
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
        ) : null}
      </div>
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
      style={{
        fontWeight: props.leaf.bold ? "bold" : "normal",
        fontStyle: props.leaf.italic ? "italic" : "normal",
        textDecoration: props.leaf.underlined ? "underline" : undefined,
      }}
    >
      {props.children}
    </span>
  )
}

const baseStyle = css`
  width: 100%;
`
const editorWrapperStyle = css`
  padding: 0 16px;
`
