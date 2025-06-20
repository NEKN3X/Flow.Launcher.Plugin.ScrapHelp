import { Fzf, FzfOptions, FzfResultItem } from "fzf";

export function searchResult(data: ResultItem[], query: string): ResultItem[] {
  const options: FzfOptions = {
    selector: (item: ResultItem) =>
      `${item.title} ${item.subTitle} ${item.title} ${item.subTitle}`,
  };
  const fzf = new Fzf<ResultItem[]>(data, options);

  const result: FzfResultItem<ResultItem[]>[] = fzf.find(query);

  return result
    .map((x) => x.item as ResultItem)
    .reduce((acc, item) => {
      if (
        acc.some(
          (x) =>
            x.subTitle === item.subTitle &&
            x.jsonRPCAction.parameters[0] === item.jsonRPCAction.parameters[0]
        )
      ) {
        return acc;
      }
      return [...acc, item];
    }, [] as ResultItem[]);
}
