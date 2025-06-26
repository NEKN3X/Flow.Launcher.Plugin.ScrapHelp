import type { ScrapboxPage } from '@core/scrapbox/types.js'
import type { Help } from './types.js'

const helpfeel = /^\s*\?(.+)$/
const webHelpRegex = /^\s*(%|\$)\s+(https?:\/\/.+)$/
const fileHelpRegex = /^\s*(%)(.+)$/
const textHelpRegex = /^\s*(\$)(.+)$/
const scrapboxLinkRegex = /\[(https?:\/\/\S+)\s+(\S.*)\]/
const scrapboxLinkRegex2 = /\[(.*\S)\s+(https?:\/\/\S+)\]/

export function extractHelp(
  project: string,
  page: ScrapboxPage,
) {
  return page.lines.reduce((acc, line, index): Help[] => {
    const helpfeelMatch = line.text.match(helpfeel)
    if (!helpfeelMatch)
      return acc
    const nextLine = page.lines[index + 1] || ''

    const scrapboxLinkMatch = nextLine.text.match(scrapboxLinkRegex)
    if (scrapboxLinkMatch) {
      return [...acc, {
        type: 'web_page',
        project,
        title: page.title,
        helpfeel: helpfeelMatch[1].trim(),
        url: scrapboxLinkMatch[1].trim(),
      }]
    }
    const scrapboxLinkMatch2 = nextLine.text.match(scrapboxLinkRegex2)
    if (scrapboxLinkMatch2) {
      return [...acc, {
        type: 'web_page',
        project,
        title: page.title,
        helpfeel: helpfeelMatch[1].trim(),
        url: scrapboxLinkMatch2[2].trim(),
      }]
    }

    const webHelpMatch = nextLine.text.match(webHelpRegex)
    if (webHelpMatch) {
      return [...acc, {
        type: 'web_page',
        project,
        title: page.title,
        helpfeel: helpfeelMatch[1].trim(),
        url: webHelpMatch[2].trim(),
      }]
    }

    const fileHelpMatch = nextLine.text.match(fileHelpRegex)
    if (fileHelpMatch) {
      const text = ''
      return [...acc, {
        type: 'file',
        project,
        title: page.title,
        helpfeel: helpfeelMatch[1].trim(),
        fileName: fileHelpMatch[2].trim(),
        text,
      }]
    }

    const textHelpMatch = nextLine.text.match(textHelpRegex)
    if (textHelpMatch) {
      return [...acc, {
        type: 'text',
        project,
        title: page.title,
        helpfeel: helpfeelMatch[1].trim(),
        text: textHelpMatch[2].trim(),
      }]
    }

    return [
      ...acc,
      {
        type: 'scrapbox_page',
        project,
        title: page.title,
        helpfeel: helpfeelMatch[1].trim(),
      },
    ]
  }, [] as Help[])
}
