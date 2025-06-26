import { mkdir, readFile, rmdir, writeFile } from 'node:fs/promises'
import { ResultAsync } from 'neverthrow'

export type WriteJSON<T> = (key: string, value: T) => ResultAsync<void, unknown>
export function createWriteJSON<T>(cachePath: string): WriteJSON<T> {
  return (key: string, value: T) => {
    return ResultAsync.fromPromise(mkdir(cachePath, { recursive: true }).then(async () =>
      await writeFile(
        `${cachePath}/${key}.json`,
        JSON.stringify(
          value,
          null,
          2,
        ),
        'utf-8',
      ),
    ), (error) => {
      return error
    })
  }
}

export type ReadJSON<T> = (key: string) => ResultAsync<T, unknown>
export function createReadJSON<T>(cachePath: string): ReadJSON<T> {
  return (key: string) => {
    return ResultAsync.fromPromise(
      readFile(`${cachePath}/${key}.json`, 'utf-8').then(x => JSON.parse(x) as T),
      (error) => {
        return error
      },
    )
  }
}

export type RemoveDir = () => ResultAsync<void, unknown>
export function createRemoveDir(cachePath: string): RemoveDir {
  return () => {
    return ResultAsync.fromPromise(
      mkdir(cachePath, { recursive: true }).then(async () =>
        await rmdir(`${cachePath}`, { recursive: true }),
      ),
      (error) => {
        return error
      },
    )
  }
}
