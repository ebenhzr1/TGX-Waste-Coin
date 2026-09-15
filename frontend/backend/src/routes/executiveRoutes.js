const express = require("express");
const router = express.Router();
const {
    getOverview,
    getEnvironmental,
    getSocial,
    getEconomic,
    getGovernance,
    getMap,
    getESGScore,
    getPDFReport
} = require("../controllers/executiveController");

const { authenticate, checkPermission } = require("../middleware/authMiddleware");

// Semua endpoint Executive ESG Command Center diproteksi JWT & view_executive_dashboard
router.get("/overview", authenticate, checkPermission("view_executive_dashboard"), getOverview);
router.get("/environmental", authenticate, checkPermission("view_executive_dashboard"), getEnvironmental);
router.get("/social", authenticate, checkPermission("view_executive_dashboard"), getSocial);
router.get("/economic", authenticate, checkPermission("view_executive_dashboard"), getEconomic);
router.get("/governance", authenticate, checkPermission("view_executive_dashboard"), getGovernance);
router.get("/map", authenticate, checkPermission("view_executive_dashboard"), getMap);
router.get("/esg", authenticate, checkPermission("view_executive_dashboard"), getESGScore);
router.get("/report/pdf", authenticate, checkPermission("view_executive_dashboard"), getPDFReport);

module.exports = router;
