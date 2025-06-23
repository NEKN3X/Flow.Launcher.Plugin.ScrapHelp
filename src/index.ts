import process from 'node:process'
import * as rpc from 'vscode-jsonrpc/node.js'

const connection = rpc.createMessageConnection(
  new rpc.StreamMessageReader(process.stdin),
  new rpc.StreamMessageWriter(process.stdout),
)

connection.onRequest('initialize', async (_ctx) => {})

connection.onRequest('query', async (_query, _settings) => {
  return { result: [] }
})

connection.listen()
