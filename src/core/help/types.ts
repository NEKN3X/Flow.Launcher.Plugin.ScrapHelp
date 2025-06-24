import type { ScrapboxPage } from '@core/scrapbox/types.js'

export type ScrapboePageHelp = {
  type: 'scrapbox_page'
  helpfeel: string
  project: string
  title: string
}

export type WebPageHelp = {
  type: 'web_page'
  helpfeel: string
  project: string
  title: string
  url: string
}

export type TextHelp = {
  type: 'text'
  helpfeel: string
  project: string
  title: string
  text: string
}

export type FileHelp = {
  type: 'file'
  helpfeel: string
  project: string
  title: string
  fileName: string
}

export type Help = ScrapboePageHelp | WebPageHelp | TextHelp | FileHelp

export type ScrapboxPageWithHelp = ScrapboxPage & {
  help: Help[]
}

export type Glossary = Map<string, string>
