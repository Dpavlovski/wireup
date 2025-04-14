import {api} from "../api";


const AuthService = {
    register: async (username, password) => {
        const response = await api.post(`/auth/register`, {username, password}, {withCredentials: true});
        return response.data;
    },

    login: async (username, password) => {
        const response = await api.post(`/auth/login`, {username, password}, {withCredentials: true});
        localStorage.setItem('auth_token', response.data.access_token);
        return response.data;
    },

    logout: async () => {
        localStorage.removeItem('auth_token');
    },

    fetchUser: async () => {
        try {
            const response = await api.get(`/auth/me`, {withCredentials: true});
            return response.data;
        } catch (error) {
            return null;
        }
    }
}

export default AuthService;