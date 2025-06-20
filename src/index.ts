import * as rpc from "vscode-jsonrpc/node.js";
import { Query, Settings } from "./types.js";

const connection = rpc.createMessageConnection(
  new rpc.StreamMessageReader(process.stdin),
  new rpc.StreamMessageWriter(process.stdout)
);

connection.onRequest("initialize", async (params) => {
  return;
});

connection.onRequest("query", async (query: Query, settings: Settings) => {
  return {
    result: [
      {
        title: "aa" + query.search,
        subtitle: "Search result for: ",
        jsonRPCAction: {
          method: "open_url",
          parameters: [],
        },
      },
    ],
  };
});

connection.onRequest("open_url", async (params) => {
  await connection.sendRequest("OpenUrl", { url: "https://www.google.com" });
  return {};
});

connection.listen();
