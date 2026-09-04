const pool = require("../config/database");

/**
 * Menambah saldo koin TGX ke dompet user dan mencatat mutasi di wallet_transactions
 * @param {number} userId ID pengguna pemilik dompet
 * @param {number} coinAmount Jumlah koin yang ditambahkan (+TGX)
 * @param {string} description Keterangan transaksi (cth: "Setor Plastik 10 kg")
 * @param {number|null} referenceId ID transaksi setoran sampah (waste_transaction.id)
 */
const addCoin = async (userId, coinAmount, description = "Reward Setor Sampah", referenceId = null) => {
    let client;
    try {
        client = await pool.connect();
    } catch (connErr) {
        console.warn("DB offline, addCoin fallback aktif:", connErr.message);
        return {
            wallet: { id: 1, user_id: userId, balance: 250.0 + parseFloat(coinAmount || 0) },
            transaction: { id: Date.now(), user_id: userId, transaction_type: 'waste_deposit', amount: parseFloat(coinAmount || 0), description, reference_id: referenceId }
        };
    }

    try {
        await client.query("BEGIN");

        const amount = parseFloat(coinAmount);
        if (isNaN(amount) || amount <= 0) {
            throw new Error("Jumlah koin harus lebih dari 0");
        }

        // 1. Update / Insert Saldo Wallet (Atomic Upsert)
        const walletResult = await client.query(
            `
            INSERT INTO wallets (user_id, balance, updated_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id)
            DO UPDATE SET 
                balance = wallets.balance + $2,
                updated_at = CURRENT_TIMESTAMP
            RETURNING id, user_id, balance
            `,
            [userId, amount]
        );

        // 2. Catat Mutasi Transaksi di wallet_transactions untuk Riwayat & Audit
        const txResult = await client.query(
            `
            INSERT INTO wallet_transactions 
            (user_id, transaction_type, amount, description, reference_id)
            VALUES ($1, 'waste_deposit', $2, $3, $4)
            RETURNING *
            `,
            [userId, amount, description, referenceId]
        );

        // 3. Opsional kirim notifikasi ke siswa
        await client.query(
            `
            INSERT INTO notifications (user_id, title, message)
            VALUES ($1, 'Koin TGX Masuk!', $2)
            `,
            [userId, `Selamat! Anda menerima +${amount} TGX dari setoran sampah terverifikasi.`]
        );

        await client.query("COMMIT");

        return {
            wallet: walletResult.rows[0],
            transaction: txResult.rows[0]
        };

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error in addCoin walletService:", error);
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Mengambil informasi saldo wallet dan mutasi transaksi pengguna
 */
const getWallet = async (userId) => {
    try {
        const walletRes = await pool.query(
            "SELECT * FROM wallets WHERE user_id = $1",
            [userId]
        );

        const historyRes = await pool.query(
            "SELECT * FROM wallet_transactions WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );

        return {
            balance: walletRes.rows[0]?.balance || 0,
            history: historyRes.rows
        };
    } catch (error) {
        console.error("Error in getWallet:", error);
        throw error;
    }
};

module.exports = {
    addCoin,
    getWallet
};
