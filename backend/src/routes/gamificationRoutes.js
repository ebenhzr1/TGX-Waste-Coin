const express = require("express");
const router = express.Router();
const gamificationController = require("../controllers/gamificationController");
const authenticate = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/authMiddleware");

// 1. Prestasi & Badge Siswa (Siswa, Guru, Operator, Admin)
router.get(
    "/user/:id",
    authenticate,
    checkPermission("view_achievement"),
    gamificationController.getUserAchievement
);

// 2. Prestasi & Level Sekolah Adiwiyata
router.get(
    "/school/:id",
    authenticate,
    gamificationController.getSchoolAchievement
);

// 3. Menampilkan Kompetisi Aktif & Leaderboard (Semua user)
router.get(
    "/competition",
    authenticate,
    checkPermission("view_achievement"),
    gamificationController.getCompetition
);

// 4. Admin Membuat Kompetisi Baru
router.post(
    "/competition",
    authenticate,
    checkPermission("manage_competition"),
    gamificationController.createCompetition
);

// 5. Admin Menutup Kompetisi
router.put(
    "/competition/:id/close",
    authenticate,
    checkPermission("manage_competition"),
    gamificationController.closeCompetition
);

module.exports = router;
