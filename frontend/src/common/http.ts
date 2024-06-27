import { Auth0Client } from "@auth0/auth0-spa-js"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

class TokenManager {
  private token: string | null = null;

  constructor() {
  }

  public setToken(token: string) {
    this.token = token
  }

  public getToken(): string | null {
    return this.token
  }

  public isInvalid(): boolean {
    return !this.token
  }
}

const tokenManager = new TokenManager()

const createBearerToken = async () => {
  const auth0 = new Auth0Client({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENTID
  })

  if (tokenManager.isInvalid()) {
    const token = await auth0.getTokenSilently()
    tokenManager.setToken(token)
  }

  try {
    return `Bearer ${tokenManager.getToken()}`
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
