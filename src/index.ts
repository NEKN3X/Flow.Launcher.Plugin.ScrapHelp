import type { AxiosCacheInstance } from 'axios-cache-interceptor'
import type { Context, Methods, Query, ResultItem, Settings } from './types.js'
import process from 'node:process'
import { expandHelpfeel } from '@core/help/parser.js'
import { client } from '@shell/api/client.js'
import { createGetScrapboxPages } from '@shell/api/getScrapboxPages.js'
import { getGlossary } from '@shell/getGlossary.js'
import { searchResult } from '@shell/searchResult.js'
import { setupCache } from 'axios-cache-interceptor'
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
    handler: async (ctx) => {
      context = ctx
      cacheClient = setupCache(client)
    },
  },
  {
    method: 'query',
    handler: async (query: Query, settings: Settings) => {
      const getScrapboxPages = createGetScrapboxPages(cacheClient, context.currentPluginMetadata.pluginCacheDirectoryPath)
      const projects = settings.projects.split(',')
      const glossary = await getGlossary(context.currentPluginMetadata.pluginCacheDirectoryPath, settings.glossary)
      const result: ResultItem[] = (await Promise.all(
        projects.map(project => (
          getScrapboxPages(project, settings.sid).then(pages => pages.flatMap((page): ResultItem[] => ([
            {
              title: page.title,
              subTitle: `${project}/${page.title}`,
              jsonRPCAction: {
                method: 'open_url',
                parameters: [new URL(`https://scrapbox.io/${project}/${page.title}`)],
              },
            },
            ...page.help.flatMap((help): ResultItem[] => {
              switch (help.type) {
                case 'scrapbox_page':
                  return [
                    {
                      title: help.helpfeel,
                      subTitle: `${help.project}/${help.title}`,
                      jsonRPCAction: {
                        method: 'open_url',
                        parameters: [new URL(`https://scrapbox.io/${help.project}/${help.title}`)],
                      },
                    },
                  ]
                case 'web_page':
                { const url = new URL(help.url)
                  return [
                    {
                      title: help.helpfeel,
                      subTitle: `${url.hostname}${url.pathname}`,
                      jsonRPCAction: {
                        method: 'open_url',
                        parameters: [url],
                      },
                    },
                  ] }
                case 'text':
                  return [
                    {
                      title: help.helpfeel,
                      subTitle: help.text,
                      jsonRPCAction: {
                        method: 'copy_text',
                        parameters: [help.text],
                      },
                    },
                  ]
                case 'file':
                  return [
                    {
                      title: help.helpfeel,
                      subTitle: help.fileName,
                      jsonRPCAction: {
                        method: 'copy_text',
                        parameters: [help.fileName],
                      },
                    },
                  ]
                default:
                  return []
              }
            }).flatMap(help => (expandHelpfeel(help.title, glossary).map(expandedHelpfeel => ({
              ...help,
              title: expandedHelpfeel,
            })))),
          ])),
          )),
        ),
      )).flat()

      return { result: searchResult(result, query.search) }
    },
  },
  {
    method: 'context_menu',
    handler: async contextData => ({
      result: contextData,
    }),
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
  {
    method: 'copy_text',
    handler: async (params: [string]) => {
      await connection.sendRequest('CopyToClipboard', {
        text: params[0],
      })
      return {}
    },
  },
]

methods.forEach(({ method, handler }) => {
  connection.onRequest(method, (...args) => handler(...args))
})

connection.listen()
