import type { ScrapboxPage } from "@core/scrapbox/types.js"
import type { Help } from "./types.js"

const helpfeel = /^\?\s+(\S.*)$/
const webHelpRegex = /^(%|\$)\s+(http.+)$/
const fileHelpRegex = /^%\s+(.+)$/
const textHelpRegex = /^\$\s+(.+)$/

export function extractHelp(project: string, page: ScrapboxPage) {
  return page.lines.reduce((acc, line, index): Help[] => {
    const helpfeelMatch = line.text.trim().match(helpfeel)
    if (!helpfeelMatch) return acc
    const nextLine = (page.lines[index + 1] || "").text.trim()

    const webHelpMatch = nextLine.match(webHelpRegex)
    if (webHelpMatch) {
      return acc.concat({
        type: "web_page",
        project,
        title: page.title,
        helpfeel: helpfeelMatch[1],
        url: webHelpMatch[2],
      })
    }

    const fileHelpMatch = nextLine.match(fileHelpRegex)
    if (fileHelpMatch) {
      return acc.concat({
        type: "file",
        project,
        title: page.title,
        helpfeel: helpfeelMatch[1],
        fileName: fileHelpMatch[2],
      })
    }

    const textHelpMatch = nextLine.match(textHelpRegex)
    if (textHelpMatch) {
      return acc.concat({
        type: "text",
        project,
        title: page.title,
        helpfeel: helpfeelMatch[1],
        text: textHelpMatch[2],
      })
    }

    return acc.concat({
      type: "scrapbox_page",
      project,
      title: page.title,
      helpfeel: helpfeelMatch[1],
    })
  }, [] as Help[])
}
