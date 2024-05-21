import axios from "axios"

const client = axios.create({
    baseURL: import.meta.env.VITE_API_HOST
})

async function get<T = any>(url: string) {
    const res = await client.get(url)
    return res.data as T
}

async function post<T = any>(url: string, body: T) {
    const res = await client.post(url, body)
    return res.data
}

async function put<T = any>(url: string, body: T) {
    const res = await client.put(url, body)
    return res.data
}

async function del(url: string) {
    const res = await client.delete(url)
    return res.data
}

const httpClient = {
    get,
    post,
    put,
    del,
}

export default httpClient