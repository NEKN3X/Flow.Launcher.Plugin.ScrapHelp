import type { AxiosCacheInstance } from 'axios-cache-interceptor'
import type { Context, Query, ResultItem, Settings } from './types.js'
import process from 'node:process'
import { client } from '@shell/api/client.js'
import { createGetScrapboxPages } from '@shell/api/getScrapboxPages.js'
import { setupCache } from 'axios-cache-interceptor'
import * as rpc from 'vscode-jsonrpc/node.js'

const connection = rpc.createMessageConnection(
  new rpc.StreamMessageReader(process.stdin),
  new rpc.StreamMessageWriter(process.stdout),
)

let context: Context
let cacheClient: AxiosCacheInstance

connection.onRequest('initialize', async (_ctx: Context) => {
  context = _ctx
  cacheClient = setupCache(client)
})

connection.onRequest('query', async (query: Query, settings: Settings) => {
  const getScrapboxPages = createGetScrapboxPages(cacheClient, context.currentPluginMetadata.pluginCacheDirectoryPath)
  const projects = settings.projects.split(',')
  const result: ResultItem[] = (await Promise.all(
    projects.map(project => getScrapboxPages(project, settings.sid)),
  )).flat().map(page => ({
    title: page.title,
    jsonRPCAction: {
      method: 'open_url',
      parameters: [],
    },
  }))

  return { result }
})

connection.listen()
