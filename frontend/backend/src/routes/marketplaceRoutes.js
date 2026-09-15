const express = require("express");
const router = express.Router();
const marketplaceController = require("../controllers/marketplaceController");
const authenticate = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/authMiddleware");

// 1. Katalog Produk Marketplace (Siswa, Operator, Admin dapat melihat)
router.get(
    "/items",
    authenticate,
    checkPermission("view_marketplace"),
    marketplaceController.getItems
);

// 2. Tukar Reward dengan Koin TGX (Khusus Siswa)
router.post(
    "/redeem/:id",
    authenticate,
    checkPermission("redeem_reward"),
    marketplaceController.redeem
);

// 3. Riwayat Reward Pengguna (Authed User)
router.get(
    "/my-rewards",
    authenticate,
    marketplaceController.myRewards
);

// 4. Update Status Pesanan/Klaim (Operator Sekolah & Admin Operasional / Super Admin)
router.put(
    "/orders/:id/status",
    authenticate,
    checkPermission("approve_reward"),
    marketplaceController.updateStatus
);

// 5. Ambil Seluruh Pesanan Reward (Operator Sekolah & Admin Operasional / Super Admin)
router.get(
    "/orders",
    authenticate,
    checkPermission("approve_reward"),
    marketplaceController.getAllOrders
);

// 6. Kelola Produk Reward: Tambah Item (Admin Operasional / Super Admin)
router.post(
    "/items",
    authenticate,
    checkPermission("manage_reward"),
    marketplaceController.createItem
);

// 7. Kelola Produk Reward: Edit Item (Admin Operasional / Super Admin)
router.put(
    "/items/:id",
    authenticate,
    checkPermission("manage_reward"),
    marketplaceController.updateItem
);

module.exports = router;
