export type SearchTitlesResponseItem = {
  id: string
  title: string
  image?: string
  updated: number
}
export type SearchTitlesResponse = SearchTitlesResponseItem[]

export type GetScrapboxPageResponse = {
  id: string
  title: string
  image?: string
  updated: number
  helpfeels: string[]
  lines: {
    id: string
    text: string
  }[]
}

export type ScrapboxApiError = {
  name: string
  message: string
}
