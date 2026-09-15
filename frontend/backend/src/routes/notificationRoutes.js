const express = require("express");
const router = express.Router();

const { getNotifications } = require("../controllers/notificationController");
const { authenticate } = require("../middleware/authMiddleware");

// GET /api/notification (Mendukung token auth atau query user_id)
router.get("/", (req, res, next) => {
    if (req.headers.authorization) {
        return authenticate(req, res, next);
    }
    next();
}, getNotifications);

module.exports = router;
