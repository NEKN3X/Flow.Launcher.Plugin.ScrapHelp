import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('https://scrapbox.io/api/pages/:project/search/titles', ({ request }) => {
    if (request.headers.get('Cookie') !== 'connect.sid=VALID_SID') {
      return HttpResponse.json(
        { name: 'NotLoggedInError', message: 'You are not logged in yet.' },
        { status: 401 },
      )
    }

    return HttpResponse.json([
      {
        id: 'example',
        title: 'Example Page',
        links: [],
        image: 'https://gyazo.com/example/raw',
        updated: 1750062739,
      },
      {
        id: 'example',
        title: 'Another Example Page',
        links: [],
        image: 'https://gyazo.com/example/raw',
        updated: 1749448873,
      },
    ])
  }),
]
