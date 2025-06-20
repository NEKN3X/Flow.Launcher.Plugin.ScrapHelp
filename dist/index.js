import * as rpc from "vscode-jsonrpc/node.js";
const connection = rpc.createMessageConnection(new rpc.StreamMessageReader(process.stdin), new rpc.StreamMessageWriter(process.stdout));
connection.onRequest("initialize", (params) => {
    return;
});
connection.onRequest("query", (query, settings) => {
    return {
        result: [
            {
                title: query["search"],
                subtitle: "Open Google",
                jsonRPCAction: {
                    method: "open_url",
                    parameters: [],
                },
            },
        ],
    };
});
connection.onRequest("open_url", (params) => {
    connection.sendRequest("OpenUrl", { url: "https://www.google.com" });
    return;
});
connection.listen();
