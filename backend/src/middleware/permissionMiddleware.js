const permissionService = require("../services/permissionService");

/**
 * Middleware untuk memvalidasi hak akses spesifik (Permission)
 * Flow:
 * Request -> JWT authenticate -> Check permission -> Allow / Reject (403)
 * 
 * @param {string} permissionName 
 */
const requirePermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Token tidak ditemukan atau autentikasi diperlukan"
                });
            }

            const userId = req.user.id;
            const userRole = req.user.role || (req.user.roles && req.user.roles[0]) || null;

            const hasPermission = await permissionService.checkPermission(userId, permissionName, userRole);

            if (!hasPermission) {
                return res.status(403).json({
                    message: "User tidak memiliki akses"
                });
            }

            next();
        } catch (error) {
            console.error("Error in requirePermission middleware:", error);
            return res.status(403).json({
                message: "User tidak memiliki akses"
            });
        }
    };
};

module.exports = {
    requirePermission
};
