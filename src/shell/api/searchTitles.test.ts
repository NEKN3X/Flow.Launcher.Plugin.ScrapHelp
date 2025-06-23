import { getSearchTitles } from './searchTitles.js'

it('getSearchTitles should return Error when invalid SID', async () => {
  const project = 'testProject'
  const sid = 'INVALID_SID'

  const data = await getSearchTitles(project, sid)
  expect(data.isErr()).toBe(true)
})

it('getSearchTitles should return search titles when valid SID', async () => {
  const project = 'testProject'
  const sid = 'VALID_SID'

  const data = await getSearchTitles(project, sid)
  expect(data.isOk()).toBe(true)
  expect(data.unwrapOr([])).toEqual(
    [
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
    ],
  )
})
