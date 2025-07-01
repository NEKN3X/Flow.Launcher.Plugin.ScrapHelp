import { Flow } from "./helper.js"

interface AppSettings {
  projects?: string
  sid?: string
  glossary?: string
}

const methods = ["open_url", "copy_text"] as const
type AppMethods = (typeof methods)[number]

const flow = new Flow<AppMethods, AppSettings>()

flow.showResult(async (_query, _settings) => {
  return []
})

flow.on("open_url", async (params) => {
  const url = params[0] as string
  flow.openUrl(url)
})

flow.on("copy_text", async (params) => {
  const text = params[0] as string
  flow.copyToClipboard(text)
})

flow.run()
