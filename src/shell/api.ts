import { Effect, Schema } from "effect"

const API_BASE_URL = "https://scrapbox.io/api"

function fetchScrapboxApi(endpoint: string, sid?: string) {
  return Effect.tryPromise({
    catch: (error) => {
      throw new Error(`Failed to fetch Scrapbox API: ${error}`)
    },
    try: () =>
      fetch(`${API_BASE_URL}/${endpoint}`, {
        headers: {
          ...(sid && { Cookie: `connect.sid=${sid}` }),
        },
      }),
  })
}

const SearchTitlesResponse = Schema.Array(
  Schema.Struct({
    id: Schema.String,
    image: Schema.NullishOr(Schema.String),
    title: Schema.String,
    updated: Schema.Number,
  }),
)

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
    Effect.flatMap((response) =>
      Effect.tryPromise({
        catch: (error) => {
          throw new Error(`Failed to parse JSON response: ${error}`)
        },
        try: () => response.text(),
      }),
    ),
    Effect.flatMap((text) => {
      const parser = Schema.parseJson(SearchTitlesResponse)
      const decode = Schema.decode(parser)
      return decode(text)
    }),
  )
}

export function getScrapboxPage(project: string, title: string, sid?: string) {
  return fetchScrapboxApi(`pages/${project}/${encodeURIComponent(title)}`, sid)
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
  )
}
