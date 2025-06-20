import * as rpc from "vscode-jsonrpc/node.js";

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
  const projects = settings.projects
    .split(",")
    .map((project) => project.trim());

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
