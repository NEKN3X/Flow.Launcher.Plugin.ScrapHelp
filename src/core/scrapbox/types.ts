export type ObjectId = string
export type ProjectName = string
export type PageTitle = string
export type PageText = string
export type PageImage = URL
export type Timestamp = number
export type ConnectSid = string

export type PageLine = {
  id: ObjectId
  text: PageText
}

export type ScrapboxPage = {
  id: ObjectId
  title: PageTitle
  image?: PageImage
  helpfeels: PageText[]
  lines: PageLine[]
  updated: Timestamp
}
