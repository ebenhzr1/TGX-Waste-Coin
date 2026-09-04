const pool = require("../config/database");
const carbonService = require("../services/carbonService");

/**
 * 1. Mendapatkan Dampak Karbon Perorangan (Siswa)
 * GET /api/carbon/user/:id
 */
const getUserCarbonImpact = async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);

        // Query dari carbon_impacts terhubung waste_transactions
        let query = `
            SELECT 
                COALESCE(SUM(ci.weight_kg), 0) AS total_waste_kg,
                COALESCE(SUM(ci.co2_avoided), 0) AS co2_avoided,
                COUNT(ci.id) AS total_tx
            FROM carbon_impacts ci
            JOIN waste_transactions wt ON ci.transaction_id = wt.id
            WHERE wt.user_id = $1
        `;

        const result = await pool.query(query, [userId]);
        let totalWasteKg = parseFloat(result.rows[0]?.total_waste_kg || 0);
        let co2Avoided = parseFloat(result.rows[0]?.co2_avoided || 0);

        // Jika belum ada di carbon_impacts, cek transaksi approved langsung di waste_transactions
        if (totalWasteKg === 0) {
            const fallbackTx = await pool.query(
                `SELECT waste_type, weight_kg FROM waste_transactions WHERE user_id = $1 AND status = 'approved'`,
                [userId]
            );
            if (fallbackTx.rows.length > 0) {
                fallbackTx.rows.forEach(tx => {
                    const weight = parseFloat(tx.weight_kg || 0);
                    const impact = carbonService.calculateCarbonImpact(tx.waste_type, weight);
                    totalWasteKg += impact.weightKg;
                    co2Avoided += impact.co2Avoided;
                });
            }
        }

        // Jika data database kosong / offline (demo fallback sesuai spesifikasi)
        if (totalWasteKg === 0 && co2Avoided === 0) {
            totalWasteKg = 25;
            co2Avoided = 50;
        }

        // Perhitungan konversi pohon (1 pohon dewasa menyerap rata-rata 10 kgCO2e/tahun)
        const treeEquivalent = Math.round(co2Avoided / 10);

        return res.json({
            totalWasteKg: parseFloat(totalWasteKg.toFixed(2)),
            co2Avoided: parseFloat(co2Avoided.toFixed(2)),
            treeEquivalent: treeEquivalent || 5
        });

    } catch (error) {
        console.warn("User carbon impact fallback aktif:", error.message);
        return res.json({
            totalWasteKg: 25,
            co2Avoided: 50,
            treeEquivalent: 5
        });
    }
};

/**
 * 2. Mendapatkan Dampak Karbon Agregat Tingkat Sekolah
 * GET /api/carbon/school/:id
 */
const getSchoolCarbonImpact = async (req, res) => {
    try {
        const schoolId = parseInt(req.params.id, 10);

        let schoolName = "SDN 2 Bendorejo";
        const schoolQuery = await pool.query(`SELECT school_name FROM schools WHERE id = $1`, [schoolId]);
        if (schoolQuery.rows.length > 0) {
            schoolName = schoolQuery.rows[0].school_name;
        }

        const impactQuery = await pool.query(
            `
            SELECT 
                COALESCE(SUM(ci.weight_kg), 0) AS total_waste_kg,
                COALESCE(SUM(ci.co2_avoided), 0) AS co2_avoided
            FROM carbon_impacts ci
            JOIN waste_transactions wt ON ci.transaction_id = wt.id
            WHERE wt.school_id = $1
            `,
            [schoolId]
        );

        let totalWasteKg = parseFloat(impactQuery.rows[0]?.total_waste_kg || 0);
        let co2Avoided = parseFloat(impactQuery.rows[0]?.co2_avoided || 0);

        // Jika belum ada di carbon_impacts, cek transaksi approved di waste_transactions
        if (totalWasteKg === 0) {
            const fallbackTx = await pool.query(
                `SELECT waste_type, weight_kg FROM waste_transactions WHERE school_id = $1 AND status = 'approved'`,
                [schoolId]
            );
            if (fallbackTx.rows.length > 0) {
                fallbackTx.rows.forEach(tx => {
                    const weight = parseFloat(tx.weight_kg || 0);
                    const impact = carbonService.calculateCarbonImpact(tx.waste_type, weight);
                    totalWasteKg += impact.weightKg;
                    co2Avoided += impact.co2Avoided;
                });
            }
        }

        // Demo fallback jika data kosong
        if (totalWasteKg === 0 && co2Avoided === 0) {
            totalWasteKg = 1500;
            co2Avoided = 3000;
        }

        return res.json({
            school: schoolName,
            totalWasteKg: parseFloat(totalWasteKg.toFixed(2)),
            co2Avoided: parseFloat(co2Avoided.toFixed(2))
        });

    } catch (error) {
        console.warn("School carbon impact fallback aktif:", error.message);
        return res.json({
            school: "SDN 2 Bendorejo",
            totalWasteKg: 1500,
            co2Avoided: 3000
        });
    }
};

/**
 * 3. Mendapatkan Dampak Karbon Agregat Kabupaten (Admin JET)
 * GET /api/carbon/admin
 */
const getAdminCarbonImpact = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT 
                COALESCE(SUM(weight_kg), 0) AS total_waste_kg,
                COALESCE(SUM(co2_avoided), 0) AS total_co2_avoided,
                COUNT(id) AS total_transaction
            FROM carbon_impacts
            `
        );

        let totalWasteKg = parseFloat(result.rows[0]?.total_waste_kg || 0);
        let totalCO2Avoided = parseFloat(result.rows[0]?.total_co2_avoided || 0);
        let totalTransaction = parseInt(result.rows[0]?.total_transaction || 0, 10);

        // Jika belum ada, cek seluruh waste_transactions approved
        if (totalWasteKg === 0) {
            const txResult = await pool.query(
                `SELECT waste_type, weight_kg FROM waste_transactions WHERE status = 'approved'`
            );
            if (txResult.rows.length > 0) {
                totalTransaction = txResult.rows.length;
                txResult.rows.forEach(tx => {
                    const weight = parseFloat(tx.weight_kg || 0);
                    const impact = carbonService.calculateCarbonImpact(tx.waste_type, weight);
                    totalWasteKg += impact.weightKg;
                    totalCO2Avoided += impact.co2Avoided;
                });
            }
        }

        // Demo fallback sesuai spesifikasi
        if (totalWasteKg === 0 && totalCO2Avoided === 0) {
            totalWasteKg = 20000;
            totalCO2Avoided = 45000;
            totalTransaction = 5000;
        }

        return res.json({
            totalWasteKg: parseFloat(totalWasteKg.toFixed(2)),
            totalCO2Avoided: parseFloat(totalCO2Avoided.toFixed(2)),
            totalTransaction: totalTransaction || 5000
        });

    } catch (error) {
        console.warn("Admin carbon impact fallback aktif:", error.message);
        return res.json({
            totalWasteKg: 20000,
            totalCO2Avoided: 45000,
            totalTransaction: 5000
        });
    }
};

module.exports = {
    getUserCarbonImpact,
    getSchoolCarbonImpact,
    getAdminCarbonImpact
};
