import * as fs from "node:fs";
import * as rpc from "vscode-jsonrpc/node.js";

const connection = rpc.createMessageConnection(
  new rpc.StreamMessageReader(process.stdin),
  new rpc.StreamMessageWriter(process.stdout)
);

connection.onRequest("initialize", (params) => {
  fs.writeFileSync("log.json", JSON.stringify(params, null, 4));
  return;
});

connection.onRequest("query", (query, settings) => {
  fs.writeFileSync("query.json", JSON.stringify(query, null, 4));
  return {
    result: [
      {
        title: query["search"],
        jsonRPCAction: {
          method: "open_url",
        },
      },
    ],
  };
});

connection.onRequest("open_url", (params) => {
  connection.sendRequest("OpenUrl", { url: "https://www.google.com" });
  return;
});

connection.onError((error) => {
  fs.writeFileSync("error.log", JSON.stringify(error, null, 4));
});

connection.listen();
