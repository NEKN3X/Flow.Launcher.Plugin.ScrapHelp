import { SearchHelpResult } from "../domain/getAllHelp.js";
import { expandHelpfeel } from "../scrapbox/parser.js";

const copyScrapboxLinkContext = (text: string) => [
  "Copy Scrapbox Link",
  "copy_text",
  text,
];

const openScrapboxPageContext = (url: string) => [
  "Open Scrapbox Page",
  "open_url",
  url,
];

export async function makeResult(help: SearchHelpResult, glossary: Glossary) {
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
          contextData: copyScrapboxLinkContext(
            `[/${item.project}/${page.title}]`
          ),
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
                    contextData: copyScrapboxLinkContext(
                      `[/${item.project}/${x.title}]`
                    ),
                  },
                ];
              case "web":
                const url = new URL(x.url);
                return [
                  {
                    title: x.helpfeel,
                    subTitle: `/${url.hostname}${url.pathname}`,
                    icoPath: "assets/globe.png",
                    jsonRPCAction: {
                      method: "open_url",
                      parameters: [url],
                    },
                    contextData: copyScrapboxLinkContext(
                      `[/${item.project}/${page.title}]`
                    ),
                  },
                ];
              case "text":
                return [
                  {
                    title: x.helpfeel,
                    subTitle: x.text,
                    icoPath: "assets/clipboard.png",
                    jsonRPCAction: {
                      method: "copy_text",
                      parameters: [x.text],
                    },
                    contextData: openScrapboxPageContext(
                      `https://scrapbox.io/${item.project}/${page.title}`
                    ),
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
                    contextData: openScrapboxPageContext(
                      `https://scrapbox.io/${item.project}/${page.title}`
                    ),
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
