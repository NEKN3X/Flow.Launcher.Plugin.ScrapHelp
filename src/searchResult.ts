import type { FzfOptions, FzfResultItem } from 'fzf'
import type { ResultItem } from 'types.js'
import { Fzf } from 'fzf'

export function searchResult(data: ResultItem[], query: string): ResultItem[] {
  const options: FzfOptions = {
    selector: (item: ResultItem) =>
      `${item.title} ${item.subTitle} ${item.title} ${item.subTitle}`,
  }
  const fzf = new Fzf<ResultItem[]>(data, options)
  const result: FzfResultItem<ResultItem[]>[] = fzf.find(query)

  return result
    .map(x => x.item as ResultItem)
    .reduce((acc, item) => {
      if (acc.some(x => x.subTitle === item.subTitle && sameUrlAction(x, item)))
        return acc
      return [...acc, item]
    }, [] as ResultItem[])
}

function sameUrlAction(
  a: ResultItem,
  b: ResultItem,
): boolean {
  return (
    a.jsonRPCAction.method === 'open_url'
    && a.jsonRPCAction.method === b.jsonRPCAction.method
    && a.jsonRPCAction.parameters[0] === b.jsonRPCAction.parameters[0]
  )
}
