import type { ConnectSid, PageTitle, ProjectName } from '@core/scrapbox/types.js'
import type { AxiosInstance } from 'axios'
import type { ScrapboxApiError } from './types.js'
import { ResultAsync } from 'neverthrow'

type GetFile = (project: ProjectName, title: PageTitle, fileName: string, sid?: ConnectSid) => ResultAsync<string, ScrapboxApiError>
function createGetFile(client: AxiosInstance): GetFile {
  return (project: ProjectName, title: PageTitle, fileName: string, sid?: ConnectSid) => {
    return ResultAsync.fromPromise(client.get<string>(`/code/${project}/${encodeURIComponent(title)}/${encodeURIComponent(fileName)}`, {
      headers: {
        'Content-Type': 'text/plain',
        ...(sid ? { Cookie: `connect.sid=${sid}` } : {}),
      },
    }).then((response) => {
      return response.data
    }), (error: any): ScrapboxApiError => {
      return error.response.data
    })
  }
}

export function createGetScrapboxFile(client: AxiosInstance) {
  const getFile = createGetFile(client)
  return async (project: ProjectName, title: PageTitle, fileName: string, sid?: ConnectSid) => {
    const text = await getFile(project, title, fileName, sid)
    if (text.isErr())
      return text.error.message
    return text.value
  }
}
