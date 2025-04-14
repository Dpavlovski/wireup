import axios from "axios";


export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://dimiserver.duckdns.org:8101/api',
    headers: {
        'Content-Type': 'application/json',
    },
    maxRedirects: 0
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});