import axios from 'axios'
import { setupCache } from 'axios-cache-interceptor'

const SCRAPBOX_API_URL = 'https://scrapbox.io/api'

const instance = axios.create({
  baseURL: SCRAPBOX_API_URL,
})

export const client = setupCache(instance)
