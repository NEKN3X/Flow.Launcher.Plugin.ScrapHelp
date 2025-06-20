import * as rpc from "vscode-jsonrpc/node.js";
import { makeResult } from "./plugins/makeResult.js";

const connection = rpc.createMessageConnection(
  new rpc.StreamMessageReader(process.stdin),
  new rpc.StreamMessageWriter(process.stdout)
);

let context: Context;

connection.onRequest("initialize", async (ctx: Context) => {
  context = ctx;
  return;
});

connection.onRequest("query", async (query: Query, settings: Settings) => {
  return {
    result: await makeResult(context, settings),
  };
});

connection.onRequest("open_url", async (params) => {
  await connection.sendRequest("OpenUrl", { url: params[0] });
  return {};
});

connection.listen();
