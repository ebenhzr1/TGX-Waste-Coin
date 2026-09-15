const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Token tidak ditemukan"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token tidak valid"
        });
    }
};

const permissionService = require("../services/permissionService");

// Middleware verifikasi role (contoh: checkRole("admin", "school", "student"))
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({
                message: "Akses ditolak: Autentikasi diperlukan terlebih dahulu"
            });
        }

        const normalizedUserRole = permissionService.normalizeRole(req.user.role);
        const normalizedAllowed = allowedRoles.map(r => permissionService.normalizeRole(r));

        if (!allowedRoles.includes(req.user.role) && !normalizedAllowed.includes(normalizedUserRole)) {
            return res.status(403).json({
                message: `Akses ditolak: Peran '${req.user.role}' tidak memiliki izin untuk akses ini`
            });
        }

        next();
    };
};

// Middleware verifikasi permission (Sprint 18 & 24)
const checkPermission = (...permissionNames) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Autentikasi diperlukan terlebih dahulu"
            });
        }

        const userId = req.user.id;
        const userRole = req.user.role || (req.user.roles && req.user.roles[0]) || null;
        const perms = permissionNames.flat();

        let hasPermission = false;
        for (const p of perms) {
            if (await permissionService.checkPermission(userId, p, userRole)) {
                hasPermission = true;
                break;
            }
        }

        if (!hasPermission) {
            return res.status(403).json({
                message: "User tidak memiliki akses"
            });
        }

        next();
    };
};

// Ekspor fleksibel: bisa require langsung fungsi `authenticate` atau destructure `{ authenticate, checkRole, checkPermission }`
authenticate.authenticate = authenticate;
authenticate.checkRole = checkRole;
authenticate.checkPermission = checkPermission;

module.exports = authenticate;
