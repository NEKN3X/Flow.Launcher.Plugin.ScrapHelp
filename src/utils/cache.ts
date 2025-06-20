import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

type CacheData<T> = {
  data: T;
  timestamp: number;
};

export type WriteCache<T> = (key: string, value: T) => void;
export type ReadCache<T> = (key: string) => CacheData<T> | undefined;

export function defineWriteCache<T>(
  cachePath: string,
  timestamp?: number
): WriteCache<T> {
  return (key: string, value: T) => {
    mkdirSync(cachePath, { recursive: true });
    writeFileSync(
      `${cachePath}/${key}.json`,
      JSON.stringify(
        {
          data: value,
          timestamp: timestamp ?? Date.now(),
        },
        null,
        2
      ),
      "utf-8"
    );
  };
}

export function defineReadCache<T>(cachePath: string): ReadCache<T> {
  return (key: string): CacheData<T> | undefined => {
    try {
      const data = readFileSync(`${cachePath}/${key}.json`, "utf-8");
      return JSON.parse(data);
    } catch (_) {
      return undefined;
    }
  };
}
