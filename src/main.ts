import type { Query, Settings } from 'types.js'
import * as rpc from 'vscode-jsonrpc/node.js'

const connection = rpc.createMessageConnection(
  new rpc.StreamMessageReader(process.stdin),
  new rpc.StreamMessageWriter(process.stdout),
)

connection.onRequest('initialize', async (params) => {
  return
})

connection.onRequest('query', async (query: Query, settings: Settings) => {
  return {
    result: [
      {
        title: 'Sample Result',
        subTitle: 'This is a sample result item',
        jsonRPCAction: {
          method: 'open_url',
          parameters: ['https://example.com'],
        },
      },
    ],
  }
})

connection.onRequest('open_url', async (params) => {
  connection.sendRequest('OpenUrl', params[0])
  return {}
})

connection.listen()
