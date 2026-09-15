const mobileService = require("../services/mobileService");

/**
 * POST /api/mobile/device/register
 */
const registerDevice = async (req, res) => {
    try {
        const { device_token, platform } = req.body;
        const userId = req.user ? req.user.id : null;

        if (!device_token) {
            return res.status(400).json({
                message: "Device token wajib disertakan"
            });
        }

        const device = await mobileService.registerDevice(userId, device_token, platform || "android");

        res.status(201).json({
            message: "Mobile device berhasil didaftarkan",
            device
        });
    } catch (error) {
        console.error("Error registering mobile device:", error);
        res.status(500).json({
            message: "Gagal mendaftarkan device",
            error: error.message
        });
    }
};

/**
 * POST /api/mobile/location
 */
const logLocation = async (req, res) => {
    try {
        const { latitude, longitude, activity } = req.body;
        const userId = req.user ? req.user.id : null;

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                message: "Latitude dan longitude koordinat GPS wajib diisi"
            });
        }

        const log = await mobileService.logLocation(userId, latitude, longitude, activity || "field_activity");

        res.status(201).json({
            message: "Koordinat lokasi GPS berhasil dicatat",
            log
        });
    } catch (error) {
        console.error("Error logging mobile location:", error);
        res.status(500).json({
            message: "Gagal mencatat lokasi",
            error: error.message
        });
    }
};

/**
 * GET / POST /api/mobile/sync
 */
const syncData = async (req, res) => {
    try {
        const queue = req.body && req.body.queue ? req.body.queue : [];
        const syncResult = await mobileService.syncData(req.user, queue);

        res.json({
            message: "Sinkronisasi mobile data berhasil",
            sync: syncResult
        });
    } catch (error) {
        console.error("Error syncing mobile data:", error);
        res.status(500).json({
            message: "Gagal melakukan sinkronisasi data",
            error: error.message
        });
    }
};

/**
 * GET /api/mobile/dashboard
 */
const getDashboard = async (req, res) => {
    try {
        const dashboard = await mobileService.getMobileDashboard(req.user);
        res.json({
            message: "Data dashboard mobile berhasil diambil",
            dashboard
        });
    } catch (error) {
        console.error("Error getting mobile dashboard:", error);
        res.status(500).json({
            message: "Gagal memuat dashboard mobile",
            error: error.message
        });
    }
};

/**
 * GET /api/mobile/pickups
 */
const getPickups = async (req, res) => {
    try {
        const pickups = await mobileService.getPickupRequests();
        res.json({
            message: "Daftar permintaan pickup lapangan berhasil diambil",
            pickups
        });
    } catch (error) {
        console.error("Error getting pickup requests:", error);
        res.status(500).json({
            message: "Gagal memuat daftar pickup",
            error: error.message
        });
    }
};

/**
 * PUT /api/mobile/pickups/:id/status
 */
const updatePickupStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, photo_url } = req.body;

        if (!status || !["requested", "picked_up", "completed"].includes(status)) {
            return res.status(400).json({
                message: "Status pickup harus salah satu dari: requested, picked_up, completed"
            });
        }

        const updated = await mobileService.updatePickupStatus(id, status, photo_url);
        res.json({
            message: `Status pickup lapangan berhasil diperbarui menjadi ${status}`,
            pickup: updated
        });
    } catch (error) {
        console.error("Error updating pickup status:", error);
        res.status(500).json({
            message: "Gagal memperbarui status pickup",
            error: error.message
        });
    }
};

module.exports = {
    registerDevice,
    logLocation,
    syncData,
    getDashboard,
    getPickups,
    updatePickupStatus
};
