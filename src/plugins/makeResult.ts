import { defineReadCache, defineWriteCache } from "../cache.js";
import { getAllHelp, GetLines, GetTitles } from "../domain/getAllHelp.js";
import { scrapboxApi } from "../scrapbox/api.js";

const timeout = 1000 * 60;

export function encodeFilename(input: string): string {
  return input.replace(
    /[\\/:*?"<>|\x00-\x1F]/g,
    (c) => `_${c.charCodeAt(0).toString(16)}_`
  );
}

function defineGetTitles(context: Context, settings: Settings): GetTitles {
  return async (project: string) => {
    const key = encodeFilename(project);
    const cache = defineReadCache<string[]>(
      context.currentPluginMetadata.pluginCacheDirectoryPath
    )(key);
    const writeCache = defineWriteCache<string[]>(
      context.currentPluginMetadata.pluginCacheDirectoryPath
    );
    const getAndWriteCache = async () => {
      const titles = await scrapboxApi
        .searchTitles(project, settings.sid)
        .then((response) => response.map((title) => title.title));
      writeCache(key, titles);
      return titles;
    };
    if (cache !== undefined) {
      if (Date.now() - cache.timestamp < timeout) {
        return cache.data;
      } else {
        return getAndWriteCache();
      }
    }
    return getAndWriteCache();
  };
}

function defineGetLines(context: Context, settings: Settings): GetLines {
  return async (project: string, title: string) => {
    const key = encodeFilename(`${project}-${title}`);
    const cache = defineReadCache<string[]>(
      context.currentPluginMetadata.pluginCacheDirectoryPath
    )(key);
    const writeCache = defineWriteCache<string[]>(
      context.currentPluginMetadata.pluginCacheDirectoryPath
    );
    const getAndWriteCache = async () => {
      const lines = await scrapboxApi
        .pageText(project, title, settings.sid)
        .then((response) => response);
      writeCache(key, lines);
      return lines;
    };
    if (cache !== undefined) {
      if (Date.now() - cache.timestamp < timeout) {
        return cache.data;
      } else {
        return getAndWriteCache();
      }
    }
    return getAndWriteCache();
  };
}

export async function makeResult(context: Context, settings: Settings) {
  const projects = settings.projects.split(",");
  const getTitles = defineGetTitles(context, settings);
  const getLines = defineGetLines(context, settings);
  const glossary = new Map<string, string>();

  const allHelp = await getAllHelp(projects, getTitles, getLines, glossary);

  return allHelp.flatMap((item) => {
    return item.pages.flatMap((page) => {
      return {
        title: page.title,
        jsonRPCAction: {
          method: "open_url",
          parameters: [
            `https://scrapbox.io/${item.project}/${encodeURIComponent(
              page.title
            )}`,
          ],
        },
      };
    });
  });
}
