import { mkdir, readFile, writeFile } from "node:fs/promises"
import { Effect } from "effect"

export function writeStorage(cachePath: string) {
  return (key: string, value: object) =>
    Effect.tryPromise(() =>
      mkdir(cachePath, { recursive: true }).then(
        async () =>
          await writeFile(
            `${cachePath}/${key}.json`,
            JSON.stringify(value, null, 2),
            "utf-8",
          ),
      ),
    )
}

export function readStorage(cachePath: string) {
  return (key: string) =>
    Effect.tryPromise(() =>
      readFile(`${cachePath}/${key}.json`, "utf-8").then((x) => JSON.parse(x)),
    )
}
