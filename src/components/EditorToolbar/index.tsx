import { useContext, useCallback, useMemo } from "react"
import { EditorContext } from "../../contexts"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import {
  Download,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatUnderlined,
} from "@mui/icons-material"
import { EditorCommands } from "../../Editor/commands"
import { Document, Packer, Paragraph, TextRun, UnderlineType } from "docx"
import { saveAs } from "file-saver"
import type { Descendant } from "slate"

type Props = {
  editorValue: Descendant[]
}

export const EditorToolbar = ({ editorValue }: Props) => {
  const editor = useContext(EditorContext)

  const handleFormatBold = useCallback(() => {
    if (editor) {
      EditorCommands.toggleBoldMark(editor)
    }
  }, [editor])

  const handleFormatItalic = useCallback(() => {
    if (editor) {
      EditorCommands.toggleItalicMark(editor)
    }
  }, [editor])

  const handleFormatUnderlined = useCallback(() => {
    if (editor) {
      EditorCommands.toggleUnderlinedMark(editor)
    }
  }, [editor])

  const handleFormatBulletedList = useCallback(() => {
    if (editor) {
      EditorCommands.toggleBulletedListBlock(editor)
    }
  }, [editor])

  const sections = useMemo(
    () => [
      {
        properties: {},
        children: editorValue.map(
          (value) =>
            new Paragraph({
              children:
                value.type === "paragraph"
                  ? value.children?.map(
                      ({ text, bold, italic, underlined }) =>
                        new TextRun({
                          text,
                          bold,
                          italics: italic,
                          underline: underlined
                            ? { type: "single" as UnderlineType }
                            : undefined,
                        })
                    )
                  : undefined,
            })
        ),
      },
    ],
    [editorValue]
  )

  const handleDownloadDocx = useCallback(() => {
    const doc = new Document({
      sections,
    })

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "example.docx")
    })
  }, [sections])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={handleFormatBold}>
            <FormatBold />
          </IconButton>
          <IconButton color="inherit" onClick={handleFormatItalic}>
            <FormatItalic />
          </IconButton>
          <IconButton color="inherit" onClick={handleFormatUnderlined}>
            <FormatUnderlined />
          </IconButton>
          <IconButton color="inherit" onClick={handleFormatBulletedList}>
            <FormatListBulleted />
          </IconButton>
          <IconButton color="inherit">
            <FormatListNumbered />
          </IconButton>
          <IconButton color="inherit" onClick={handleDownloadDocx}>
            <Download />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
