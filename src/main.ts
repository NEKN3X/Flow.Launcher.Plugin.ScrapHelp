import { searchTitles } from '@shell/api.js'
import { Effect } from 'effect'
import type { JSONRPCResponse } from 'types.js'
import { Flow } from './helper.js'

interface AppSettings {
  projects?: string
  sid?: string
  glossary?: string
}

const methods = ['open_url', 'copy_text'] as const
type AppMethods = (typeof methods)[number]

const flow = new Flow<AppMethods, AppSettings>()

flow.showResult(async (query, settings) => {
  const program = searchTitles('nekn3x', settings.sid).pipe(
    Effect.map((titles) =>
      titles.map(
        (title): JSONRPCResponse<AppMethods> => ({
          jsonRPCAction: {
            method: 'open_url',
            parameters: [title],
          },
          subTitle: title.id,
          title: query + title.title,
        }),
      ),
    ),
  )
  return await Effect.runPromise(program)
})

flow.on('open_url', async (params) => {
  const url = params[0] as string
  const result = await flow.fuzzySearch('aa a', 'CC AA BBB A')
  flow.showMessage(`Fuzzy search result: ${result.success}`)
  flow.openUrl(url, true)
})

flow.run()
