const reportService = require("../services/reportService");
const reportPdfService = require("../services/reportPdfService");
const reportExcelService = require("../services/reportExcelService");

/**
 * 1. Mendapatkan Data JSON Laporan Dampak & ESG
 * GET /api/report/impact?start=2026-01-01&end=2026-12-31
 */
const getImpactReport = async (req, res) => {
    try {
        const { start, end } = req.query;
        const currentYear = new Date().getFullYear().toString();
        const period = (start && end) ? `${start} s/d ${end}` : currentYear;

        const data = await reportService.generateImpactReport(start, end);

        res.json({
            period,
            environmental: data.environmental,
            social: data.social,
            governance: data.governance
        });
    } catch (error) {
        console.error("Error generating impact report:", error);
        res.status(500).json({
            message: "Gagal memproses laporan dampak",
            error: error.message
        });
    }
};

/**
 * 2. Download Laporan Dampak & ESG dalam Format PDF
 * GET /api/report/pdf
 */
const getImpactPdf = async (req, res) => {
    try {
        const { start, end } = req.query;
        const currentYear = new Date().getFullYear().toString();
        const period = (start && end) ? `${start} s/d ${end}` : currentYear;

        const data = await reportService.generateImpactReport(start, end);
        const report = {
            period,
            ...data
        };

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=TGX_ESG_Impact_Report_${Date.now()}.pdf`);

        await reportPdfService.generatePDF(report, res);
    } catch (error) {
        console.error("Error exporting impact PDF:", error);
        res.status(500).json({
            message: "Gagal men-generate PDF laporan",
            error: error.message
        });
    }
};

/**
 * 3. Download Laporan Dampak & ESG dalam Format Excel
 * GET /api/report/excel
 */
const getImpactExcel = async (req, res) => {
    try {
        const { start, end } = req.query;
        const currentYear = new Date().getFullYear().toString();
        const period = (start && end) ? `${start} s/d ${end}` : currentYear;

        const data = await reportService.generateImpactReport(start, end);
        const report = {
            period,
            ...data
        };

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=TGX_Impact_Report.xlsx"
        );

        await reportExcelService.generateExcel(report, res);
    } catch (error) {
        console.error("Error exporting impact Excel:", error);
        res.status(500).json({
            message: "Gagal men-generate Excel laporan",
            error: error.message
        });
    }
};

module.exports = {
    getImpactReport,
    getImpactPdf,
    getImpactExcel
};
