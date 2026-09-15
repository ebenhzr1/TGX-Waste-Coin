const express = require("express");
const router = express.Router();
const { authenticate, checkRole } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// Seluruh endpoint User Management diproteksi hanya untuk Super Admin JET
router.use(authenticate, checkRole("super_admin", "admin", "SUPER ADMIN JET"));

// 1. Ambil daftar semua user
// GET /api/users
router.get("/", userController.getUsers);

// 2. Ambil daftar role resmi
// GET /api/users/roles
router.get("/roles", userController.getRoles);

// 3. Update role spesifik pengguna
// PUT /api/users/:id/role
router.put("/:id/role", userController.updateUserRole);

module.exports = router;
