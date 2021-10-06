// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import type { BaseEditor } from "slate"
import type { ReactEditor } from "slate-react"
import type { HistoryEditor } from "slate-history"

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

export type ParagraphElement = {
  type: "paragraph"
  children: CustomText[]
}

export type HeadingElement = {
  type: "heading"
  level: number
  children: CustomText[]
}

export type CodeElement = {
  type: "code"
  children: CustomText[]
}

export type CustomElement = ParagraphElement | HeadingElement | CodeElement

export type FormattedText = { type: "text"; text: string; bold?: true }

export type CustomText = FormattedText

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}
