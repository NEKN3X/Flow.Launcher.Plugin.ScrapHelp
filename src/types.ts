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

export type JSONRPCActionHandler = {
  method: string
  handler: (...args: any) => (Promise<any> | void)
}

export type InitializeHandler = JSONRPCActionHandler & {
  method: 'initialize'
  handler: (context: Context) => Promise<void>
}

export type QueryHandler = JSONRPCActionHandler & {
  method: 'query'
  handler: (query: Query, settings: Settings) => Promise<{ result: ResultItem[] }>
}

export type CustomHandler<T extends JSONRPCAction> = JSONRPCActionHandler & {
  method: T['method']
  handler: (params: T['parameters']) => Promise<object> | object
}

export type OpenURLHandler = CustomHandler<OpenURLAction>

export type Methods
  = | InitializeHandler
    | QueryHandler
    | OpenURLHandler
