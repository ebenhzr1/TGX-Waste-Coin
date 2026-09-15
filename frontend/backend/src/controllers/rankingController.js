const pool = require("../config/database");
const { generateRanking } = require("../services/rankingService");

// GET /api/ranking/school
const getSchoolRanking = async (req, res) => {
    try {
        const period = req.query.period || "weekly";

        const result = await pool.query(
            `
            SELECT 
                r.rank,
                s.school_name AS school,
                r.total_weight AS weight,
                r.total_coin AS coin,
                r.period,
                r.created_at
            FROM rankings r
            JOIN schools s ON r.school_id = s.id
            WHERE r.period = $1 AND r.user_id IS NULL
            ORDER BY r.rank ASC
            LIMIT 50
            `,
            [period]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error in getSchoolRanking:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// GET /api/ranking/student
const getStudentRanking = async (req, res) => {
    try {
        const period = req.query.period || "weekly";

        const result = await pool.query(
            `
            SELECT 
                r.rank,
                u.name AS student,
                s.school_name AS school,
                r.total_weight AS weight,
                r.total_coin AS coin,
                r.period,
                r.created_at
            FROM rankings r
            JOIN users u ON r.user_id = u.id
            LEFT JOIN schools s ON r.school_id = s.id
            WHERE r.period = $1 AND r.user_id IS NOT NULL
            ORDER BY r.rank ASC
            LIMIT 50
            `,
            [period]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error in getStudentRanking:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// POST /api/ranking/generate (Trigger manual kalkulasi)
const triggerGenerate = async (req, res) => {
    try {
        const period = req.body.period || "weekly";
        const result = await generateRanking(period);

        res.json({
            message: "Kalkulasi ranking berhasil dijalankan",
            details: result
        });
    } catch (error) {
        console.error("Error in triggerGenerate:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    getSchoolRanking,
    getStudentRanking,
    triggerGenerate
};
