const { generateWasteCSV } = require("../services/exportService");
const { generateReceiptPDF } = require("../services/pdfService");

// GET /api/export/waste (Download CSV)
const exportWasteCSV = async (req, res) => {
    try {
        const csvData = await generateWasteCSV();

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", 'attachment; filename="laporan_sampah.csv"');
        res.status(200).send(csvData);
    } catch (error) {
        console.error("Error exporting waste CSV:", error);
        res.status(500).json({
            message: "Gagal mengekspor laporan CSV",
            error: error.message
        });
    }
};

// GET /api/export/receipt/:id (Download PDF)
const exportReceiptPDF = async (req, res) => {
    try {
        const { id } = req.params;

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="bukti_setor_TX-${id}.pdf"`);

        await generateReceiptPDF(id, res);
    } catch (error) {
        console.error("Error exporting receipt PDF:", error);
        if (!res.headersSent) {
            res.status(500).json({
                message: "Gagal menghasilkan bukti setor PDF",
                error: error.message
            });
        }
    }
};

module.exports = {
    exportWasteCSV,
    exportReceiptPDF
};
