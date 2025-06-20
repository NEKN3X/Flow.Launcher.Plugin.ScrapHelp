import { SearchHelpResult } from "../domain/getAllHelp.js";

export async function makeResult(help: SearchHelpResult) {
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
      ];
    });
  });
}
