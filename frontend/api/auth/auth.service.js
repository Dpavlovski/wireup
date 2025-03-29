import {api} from "../api";


const AuthService = {
    register: async (username, password) => {
        const response = await api.post(`/auth/register`, {username, password}, {withCredentials: true});
        return response.data;
    },

    login: async (username, password) => {
        const response = await api.post(`/auth/login`, {username, password}, {withCredentials: true});
        return response.data;
    },

    logout: async () => {
        await api.post(`/auth/logout`, {}, {withCredentials: true});
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