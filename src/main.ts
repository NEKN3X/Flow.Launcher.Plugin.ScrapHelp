import { extractGlossary } from "@core/help/extractGlossary.js"
import { extractHelp } from "@core/help/extractHelp.js"
import { expandHelpfeel } from "@core/help/parser.js"
import { replaceGlossary } from "@core/help/replaceGlossary.js"
import type { Glossary } from "@core/help/types.js"
import { scrapboxUrl } from "@core/scrapbox/scrapboxUrl.js"
import { getScrapboxFile } from "@shell/api.js"
import { getScrapboxPages } from "@shell/pages.js"
import { search } from "@shell/search.js"
import { Effect } from "effect"
import type { JSONRPCResponse } from "types.js"
import { Flow } from "./helper.js"

interface AppSettings {
  projects?: string
  sid?: string
  glossary?: string
}

const methods = ["open_url", "copy_text", "copy_file"] as const
type AppMethods = (typeof methods)[number]

const flow = new Flow<AppMethods, AppSettings>()

flow.showResult(async (query, settings) => {
  const program = Effect.runPromise(
    getScrapboxPages(
      flow.context.pluginCacheDirectoryPath,
      settings.projects?.split(",") || [],
      settings.sid,
    ).pipe(
      Effect.map((projects) => {
        const glossaryPage = projects
          .find((x) => x.project === settings.glossary)
          ?.pages.find((page) => /glossary/i.test(page.title))
        const glossary = extractGlossary(
          glossaryPage?.lines.map((line) => line.text) || [],
        )
          .set("query", query.search)
          .set("term", query.searchTerms.slice(1).join(" "))
        return {
          projects,
          glossary,
        }
      }),
      Effect.map((projectsAndGlossary) =>
        projectsAndGlossary.projects.flatMap((x) =>
          x.pages.flatMap((page): JSONRPCResponse<AppMethods>[] => {
            const help = extractHelp(
              x.project,
              page,
              projectsAndGlossary.glossary,
            )
            return [
              {
                title: page.title,
                subTitle: `${x.project}/${page.title}`,
                icoPath: "assets/sticky-note.png",
                jsonRPCAction: {
                  method: "open_url",
                  parameters: [scrapboxUrl(x.project, page.title).toString()],
                },
              },
              ...help
                .map((h): JSONRPCResponse<AppMethods> => {
                  switch (h.type) {
                    case "scrapbox_page":
                      return {
                        title: h.helpfeel,
                        subTitle: `${h.project}/${h.title}`,
                        icoPath: "assets/circle-help.png",
                        jsonRPCAction: {
                          method: "open_url",
                          parameters: [
                            scrapboxUrl(h.project, h.title).toString(),
                          ],
                        },
                      }

                    case "web_page":
                      return {
                        title: h.helpfeel,
                        subTitle: `${h.url.hostname}${h.url.pathname}`,
                        icoPath: "assets/globe.png",
                        jsonRPCAction: {
                          method: "open_url",
                          parameters: [h.url.toString()],
                        },
                      }

                    case "text":
                      return {
                        title: h.helpfeel,
                        subTitle: h.text,
                        icoPath: "assets/clipboard.png",
                        jsonRPCAction: {
                          method: "copy_text",
                          parameters: [h.text],
                        },
                      }

                    case "file":
                      return {
                        title: h.helpfeel,
                        subTitle: `${h.project}/${h.title}/${h.fileName}`,
                        icoPath: "assets/clipboard-minus.png",
                        jsonRPCAction: {
                          method: "copy_file",
                          parameters: [
                            h.project,
                            h.title,
                            h.fileName,
                            settings.sid || "",
                          ],
                        },
                      }
                  }
                })
                .flatMap((item) =>
                  expandHelpfeel(item.title).map((expanded) => ({
                    ...item,
                    title: expanded,
                  })),
                ),
            ]
          }),
        ),
      ),
      Effect.map((results) =>
        search(results, query.search, (item) => item.title).reduce(
          (acc, item) =>
            acc.some(
              (x) =>
                x.jsonRPCAction.method === item.jsonRPCAction.method &&
                x.subTitle === item.subTitle &&
                x.icoPath === item.icoPath,
            )
              ? acc
              : acc.concat(item),
          [] as JSONRPCResponse<AppMethods>[],
        ),
      ),
    ),
  )
  return program
})

flow.on("open_url", async (params) => {
  const url = params[0] as string
  flow.openUrl(url)
})

flow.on("copy_text", async (params) => {
  const text = params[0] as string
  flow.copyToClipboard(text)
})

flow.on("copy_file", async (params) => {
  const [project, title, fileName, sid] = params as [
    string,
    string,
    string,
    string,
  ]
  const fileContent = getScrapboxFile(project, title, fileName, sid)
  const text = await Effect.runPromise(fileContent)
  flow.copyToClipboard(text)
})

flow.run()
