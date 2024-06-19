import { Auth0Client } from "@auth0/auth0-spa-js"
import axios from "axios"

const createBearerToken = async () => {
  const auth0 = new Auth0Client({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENTID
  })

  const token = await auth0.getTokenSilently()

  try {
    return `Bearer ${token}`
  } catch (err) {
    return ""
  }
}

const createAxiosClient = async () => {
  const bearerToken = await createBearerToken()
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    headers: {
      Authorization: bearerToken,
    },
  })
  return client
}

async function get<T = any>(url: string) {
  const client = await createAxiosClient()
  const res = await client.get(url)
  return res.data as T
}

async function post<T = any>(url: string, body: T) {
  const client = await createAxiosClient()
  const res = await client.post(url, body)
  return res.data
}

async function put<T = any>(url: string, body: T) {
  const client = await createAxiosClient()
  const res = await client.put(url, body)
  return res.data
}

async function del(url: string) {
  const client = await createAxiosClient()
  const res = await client.delete(url)
  return res.data
}

const httpService = {
  get,
  post,
  put,
  del,
}

export default httpService
