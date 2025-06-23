export type SearchTitlesResponse = {
  id: string
  title: string
  image?: string
  updated: number
}[]

export interface ScrapboxApiError {
  name: string
  message: string
}
