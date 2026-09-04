const pool = require("../config/database");
const { sendNotification } = require("./notificationService");

// In-memory fallback dataset jika PostgreSQL offline
let memoryItems = [
    {
        id: 1,
        name: "Bibit Pohon Jwalita For Earth",
        category: "environment",
        point_cost: 100.0,
        stock: 100,
        description: "Bibit pohon sengon & mahoni untuk program penghijauan dan reboisasi di Trenggalek.",
        image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=80",
        is_active: true,
        created_at: new Date()
    },
    {
        id: 2,
        name: "Tas Sekolah TGX",
        category: "education",
        point_cost: 500.0,
        stock: 50,
        description: "Tas ransel sekolah eksklusif berbahan rPET daur ulang plastik berkualitas tinggi.",
        image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
        is_active: true,
        created_at: new Date()
    },
    {
        id: 3,
        name: "Voucher UMKM Hijau",
        category: "voucher",
        point_cost: 1000.0,
        stock: 25,
        description: "Voucher belanja Rp 50.000 di merchant UMKM mitra ramah lingkungan Trenggalek.",
        image_url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=80",
        is_active: true,
        created_at: new Date()
    },
    {
        id: 4,
        name: "Tumbler Ramah Lingkungan JET",
        category: "eco_product",
        point_cost: 250.0,
        stock: 40,
        description: "Tumbler stainless steel insulasi ganda untuk mengurangi sampah botol plastik sekali pakai.",
        image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80",
        is_active: true,
        created_at: new Date()
    },
    {
        id: 5,
        name: "Paket Alat Tulis Daur Ulang",
        category: "education",
        point_cost: 150.0,
        stock: 80,
        description: "Buku tulis dari kertas daur ulang dan pensil ramah lingkungan.",
        image_url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80",
        is_active: true,
        created_at: new Date()
    }
];

let memoryRedemptions = [
    {
        id: 1,
        user_id: 1,
        user_name: "Ahmad Santoso",
        school_name: "SDN 2 Bendorejo",
        item_id: 1,
        item_name: "Bibit Pohon Jwalita For Earth",
        category: "environment",
        coin_spent: 100.0,
        claim_code: "TGX-2026-00001",
        status: "ready_pickup",
        pickup_point: "Kantor JET Trenggalek",
        created_at: "2026-09-03 10:00:00"
    }
];

let memoryWallets = {
    1: { balance: 250.0 },
    7: { balance: 500.0 }
};

let memoryWalletTransactions = [];
let memoryNotifications = [];

/**
 * 1. Mengambil item katalog marketplace yang aktif
 */
const getMarketplaceItems = async () => {
    try {
        const res = await pool.query(
            `
            SELECT id, name, description, category, point_cost, stock, image_url, is_active, created_at
            FROM marketplace_items
            WHERE is_active = TRUE
            ORDER BY point_cost ASC
            `
        );
        if (res.rows.length > 0) {
            return res.rows;
        }
        return memoryItems.filter(i => i.is_active);
    } catch (err) {
        console.warn("DB offline, getMarketplaceItems menggunakan memory fallback:", err.message);
        return memoryItems.filter(i => i.is_active);
    }
};

/**
 * 2. Menukarkan Koin TGX dengan Reward (ATOMIC TRANSACTION)
 * Flow: Check stock -> Check balance -> BEGIN -> Kurangi wallet balance -> Catat wallet_transactions (redeem, negative) -> Kurangi stok item -> Insert reward_redemptions -> Kirim Notifikasi -> COMMIT
 */
const redeemItem = async (userId, itemId, pickupPoint = "Kantor JET") => {
    let client;
    let dbConnected = false;

    try {
        client = await pool.connect();
        dbConnected = true;
    } catch (connErr) {
        console.warn("DB offline, redeemItem menggunakan atomic in-memory fallback:", connErr.message);
    }

    if (dbConnected) {
        try {
            await client.query("BEGIN");

            // 1. Ambil & Kunci Item Reward (FOR UPDATE)
            const itemRes = await client.query(
                "SELECT * FROM marketplace_items WHERE id = $1 FOR UPDATE",
                [itemId]
            );

            if (itemRes.rows.length === 0) {
                throw new Error("Item reward tidak ditemukan");
            }

            const item = itemRes.rows[0];

            if (!item.is_active) {
                throw new Error("Item reward saat ini sedang tidak aktif");
            }

            if (item.stock <= 0) {
                throw new Error(`Stok item '${item.name}' sudah habis`);
            }

            const pointCost = parseFloat(item.point_cost);

            // 2. Ambil & Kunci Wallet Pengguna (FOR UPDATE)
            const walletRes = await client.query(
                "SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE",
                [userId]
            );

            const currentBalance = walletRes.rows.length > 0 ? parseFloat(walletRes.rows[0].balance) : 0;

            if (currentBalance < pointCost) {
                throw new Error(`Saldo TGX Coin tidak mencukupi (Saldo: ${currentBalance} TGX, Dibutuhkan: ${pointCost} TGX)`);
            }

            // 3. Kurangi Saldo Wallet
            const updatedWalletRes = await client.query(
                `
                UPDATE wallets 
                SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = $2
                RETURNING balance
                `,
                [pointCost, userId]
            );

            // 4. Kurangi Stok Item
            await client.query(
                "UPDATE marketplace_items SET stock = stock - 1 WHERE id = $1",
                [itemId]
            );

            // 5. Generate Unik Claim Code (cth: TGX-2026-XXXXX)
            const randomCode = Math.floor(10000 + Math.random() * 90000);
            const claimCode = `TGX-2026-${randomCode}`;

            // 6. Buat Rekaman Penebusan (reward_redemptions)
            const redemptionRes = await client.query(
                `
                INSERT INTO reward_redemptions
                (user_id, item_id, coin_spent, claim_code, status, pickup_point)
                VALUES ($1, $2, $3, $4, 'requested', $5)
                RETURNING *
                `,
                [userId, itemId, pointCost, claimCode, pickupPoint]
            );

            const redemption = redemptionRes.rows[0];

            // 7. Catat Mutasi Koin Keluar di wallet_transactions (Audit Trail)
            const negativeAmount = -Math.abs(pointCost);
            const txRes = await client.query(
                `
                INSERT INTO wallet_transactions
                (user_id, transaction_type, amount, description, reference_id)
                VALUES ($1, 'redeem', $2, $3, $4)
                RETURNING *
                `,
                [userId, negativeAmount, `Redeem: ${item.name}`, redemption.id]
            );

            // 8. Buat Notifikasi ke Pengguna
            const notifTitle = "Reward Berhasil Ditukar";
            const notifMessage = `Anda menukar:\n${item.name}\n${pointCost} TGX\nClaim Code: ${claimCode}`;

            await client.query(
                `
                INSERT INTO notifications (user_id, title, message)
                VALUES ($1, $2, $3)
                `,
                [userId, notifTitle, notifMessage]
            );

            await client.query("COMMIT");

            return {
                success: true,
                message: `Berhasil menukar reward '${item.name}'`,
                item: {
                    id: item.id,
                    name: item.name,
                    point_cost: pointCost
                },
                redemption: {
                    id: redemption.id,
                    claim_code: claimCode,
                    status: redemption.status,
                    pickup_point: redemption.pickup_point,
                    created_at: redemption.created_at
                },
                wallet: {
                    previous_balance: currentBalance,
                    current_balance: parseFloat(updatedWalletRes.rows[0].balance),
                    coin_spent: pointCost
                },
                transaction: txRes.rows[0]
            };

        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Error in atomic redeemItem (rolled back):", error);
            throw error;
        } finally {
            client.release();
        }
    }

    // ==========================================
    // IN-MEMORY FALLBACK (ATOMIC SIMULATION)
    // ==========================================
    const itemIndex = memoryItems.findIndex(i => i.id === parseInt(itemId));
    if (itemIndex === -1) {
        throw new Error("Item reward tidak ditemukan");
    }

    const item = memoryItems[itemIndex];
    if (!item.is_active) {
        throw new Error("Item reward saat ini sedang tidak aktif");
    }

    if (item.stock <= 0) {
        throw new Error(`Stok item '${item.name}' sudah habis`);
    }

    const pointCost = parseFloat(item.point_cost);

    if (!memoryWallets[userId]) {
        memoryWallets[userId] = { balance: 500.0 }; // Default initial balance
    }

    const currentBalance = memoryWallets[userId].balance;
    if (currentBalance < pointCost) {
        throw new Error(`Saldo TGX Coin tidak mencukupi (Saldo: ${currentBalance} TGX, Dibutuhkan: ${pointCost} TGX)`);
    }

    // 1. Kurangi Saldo Wallet
    memoryWallets[userId].balance -= pointCost;

    // 2. Kurangi Stok Item
    item.stock -= 1;

    // 3. Generate Kode Klaim
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const claimCode = `TGX-2026-${randomCode}`;

    // 4. Catat Redemption
    const newRedemption = {
        id: memoryRedemptions.length + 1,
        user_id: userId,
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        coin_spent: pointCost,
        claim_code: claimCode,
        status: "requested",
        pickup_point: pickupPoint || "Kantor JET",
        created_at: new Date().toISOString()
    };
    memoryRedemptions.unshift(newRedemption);

    // 5. Catat Mutasi wallet_transactions
    const negativeAmount = -Math.abs(pointCost);
    const newTx = {
        id: memoryWalletTransactions.length + 1,
        user_id: userId,
        transaction_type: "redeem",
        amount: negativeAmount,
        description: `Redeem: ${item.name}`,
        reference_id: newRedemption.id,
        created_at: new Date().toISOString()
    };
    memoryWalletTransactions.unshift(newTx);

    // 6. Catat Notifikasi
    const notifTitle = "Reward Berhasil Ditukar";
    const notifMessage = `Anda menukar:\n${item.name}\n${pointCost} TGX\nClaim Code: ${claimCode}`;
    await sendNotification(userId, notifTitle, notifMessage);

    return {
        success: true,
        message: `Berhasil menukar reward '${item.name}'`,
        item: {
            id: item.id,
            name: item.name,
            point_cost: pointCost
        },
        redemption: newRedemption,
        wallet: {
            previous_balance: currentBalance,
            current_balance: memoryWallets[userId].balance,
            coin_spent: pointCost
        },
        transaction: newTx
    };
};

/**
 * 3. Mengambil riwayat penukaran reward milik user saat ini
 */
const getMyRewards = async (userId) => {
    try {
        const res = await pool.query(
            `
            SELECT 
                r.id, r.user_id, r.item_id, r.coin_spent, r.claim_code, 
                r.status, r.pickup_point, r.created_at,
                m.name AS item_name, m.category, m.image_url, m.description
            FROM reward_redemptions r
            LEFT JOIN marketplace_items m ON r.item_id = m.id
            WHERE r.user_id = $1
            ORDER BY r.created_at DESC
            `,
            [userId]
        );
        if (res.rows.length > 0) {
            return res.rows;
        }
        return memoryRedemptions.filter(r => r.user_id === parseInt(userId));
    } catch (err) {
        console.warn("DB offline, getMyRewards fallback aktif:", err.message);
        return memoryRedemptions.filter(r => r.user_id === parseInt(userId));
    }
};

/**
 * 4. Mengambil seluruh pesanan/penukaran untuk Admin & Operator Sekolah
 */
const getAllOrders = async () => {
    try {
        const res = await pool.query(
            `
            SELECT 
                r.id, r.user_id, r.item_id, r.coin_spent, r.claim_code, 
                r.status, r.pickup_point, r.created_at,
                u.name AS user_name, u.email AS user_email,
                s.school_name,
                m.name AS item_name, m.category, m.image_url
            FROM reward_redemptions r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN schools s ON u.school_id = s.id
            LEFT JOIN marketplace_items m ON r.item_id = m.id
            ORDER BY r.created_at DESC
            `
        );
        if (res.rows.length > 0) {
            return res.rows;
        }
        return memoryRedemptions;
    } catch (err) {
        console.warn("DB offline, getAllOrders fallback aktif:", err.message);
        return memoryRedemptions;
    }
};

/**
 * 5. Memperbarui status penukaran reward (Operator/Admin)
 * status: requested -> approved -> ready_pickup -> completed / cancelled
 */
const updateOrderStatus = async (orderId, status) => {
    const validStatuses = ["requested", "approved", "ready_pickup", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
        throw new Error(`Status tidak valid. Harus salah satu dari: ${validStatuses.join(", ")}`);
    }

    try {
        const res = await pool.query(
            `
            UPDATE reward_redemptions
            SET status = $1
            WHERE id = $2
            RETURNING *
            `,
            [status, orderId]
        );
        if (res.rows.length > 0) {
            return res.rows[0];
        }
    } catch (err) {
        console.warn("DB offline, updateOrderStatus fallback aktif:", err.message);
    }

    const order = memoryRedemptions.find(o => o.id === parseInt(orderId));
    if (!order) {
        throw new Error("Pesanan reward tidak ditemukan");
    }
    order.status = status;
    return order;
};

/**
 * 6. Admin mengelola produk: Tambah Item
 */
const createItem = async (data) => {
    const { name, category, point_cost, stock, description, image_url } = data;
    try {
        const res = await pool.query(
            `
            INSERT INTO marketplace_items (name, category, point_cost, stock, description, image_url)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [name, category, point_cost, stock, description, image_url]
        );
        if (res.rows.length > 0) {
            return res.rows[0];
        }
    } catch (err) {
        console.warn("DB offline, createItem fallback aktif:", err.message);
    }

    const newItem = {
        id: memoryItems.length + 1,
        name,
        category: category || "eco_product",
        point_cost: parseFloat(point_cost),
        stock: parseInt(stock) || 0,
        description: description || "",
        image_url: image_url || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500",
        is_active: true,
        created_at: new Date()
    };
    memoryItems.push(newItem);
    return newItem;
};

/**
 * 7. Admin mengelola produk: Update Item (harga, stok, status aktif)
 */
const updateItem = async (id, data) => {
    const { name, category, point_cost, stock, description, image_url, is_active } = data;
    try {
        const res = await pool.query(
            `
            UPDATE marketplace_items
            SET 
                name = COALESCE($1, name),
                category = COALESCE($2, category),
                point_cost = COALESCE($3, point_cost),
                stock = COALESCE($4, stock),
                description = COALESCE($5, description),
                image_url = COALESCE($6, image_url),
                is_active = COALESCE($7, is_active)
            WHERE id = $8
            RETURNING *
            `,
            [name, category, point_cost, stock, description, image_url, is_active, id]
        );
        if (res.rows.length > 0) {
            return res.rows[0];
        }
    } catch (err) {
        console.warn("DB offline, updateItem fallback aktif:", err.message);
    }

    const item = memoryItems.find(i => i.id === parseInt(id));
    if (!item) {
        throw new Error("Item tidak ditemukan");
    }
    if (name !== undefined) item.name = name;
    if (category !== undefined) item.category = category;
    if (point_cost !== undefined) item.point_cost = parseFloat(point_cost);
    if (stock !== undefined) item.stock = parseInt(stock);
    if (description !== undefined) item.description = description;
    if (image_url !== undefined) item.image_url = image_url;
    if (is_active !== undefined) item.is_active = is_active;

    return item;
};

// Helper getter untuk testing
const _getMemoryState = () => ({
    items: memoryItems,
    redemptions: memoryRedemptions,
    wallets: memoryWallets,
    transactions: memoryWalletTransactions,
    notifications: memoryNotifications
});

module.exports = {
    getMarketplaceItems,
    redeemItem,
    getMyRewards,
    getAllOrders,
    updateOrderStatus,
    createItem,
    updateItem,
    _getMemoryState
};
