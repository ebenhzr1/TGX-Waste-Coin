const express = require("express");

const router = express.Router();

const {
    register,
    login,
    sendOTP,
    verifyAndRegister,
} = require("../controllers/authController");


// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/send-otp
router.post("/send-otp", sendOTP);

// POST /api/auth/verify-register
router.post("/verify-register", verifyAndRegister);


module.exports = router;

