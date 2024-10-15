import { createAuth0Client } from "@auth0/auth0-spa-js";
import axios from "axios";

const auth0 = await createAuth0Client({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENTID,
    authorizationParams: {
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE
    }
});

const client = axios.create({
    baseURL: import.meta.env.VITE_API_HOST
});

async function getAuthHeaders() {
    const token = await auth0.getTokenSilently();
    return {
        Authorization: `Bearer ${token}`
    };
}

async function get<T = any>(url: string) {
    const headers = await getAuthHeaders();
    const res = await client.get(url, { headers });
    return res.data as T;
}

async function post<T = any>(url: string, body: T) {
    const res = await client.post(url, body);
    return res.data;
}

async function put<T = any>(url: string, body: T) {
    const res = await client.put(url, body);
    return res.data;
}

async function del(url: string) {
    const res = await client.delete(url);
    return res.data;
}

const httpService = {
    get,
    post,
    put,
    del,
};

export default httpService;