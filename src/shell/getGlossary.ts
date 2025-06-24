import type { GetScrapboxPageResponse } from './api/types.js'
import { extractGlossary } from '@core/help/extractGlossary.js'
import { createReadLocalJSON } from './storage.js'

export async function getGlossary(
  cachePath: string,
  id: string,
) {
  const readJSON = createReadLocalJSON<GetScrapboxPageResponse>(cachePath)
  const file = await readJSON(id)
  if (file.isErr())
    return new Map<string, string>()
  return extractGlossary(file.value.lines.map(line => line.text))
}
