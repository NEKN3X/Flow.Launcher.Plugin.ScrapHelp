export interface Context {
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

export interface Query {
  rawQuery: string
  isReQuery: boolean
  isHomeQuery: boolean
  search: string
  searchTerms: string[]
  actionKeyword: string
}

export interface Settings {
  sid: string
  projects: string
}
