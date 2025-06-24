import type { Context, Query } from './types.js'
import process from 'node:process'
import * as rpc from 'vscode-jsonrpc/node.js'
import { getSearchTitles } from './shell/api/getSearchTitles.js'

const connection = rpc.createMessageConnection(
  new rpc.StreamMessageReader(process.stdin),
  new rpc.StreamMessageWriter(process.stdout),
)

// let context: Context

connection.onRequest('initialize', async (_ctx: Context) => {
  // context = _ctx
})

connection.onRequest('query', async (_query: Query, settings) => {
  const data = await getSearchTitles('nekn3x')
  data.mapErr((e) => {
    connection.sendRequest('ShowMsg', {
      title: `Error: ${e}`,
    })
  })
  return { result: [] }
})

connection.listen()
