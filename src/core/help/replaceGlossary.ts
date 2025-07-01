import type { Glossary } from "./types.js"

export function replaceGlossary(text: string, glossary: Glossary) {
  return [...glossary.entries()].reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(`\\{${key}\\}`, "g"), value)
  }, text)
}
