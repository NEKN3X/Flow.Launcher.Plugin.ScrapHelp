import type { Glossary } from './types.js'

const glossaryRegex = /(.*):\s*`(.*)`$/

export function extractGlossary(lines: string[]): Glossary {
  return new Map(
    lines.flatMap((x) => {
      const match = x.match(glossaryRegex)
      if (!match)
        return []
      return [[match[1].trim(), match[2].trim()]]
    }),
  )
}
