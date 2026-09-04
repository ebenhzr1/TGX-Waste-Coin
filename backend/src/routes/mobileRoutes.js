const express = require("express");
const router = express.Router();
const {
    registerDevice,
    logLocation,
    syncData,
    getDashboard,
    getPickups,
    updatePickupStatus
} = require("../controllers/mobileController");

const { authenticate, checkPermission } = require("../middleware/authMiddleware");

// 1. Device Registration (Push notification token)
router.post("/device/register", authenticate, registerDevice);

// 2. GPS Location Logging
router.post("/location", authenticate, logLocation);

// 3. Mobile Sync & Offline Queue Synchronization
router.get("/sync", authenticate, syncData);
router.post("/sync", authenticate, syncData);

// 4. Role-tailored Mobile Dashboard
router.get("/dashboard", authenticate, getDashboard);

// 5. Field Collector Pickup Operations
router.get("/pickups", authenticate, checkPermission("field_collection"), getPickups);
router.put("/pickups/:id/status", authenticate, checkPermission("field_collection"), updatePickupStatus);

module.exports = router;
