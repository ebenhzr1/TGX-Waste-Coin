const marketplaceService = require("../services/marketplaceService");

/**
 * 1. Mengambil katalog produk marketplace
 * GET /api/marketplace/items
 */
const getItems = async (req, res) => {
    try {
        const items = await marketplaceService.getMarketplaceItems();
        return res.status(200).json(items);
    } catch (error) {
        console.error("Error in getItems controller:", error);
        return res.status(500).json({
            message: "Gagal memuat katalog marketplace",
            error: error.message
        });
    }
};

/**
 * 2. Siswa menukarkan koin TGX dengan reward
 * POST /api/marketplace/redeem/:id
 * Body: { pickup_point: "Kantor JET" }
 */
const redeem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const userId = req.user?.id || req.body?.user_id || 1;
        const pickupPoint = req.body?.pickup_point || "Kantor JET Trenggalek";

        if (!itemId) {
            return res.status(400).json({ message: "ID item reward wajib diisi" });
        }

        const result = await marketplaceService.redeemItem(userId, itemId, pickupPoint);

        return res.status(201).json({
            message: result.message,
            data: result
        });
    } catch (error) {
        console.error("Error in redeem controller:", error);
        return res.status(400).json({
            message: error.message || "Gagal melakukan penukaran reward"
        });
    }
};

/**
 * 3. Mengambil riwayat reward milik user saat ini
 * GET /api/marketplace/my-rewards
 */
const myRewards = async (req, res) => {
    try {
        const userId = req.user?.id || 1;
        const rewards = await marketplaceService.getMyRewards(userId);
        return res.status(200).json(rewards);
    } catch (error) {
        console.error("Error in myRewards controller:", error);
        return res.status(500).json({
            message: "Gagal memuat riwayat reward",
            error: error.message
        });
    }
};

/**
 * 4. Operator / Admin mengubah status pesanan reward
 * PUT /api/marketplace/orders/:id/status
 * Body: { status: "ready_pickup" | "completed" | "approved" | "cancelled" }
 */
const updateStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status pesanan wajib disertakan" });
        }

        const updatedOrder = await marketplaceService.updateOrderStatus(orderId, status);

        return res.status(200).json({
            message: `Status pesanan #${orderId} berhasil diubah menjadi '${status}'`,
            data: updatedOrder
        });
    } catch (error) {
        console.error("Error in updateStatus controller:", error);
        return res.status(400).json({
            message: error.message || "Gagal memperbarui status pesanan"
        });
    }
};

/**
 * 5. Mengambil seluruh pesanan penukaran reward (Admin / Operator)
 * GET /api/marketplace/orders
 */
const getAllOrders = async (req, res) => {
    try {
        const orders = await marketplaceService.getAllOrders();
        return res.status(200).json(orders);
    } catch (error) {
        console.error("Error in getAllOrders controller:", error);
        return res.status(500).json({
            message: "Gagal memuat daftar pesanan",
            error: error.message
        });
    }
};

/**
 * 6. Admin menambah item reward baru
 * POST /api/marketplace/items
 */
const createItem = async (req, res) => {
    try {
        const { name, category, point_cost, stock, description, image_url } = req.body;

        if (!name || point_cost === undefined) {
            return res.status(400).json({ message: "Nama dan harga koin wajib diisi" });
        }

        const newItem = await marketplaceService.createItem({
            name,
            category,
            point_cost,
            stock,
            description,
            image_url
        });

        return res.status(201).json({
            message: "Item reward berhasil ditambahkan ke marketplace",
            data: newItem
        });
    } catch (error) {
        console.error("Error in createItem controller:", error);
        return res.status(500).json({
            message: "Gagal menambahkan item",
            error: error.message
        });
    }
};

/**
 * 7. Admin mengupdate item reward (harga, stok, aktif/nonaktif)
 * PUT /api/marketplace/items/:id
 */
const updateItem = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedItem = await marketplaceService.updateItem(id, req.body);

        return res.status(200).json({
            message: `Item #${id} berhasil diperbarui`,
            data: updatedItem
        });
    } catch (error) {
        console.error("Error in updateItem controller:", error);
        return res.status(400).json({
            message: error.message || "Gagal memperbarui item"
        });
    }
};

module.exports = {
    getItems,
    redeem,
    myRewards,
    updateStatus,
    getAllOrders,
    createItem,
    updateItem
};
