export type Context = {
  currentPluginMetadata: {
    id: string
    name: string
    author: string
    version: string
    language: string
    description: string
    website: string
    disabled: boolean
    homeDisabled: boolean
    executeFilePath: string
    executeFileName: string
    pluginDirectory: string
    actionKeyword: string
    actionKeywords: string[]
    hideActionKeywordPanel: boolean
    icoPath: string
    pluginSettingsDirectoryPath: string
    pluginCacheDirectoryPath: string
  }
}

export type Query = {
  rawQuery: string
  isReQuery: boolean
  isHomeQuery: boolean
  search: string
  searchTerms: string[]
  actionKeyword: string
}

export type Settings = {
  sid: string
  projects: string
}

export type ResultItem = {
  title: string
  subTitle?: string
  glyph?: {
    glyph: string
    fontFamily: string
  }
  icoPath?: string
  jsonRPCAction: {
    method: string
    parameters: any[]
  }
  contextData?: ResultItem[]
}
