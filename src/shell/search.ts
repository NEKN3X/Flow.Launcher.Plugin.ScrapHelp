import type { FzfOptions, FzfResultItem } from "fzf"
import { Fzf } from "fzf"

export function search<T>(
  data: T[],
  query: string,
  selector: (item: T) => string,
): T[] {
  const options: FzfOptions = {
    selector,
  }
  const fzf = new Fzf(data, options)
  const result: FzfResultItem[] = fzf.find(query)

  return result.map((item) => item.item as T)
}
