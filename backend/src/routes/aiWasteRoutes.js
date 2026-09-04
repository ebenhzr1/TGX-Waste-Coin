const express = require("express");
const router = express.Router();
const {
    analyzeTransaction,
    getAnalysisResult,
    getAIDashboard
} = require("../controllers/aiWasteController");

const { authenticate, checkPermission } = require("../middleware/authMiddleware");

// POST /api/ai/analyze/:transactionId
router.post("/analyze/:transactionId", authenticate, checkPermission("view_ai_analysis", "approve_ai_recommendation"), analyzeTransaction);

// GET /api/ai/result/:transactionId
router.get("/result/:transactionId", authenticate, checkPermission("view_ai_analysis", "approve_ai_recommendation"), getAnalysisResult);

// GET /api/ai/dashboard
router.get("/dashboard", authenticate, checkPermission("view_ai_analysis", "approve_ai_recommendation"), getAIDashboard);

module.exports = router;
