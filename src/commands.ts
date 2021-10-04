import { Transforms, Editor, Text, Element } from "slate"
import type { CustomEditor } from "./custom-types"

// Define our own custom set of helpers.
export const EditorCommands = {
  isBoldMarkActive(editor: CustomEditor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Text.isText(n) && n.bold === true,
      universal: true,
    })

    return !!match
  },

  isCodeBlockActive(editor: CustomEditor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === "code",
    })

    return !!match
  },

  toggleBoldMark(editor: CustomEditor) {
    const isActive = EditorCommands.isBoldMarkActive(editor)
    Transforms.setNodes(
      editor,
      { bold: isActive ? undefined : true },
      { match: (n) => Text.isText(n), split: true }
    )
  },

  toggleCodeBlock(editor: CustomEditor) {
    const isActive = EditorCommands.isCodeBlockActive(editor)
    Transforms.setNodes(
      editor,
      { type: isActive ? undefined : "code" },
      { match: (n) => Editor.isBlock(editor, n) }
    )
  },
}
