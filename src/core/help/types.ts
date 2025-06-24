export type ScrapboePageHelp = {
  project: string
  title: string
}

export type WebPageHelp = {
  helpfeel: string
  url: URL
}

export type TextHelp = {
  helpfeel: string
  text: string
}

export type FileHelp = {
  helpfeel: string
  fileName: string
}

export type Help = ScrapboePageHelp | WebPageHelp | TextHelp | FileHelp
