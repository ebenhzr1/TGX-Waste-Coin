/**
 * Offline Sync Service
 * Sprint 23: Offline Queue & Background Sync
 * Alur: Offline -> Simpan Transaksi Lokal di AsyncStorage -> Online -> Sync Otomatis ke Backend
 */
import { getItem, setItem, StorageKeys } from "../utils/storage";
import { mobileAPI } from "../api/api";

/**
 * Simpan transaksi sampah ke antrean lokal offline
 */
export const queueOfflineTransaction = async (transactionData) => {
    try {
        const queue = (await getItem(StorageKeys.OFFLINE_QUEUE, true)) || [];
        const newItem = {
            local_id: "local_" + Date.now() + "_" + Math.random().toString(36).substring(4),
            ...transactionData,
            queued_at: new Date().toISOString(),
            status: "pending_sync"
        };
        queue.push(newItem);
        await setItem(StorageKeys.OFFLINE_QUEUE, queue);
        return {
            success: true,
            item: newItem,
            queueLength: queue.length
        };
    } catch (error) {
        console.error("queueOfflineTransaction error:", error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Dapatkan daftar transaksi yang sedang mengantre di offline storage
 */
export const getOfflineQueue = async () => {
    try {
        return (await getItem(StorageKeys.OFFLINE_QUEUE, true)) || [];
    } catch (error) {
        return [];
    }
};

/**
 * Hapus antrean offline setelah berhasil disinkronkan
 */
export const clearOfflineQueue = async () => {
    try {
        await setItem(StorageKeys.OFFLINE_QUEUE, []);
    } catch (error) {
        console.warn("clearOfflineQueue error:", error);
    }
};

/**
 * Sinkronisasi antrean offline ke server TGX
 */
export const syncOfflineTransactions = async () => {
    const queue = await getOfflineQueue();
    if (!queue || queue.length === 0) {
        return {
            syncedCount: 0,
            message: "Tidak ada antrean transaksi offline."
        };
    }

    try {
        const response = await mobileAPI.sync(queue);
        // Hapus queue jika server berhasil memproses
        await clearOfflineQueue();
        await setItem(StorageKeys.LAST_SYNC, new Date().toISOString());

        return {
            success: true,
            syncedCount: queue.length,
            result: response.data?.sync
        };
    } catch (error) {
        console.warn("syncOfflineTransactions failed, retaining queue:", error.message);
        return {
            success: false,
            syncedCount: 0,
            error: error.message
        };
    }
};

export default {
    queueOfflineTransaction,
    getOfflineQueue,
    clearOfflineQueue,
    syncOfflineTransactions
};
