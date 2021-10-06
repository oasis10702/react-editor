import { createContext } from "react"
import type { CustomEditor } from "./Editor/custom-types"

export const EditorContext = createContext<CustomEditor | null>(null)
