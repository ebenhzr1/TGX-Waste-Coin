const pool = require("../config/database");

/**
 * Generate ranking mingguan/bulanan sekolah dan siswa berdasarkan sampah yang disetujui (approved)
 */
const generateRanking = async (period = "weekly") => {
    try {
        console.log(`[RankingEngine] Mulai kalkulasi peringkat periode: ${period}`);

        // 1. Kalkulasi Peringkat Sekolah
        const schoolResult = await pool.query(`
            SELECT 
                school_id,
                COALESCE(SUM(weight_kg), 0) AS total_weight,
                COALESCE(SUM(coin_amount), 0) AS total_coin
            FROM waste_transactions
            WHERE status = 'approved' AND school_id IS NOT NULL
            GROUP BY school_id
            ORDER BY total_weight DESC
        `);

        let schoolRank = 1;
        for (const item of schoolResult.rows) {
            await pool.query(
                `
                INSERT INTO rankings 
                (school_id, period, total_weight, total_coin, rank)
                VALUES ($1, $2, $3, $4, $5)
                `,
                [
                    item.school_id,
                    period,
                    item.total_weight,
                    item.total_coin,
                    schoolRank
                ]
            );
            schoolRank++;
        }

        // 2. Kalkulasi Peringkat Siswa
        const studentResult = await pool.query(`
            SELECT 
                user_id,
                school_id,
                COALESCE(SUM(weight_kg), 0) AS total_weight,
                COALESCE(SUM(coin_amount), 0) AS total_coin
            FROM waste_transactions
            WHERE status = 'approved' AND user_id IS NOT NULL
            GROUP BY user_id, school_id
            ORDER BY total_weight DESC
        `);

        let studentRank = 1;
        for (const item of studentResult.rows) {
            await pool.query(
                `
                INSERT INTO rankings 
                (user_id, school_id, period, total_weight, total_coin, rank)
                VALUES ($1, $2, $3, $4, $5, $6)
                `,
                [
                    item.user_id,
                    item.school_id,
                    period,
                    item.total_weight,
                    item.total_coin,
                    studentRank
                ]
            );
            studentRank++;
        }

        console.log(`[RankingEngine] Selesai: ${schoolRank - 1} sekolah, ${studentRank - 1} siswa diperingkat`);
        return {
            period,
            totalSchoolsRanked: schoolRank - 1,
            totalStudentsRanked: studentRank - 1
        };

    } catch (error) {
        console.error("Error generating ranking in rankingService:", error);
        throw error;
    }
};

module.exports = {
    generateRanking
};
