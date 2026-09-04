import axios from "axios";
import { getItem, StorageKeys } from "../utils/storage";

// Default backend API URL (Local development backend)
export const API_BASE_URL = "http://localhost:5000";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json"
    }
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await getItem(StorageKeys.AUTH_TOKEN);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (err) {
            console.warn("Failed to retrieve auth token for request:", err);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Format error
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            return Promise.reject({
                status: error.response.status,
                message: error.response.data?.message || "Terjadi kesalahan pada server",
                data: error.response.data
            });
        }
        if (error.request) {
            return Promise.reject({
                status: 0,
                message: "Koneksi terputus atau server tidak merespons (Offline Mode Aktif)",
                isOffline: true
            });
        }
        return Promise.reject({
            status: -1,
            message: error.message
        });
    }
);

// ==========================================
// API CLIENT METHODS
// ==========================================

export const authAPI = {
    login: (email, password) => api.post("/api/auth/login", { email, password }),
    getMe: () => api.get("/api/auth/me")
};

export const wasteAPI = {
    submit: (formData) => api.post("/api/waste/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }),
    getPending: (params = {}) => api.get("/api/waste/pending", { params }),
    verify: (id, status) => api.put(`/api/waste/verify/${id}`, { status }),
    getHistory: (userId) => api.get("/api/waste/history", { params: { user_id: userId } })
};

export const mobileAPI = {
    registerDevice: (device_token, platform = "android") => 
        api.post("/api/mobile/device/register", { device_token, platform }),
    
    logLocation: (latitude, longitude, activity = "field_activity") => 
        api.post("/api/mobile/location", { latitude, longitude, activity }),
    
    sync: (queue = []) => api.post("/api/mobile/sync", { queue }),
    
    getDashboard: () => api.get("/api/mobile/dashboard"),
    
    getPickups: () => api.get("/api/mobile/pickups"),
    
    updatePickupStatus: (id, status, photo_url = null) => 
        api.put(`/api/mobile/pickups/${id}/status`, { status, photo_url })
};

export const notificationAPI = {
    getAll: () => api.get("/api/notification")
};

export default api;
