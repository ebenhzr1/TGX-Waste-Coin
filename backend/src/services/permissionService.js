const pool = require("../config/database");

/**
 * Matriks Hak Akses Peran (Role Permission Matrix)
 * Standar PT Jwalita Energi Trenggalek (Sprint 18)
 */
const ROLE_PERMISSIONS = {
    // 1. Super Admin JET (Full system access)
    super_admin: ["*"],
    "SUPER ADMIN JET": ["*"],
    admin: ["*"], // Backward compatibility legacy role

    // 2. Admin Operasional (Waste transaction, verification, reward, competition & AI verification)
    admin_operasional: [
        "view_transaction",
        "approve_transaction",
        "reject_transaction",
        "manage_reward",
        "approve_reward",
        "manage_competition",
        "view_achievement",
        "view_ai_analysis",
        "approve_ai_recommendation",
        "manage_ai_model"
    ],
    "ADMIN OPERASIONAL": [
        "view_transaction",
        "approve_transaction",
        "reject_transaction",
        "manage_reward",
        "approve_reward",
        "manage_competition",
        "view_achievement",
        "view_ai_analysis",
        "approve_ai_recommendation",
        "manage_ai_model"
    ],

    // 3. Admin Karbon (Carbon impact, ESG report, & Carbon Asset Management)
    admin_karbon: [
        "view_carbon",
        "generate_esg_report",
        "view_carbon_asset",
        "manage_carbon_project",
        "create_offset",
        "issue_certificate"
    ],
    "ADMIN KARBON": [
        "view_carbon",
        "generate_esg_report",
        "view_carbon_asset",
        "manage_carbon_project",
        "create_offset",
        "issue_certificate"
    ],

    // 4. Admin Laporan (Reporting access + Sprint 27: Economic Dashboard)
    admin_laporan: [
        "view_report",
        "export_report",
        "view_carbon_asset",
        "view_impact_report",
        "view_executive_dashboard",
        "view_economic_dashboard"     // Sprint 27
    ],
    "ADMIN LAPORAN": [
        "view_report",
        "export_report",
        "view_carbon_asset",
        "view_impact_report",
        "view_executive_dashboard",
        "view_economic_dashboard"
    ],

    // 4b. Admin CSR (Corporate Partnership & CSR Campaign + Sprint 27: Ecosystem Partner)
    admin_csr: [
        "view_csr_campaign",
        "manage_csr_campaign",
        "manage_partner",
        "view_impact_report",
        "manage_ecosystem_partner",   // Sprint 27
        "view_economic_dashboard"     // Sprint 27
    ],
    "ADMIN CSR": [
        "view_csr_campaign",
        "manage_csr_campaign",
        "manage_partner",
        "view_impact_report",
        "manage_ecosystem_partner",
        "view_economic_dashboard"
    ],

    // 4c. Direksi PT JET (Sprint 25: Executive ESG + Sprint 27: Economic Dashboard)
    direksi: [
        "view_executive_dashboard",
        "view_report",
        "export_report",
        "view_carbon",
        "view_carbon_asset",
        "view_impact_report",
        "view_csr_campaign",
        "view_economic_dashboard"     // Sprint 27
    ],
    "DIREKSI": [
        "view_executive_dashboard",
        "view_report",
        "export_report",
        "view_carbon",
        "view_carbon_asset",
        "view_impact_report",
        "view_csr_campaign",
        "view_economic_dashboard"
    ],

    // 5. Operator Sekolah (Manage school waste transaction, approve rewards & AI verification)
    operator_sekolah: [
        "view_school_transaction",
        "verify_school_transaction",
        "approve_transaction",
        "reject_transaction",
        "approve_reward",
        "view_achievement",
        "approve_mobile_transaction",
        "mobile_access",
        "view_ai_analysis",
        "approve_ai_recommendation"
    ],
    "OPERATOR SEKOLAH": [
        "view_school_transaction",
        "verify_school_transaction",
        "approve_transaction",
        "reject_transaction",
        "approve_reward",
        "view_achievement",
        "approve_mobile_transaction",
        "mobile_access",
        "view_ai_analysis",
        "approve_ai_recommendation"
    ],
    school: [
        "view_school_transaction",
        "verify_school_transaction",
        "approve_transaction",
        "reject_transaction",
        "approve_reward",
        "view_achievement",
        "approve_mobile_transaction",
        "mobile_access",
        "view_ai_analysis",
        "approve_ai_recommendation"
    ], // Backward compatibility

    // 5b. Operator Lapangan / Field Collector (Sprint 23: Field pickup & location tracking)
    collector: [
        "field_collection",
        "mobile_access",
        "view_transaction"
    ],
    "COLLECTOR": [
        "field_collection",
        "mobile_access",
        "view_transaction"
    ],
    operator_lapangan: [
        "field_collection",
        "mobile_access",
        "view_transaction"
    ],
    "OPERATOR LAPANGAN": [
        "field_collection",
        "mobile_access",
        "view_transaction"
    ],

    // 6. Guru Pendamping (Monitor student activity)
    guru: [
        "view_student_activity",
        "view_achievement"
    ],
    "GURU PENDAMPING": [
        "view_student_activity",
        "view_achievement"
    ],

    // 7. Siswa (Submit waste, view reward, marketplace, redeem, & view achievement)
    siswa: [
        "submit_waste",
        "view_wallet",
        "view_ranking",
        "view_marketplace",
        "redeem_reward",
        "view_achievement",
        "mobile_access"
    ],
    "SISWA": [
        "submit_waste",
        "view_wallet",
        "view_ranking",
        "view_marketplace",
        "redeem_reward",
        "view_achievement",
        "mobile_access"
    ],
    student: [
        "submit_waste",
        "view_wallet",
        "view_ranking",
        "view_marketplace",
        "redeem_reward",
        "view_achievement",
        "mobile_access"
    ] // Backward compatibility
};

/**
 * Daftar Role Resmi PT JET untuk UI dan dropdown
 */
const DEFAULT_ROLES = [
    { key: "super_admin", label: "Super Admin JET", desc: "Full system access" },
    { key: "admin_operasional", label: "Admin Operasional", desc: "Waste transaction and verification" },
    { key: "admin_karbon", label: "Admin Karbon", desc: "Carbon impact and ESG report" },
    { key: "direksi", label: "Dewan Direksi PT JET", desc: "Executive ESG Command Center & Strategic Oversight" },
    { key: "admin_laporan", label: "Admin Laporan", desc: "Reporting access only" },
    { key: "admin_csr", label: "Admin CSR & Kemitraan", desc: "Corporate CSR and impact partnership" },
    { key: "operator_sekolah", label: "Operator Sekolah", desc: "Manage school waste transaction" },
    { key: "collector", label: "Operator Lapangan", desc: "Field waste pickup and route tracking" },
    { key: "guru", label: "Guru Pendamping", desc: "Monitor student activity" },
    { key: "siswa", label: "Siswa", desc: "Submit waste and view reward" }
];

/**
 * Normalisasi nama role
 */
const normalizeRole = (role) => {
    if (!role) return "siswa";
    const lower = role.toLowerCase().replace(/[\s-]+/g, "_");
    if (lower === "super_admin_jet" || lower === "superadmin" || lower === "admin") return "super_admin";
    if (lower === "director" || lower === "direktur" || lower === "board_of_directors") return "direksi";
    if (lower === "student") return "siswa";
    if (lower === "school") return "operator_sekolah";
    if (lower === "guru_pendamping") return "guru";
    if (lower === "collector" || lower === "field_collector" || lower === "operator_lapangan") return "collector";
    return lower;
};

/**
 * Mendapatkan daftar permissions untuk role tertentu
 * @param {string} roleName 
 * @returns {string[]}
 */
const getPermissionsForRole = (roleName) => {
    const normalized = normalizeRole(roleName);
    return ROLE_PERMISSIONS[normalized] || ROLE_PERMISSIONS[roleName] || [];
};

/**
 * Memeriksa apakah user memiliki permission tertentu
 * @param {number} userId 
 * @param {string} permissionName 
 * @param {string|null} fallbackRole 
 * @returns {Promise<boolean>}
 */
const checkPermission = async (userId, permissionName, fallbackRole = null) => {
    try {
        let userRole = fallbackRole;

        // Cek database users & user_roles jika userId valid
        if (userId) {
            try {
                const res = await pool.query(
                    `
                    SELECT u.role, r.name AS role_name
                    FROM users u
                    LEFT JOIN user_roles ur ON u.id = ur.user_id
                    LEFT JOIN roles r ON ur.role_id = r.id
                    WHERE u.id = $1
                    `,
                    [userId]
                );

                if (res.rows.length > 0) {
                    userRole = res.rows[0].role_name || res.rows[0].role || userRole;
                }
            } catch (dbErr) {
                // Database fallback toleran
                userRole = fallbackRole || "siswa";
            }
        }

        const normalized = normalizeRole(userRole);
        const perms = ROLE_PERMISSIONS[normalized] || ROLE_PERMISSIONS[userRole] || [];

        // Jika memiliki wildcard '*' (Super Admin)
        if (perms.includes("*")) {
            return true;
        }

        return perms.includes(permissionName);

    } catch (error) {
        console.error("Error checking permission:", error);
        return false;
    }
};

module.exports = {
    ROLE_PERMISSIONS,
    DEFAULT_ROLES,
    normalizeRole,
    getPermissionsForRole,
    checkPermission
};
