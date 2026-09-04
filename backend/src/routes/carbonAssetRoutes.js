const express = require("express");
const router = express.Router();
const carbonAssetController = require("../controllers/carbonAssetController");
const authenticate = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/authMiddleware");

// 1. Ambil Carbon Inventory & Potensi Aset Karbon
router.get(
    "/inventory",
    authenticate,
    checkPermission("view_carbon_asset"),
    carbonAssetController.getCarbonInventory
);

// 2. Buat Carbon Project Baru (Super Admin & Admin Karbon)
router.post(
    "/project",
    authenticate,
    checkPermission("manage_carbon_project"),
    carbonAssetController.createProject
);

// 3. Ambil Daftar Carbon Projects
router.get(
    "/projects",
    authenticate,
    checkPermission("view_carbon_asset"),
    carbonAssetController.getProjects
);

// 4. Buat Transaksi Carbon Offset & Terbitkan Sertifikat (Admin Karbon & Super Admin)
router.post(
    "/offset",
    authenticate,
    checkPermission("create_offset"),
    carbonAssetController.createOffset
);

// 5. Ambil Riwayat Offset
router.get(
    "/offsets",
    authenticate,
    checkPermission("view_carbon_asset"),
    carbonAssetController.getOffsets
);

// 6. Ambil Sertifikat Karbon Spesifik berdasarkan ID atau Kode Sertifikat
router.get(
    "/certificate/:id",
    authenticate,
    checkPermission("view_carbon_asset"),
    carbonAssetController.getCertificate
);

// 7. Ambil Seluruh Daftar Sertifikat
router.get(
    "/certificates",
    authenticate,
    checkPermission("view_carbon_asset"),
    carbonAssetController.getCertificates
);

module.exports = router;
