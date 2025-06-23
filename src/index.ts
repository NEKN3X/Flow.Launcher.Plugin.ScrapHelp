import * as rpc from "vscode-jsonrpc/node.js";

const connection = rpc.createMessageConnection(
  new rpc.StreamMessageReader(process.stdin),
  new rpc.StreamMessageWriter(process.stdout)
);

connection.onRequest("initialize", async (ctx) => {
  return;
});

connection.onRequest("query", async (query, settings) => {

  return { result: [] };
});

connection.listen();
