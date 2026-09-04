const { Parser } = require("json2csv");
const pool = require("../config/database");

/**
 * Menghasilkan data CSV laporan setoran sampah
 */
const generateWasteCSV = async () => {
    try {
        const query = `
            SELECT 
                wt.id,
                TO_CHAR(wt.created_at, 'YYYY-MM-DD HH24:MI:SS') AS tanggal,
                COALESCE(u.name, 'Anonim') AS nama,
                COALESCE(s.school_name, '-') AS sekolah,
                wt.waste_type AS jenis_sampah,
                wt.weight_kg AS berat_kg,
                wt.coin_amount AS koin_tgx,
                wt.status
            FROM waste_transactions wt
            LEFT JOIN users u ON wt.user_id = u.id
            LEFT JOIN schools s ON wt.school_id = s.id
            ORDER BY wt.created_at DESC
        `;

        const result = await pool.query(query);

        const fields = [
            { label: "ID Transaksi", value: "id" },
            { label: "Tanggal", value: "tanggal" },
            { label: "Nama Siswa", value: "nama" },
            { label: "Sekolah", value: "sekolah" },
            { label: "Jenis Sampah", value: "jenis_sampah" },
            { label: "Berat (Kg)", value: "berat_kg" },
            { label: "Koin TGX", value: "koin_tgx" },
            { label: "Status", value: "status" }
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(result.rows);

        return csv;
    } catch (error) {
        console.error("Error generating waste CSV:", error);
        throw error;
    }
};

module.exports = {
    generateWasteCSV
};
