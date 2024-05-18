import axios from "axios"

function buildUrl(resource: string) {
    const HOST = import.meta.env.VITE_API_HOST
    return `${HOST}/${resource}`
}

function get<T = any>(resource: string) {
    const url = buildUrl(resource)
    return fetch(url).then(res => res.json()) as T
}

async function post<T = any>(resource: string, body: T) {
    const url = buildUrl(resource)
    const res = await axios.post(url, body)
    return res.data
}

async function put<T = any>(resource: string, body: T) {
    const url = buildUrl(resource)
    const res = await axios.put(url, body)
    return res.data
}

async function del(resource: string) {
    const url = buildUrl(resource)
    const res = await axios.delete(url)
    return res.data
}

const httpClient = {
    get,
    post,
    put,
    del,
}

export default httpClient