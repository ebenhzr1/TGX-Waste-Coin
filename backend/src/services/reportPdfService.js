const PDFDocument = require("pdfkit");

/**
 * Menghasilkan Dokumen PDF Laporan ESG & Impact
 * TGX Waste Coin × Jwalita For Earth
 * 
 * Bagian:
 * 1. Environmental
 * 2. Social
 * 3. Economic
 * 4. Governance
 * 
 * @param {object} report Objek data laporan
 * @param {stream.Writable} outputStream Stream tujuan (Express res)
 */
const generatePDF = (report, outputStream) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });

            if (outputStream) {
                doc.pipe(outputStream);
            }

            // Header
            doc.fontSize(22).font("Helvetica-Bold").fillColor("#059669").text("TGX Waste Coin", { align: "center" });
            doc.fontSize(14).font("Helvetica-Bold").fillColor("#047857").text("Jwalita For Earth", { align: "center" });
            doc.fontSize(10).font("Helvetica").fillColor("#4b5563").text("PT Jwalita Energi Trenggalek • ESG & Impact Assessment Report", { align: "center" });
            doc.moveDown(0.5);

            // Divider Line
            doc.strokeColor("#10b981").lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(1);

            // Metadata Periode
            doc.fontSize(11).font("Helvetica-Bold").fillColor("#1f2937").text(`Periode Laporan: ${report.period || "2026"}`, { align: "left" });
            doc.fontSize(9).font("Helvetica").fillColor("#6b7280").text(`Tanggal Terbit: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`, { align: "left" });
            doc.moveDown(1.5);

            // 1. ENVIRONMENTAL
            doc.fontSize(13).font("Helvetica-Bold").fillColor("#065f46").text("1. ENVIRONMENTAL (Dampak Lingkungan & Karbon)");
            doc.fontSize(10).font("Helvetica").fillColor("#374151");
            const wasteKg = report.environmental?.totalWasteKg || 0;
            const co2Kg = report.environmental?.co2Avoided || 0;
            doc.text(`• Total Sampah Terkelola (Diverted from Landfill) : ${wasteKg.toLocaleString("id-ID")} Kg`);
            doc.text(`• Total Emisi Karbon Dihindari (CO2 Avoided)        : ${co2Kg.toLocaleString("id-ID")} kgCO2e (${(co2Kg / 1000).toFixed(2)} tCO2e)`);
            doc.text(`• Ekuivalen Serapan Pohon Dewasa (Tree Equivalent)  : ${Math.round(co2Kg / 10).toLocaleString("id-ID")} Pohon`);
            doc.moveDown(1);

            // 2. SOCIAL
            doc.fontSize(13).font("Helvetica-Bold").fillColor("#1e40af").text("2. SOCIAL (Partisipasi Sosial & Sekolah)");
            doc.fontSize(10).font("Helvetica").fillColor("#374151");
            const users = report.social?.totalUsers || 0;
            const schools = report.social?.totalSchool || 0;
            doc.text(`• Total Pelajar & Civitas Terdaftar (Users)         : ${users.toLocaleString("id-ID")} Orang`);
            doc.text(`• Sekolah Mitra Program Adiwiyata Trenggalek        : ${schools.toLocaleString("id-ID")} Sekolah`);
            doc.text(`• Program Pemberdayaan Kebersihan Generasi Muda     : Aktif di Kabupaten Trenggalek`);
            doc.moveDown(1);

            // 3. ECONOMIC
            doc.fontSize(13).font("Helvetica-Bold").fillColor("#b45309").text("3. ECONOMIC (Ekonomi Sirkular & Insentif TGX)");
            doc.fontSize(10).font("Helvetica").fillColor("#374151");
            const estCoins = Math.round(wasteKg * 3.5);
            doc.text(`• Estimasi Koin TGX Beredar ke Siswa                : ${estCoins.toLocaleString("id-ID")} TGX`);
            doc.text(`• Manfaat Finansial Langsung bagi Pelajar           : Rp ${(estCoins * 1000).toLocaleString("id-ID")}`);
            doc.text(`• Penghematan Beban Operasional Pengolahan TPA      : Rp ${(wasteKg * 800).toLocaleString("id-ID")}`);
            doc.moveDown(1);

            // 4. GOVERNANCE
            doc.fontSize(13).font("Helvetica-Bold").fillColor("#4338ca").text("4. GOVERNANCE (Tata Kelola & Validasi Digital)");
            doc.fontSize(10).font("Helvetica").fillColor("#374151");
            const txCount = report.governance?.totalTransaction || 0;
            doc.text(`• Total Transaksi Terverifikasi Digital             : ${txCount.toLocaleString("id-ID")} Transaksi`);
            doc.text(`• Mekanisme Verifikasi                              : Multi-Level Approval Admin PT JET`);
            doc.text(`• Keselarasan Standar ESG                           : ISO 14064, GHG Protocol Scope 3 & SRN-PPI`);
            doc.moveDown(2);

            // Footer
            doc.strokeColor("#e5e7eb").lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);
            doc.fontSize(8).font("Helvetica-Oblique").fillColor("#9ca3af").text(
                "Dokumen resmi ini di-generate secara otomatis oleh Sistem TGX Waste Coin & Jwalita For Earth.",
                { align: "center" }
            );

            doc.end();
            resolve();
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    generatePDF
};
