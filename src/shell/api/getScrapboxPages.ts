import type { Help, ScrapboxPageWithHelp } from '@core/help/types.js'
import type { ConnectSid, ProjectName } from '@core/scrapbox/types.js'
import type { AxiosInstance } from 'axios'
import type { AxiosCacheInstance } from 'axios-cache-interceptor'
import type { GetScrapboxPageResponse, ScrapboxApiError, SearchTitlesResponse, SearchTitlesResponseItem } from './types.js'
import { extractHelp } from '@core/help/extractHelp.js'
import { ResultAsync } from 'neverthrow'
import { createReadLocalJSON, createWriteLocalJSON } from 'utils/storage.js'
import { client } from './client.js'

type SearchTitles = (project: ProjectName, sid?: ConnectSid) => ResultAsync<SearchTitlesResponse, ScrapboxApiError>
export function createSearchTitles(client: AxiosInstance): SearchTitles {
  return (project: ProjectName, sid?: ConnectSid) => {
    return ResultAsync.fromPromise(client.get<SearchTitlesResponse>(`/pages/${project}/search/titles`, {
      headers: {
        ...(sid ? { Cookie: `connect.sid=${sid}` } : {}),
      },
    }).then((response) => {
      return response.data
    }), (error: any): ScrapboxApiError => {
      return error.response.data
    })
  }
}

type GetScrapboxPage = (project: ProjectName, title: string, sid?: ConnectSid) => ResultAsync<GetScrapboxPageResponse, ScrapboxApiError>
export function createGetScrapboxPage(client: AxiosInstance): GetScrapboxPage {
  return (project: ProjectName, title: string, sid?: ConnectSid) => {
    return ResultAsync.fromPromise(client.get<GetScrapboxPageResponse>(`/pages/${project}/${encodeURIComponent(title)}`, {
      headers: {
        ...(sid ? { Cookie: `connect.sid=${sid}` } : {}),
      },
    }).then((response) => {
      return response.data
    }), (error: any): ScrapboxApiError => {
      return error.response?.data
    })
  }
}

function searchTitlesToScrapboxPage(item: SearchTitlesResponseItem & { help?: Help[] }): ScrapboxPageWithHelp {
  return {
    id: item.id,
    title: item.title,
    image: item.image ? new URL(item.image) : undefined,
    updated: item.updated,
    lines: [],
    helpfeels: [],
    help: item.help || [],
  }
}

function mapToScrapboxPage(item: GetScrapboxPageResponse & { help?: Help[] }): ScrapboxPageWithHelp {
  return {
    id: item.id,
    title: item.title,
    image: item.image ? new URL(item.image) : undefined,
    updated: item.updated,
    lines: [...item.lines],
    helpfeels: item.helpfeels,
    help: item.help || [],
  }
}

export function createGetScrapboxPages(cacheClient: AxiosCacheInstance, cachePath: string) {
  const searchTitles = createSearchTitles(cacheClient)
  const getScrapboxPage = createGetScrapboxPage(client)
  const writeJSON = createWriteLocalJSON(cachePath)
  const readJSON = createReadLocalJSON<GetScrapboxPageResponse & { help: Help[] }>(cachePath)
  return async (project: ProjectName, sid?: ConnectSid): Promise<ScrapboxPageWithHelp[]> => {
    const titlesResult = await searchTitles(project, sid)
    if (titlesResult.isErr())
      return []

    const pages = titlesResult.value.map(searchTitlesToScrapboxPage)
    return await Promise.all(
      pages.map(async (page) => {
        const cache = await readJSON(page.id)
        if (cache.isOk()) {
          const cachedPage = mapToScrapboxPage(cache.value)
          if (page.updated > cachedPage.updated) {
            const data = await getScrapboxPage(project, cachedPage.title, sid)
            if (data.isOk()) {
              const updatedPage = mapToScrapboxPage(data.value)
              await writeJSON(updatedPage.id, { ...updatedPage, help: extractHelp(project, updatedPage) })
              return updatedPage
            }
          }
          return cachedPage
        }
        const data = await getScrapboxPage(project, page.title, sid)
        if (data.isOk()) {
          const newPage = mapToScrapboxPage(data.value)
          await writeJSON(newPage.id, { ...newPage, help: extractHelp(project, newPage) })
          return newPage
        }
        return page
      }),
    )
  }
}
