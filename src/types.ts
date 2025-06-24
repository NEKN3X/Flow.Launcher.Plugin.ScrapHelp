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
  glossary: string
}

export type JSONRPCAction = {
  method: string
  parameters: any[]
}

export type OpenURLAction = JSONRPCAction & {
  method: 'open_url'
  parameters: [URL]
}

export type CopyTextAction = JSONRPCAction & {
  method: 'copy_text'
  parameters: [string]
}

export type JSONRPCActions = OpenURLAction | CopyTextAction

export type ResultItem = {
  title: string
  subTitle?: string
  glyph?: {
    glyph: string
    fontFamily: string
  }
  icoPath?: string
  jsonRPCAction: JSONRPCActions
  contextData?: ResultItem[]
}

export type JSONRPCActionHandler<T, U extends Array<unknown>, V> = {
  method: T
  handler: (...args: U) => (Promise<V> | V)
}

export type InitializeHandler = JSONRPCActionHandler<'initialize', [Context], void>
export type QueryHandler = JSONRPCActionHandler<'query', [Query, Settings], { result: ResultItem[] }>
export type ContextMenuHandler = JSONRPCActionHandler<'context_menu', [ResultItem[]], { result: ResultItem[] }>

export type CustomHandler<T extends JSONRPCAction> = JSONRPCActionHandler<T['method'], [T['parameters']], object>
export type OpenURLHandler = CustomHandler<OpenURLAction>
export type CopyTextHandler = CustomHandler<CopyTextAction>

export type Methods
  = | InitializeHandler
    | QueryHandler
    | ContextMenuHandler
    | OpenURLHandler
    | CopyTextHandler
