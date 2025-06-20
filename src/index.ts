import * as rpc from "vscode-jsonrpc/node.js";
import { extractGlossary } from "./domain/extractGlossary.js";
import { getAllHelp } from "./domain/getAllHelp.js";
import {
  defineGetFile,
  defineGetLines,
  defineGetTitles,
} from "./plugins/impl.js";
import { makeResult } from "./plugins/makeResult.js";
import { searchResult } from "./plugins/searchResult.js";

const connection = rpc.createMessageConnection(
  new rpc.StreamMessageReader(process.stdin),
  new rpc.StreamMessageWriter(process.stdout)
);

let _context: Context;
let _settings: Settings;

connection.onRequest("initialize", async (ctx: Context) => {
  _context = ctx;
  return;
});

connection.onRequest("query", async (query: Query, settings: Settings) => {
  _settings = settings;
  const projects = settings.projects.split(",");
  const getTitles = defineGetTitles(_context, settings);
  const getLines = defineGetLines(_context, settings);
  const glossary = extractGlossary(await getLines(projects[0], "Glossary"));
  const allHelp = await getAllHelp(projects, getTitles, getLines);
  const result = await makeResult(allHelp, glossary);

  return { result: searchResult(result, query.search) };
});

connection.onRequest("open_url", async (params) => {
  await connection.sendRequest("OpenUrl", { url: params[0] });
  return {};
});

connection.onRequest("copy_text", async (params) => {
  await connection.sendRequest("CopyToClipboard", { text: params[0] });
  return {};
});

connection.onRequest("copy_file", async (params) => {
  const getFile = defineGetFile(_context, _settings);
  const text = await getFile(params[0], params[1], params[2]);
  await connection.sendRequest("CopyToClipboard", { text });
  return {};
});

connection.listen();
