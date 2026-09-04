const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const checkRole = authenticate.checkRole;
const carbonController = require("../controllers/carbonController");

// 1. Endpoint User (Student, School, Admin)
// GET /api/carbon/user/:id
router.get(
    "/user/:id",
    authenticate,
    checkRole("student", "school", "admin"),
    carbonController.getUserCarbonImpact
);

// 2. Endpoint Sekolah (School, Admin)
// GET /api/carbon/school/:id
router.get(
    "/school/:id",
    authenticate,
    checkRole("school", "admin"),
    carbonController.getSchoolCarbonImpact
);

// 3. Endpoint Admin (Admin)
// GET /api/carbon/admin
router.get(
    "/admin",
    authenticate,
    checkRole("admin"),
    carbonController.getAdminCarbonImpact
);

module.exports = router;
