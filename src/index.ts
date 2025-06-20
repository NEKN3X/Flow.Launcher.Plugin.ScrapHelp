import * as rpc from "vscode-jsonrpc/node.js";
import { getAllHelp } from "./domain/getAllHelp.js";
import { defineGetLines, defineGetTitles } from "./plugins/impl.js";
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
  const projects = settings.projects.split(",");
  const getTitles = defineGetTitles(context, settings);
  const getLines = defineGetLines(context, settings);
  const glossary = new Map<string, string>();
  const allHelp = await getAllHelp(projects, getTitles, getLines, glossary);
  const result = await makeResult(allHelp);

  return { result };
});

connection.onRequest("open_url", async (params) => {
  await connection.sendRequest("OpenUrl", { url: params[0] });
  return {};
});

connection.listen();
