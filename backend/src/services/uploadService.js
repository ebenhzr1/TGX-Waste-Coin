const pool = require("../config/database");

/**
 * Menyimpan tautan foto setoran sampah ke database
 * @param {number} transactionId ID transaksi setoran sampah
 * @param {string} imageUrl URL / path relatif foto sampah yang diunggah
 */
const saveImage = async (transactionId, imageUrl) => {
    try {
        const result = await pool.query(
            `
            INSERT INTO waste_images
            (transaction_id, image_url)
            VALUES($1, $2)
            RETURNING *
            `,
            [transactionId, imageUrl]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error in uploadService.saveImage:", error);
        throw error;
    }
};

/**
 * Mengambil foto berdasarkan ID transaksi
 * @param {number} transactionId
 */
const getImageByTransactionId = async (transactionId) => {
    try {
        const result = await pool.query(
            "SELECT * FROM waste_images WHERE transaction_id = $1 ORDER BY created_at DESC LIMIT 1",
            [transactionId]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error("Error in uploadService.getImageByTransactionId:", error);
        throw error;
    }
};

module.exports = {
    saveImage,
    getImageByTransactionId
};
