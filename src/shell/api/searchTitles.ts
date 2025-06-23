import type { ConnectSid, ProjectName } from '../../core/scrapbox/types.js'
import type { ScrapboxApiError, SearchTitlesResponse } from './types.js'
import { ResultAsync } from 'neverthrow'
import { client } from './client.js'

export function getSearchTitles(project: ProjectName, sid?: ConnectSid) {
  return ResultAsync.fromPromise(client.get<SearchTitlesResponse>(`/pages/${project}/search/titles`, {
    headers: {
      ...(sid ? { Cookie: `connect.sid=${sid}` } : {}),
    },
  }).then((response) => {
    return response.data
  }), (error: any) => {
    return error.response as ScrapboxApiError
  })
}
