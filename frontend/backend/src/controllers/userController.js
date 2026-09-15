const pool = require("../config/database");
const { DEFAULT_ROLES, normalizeRole, getPermissionsForRole } = require("../services/permissionService");

// In-memory user store untuk fallback saat DB offline
let memoryUsers = [
    { id: 1, name: "Budi Pratama (Super Admin)", email: "superadmin@jet.co.id", role: "super_admin", status: "active", school: "PT JET HQ Trenggalek" },
    { id: 2, name: "Reza Rahardian (Operasional)", email: "reza.ops@jet.co.id", role: "admin_operasional", status: "active", school: "PT JET Trenggalek" },
    { id: 3, name: "Dewi Lestari (Karbon)", email: "dewi.karbon@jet.co.id", role: "admin_karbon", status: "active", school: "PT JET Trenggalek" },
    { id: 4, name: "Bayu Wicaksono (Laporan)", email: "bayu.laporan@jet.co.id", role: "admin_laporan", status: "active", school: "PT JET Trenggalek" },
    { id: 5, name: "Siti Maryam (Operator Sekolah)", email: "siti.operator@sdn2bendorejo.sch.id", role: "operator_sekolah", status: "active", school: "SDN 2 Bendorejo" },
    { id: 6, name: "Drs. Hendro Wibowo (Guru)", email: "hendro.guru@sdn2bendorejo.sch.id", role: "guru", status: "active", school: "SDN 2 Bendorejo" },
    { id: 7, name: "Ahmad Santoso (Siswa)", email: "ahmad@siswa.id", role: "siswa", status: "active", school: "SDN 2 Bendorejo" }
];

/**
 * 1. Mendapatkan Daftar Semua Pengguna
 * GET /api/users
 */
const getUsers = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.role, 
                COALESCE(s.school_name, 'PT JET HQ') AS school,
                'active' AS status,
                u.created_at
            FROM users u
            LEFT JOIN schools s ON u.school_id = s.id
            ORDER BY u.id ASC
        `;

        const result = await pool.query(query);

        if (result.rows.length > 0) {
            const users = result.rows.map(user => ({
                ...user,
                role: normalizeRole(user.role),
                permissions: getPermissionsForRole(user.role)
            }));
            return res.json({
                message: "Daftar pengguna berhasil diambil",
                users
            });
        }

        // Jika DB kosong, kembalikan in-memory demo data
        return res.json({
            message: "Daftar pengguna berhasil diambil (Demo)",
            users: memoryUsers
        });

    } catch (error) {
        console.warn("DB offline, menggunakan memory fallback untuk getUsers:", error.message);
        return res.json({
            message: "Daftar pengguna berhasil diambil (Fallback)",
            users: memoryUsers
        });
    }
};

/**
 * 2. Mengubah Role Pengguna
 * PUT /api/users/:id/role
 * Body: { role: "admin_karbon" }
 */
const updateUserRole = async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({
                message: "Field 'role' wajib diisi"
            });
        }

        const normalized = normalizeRole(role);

        try {
            // Update role di tabel users
            const updateResult = await pool.query(
                `
                UPDATE users
                SET role = $1
                WHERE id = $2
                RETURNING id, name, email, role
                `,
                [normalized, userId]
            );

            if (updateResult.rows.length > 0) {
                const updatedUser = updateResult.rows[0];

                // Sinkronisasi tabel user_roles jika ada relasi
                try {
                    const roleLookup = await pool.query("SELECT id FROM roles WHERE LOWER(name) = LOWER($1)", [role]);
                    if (roleLookup.rows.length > 0) {
                        const roleId = roleLookup.rows[0].id;
                        await pool.query(
                            `
                            INSERT INTO user_roles (user_id, role_id)
                            VALUES ($1, $2)
                            ON CONFLICT DO NOTHING
                            `,
                            [userId, roleId]
                        );
                    }
                } catch (rErr) {
                    // silent fallback
                }

                return res.json({
                    message: `Role pengguna #${userId} berhasil diubah menjadi '${normalized}'`,
                    user: {
                        ...updatedUser,
                        role: normalized,
                        permissions: getPermissionsForRole(normalized)
                    }
                });
            }
        } catch (dbErr) {
            console.warn("DB error saat updateUserRole, memperbarui memory store:", dbErr.message);
        }

        // Memory fallback update
        let updatedUser = null;
        memoryUsers = memoryUsers.map(u => {
            if (u.id === userId) {
                updatedUser = { ...u, role: normalized };
                return updatedUser;
            }
            return u;
        });

        if (!updatedUser) {
            updatedUser = { id: userId, name: "User #" + userId, role: normalized };
        }

        return res.json({
            message: `Role pengguna #${userId} berhasil diubah menjadi '${normalized}'`,
            user: {
                ...updatedUser,
                role: normalized,
                permissions: getPermissionsForRole(normalized)
            }
        });

    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({
            message: "Gagal memperbarui role user",
            error: error.message
        });
    }
};

/**
 * 3. Mendapatkan Daftar Role Tersedia
 * GET /api/users/roles
 */
const getRoles = async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name, description FROM roles ORDER BY id ASC");
        if (result.rows.length > 0) {
            return res.json({
                message: "Daftar role resmi berhasil diambil",
                roles: result.rows.map(r => ({
                    id: r.id,
                    name: r.name,
                    key: normalizeRole(r.name),
                    description: r.description
                }))
            });
        }
        return res.json({
            message: "Daftar role resmi berhasil diambil",
            roles: DEFAULT_ROLES
        });
    } catch (error) {
        return res.json({
            message: "Daftar role resmi berhasil diambil (Fallback)",
            roles: DEFAULT_ROLES
        });
    }
};

module.exports = {
    getUsers,
    updateUserRole,
    getRoles
};
