import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import axios from 'axios'
import { buildStorage } from 'axios-cache-interceptor'

const SCRAPBOX_API_URL = 'https://scrapbox.io/api'

export const client = axios.create({
  baseURL: SCRAPBOX_API_URL,
})

export function createStorage(dir: string) {
  return buildStorage({
    async find(key) {
      const data = await readFile(`${dir}/${key}`, 'utf8')
      if (!data)
        return
      return JSON.parse(data)
    },
    async set(key, value) {
      await mkdir(dir, { recursive: true })
      await writeFile(`${dir}/${key}`, JSON.stringify(value))
    },
    async remove(key) {
      try {
        await unlink(`${dir}/${key}`)
      }
      catch (error) {
        console.error(`Error removing file ${key}:`, error)
      }
    },
  })
}
