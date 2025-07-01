import { mkdirSync } from "node:fs"
import { Effect } from "effect"
import { getScrapboxPage, type ScrapboxPage, searchTitles } from "./api.js"
import { readStorage, writeStorage } from "./storage.js"

export function getScrapboxPages(
  cachePath: string,
  projects: string[],
  sid?: string,
) {
  const readCache = readStorage(cachePath)
  const writeCache = writeStorage(cachePath)

  // ディレクトリが存在しなければ作成
  mkdirSync(cachePath, { recursive: true })

  const program = Effect.all(
    projects.map((project) =>
      // 各プロジェクトのタイトルを取得
      searchTitles(project, sid).pipe(
        Effect.flatMap((titles) =>
          Effect.all(
            titles.map((titleInfo) => {
              const cacheKey = titleInfo.id

              // キャッシュを読み取り
              const program = readCache(cacheKey).pipe(
                Effect.flatMap((cachedPage: ScrapboxPage) => {
                  // キャッシュが存在し、更新日時が同じ場合はキャッシュを使用
                  if (cachedPage.updated >= titleInfo.updated) {
                    return Effect.succeed(cachedPage)
                  }
                  // 更新されている場合は新しいページをフェッチ
                  return getScrapboxPage(project, titleInfo.title, sid).pipe(
                    Effect.tap((page) => writeCache(cacheKey, page)),
                  )
                }),
                Effect.catchAll(() =>
                  getScrapboxPage(project, titleInfo.title, sid).pipe(
                    Effect.tap((page) => writeCache(cacheKey, page)),
                  ),
                ),
              )
              return program
            }),
          ),
        ),
        Effect.map((pages) => ({
          project,
          pages,
        })),
      ),
    ),
  ).pipe(Effect.map((results) => results.flat()))

  return program
}
