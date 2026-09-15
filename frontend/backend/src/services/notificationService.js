const pool = require("../config/database");

let memoryNotifications = [
    {
        id: 1,
        user_id: 1,
        title: "Selamat Datang di TGX Waste Coin",
        message: "Mulai kumpulkan sampah terpilah dan dapatkan koin TGX!",
        is_read: false,
        created_at: new Date().toISOString()
    }
];

/**
 * Mengirim notifikasi ke pengguna
 */
async function sendNotification(userId, title, message) {
    try {
        const result = await pool.query(
            `
            INSERT INTO notifications
            (user_id, title, message)
            VALUES($1, $2, $3)
            RETURNING *
            `,
            [userId, title, message]
        );
        return result.rows[0];
    } catch (error) {
        console.warn("DB offline, simpan notifikasi ke memory store:", error.message);
        const newNotif = {
            id: memoryNotifications.length + 1,
            user_id: parseInt(userId),
            title,
            message,
            is_read: false,
            created_at: new Date().toISOString()
        };
        memoryNotifications.unshift(newNotif);
        return newNotif;
    }
}

/**
 * Mengambil daftar notifikasi pengguna
 */
async function getUserNotifications(userId) {
    try {
        const result = await pool.query(
            `
            SELECT id, title, message, is_read, created_at
            FROM notifications
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [userId]
        );
        if (result.rows.length > 0) return result.rows;
        return memoryNotifications.filter(n => n.user_id === parseInt(userId));
    } catch (error) {
        console.warn("DB offline, ambil notifikasi dari memory store:", error.message);
        return memoryNotifications.filter(n => n.user_id === parseInt(userId));
    }
}

module.exports = {
    sendNotification,
    createNotification: sendNotification,
    getUserNotifications
};
