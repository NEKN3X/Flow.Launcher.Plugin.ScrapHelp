import { searchTitles } from "@shell/api.js"
import type { JSONRPCResponse } from "types.js"
import { Flow } from "./helper.js"

interface AppSettings {
  projects?: string
  sid?: string
  glossary?: string
}

const methods = ["open_url", "copy_text"] as const
type AppMethods = (typeof methods)[number]

const flow = new Flow<AppMethods, AppSettings>()

flow.showResult(async (query, settings) => {
  const projects = settings.projects?.split(",") || []
  const result = await Promise.all(
    projects.map((projectName) =>
      searchTitles(projectName, settings.sid).then((titles) =>
        titles.map(
          (title): JSONRPCResponse<AppMethods> => ({
            title: title.title,
            jsonRPCAction: {
              method: "open_url",
              parameters: [title],
            },
          }),
        ),
      ),
    ),
  ).then((results) => results.flat())

  return result
})

flow.on("open_url", async (params) => {
  const url = params[0] as string
  const result = await flow.fuzzySearch("aa a", "CC AA BBB A")
  flow.showMessage(`Fuzzy search result: ${result.success}`)
  flow.openUrl(url, true)
})

flow.run()
