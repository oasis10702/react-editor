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

  isItalicMarkActive(editor: CustomEditor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Text.isText(n) && n.italic === true,
      universal: true,
    })

    return !!match
  },

  isUnderlinedMarkActive(editor: CustomEditor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Text.isText(n) && n.underlined === true,
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

  toggleItalicMark(editor: CustomEditor) {
    const isActive = EditorCommands.isItalicMarkActive(editor)
    Transforms.setNodes(
      editor,
      { italic: isActive ? undefined : true },
      { match: (n) => Text.isText(n), split: true }
    )
  },

  toggleUnderlinedMark(editor: CustomEditor) {
    const isActive = EditorCommands.isUnderlinedMarkActive(editor)
    Transforms.setNodes(
      editor,
      { underlined: isActive ? undefined : true },
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
