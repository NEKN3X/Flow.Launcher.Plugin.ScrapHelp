import { emptyGlossary, extractGlossary } from "@core/help/extractGlossary.js"
import { extractHelp } from "@core/help/extractHelp.js"
import { scrapboxUrl } from "@core/scrapbox/scrapboxUrl.js"
import type { ScrapboxPage } from "@core/scrapbox/types.js"
import { getScrapboxFile, getScrapboxPage, searchTitles } from "@shell/api.js"
import { Fzf } from "fzf"
import { search } from "search.js"
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
  const glossaryProject = settings.glossary || ""
  const glossary = glossaryProject
    ? await getScrapboxPage(glossaryProject, "Glossary", settings.sid).then(
        (page) => extractGlossary(page.lines.map((line) => line.text)),
      )
    : emptyGlossary()
  const result = await Promise.all(
    await Promise.all(
      projects.map((projectName) =>
        searchTitles(projectName, settings.sid).then((titles) =>
          titles.flatMap(
            async (title): Promise<JSONRPCResponse<AppMethods>[]> => {
              const page = (await getScrapboxPage(
                projectName,
                title.title,
                settings.sid,
              )) as ScrapboxPage
              const help: JSONRPCResponse<AppMethods>[] = await Promise.all(
                extractHelp(projectName, page).map(async (h) => {
                  switch (h.type) {
                    case "scrapbox_page":
                      return {
                        title: h.helpfeel,
                        icoPath: "assets/circle-help.png",
                        jsonRPCAction: {
                          method: "open_url",
                          parameters: [
                            scrapboxUrl(projectName, h.title).toString(),
                          ],
                        },
                      }
                    case "web_page":
                      return {
                        title: h.helpfeel,
                        icoPath: "assets/globe.png",
                        jsonRPCAction: {
                          method: "open_url",
                          parameters: [h.url],
                        },
                      }
                    case "text":
                      return {
                        title: h.helpfeel,
                        icoPath: "assets/clipboard.png",
                        jsonRPCAction: {
                          method: "copy_text",
                          parameters: [h.text],
                        },
                      }
                    case "file": {
                      const file = await getScrapboxFile(
                        projectName,
                        title.title,
                        h.fileName,
                        settings.sid,
                      )
                      return {
                        title: h.helpfeel,
                        icoPath: "assets/clipboard-minus.png",
                        jsonRPCAction: {
                          method: "copy_text",
                          parameters: [file],
                        },
                      }
                    }
                  }
                }),
              )
              return help.concat({
                title: title.title,
                icoPath: "assets/sticky-note.png",
                jsonRPCAction: {
                  method: "open_url",
                  parameters: [
                    scrapboxUrl(projectName, title.title).toString(),
                  ],
                },
              })
            },
          ),
        ),
      ),
    ).then((results) => results.flat()),
  ).then((results) => results.flat())

  const filteredResult = search(
    result,
    query.search,
    (item) => item.title,
  ).reduce(
    (acc, a) =>
      acc.some(
        (b) =>
          a.jsonRPCAction.method === "open_url" &&
          a.jsonRPCAction.method === b.jsonRPCAction.method &&
          a.icoPath === b.icoPath &&
          a.jsonRPCAction.parameters[0] === b.jsonRPCAction.parameters[0],
      )
        ? acc
        : acc.concat(a),
    [] as JSONRPCResponse<AppMethods>[],
  )

  return filteredResult
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
