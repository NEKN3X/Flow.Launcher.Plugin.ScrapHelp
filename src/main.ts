import { Flow } from './helper.js'

interface AppSettings {
  projects?: string
  sid?: string
  glossary?: string
}

const methods = ['open_url', 'copy_text'] as const
type AppMethods = (typeof methods)[number]

const flow = new Flow<AppMethods, AppSettings>()

flow.showResult((query, settings) => {
  return [
    {
      title: flow.context.name + query.search,
      subTitle: settings.projects || '',
      jsonRPCAction: {
        method: 'open_url',
        parameters: ['https://example.com'],
      },
    },
  ]
})

flow.on('open_url', (params) => {
  const url = params[0] as string
  flow.openUrl(url, true)
})

flow.run()
