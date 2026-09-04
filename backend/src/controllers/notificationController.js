const { getUserNotifications } = require("../services/notificationService");

// GET /api/notification
const getNotifications = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : req.query.user_id;

        if (!userId) {
            return res.status(400).json({
                message: "User ID diperlukan untuk mengambil notifikasi"
            });
        }

        const notifications = await getUserNotifications(userId);
        res.json(notifications);
    } catch (error) {
        console.error("Error in getNotifications:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    getNotifications
};
