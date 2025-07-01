import { mkdir, readFile, writeFile } from "node:fs/promises"
import { Effect } from "effect"

export function writeCache<T>(cachePath: string) {
  return (key: string, value: T) => {
    return Effect.promise(() =>
      mkdir(cachePath, { recursive: true }).then(
        async () =>
          await writeFile(
            `${cachePath}/${key}.json`,
            JSON.stringify(
              {
                data: value,
              },
              null,
              2,
            ),
            "utf-8",
          ),
      ),
    )
  }
}

export function readCache<T>(cachePath: string) {
  return (key: string) => {
    return Effect.promise(() =>
      readFile(`${cachePath}/${key}.json`, "utf-8").then(
        (x) => JSON.parse(x).data as T,
      ),
    )
  }
}
