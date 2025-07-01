export function scrapboxUrl(project: string, title: string): URL {
  return new URL(`https://scrapbox.io/${project}/${encodeURIComponent(title)}`)
}
