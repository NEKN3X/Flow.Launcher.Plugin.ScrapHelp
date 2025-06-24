export type SearchTitlesResponse = {
  id: string
  title: string
  image?: string
  updated: number
}[]

export type ScrapboxApiError = {
  name: string
  message: string
}
