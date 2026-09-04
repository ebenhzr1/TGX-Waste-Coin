const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const checkRole = authenticate.checkRole;
const reportController = require("../controllers/reportController");

// Seluruh endpoint laporan ESG & Impact dilindungi otentikasi role admin
router.use(authenticate, checkRole("admin"));

// 1. JSON Data Laporan Impact
// GET /api/report/impact?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get("/impact", reportController.getImpactReport);

// 2. Export Dokumen PDF
// GET /api/report/pdf
router.get("/pdf", reportController.getImpactPdf);

// 3. Export Spreadsheet Excel
// GET /api/report/excel
router.get("/excel", reportController.getImpactExcel);

module.exports = router;
