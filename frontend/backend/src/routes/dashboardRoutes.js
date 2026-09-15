const express = require("express");
const router = express.Router();

const {
    getAdminDashboard,
    getStudentDashboard,
    getSchoolDashboard
} = require("../controllers/dashboardController");

const { authenticate, checkRole } = require("../middleware/authMiddleware");

// GET /api/dashboard/admin (Admin JET Monitoring)
router.get("/admin", authenticate, checkRole("admin"), getAdminDashboard);

// GET /api/dashboard/student/:id (Student Profile & Stats)
router.get("/student/:id", authenticate, getStudentDashboard);

// GET /api/dashboard/school/:id (School Analytics & Ranking)
router.get("/school/:id", authenticate, getSchoolDashboard);

module.exports = router;
