import type { SearchTitlesResponse } from './types.js'

export function getSearchTitles(): Promise<SearchTitlesResponse> {
  return new Promise((resolve) => {
    resolve([
      {
        id: 'example-id-1',
        title: 'Example Title 1',
        image: 'https://example.com/image1.png',
        updated: Date.now(),
      },
      {
        id: 'example-id-2',
        title: 'Example Title 2',
        updated: Date.now(),
      },
      {
        id: 'example-id-3',
        title: 'Example Title 3',
        image: 'https://example.com/image3.png',
        updated: Date.now(),
      },
    ])
  })
}
