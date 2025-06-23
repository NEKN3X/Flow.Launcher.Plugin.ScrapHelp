import type { ConnectSid, ProjectName } from '../../core/scrapbox/types.js'
import type { SearchTitlesResponse } from './types.js'
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
    if (error.response) {
      return new Error(`${error.response.data.name}: ${error.response.data.message}`)
    }
    return new Error('Unexpected error occurred while fetching titles')
  })
}
