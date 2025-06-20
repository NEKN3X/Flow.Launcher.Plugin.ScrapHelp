import { SearchHelpResult } from "../domain/getAllHelp.js";
import { expandHelpfeel } from "../scrapbox/parser.js";

const copyScrapboxLinkContext = (text: string): ResultItem => ({
  title: "Copy Scrapbox Link",
  subTitle: text,
  icoPath: "assets/clipboard.png",
  jsonRPCAction: {
    method: "copy_text",
    parameters: [text],
  },
});

const openScrapboxPageContext = (url: URL): ResultItem => ({
  title: "Open Scrapbox Page",
  subTitle: decodeURIComponent(url.pathname),
  icoPath: "assets/sticky-note.png",
  jsonRPCAction: {
    method: "open_url",
    parameters: [url],
  },
});

const replaceQuery = (text: string, query: string): string => {
  return text.replace(/{query}/g, query);
};

export async function makeResult(
  help: SearchHelpResult,
  glossary: Glossary,
  query: string
) {
  return help.flatMap((item) => {
    return item.pages.flatMap((page): ResultItem[] => {
      return [
        {
          title: page.title,
          subTitle: `/${item.project}`,
          icoPath: "assets/sticky-note.png",
          jsonRPCAction: {
            method: "open_url",
            parameters: [
              `https://scrapbox.io/${item.project}/${encodeURIComponent(
                page.title
              )}`,
            ],
          },
          contextData: [
            copyScrapboxLinkContext(`[/${item.project}/${page.title}]`),
          ],
        },
        ...page.help
          .flatMap((x): ResultItem[] => {
            switch (x.type) {
              case "scrapbox":
                return [
                  {
                    title: x.helpfeel,
                    subTitle: `/${item.project}/${x.title}`,
                    icoPath: "assets/circle-help.png",
                    jsonRPCAction: {
                      method: "open_url",
                      parameters: [
                        `https://scrapbox.io/${
                          item.project
                        }/${encodeURIComponent(x.title)}`,
                      ],
                    },
                    contextData: [
                      copyScrapboxLinkContext(`[/${item.project}/${x.title}]`),
                    ],
                  },
                ];
              case "web":
                const url = new URL(replaceQuery(x.url, query));
                return [
                  {
                    title: replaceQuery(x.helpfeel, query),
                    subTitle: `/${url.hostname}${url.pathname}`,
                    icoPath: "assets/globe.png",
                    jsonRPCAction: {
                      method: "open_url",
                      parameters: [url],
                    },
                    contextData: [
                      copyScrapboxLinkContext(
                        `[/${item.project}/${page.title}]`
                      ),
                    ],
                  },
                ];
              case "text":
                const text = replaceQuery(x.text, query);
                return [
                  {
                    title: replaceQuery(x.helpfeel, query),
                    subTitle: text,
                    icoPath: "assets/clipboard.png",
                    jsonRPCAction: {
                      method: "copy_text",
                      parameters: [text],
                    },
                    contextData: [
                      openScrapboxPageContext(
                        new URL(
                          `https://scrapbox.io/${item.project}/${page.title}`
                        )
                      ),
                    ],
                  },
                ];
              case "file":
                return [
                  {
                    title: x.helpfeel,
                    subTitle: `/${item.project}/${page.title}/${x.fileName}`,
                    icoPath: "assets/file-code.png",
                    jsonRPCAction: {
                      method: "copy_file",
                      parameters: [item.project, page.title, x.fileName],
                    },
                    contextData: [
                      openScrapboxPageContext(
                        new URL(
                          `https://scrapbox.io/${item.project}/${page.title}`
                        )
                      ),
                    ],
                  },
                ];
              default:
                return [];
            }
          })
          .flatMap((x) => {
            try {
              const result = expandHelpfeel(x.title, glossary).map(
                (expanded) => ({
                  ...x,
                  title: expanded,
                })
              );
              return result;
            } catch (_) {
              return [];
            }
          }),
      ];
    });
  });
}
