const pool = require("../config/database");

// GET /api/dashboard/admin
const getAdminDashboard = async (req, res) => {
    try {
        const usersCountRes = await pool.query("SELECT COUNT(*) FROM users");
        const schoolsCountRes = await pool.query("SELECT COUNT(*) FROM schools");
        const wasteAggRes = await pool.query(`
            SELECT 
                COALESCE(SUM(weight_kg), 0) AS total_waste_kg,
                COALESCE(SUM(coin_amount), 0) AS total_coin
            FROM waste_transactions
            WHERE status = 'approved'
        `);
        const pendingCountRes = await pool.query(
            "SELECT COUNT(*) FROM waste_transactions WHERE status = 'pending'"
        );

        res.json({
            totalUser: parseInt(usersCountRes.rows[0].count, 10) || 0,
            totalSchool: parseInt(schoolsCountRes.rows[0].count, 10) || 0,
            totalWasteKg: parseFloat(wasteAggRes.rows[0].total_waste_kg) || 0,
            totalCoin: parseFloat(wasteAggRes.rows[0].total_coin) || 0,
            pendingApproval: parseInt(pendingCountRes.rows[0].count, 10) || 0
        });
    } catch (error) {
        console.error("Error in getAdminDashboard:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// GET /api/dashboard/student/:id
const getStudentDashboard = async (req, res) => {
    try {
        const { id } = req.params;

        const userRes = await pool.query(
            "SELECT id, name, email, role, school_id FROM users WHERE id = $1",
            [id]
        );

        if (userRes.rows.length === 0) {
            return res.status(404).json({
                message: "Siswa tidak ditemukan"
            });
        }

        const user = userRes.rows[0];

        // Total sampah & koin disetujui siswa
        const wasteRes = await pool.query(`
            SELECT 
                COALESCE(SUM(weight_kg), 0) AS total_waste_kg,
                COALESCE(SUM(coin_amount), 0) AS total_coin
            FROM waste_transactions
            WHERE user_id = $1 AND status = 'approved'
        `, [id]);

        // Saldo wallet terkini
        const walletRes = await pool.query(
            "SELECT balance FROM wallets WHERE user_id = $1",
            [id]
        );

        // Riwayat transaksi terakhir
        const recentTxRes = await pool.query(`
            SELECT id, waste_type, weight_kg, coin_amount, status, created_at
            FROM waste_transactions
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 5
        `, [id]);

        res.json({
            student: {
                id: user.id,
                name: user.name,
                email: user.email,
                schoolId: user.school_id
            },
            totalWasteKg: parseFloat(wasteRes.rows[0].total_waste_kg) || 0,
            totalCoin: parseFloat(wasteRes.rows[0].total_coin) || 0,
            walletBalance: parseFloat(walletRes.rows[0]?.balance) || 0,
            recentTransactions: recentTxRes.rows
        });
    } catch (error) {
        console.error("Error in getStudentDashboard:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// GET /api/dashboard/school/:id
const getSchoolDashboard = async (req, res) => {
    try {
        const { id } = req.params;

        const schoolRes = await pool.query(
            "SELECT * FROM schools WHERE id = $1",
            [id]
        );

        if (schoolRes.rows.length === 0) {
            return res.status(404).json({
                message: "Sekolah tidak ditemukan"
            });
        }

        const school = schoolRes.rows[0];

        // Total siswa terdaftar di sekolah ini
        const studentCountRes = await pool.query(
            "SELECT COUNT(*) FROM users WHERE school_id = $1",
            [id]
        );

        // Total sampah & koin sekolah
        const wasteRes = await pool.query(`
            SELECT 
                COALESCE(SUM(weight_kg), 0) AS total_waste_kg,
                COALESCE(SUM(coin_amount), 0) AS total_coin
            FROM waste_transactions
            WHERE school_id = $1 AND status = 'approved'
        `, [id]);

        // Peringkat terkini sekolah
        const rankRes = await pool.query(`
            SELECT rank, period FROM rankings
            WHERE school_id = $1
            ORDER BY created_at DESC
            LIMIT 1
        `, [id]);

        res.json({
            school: {
                id: school.id,
                name: school.school_name,
                address: school.address
            },
            totalStudents: parseInt(studentCountRes.rows[0].count, 10) || 0,
            totalWasteKg: parseFloat(wasteRes.rows[0].total_waste_kg) || 0,
            totalCoin: parseFloat(wasteRes.rows[0].total_coin) || 0,
            rank: rankRes.rows[0]?.rank || "-"
        });
    } catch (error) {
        console.error("Error in getSchoolDashboard:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    getAdminDashboard,
    getStudentDashboard,
    getSchoolDashboard
};
