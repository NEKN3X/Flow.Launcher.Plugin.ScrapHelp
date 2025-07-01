import type { ScrapboxPage } from "@shell/api.js"
import { replaceGlossary } from "./replaceGlossary.js"
import type { Glossary, Help } from "./types.js"

const helpfeelRegex = /^\?\s+(\S.*)$/
const webHelpRegex = /^(%|\$)\s+(http.+)$/
const fileHelpRegex = /^%\s+(.+)$/
const textHelpRegex = /^\$\s+(.+)$/

export function extractHelp(
  project: string,
  page: ScrapboxPage,
  glossary: Glossary,
): Help[] {
  return page.lines.reduce((acc, line, index): Help[] => {
    const helpfeelMatch = line.text.trim().match(helpfeelRegex)
    if (!helpfeelMatch) return acc
    const nextLine = (page.lines[index + 1] || "").text.trim()

    const helpfeelText = replaceGlossary(helpfeelMatch[1], glossary)

    const webHelpMatch = nextLine.match(webHelpRegex)
    if (webHelpMatch) {
      return acc.concat({
        type: "web_page",
        project,
        title: page.title,
        helpfeel: helpfeelText,
        url: new URL(replaceGlossary(webHelpMatch[2], glossary)),
      })
    }

    const fileHelpMatch = nextLine.match(fileHelpRegex)
    if (fileHelpMatch) {
      return acc.concat({
        type: "file",
        project,
        title: page.title,
        helpfeel: helpfeelText,
        fileName: fileHelpMatch[1],
      })
    }

    const textHelpMatch = nextLine.match(textHelpRegex)
    if (textHelpMatch) {
      return acc.concat({
        type: "text",
        project,
        title: page.title,
        helpfeel: helpfeelText,
        text: replaceGlossary(textHelpMatch[1], glossary),
      })
    }

    return acc.concat({
      type: "scrapbox_page",
      project,
      title: page.title,
      helpfeel: helpfeelText,
    })
  }, [] as Help[])
}
