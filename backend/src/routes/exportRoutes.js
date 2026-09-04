const express = require("express");
const router = express.Router();

const {
    exportWasteCSV,
    exportReceiptPDF
} = require("../controllers/exportController");

const { authenticate, checkRole } = require("../middleware/authMiddleware");

// GET /api/export/waste (Laporan Sampah CSV - Admin JET & Sekolah)
router.get("/waste", exportWasteCSV);

// GET /api/export/receipt/:id (Bukti Setor Sampah PDF)
router.get("/receipt/:id", exportReceiptPDF);

module.exports = router;
