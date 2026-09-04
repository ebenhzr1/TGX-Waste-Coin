const executiveDashboardService = require("../services/executiveDashboardService");

/**
 * GET /api/executive/overview
 * Metrik KPI Utama untuk Direksi, Investor, dan Pemerintah
 */
const getOverview = async (req, res) => {
    try {
        const data = await executiveDashboardService.getExecutiveOverview();
        res.json({
            message: "Executive overview data loaded successfully",
            overview: data,
            ...data
        });
    } catch (error) {
        console.error("Error loading executive overview:", error);
        res.status(500).json({
            message: "Gagal memuat executive overview",
            error: error.message
        });
    }
};

/**
 * GET /api/executive/environmental
 * Metrik Kinerja Lingkungan & Karbon
 */
const getEnvironmental = async (req, res) => {
    try {
        const data = await executiveDashboardService.getEnvironmentalMetric();
        res.json({
            message: "Environmental metrics loaded successfully",
            environmental: data,
            ...data
        });
    } catch (error) {
        console.error("Error loading environmental metrics:", error);
        res.status(500).json({
            message: "Gagal memuat environmental metrics",
            error: error.message
        });
    }
};

/**
 * GET /api/executive/social
 * Metrik Dampak Sosial, Siswa, dan Sekolah Adiwiyata
 */
const getSocial = async (req, res) => {
    try {
        const data = await executiveDashboardService.getSocialMetric();
        res.json({
            message: "Social impact metrics loaded successfully",
            social: data,
            ...data
        });
    } catch (error) {
        console.error("Error loading social metrics:", error);
        res.status(500).json({
            message: "Gagal memuat social metrics",
            error: error.message
        });
    }
};

/**
 * GET /api/executive/economic
 * Metrik Nilai Ekonomi Sirkular, Sirkulasi Koin, & CSR
 */
const getEconomic = async (req, res) => {
    try {
        const data = await executiveDashboardService.getEconomicMetric();
        res.json({
            message: "Economic circular metrics loaded successfully",
            economic: data,
            ...data
        });
    } catch (error) {
        console.error("Error loading economic metrics:", error);
        res.status(500).json({
            message: "Gagal memuat economic metrics",
            error: error.message
        });
    }
};

/**
 * GET /api/executive/governance
 * Metrik Tata Kelola, Verifikasi AI, Integritas Audit Trail
 */
const getGovernance = async (req, res) => {
    try {
        const data = await executiveDashboardService.getGovernanceMetric();
        res.json({
            message: "Governance compliance metrics loaded successfully",
            governance: data,
            ...data
        });
    } catch (error) {
        console.error("Error loading governance metrics:", error);
        res.status(500).json({
            message: "Gagal memuat governance metrics",
            error: error.message
        });
    }
};

/**
 * GET /api/executive/map
 * Data Pemetaan Spasial Kabupaten Trenggalek
 */
const getMap = async (req, res) => {
    try {
        const locations = await executiveDashboardService.getRegionalImpact();
        res.json({
            message: "Regional impact map data loaded successfully",
            regency: "Kabupaten Trenggalek",
            total_districts: locations.length,
            locations: locations
        });
    } catch (error) {
        console.error("Error loading regional map data:", error);
        res.status(500).json({
            message: "Gagal memuat data peta regional",
            error: error.message
        });
    }
};

/**
 * GET /api/executive/esg
 * Skor Komposit ESG dan Rating (AAA / AA / A)
 */
const getESGScore = async (req, res) => {
    try {
        const esg = await executiveDashboardService.calculateESGScore();
        res.json({
            message: "ESG composite rating evaluated successfully",
            esg: esg,
            ...esg
        });
    } catch (error) {
        console.error("Error evaluating ESG score:", error);
        res.status(500).json({
            message: "Gagal menghitung skor ESG",
            error: error.message
        });
    }
};

/**
 * GET /api/executive/report/pdf
 * Mengunduh Dokumen Laporan Eksekutif PDF Resmi PT JET
 */
const getPDFReport = async (req, res) => {
    try {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="Executive-ESG-Report-PT-JET-${Date.now()}.pdf"`
        );
        await executiveDashboardService.generateExecutivePDFReport(res);
    } catch (error) {
        console.error("Error generating executive PDF report:", error);
        if (!res.headersSent) {
            res.status(500).json({
                message: "Gagal menerbitkan laporan eksekutif PDF",
                error: error.message
            });
        }
    }
};

module.exports = {
    getOverview,
    getEnvironmental,
    getSocial,
    getEconomic,
    getGovernance,
    getMap,
    getESGScore,
    getPDFReport
};
