import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { ReadCache, WriteCache } from "./domain/cache.js";

export function writeCache(cachePath: string): WriteCache {
  return <T>(key: string, value: T) => {
    mkdirSync(cachePath, { recursive: true });
    writeFileSync(
      `${cachePath}/${key}.json`,
      JSON.stringify(value, null, 2),
      "utf-8"
    );
  };
}

export function readCache(cachePath: string): ReadCache {
  return <T>(key: string): T | undefined => {
    try {
      const data = readFileSync(`${cachePath}/${key}.json`, "utf-8");
      return JSON.parse(data) as T;
    } catch (_) {
      return undefined;
    }
  };
}
