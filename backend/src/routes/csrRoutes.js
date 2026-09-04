const express = require("express");
const router = express.Router();
const csrController = require("../controllers/csrController");
const authenticate = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/authMiddleware");

// 1. Ambil Semua Mitra CSR
router.get(
    "/partners",
    authenticate,
    checkPermission("view_csr_campaign"),
    csrController.getPartners
);

// 2. Daftarkan Mitra CSR Baru (Admin CSR & Super Admin)
router.post(
    "/partners",
    authenticate,
    checkPermission("manage_partner"),
    csrController.createPartner
);

// 3. Buat Program CSR Campaign Baru (Admin CSR & Super Admin)
router.post(
    "/campaigns",
    authenticate,
    checkPermission("manage_csr_campaign"),
    csrController.createCampaign
);

// 4. Ambil Daftar Semua Program CSR
router.get(
    "/campaigns",
    authenticate,
    checkPermission("view_csr_campaign"),
    csrController.getCampaigns
);

// 5. Ambil Kalkulasi Dampak Realtime CSR Campaign
router.get(
    "/campaigns/:id/impact",
    authenticate,
    checkPermission("view_impact_report"),
    csrController.getCampaignImpact
);

// 6. Ambil Laporan Dampak Komprehensif CSR (ESG Integrated)
router.get(
    "/report/:id",
    authenticate,
    checkPermission("view_impact_report"),
    csrController.getCSRReport
);

// 7. Sponsor Reward Marketplace via Dana CSR
router.post(
    "/campaigns/:id/sponsor-reward",
    authenticate,
    checkPermission("manage_csr_campaign"),
    csrController.sponsorReward
);

module.exports = router;
