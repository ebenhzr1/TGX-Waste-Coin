const express = require("express");
const router = express.Router();

const {
    getSchoolRanking,
    getStudentRanking,
    triggerGenerate
} = require("../controllers/rankingController");

const { authenticate, checkRole } = require("../middleware/authMiddleware");

// GET /api/ranking/school
router.get("/school", getSchoolRanking);

// GET /api/ranking/student
router.get("/student", getStudentRanking);

// POST /api/ranking/generate (Admin JET trigger)
router.post("/generate", authenticate, checkRole("admin"), triggerGenerate);

module.exports = router;
