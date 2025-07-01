import { Effect, Schema } from "effect"

const API_BASE_URL = "https://scrapbox.io/api"

function fetchScrapboxApi(endpoint: string, sid?: string) {
  return Effect.tryPromise({
    try: () =>
      fetch(`${API_BASE_URL}/${endpoint}`, {
        headers: {
          ...(sid && { Cookie: `connect.sid=${sid}` }),
        },
      }),
    catch: (error) => {
      throw new Error(`Failed to fetch Scrapbox API: ${error}`)
    },
  })
}

export const SearchTitlesResponse = Schema.Array(
  Schema.Struct({
    id: Schema.String,
    image: Schema.NullishOr(Schema.String),
    title: Schema.String,
    updated: Schema.Number,
  }),
)

export type SearchTitlesResponse = Schema.Schema.Type<
  typeof SearchTitlesResponse
>

export function searchTitles(project: string, sid?: string) {
  return fetchScrapboxApi(`pages/${project}/search/titles`, sid).pipe(
    Effect.andThen((response) => {
      if (!response.ok) {
        return Effect.fail(
          new Error(
            `searchTitles failed: ${response.status} ${response.statusText}`,
          ),
        )
      }
      return Effect.succeed(response)
    }),
    Effect.flatMap((response) => Effect.promise(() => response.text())),
    Effect.flatMap((text) => {
      const parser = Schema.parseJson(SearchTitlesResponse)
      const decode = Schema.decode(parser)
      return decode(text)
    }),
  )
}

export const GetScrapboxPageResponse = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  image: Schema.NullishOr(Schema.String),
  updated: Schema.Number,
  helpfeels: Schema.Array(Schema.String),
  lines: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      text: Schema.String,
    }),
  ),
})

export type ScrapboxPage = Schema.Schema.Type<typeof GetScrapboxPageResponse>

export function getScrapboxPage(project: string, title: string, sid?: string) {
  return fetchScrapboxApi(
    `pages/${project}/${encodeURIComponent(title)}`,
    sid,
  ).pipe(
    Effect.andThen((response) => {
      if (!response.ok) {
        return Effect.fail(
          new Error(
            `getScrapboxPage failed: ${response.status} ${response.statusText}`,
          ),
        )
      }
      return Effect.succeed(response)
    }),
    Effect.flatMap((response) => Effect.promise(() => response.text())),
    Effect.flatMap((text) => {
      const parser = Schema.parseJson(GetScrapboxPageResponse)
      const decode = Schema.decode(parser)
      return decode(text)
    }),
  )
}

export function getScrapboxFile(
  project: string,
  title: string,
  fileName: string,
  sid?: string,
) {
  return fetchScrapboxApi(
    `code/${project}/${encodeURIComponent(title)}/${encodeURIComponent(fileName)}`,
    sid,
  ).pipe(
    Effect.andThen((response) => {
      if (!response.ok) {
        return Effect.fail(
          new Error(
            `getScrapboxFile failed: ${response.status} ${response.statusText}`,
          ),
        )
      }
      return Effect.succeed(response)
    }),
    Effect.flatMap((response) => Effect.promise(() => response.text())),
  )
}
