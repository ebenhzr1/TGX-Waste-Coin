const express = require("express");
const router = express.Router();

const {
    submit,
    getPending,
    verify,
    getHistory
} = require("../controllers/wasteController");

const { authenticate, checkRole, checkPermission } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// POST /api/waste/submit (Siswa / User Login - Setor Sampah + Foto)
router.post("/submit", authenticate, upload.single("image"), submit);

// GET /api/waste/pending (Admin JET & Sekolah - Antrean Setoran Pending)
router.get("/pending", authenticate, checkRole("admin", "super_admin", "admin_operasional", "school", "operator_sekolah"), getPending);

// PUT /api/waste/verify/:id (Admin Operasional & Verifikator - Approve / Reject Setoran)
router.put("/verify/:id", authenticate, checkPermission("approve_transaction"), verify);

// GET /api/waste/history (Riwayat Setoran Sampah)
router.get("/history", getHistory);

module.exports = router;
