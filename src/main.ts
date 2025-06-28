import { searchTitles } from '@shell/api.js'
import { Effect } from 'effect'
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
  const program = searchTitles('nekn3x', settings.sid)
  const response = await Effect.runPromise(program)
  return [
    {
      title: flow.context.name + query.search,
      subTitle: response.map((x) => x.title).join(', '),
      jsonRPCAction: {
        method: 'open_url',
        parameters: ['https://example.com'],
      },
    },
  ]
})

flow.on('open_url', async (params) => {
  const url = params[0] as string
  const result = await flow.fuzzySearch('aa a', 'CC AA BBB A')
  flow.showMessage(`Fuzzy search result: ${result.success}`)
  // flow.openUrl(url, true)
})

flow.run()
