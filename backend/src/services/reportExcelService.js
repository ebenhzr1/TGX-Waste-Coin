let ExcelJS;
try {
    ExcelJS = require("exceljs");
} catch {
    ExcelJS = null;
}

/**
 * Menghasilkan Dokumen Excel Laporan ESG & Impact
 * TGX Waste Coin × Jwalita For Earth
 * 
 * Output: TGX_Impact_Report.xlsx
 * 
 * @param {object} report Data laporan
 * @param {stream.Writable} outputStream Stream tujuan (Express res)
 */
const generateExcel = async (report, outputStream) => {
    if (!ExcelJS) {
        try {
            ExcelJS = require("exceljs");
        } catch {
            throw new Error("exceljs module not available");
        }
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "TGX Waste Coin × Jwalita For Earth";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("ESG Impact Report");

    // Konfigurasi Kolom
    sheet.columns = [
        { header: "Pilar ESG", key: "pillar", width: 20 },
        { header: "Indikator / Metrik", key: "indicator", width: 36 },
        { header: "Nilai", key: "value", width: 18 },
        { header: "Satuan", key: "unit", width: 14 },
        { header: "Keterangan", key: "notes", width: 38 }
    ];

    // Styling Baris Header
    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    sheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF059669" }
    };
    sheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

    const wasteKg = report.environmental?.totalWasteKg || 0;
    const co2Kg = report.environmental?.co2Avoided || 0;
    const users = report.social?.totalUsers || 0;
    const schools = report.social?.totalSchool || 0;
    const txCount = report.governance?.totalTransaction || 0;
    const estCoins = Math.round(wasteKg * 3.5);

    sheet.addRows([
        { pillar: "Environmental", indicator: "Total Sampah Terkelola", value: wasteKg, unit: "Kg", notes: "Daur ulang & pencegahan timbulan TPA" },
        { pillar: "Environmental", indicator: "CO2 Avoided (Emisi Dicegah)", value: co2Kg, unit: "kgCO2e", notes: `${(co2Kg / 1000).toFixed(2)} Ton emisi gas rumah kaca` },
        { pillar: "Environmental", indicator: "Ekuivalen Serapan Pohon", value: Math.round(co2Kg / 10), unit: "Pohon", notes: "Setara serapan tahunan pohon dewasa" },
        { pillar: "Social", indicator: "Pelajar / Pengguna Terdaftar", value: users, unit: "Orang", notes: "Edukasi pemilahan sampah generasi muda" },
        { pillar: "Social", indicator: "Sekolah Mitra Adiwiyata", value: schools, unit: "Sekolah", notes: "Institusi pendidikan di Trenggalek" },
        { pillar: "Economic", indicator: "Estimasi Koin TGX Beredar", value: estCoins, unit: "TGX", notes: "Insentif ekonomi sirkular digital" },
        { pillar: "Economic", indicator: "Nilai Manfaat Finansial", value: estCoins * 1000, unit: "IDR (Rp)", notes: "1 TGX = Rp 1.000" },
        { pillar: "Governance", indicator: "Total Transaksi Terverifikasi", value: txCount, unit: "Transaksi", notes: "Validasi bertingkat admin PT JET" },
        { pillar: "Governance", indicator: "Standar Pelaporan ESG", value: "100%", unit: "Kepatuhan", notes: "GRI Standards, ISO 14064, SRN-PPI" }
    ]);

    // Border & formatting untuk seluruh cell data
    sheet.eachRow((row, rowNumber) => {
        row.alignment = { vertical: "middle" };
        if (rowNumber > 1) {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: "thin", color: { argb: "FFE5E7EB" } },
                    bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
                    left: { style: "thin", color: { argb: "FFE5E7EB" } },
                    right: { style: "thin", color: { argb: "FFE5E7EB" } }
                };
            });
        }
    });

    if (outputStream) {
        await workbook.xlsx.write(outputStream);
    } else {
        return await workbook.xlsx.writeBuffer();
    }
};

module.exports = {
    generateExcel
};
