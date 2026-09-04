import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.PROD ? "" : "http://localhost:5000");

const api = axios.create({
    baseURL: `${API_BASE}/api`
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") || localStorage.getItem("tgx_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
