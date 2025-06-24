import type { AxiosCacheInstance } from 'axios-cache-interceptor'
import type { Context, Methods, Query, ResultItem, Settings } from './types.js'
import process from 'node:process'
import { client } from '@shell/api/client.js'
import { createGetScrapboxPages } from '@shell/api/getScrapboxPages.js'
import { setupCache } from 'axios-cache-interceptor'
import { searchResult } from 'searchResult.js'
import * as rpc from 'vscode-jsonrpc/node.js'

const connection = rpc.createMessageConnection(
  new rpc.StreamMessageReader(process.stdin),
  new rpc.StreamMessageWriter(process.stdout),
)

let context: Context
let cacheClient: AxiosCacheInstance

const methods: Methods[] = [
  {
    method: 'initialize',
    handler: async (ctx: Context) => {
      context = ctx
      cacheClient = setupCache(client)
    },
  },
  {
    method: 'query',
    handler: async (query: Query, settings: Settings) => {
      const getScrapboxPages = createGetScrapboxPages(cacheClient, context.currentPluginMetadata.pluginCacheDirectoryPath)
      const projects = settings.projects.split(',')
      const result: ResultItem[] = (await Promise.all(
        projects.map(project => (
          getScrapboxPages(project, settings.sid).then(pages => pages.map((page): ResultItem => ({
            title: page.title,
            subTitle: project,
            jsonRPCAction: {
              method: 'open_url',
              parameters: [new URL(`https://scrapbox.io/${project}/${page.title}`)],
            },
          })),
          )),
        ),
      )).flat()

      return { result: searchResult(result, query.search) }
    },
  },
  {
    method: 'open_url',
    handler: async (params: [URL]) => {
      await connection.sendRequest('OpenUrl', {
        url: params[0].toString(),
      })
      return {}
    },
  },
]

methods.forEach(({ method, handler }) => {
  connection.onRequest(method, handler)
})

connection.listen()
