import { GetLines, GetTitles } from "../domain/getAllHelp.js";
import { scrapboxApi } from "../scrapbox/api.js";
import { defineReadCache, defineWriteCache } from "../utils/cache.js";

const timeout = 1000 * 60 * 0.5;

export function encodeFilename(input: string): string {
  return input.replace(
    /[\\/:*?"<>|\x00-\x1F]/g,
    (c) => `_${c.charCodeAt(0).toString(16)}_`
  );
}

function _defineGetTitles(context: Context, settings: Settings) {
  return async (project: string) => {
    const key = encodeFilename(project);
    const cache = defineReadCache<SearchTitlesResponse>(
      context.currentPluginMetadata.pluginCacheDirectoryPath
    )(key);
    const writeCache = defineWriteCache<SearchTitlesResponse>(
      context.currentPluginMetadata.pluginCacheDirectoryPath
    );
    const getAndWriteCache = async () => {
      const res = await scrapboxApi.searchTitles(project, settings.sid);
      writeCache(key, res);

      await Promise.all(
        res.map(async (title) => {
          const linesKey = encodeFilename(`${project}-${title.title}`);
          const linesCache = defineReadCache<string[]>(
            context.currentPluginMetadata.pluginCacheDirectoryPath
          )(linesKey);
          if (
            linesCache === undefined ||
            linesCache.timestamp < title.updated
          ) {
            const writeLinesCache = defineWriteCache<string[]>(
              context.currentPluginMetadata.pluginCacheDirectoryPath,
              title.updated
            );
            const lines = await scrapboxApi.pageText(
              project,
              title.title,
              settings.sid
            );
            writeLinesCache(linesKey, lines);
          }
          return Promise.resolve();
        })
      );

      return res;
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

export function defineGetTitles(
  context: Context,
  settings: Settings
): GetTitles {
  return async (project: string) => {
    const getTitles = _defineGetTitles(context, settings);
    return getTitles(project).then((titles) =>
      titles.map((title) => title.title)
    );
  };
}

export function defineGetLines(context: Context, settings: Settings): GetLines {
  return async (project: string, title: string) => {
    const key = encodeFilename(`${project}-${title}`);
    const cache = defineReadCache<string[]>(
      context.currentPluginMetadata.pluginCacheDirectoryPath
    )(key);
    if (cache !== undefined) {
      return cache.data;
    }
    return [];
  };
}

export function defineGetFile(context: Context, settings: Settings): GetFile {
  return async (project: string, title: string, fileName: string) => {
    const key = encodeFilename(`${project}-${title}-${fileName}`);
    const cache = defineReadCache<string>(
      context.currentPluginMetadata.pluginCacheDirectoryPath
    )(key);
    const getAndWriteCache = async () => {
      const res = await scrapboxApi.fileContent(
        project,
        title,
        fileName,
        settings.sid
      );
      const writeCache = defineWriteCache<string>(
        context.currentPluginMetadata.pluginCacheDirectoryPath
      );
      writeCache(key, res);
      return res;
    };
    if (cache !== undefined) {
      if (Date.now() - cache.timestamp < timeout) {
        return cache.data;
      } else {
        return await getAndWriteCache();
      }
    }
    return await getAndWriteCache();
  };
}
