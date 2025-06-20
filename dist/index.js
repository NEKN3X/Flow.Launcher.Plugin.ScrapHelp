var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as rpc from "vscode-jsonrpc/node.js";
const connection = rpc.createMessageConnection(new rpc.StreamMessageReader(process.stdin), new rpc.StreamMessageWriter(process.stdout));
connection.onRequest("initialize", (params) => __awaiter(void 0, void 0, void 0, function* () {
    return;
}));
connection.onRequest("query", (query, settings) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
connection.onRequest("open_url", (params) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.sendRequest("OpenUrl", { url: "https://www.google.com" });
    return;
}));
connection.listen();
