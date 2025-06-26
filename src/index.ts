import type { AxiosCacheInstance } from 'axios-cache-interceptor'
import type { Context, Methods, Query, ResultItem, Settings } from './types.js'
import process from 'node:process'
import { extractGlossary } from '@core/help/extractGlossary.js'
import { expandHelpfeel } from '@core/help/parser.js'
import { client } from '@shell/api/client.js'
import { createGetScrapboxFile } from '@shell/api/getScrapboxFile.js'
import { createGetScrapboxPages } from '@shell/api/getScrapboxPages.js'
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
      cacheClient = setupCache(client, {
        ttl: 1000 * 60 * 0.5,
      })
    },
  },
  {
    method: 'query',
    handler: async (query: Query, settings: Settings) => {
      const getScrapboxPages = createGetScrapboxPages(cacheClient, context.currentPluginMetadata.pluginCacheDirectoryPath)
      const projects = settings.projects.split(',')
      let glossary = new Map<string, string>([])
      const result: ResultItem[] = (await Promise.all(
        projects.map((project, index) => (
          getScrapboxPages(project, settings.sid).then(async (pages) => {
            if (index === 0) {
              const glossaryPage = pages.find(page => page.title === 'Glossary')
              if (glossaryPage) {
                glossary = extractGlossary(glossaryPage.lines.map(line => line.text))
                glossary.set('query', query.searchTerms.slice(1).join(' ') || '')
              }
            }
            return pages.flatMap((page): ResultItem[] => ([
              {
                title: page.title,
                subTitle: `${project}/${page.title}`,
                icoPath: 'assets/sticky-note.png',
                jsonRPCAction: {
                  method: 'open_url',
                  parameters: [new URL(`https://scrapbox.io/${project}/${encodeURIComponent(page.title)}`)],
                },
                contextData: [
                  {
                    title: 'Copy Scrapbox Link',
                    icoPath: 'assets/clipboard.png',
                    jsonRPCAction: {
                      method: 'copy_text',
                      parameters: [`[/${project}/${page.title}]`],
                    },
                  },
                ],
              },
              ...page.help.flatMap((help): ResultItem[] => {
                switch (help.type) {
                  case 'scrapbox_page':
                    return [
                      {
                        title: help.helpfeel,
                        subTitle: `${help.project}/${help.title}`,
                        icoPath: 'assets/circle-help.png',
                        jsonRPCAction: {
                          method: 'open_url',
                          parameters: [new URL(`https://scrapbox.io/${help.project}/${help.title}`)],
                        },
                        contextData: [
                          {
                            title: 'Copy Scrapbox Link',
                            icoPath: 'assets/clipboard.png',
                            jsonRPCAction: {
                              method: 'copy_text',
                              parameters: [`[/${project}/${page.title}]`],
                            },
                          },
                        ],
                      },
                    ]
                  case 'web_page':
                  { const url = new URL(decodeURIComponent(help.url).replace(/\{query\}/g, query.searchTerms.slice(1).join(' ') || ''))
                    return [
                      {
                        title: help.helpfeel,
                        subTitle: decodeURIComponent(`${url.hostname}${url.pathname}`),
                        icoPath: 'assets/globe.png',
                        jsonRPCAction: {
                          method: 'open_url',
                          parameters: [url],
                        },
                        contextData: [
                          {
                            title: 'Open Scrapbox Page',
                            icoPath: 'assets/sticky-note.png',
                            jsonRPCAction: {
                              method: 'open_url',
                              parameters: [new URL(`https://scrapbox.io/${project}/${encodeURIComponent(page.title)}`)],
                            },
                          },
                        ],
                      },
                    ] }
                  case 'text':
                    return [
                      {
                        title: help.helpfeel,
                        subTitle: help.text,
                        icoPath: 'assets/clipboard.png',
                        jsonRPCAction: {
                          method: 'copy_text',
                          parameters: [help.text.replace(/\{query\}/g, query.searchTerms.slice(1).join(' ') || '')],
                        },
                        contextData: [
                          {
                            title: 'Open Scrapbox Page',
                            icoPath: 'assets/clipboard.png',
                            jsonRPCAction: {
                              method: 'open_url',
                              parameters: [new URL(`https://scrapbox.io/${project}/${encodeURIComponent(page.title)}`)],
                            },
                          },
                        ],
                      },
                    ]
                  case 'file':
                    return [
                      {
                        title: help.helpfeel,
                        subTitle: help.fileName,
                        icoPath: 'assets/clipboard-minus.png',
                        jsonRPCAction: {
                          method: 'copy_file',
                          parameters: [project, page.title, help.fileName, settings.sid],
                        },
                        contextData: [
                          {
                            title: 'Open Scrapbox Page',
                            icoPath: 'assets/clipboard.png',
                            jsonRPCAction: {
                              method: 'open_url',
                              parameters: [new URL(`https://scrapbox.io/${project}/${encodeURIComponent(page.title)}`)],
                            },
                          },
                        ],
                      },
                    ]
                  default:
                    return []
                }
              }).flatMap(help => (expandHelpfeel(help.title, glossary).map(expandedHelpfeel => ({
                ...help,
                title: expandedHelpfeel,
              })))),
            ]))
          },
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
      await connection.sendRequest('CopyToClipboard', { text: params[0] })
      return {}
    },
  },
  {
    method: 'copy_file',
    handler: async (params: [string, string, string, string]) => {
      const getScrapboxFile = createGetScrapboxFile(cacheClient)
      const text = await getScrapboxFile(...params)
      await connection.sendRequest('CopyToClipboard', { text })
      return {}
    },
  },
]

methods.forEach(({ method, handler }) => {
  connection.onRequest(method, (...args) => handler(...args))
})

connection.listen()
