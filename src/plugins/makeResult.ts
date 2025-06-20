import { SearchHelpResult } from "../domain/getAllHelp.js";

export async function makeResult(
  help: SearchHelpResult
): Promise<ResultItem[]> {
  return help.flatMap((item) => {
    return item.pages.flatMap((page) => {
      return {
        title: page.title,
        subTitle: `/${item.project}`,
        jsonRPCAction: {
          method: "open_url",
          parameters: [
            `https://scrapbox.io/${item.project}/${encodeURIComponent(
              page.title
            )}`,
          ],
        },
      };
    });
  });
}
