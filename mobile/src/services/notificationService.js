/**
 * Push Notification Service
 * Sprint 23: Event-Driven Mobile Notifications
 * Events: 1. Coin masuk, 2. Badge didapat, 3. Reward siap diambil, 4. CSR campaign baru
 */
import { mobileAPI } from "../api/api";
import { setItem, getItem, StorageKeys } from "../utils/storage";

let Notifications;
try {
    Notifications = require("expo-notifications");
} catch (e) {
    Notifications = null;
}

// In-app mock notification history if native push is not connected
const localNotifications = [];

/**
 * Daftarkan device token ke backend
 */
export const registerForPushNotifications = async () => {
    let token = "expo_token_mock_" + Math.random().toString(36).substring(7);

    try {
        if (Notifications && Notifications.getPermissionsAsync) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus === "granted" && Notifications.getExpoPushTokenAsync) {
                const pushToken = await Notifications.getExpoPushTokenAsync();
                token = pushToken.data;
            }
        }
    } catch (err) {
        console.warn("Could not get native push token, using fallback token:", err.message);
    }

    await setItem(StorageKeys.DEVICE_TOKEN, token);

    // Kirim ke backend
    try {
        await mobileAPI.registerDevice(token, "android");
    } catch (apiErr) {
        console.warn("Backend device registration warning:", apiErr.message);
    }

    return token;
};

/**
 * Trigger Notifikasi Berdasarkan Event Sistem
 * @param {'coin_received' | 'badge_earned' | 'reward_ready' | 'csr_campaign'} eventType
 * @param {Object} data
 */
export const triggerMobileNotification = async (eventType, data = {}) => {
    let title = "Notifikasi TGX Waste Coin";
    let body = "Anda memiliki pembaruan aktivitas baru.";

    switch (eventType) {
        case "coin_received":
            title = "🎉 Koin TGX Masuk!";
            body = `Setoran sampah berhasil diverifikasi! Saldo +${data.amount || 50} TGX Coin telah masuk ke dompet Anda.`;
            break;
        case "badge_earned":
            title = "🏆 Lencana Baru Diraih!";
            body = `Selamat! Anda berhasil membuka lencana '${data.badge_name || "Pahlawan Sampah Plastik"}'.`;
            break;
        case "reward_ready":
            title = "🎁 Reward Siap Diambil!";
            body = `Penukaran reward '${data.reward_name || "Bibit Pohon Trembesi"}' telah disetujui dan siap diambil di Pos Sekolah.`;
            break;
        case "csr_campaign":
            title = "🌱 Program CSR Baru Tersedia!";
            body = `Program CSR '${data.campaign_name || "Green School Movement"}' oleh PT ABC telah aktif. Ayo kumpulkan sampah!`;
            break;
        default:
            title = data.title || title;
            body = data.body || body;
    }

    const notificationItem = {
        id: Date.now().toString(),
        type: eventType,
        title,
        body,
        data,
        received_at: new Date().toISOString()
    };

    localNotifications.unshift(notificationItem);

    // Kirim local notification jika expo-notifications tersedia
    try {
        if (Notifications && Notifications.scheduleNotificationAsync) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    data
                },
                trigger: null // Tampilkan segera
            });
        }
    } catch (e) {
        console.warn("Could not schedule local notification:", e.message);
    }

    return notificationItem;
};

export const getNotificationHistory = () => localNotifications;

export default {
    registerForPushNotifications,
    triggerMobileNotification,
    getNotificationHistory
};
