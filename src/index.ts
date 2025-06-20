import * as rpc from "vscode-jsonrpc/node.js";

const connection = rpc.createMessageConnection(
  new rpc.StreamMessageReader(process.stdin),
  new rpc.StreamMessageWriter(process.stdout)
);

connection.onRequest("initialize", async (params) => {
  return;
});

connection.onRequest("query", async (query, settings) => {
  return {
    result: [
      {
        title: query["search"],
        subtitle: "Search result for: " + query["search"],
        jsonRPCAction: {
          method: "open_url",
          parameters: [
            "https://www.google.com/search?q=" +
              encodeURIComponent(query["search"]),
          ],
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
