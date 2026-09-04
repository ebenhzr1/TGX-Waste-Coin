/**
 * Mobile Safe Storage Utility
 * Uses @react-native-async-storage/async-storage with memory fallback
 */
let AsyncStorage;
try {
    AsyncStorage = require("@react-native-async-storage/async-storage").default || require("@react-native-async-storage/async-storage");
} catch (e) {
    // In-memory fallback for environments without native async-storage
    const memoryStore = {};
    AsyncStorage = {
        getItem: async (key) => memoryStore[key] || null,
        setItem: async (key, value) => { memoryStore[key] = String(value); },
        removeItem: async (key) => { delete memoryStore[key]; },
        clear: async () => {
            Object.keys(memoryStore).forEach(k => delete memoryStore[k]);
        }
    };
}

export const StorageKeys = {
    AUTH_TOKEN: "@tgx_auth_token",
    USER_PROFILE: "@tgx_user_profile",
    OFFLINE_QUEUE: "@tgx_offline_waste_queue",
    DEVICE_TOKEN: "@tgx_device_token",
    LAST_SYNC: "@tgx_last_sync_timestamp"
};

export const setItem = async (key, value) => {
    try {
        const stringValue = typeof value === "string" ? value : JSON.stringify(value);
        await AsyncStorage.setItem(key, stringValue);
    } catch (error) {
        console.warn("Storage setItem error:", error);
    }
};

export const getItem = async (key, isJson = false) => {
    try {
        const val = await AsyncStorage.getItem(key);
        if (!val) return null;
        return isJson ? JSON.parse(val) : val;
    } catch (error) {
        console.warn("Storage getItem error:", error);
        return null;
    }
};

export const removeItem = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.warn("Storage removeItem error:", error);
    }
};

export const clearAll = async () => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.warn("Storage clearAll error:", error);
    }
};

export default {
    StorageKeys,
    setItem,
    getItem,
    removeItem,
    clearAll
};
