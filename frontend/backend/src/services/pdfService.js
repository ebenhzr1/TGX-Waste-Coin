const PDFDocument = require("pdfkit");
const pool = require("../config/database");

/**
 * Generate PDF Bukti Setor Sampah
 * @param {number} transactionId ID transaksi
 * @param {stream.Writable} outputStream Stream tujuan (cth: res Express)
 */
const generateReceiptPDF = async (transactionId, outputStream) => {
    // Ambil data transaksi
    const result = await pool.query(
        `
        SELECT 
            wt.id,
            TO_CHAR(wt.created_at, 'DD Mon YYYY, HH24:MI') AS tanggal,
            COALESCE(u.name, 'Siswa TGX') AS nama,
            COALESCE(s.school_name, 'Sekolah Mitra Trenggalek') AS sekolah,
            wt.waste_type,
            wt.weight_kg,
            wt.coin_amount,
            wt.status,
            COALESCE(v.name, 'Admin PT JET') AS verifikator
        FROM waste_transactions wt
        LEFT JOIN users u ON wt.user_id = u.id
        LEFT JOIN schools s ON wt.school_id = s.id
        LEFT JOIN users v ON wt.verified_by = v.id
        WHERE wt.id = $1
        `,
        [transactionId]
    );

    if (result.rows.length === 0) {
        throw new Error("Transaksi setoran sampah tidak ditemukan");
    }

    const tx = result.rows[0];

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });

        doc.pipe(outputStream);

        // Header PT JET & TGX
        doc.fontSize(20).font("Helvetica-Bold").text("TGX WASTE COIN", { align: "center" });
        doc.fontSize(11).font("Helvetica").text("PT Jwalita Energi Trenggalek (JET)", { align: "center" });
        doc.fontSize(9).text("Program Ekonomi Sirkular & Pengurangan Emisi Karbon Sekolah", { align: "center" });
        doc.moveDown();

        // Horizontal divider
        doc.strokeColor("#16a34a").lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Title
        doc.fontSize(14).font("Helvetica-Bold").text("BUKTI SETOR SAMPAH RESMI", { align: "center" });
        doc.moveDown(0.5);

        // Details Box
        doc.fontSize(11).font("Helvetica");
        doc.text(`No. Referensi      : TX-${tx.id.toString().padStart(6, '0')}`);
        doc.text(`Tanggal            : ${tx.tanggal} WIB`);
        doc.text(`Nama Siswa         : ${tx.nama}`);
        doc.text(`Sekolah            : ${tx.sekolah}`);
        doc.moveDown(0.5);

        doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);

        doc.text(`Jenis Sampah       : ${tx.waste_type.toUpperCase()}`);
        doc.text(`Berat Timbangan    : ${tx.weight_kg} Kg`);
        doc.fontSize(12).font("Helvetica-Bold").fillColor("#16a34a")
           .text(`Koin TGX Didapat   : +${tx.coin_amount} TGX`);
        doc.fillColor("#000000").fontSize(11).font("Helvetica");
        doc.text(`Status Verifikasi  : ${tx.status.toUpperCase()}`);
        doc.text(`Diverifikasi Oleh  : ${tx.verifikator}`);
        doc.moveDown();

        // Footer / QR Verification note
        const startY = doc.y + 10;
        doc.rect(50, startY, 500, 45).fillAndStroke("#f8fafc", "#cbd5e1");
        doc.fillColor("#334155").fontSize(9)
           .text("[ VERIFIKASI RESMI TERDAFTAR ]", 50, startY + 8, { align: "center" })
           .text("Dokumen ini dihasilkan secara otomatis oleh TGX Waste Coin System PT JET.", 50, startY + 20, { align: "center" })
           .text("Validitas dapat diverifikasi langsung melalui database jaringan TGX Trenggalek.", 50, startY + 32, { align: "center" });

        doc.end();

        outputStream.on("finish", resolve);
        outputStream.on("error", reject);
    });
};

module.exports = {
    generateReceiptPDF
};
