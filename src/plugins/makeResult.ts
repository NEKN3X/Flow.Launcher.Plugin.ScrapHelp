import { SearchHelpResult } from "../domain/getAllHelp.js";
import { expandHelpfeel } from "../scrapbox/parser.js";

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
