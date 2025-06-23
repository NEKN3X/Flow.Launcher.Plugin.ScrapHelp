import type { Context, Query, Settings } from './types.js'
import process from 'node:process'
import * as rpc from 'vscode-jsonrpc/node.js'
import { getSearchTitles } from './shell/api/getSearchTitles.js'

const connection = rpc.createMessageConnection(
  new rpc.StreamMessageReader(process.stdin),
  new rpc.StreamMessageWriter(process.stdout),
)

// let context: Context

connection.onRequest('initialize', async (_ctx) => {
  // context = _ctx
})

connection.onRequest('query', async (_query: Query, settings: Settings) => {
  const data = await getSearchTitles('nekn3x', settings.sid)
  connection.sendRequest('ShowMsg', {
    title: `AAA${data.isOk()}`,
  })
  return { result: [] }
})

connection.listen()
