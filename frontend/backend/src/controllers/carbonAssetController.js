const carbonAssetService = require("../services/carbonAssetService");

/**
 * 1. Mengambil ringkasan Carbon Inventory & Potential Carbon Asset
 * GET /api/carbon-assets/inventory
 * Response:
 * {
 *   project: "TGX Waste Carbon Project",
 *   totalWaste: 10000,
 *   co2Avoided: 20000,
 *   carbonUnit: 20
 * }
 */
const getCarbonInventory = async (req, res) => {
    try {
        const projectId = req.query.projectId ? parseInt(req.query.projectId) : 1;
        const inventory = await carbonAssetService.calculateCarbonInventory(projectId);
        const projects = await carbonAssetService.getProjects();
        const activeProject = projects.find(p => p.id === projectId) || projects[0] || { name: "TGX Waste Carbon Project" };

        return res.status(200).json({
            project: activeProject.name,
            totalWaste: inventory.totalWasteKg,
            co2Avoided: inventory.totalCO2,
            carbonUnit: inventory.carbonUnit,
            // Informasi tambahan untuk UI dashboard
            status: activeProject.status || "active",
            location: activeProject.location || "Trenggalek, Jawa Timur",
            unitType: "tCO2e (Carbon Impact Unit)",
            lastCalculated: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error in getCarbonInventory:", error);
        return res.status(500).json({
            message: "Gagal memuat carbon inventory",
            error: error.message
        });
    }
};

/**
 * 2. Admin membuat Carbon Project baru
 * POST /api/carbon-assets/project
 * Body: { name, description, location, start_date, end_date }
 */
const createProject = async (req, res) => {
    try {
        const { name, description, location, start_date, end_date } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Nama project karbon wajib diisi"
            });
        }

        const newProject = await carbonAssetService.createProject({
            name,
            description,
            location,
            start_date,
            end_date
        });

        return res.status(201).json({
            message: `Proyek karbon '${name}' berhasil dibuat`,
            project: newProject
        });
    } catch (error) {
        console.error("Error in createProject:", error);
        return res.status(500).json({
            message: "Gagal membuat proyek karbon",
            error: error.message
        });
    }
};

/**
 * 3. Mengambil daftar Carbon Projects
 * GET /api/carbon-assets/projects
 */
const getProjects = async (req, res) => {
    try {
        const projects = await carbonAssetService.getProjects();
        return res.status(200).json(projects);
    } catch (error) {
        return res.status(500).json({
            message: "Gagal memuat daftar proyek karbon",
            error: error.message
        });
    }
};

/**
 * 4. Membuat Offset Transaction baru & Otomatis Menerbitkan Sertifikat
 * POST /api/carbon-assets/offset
 * Body: { buyer_name: "PT ABC", carbon_amount: 10, purpose: "CSR Offset" }
 */
const createOffset = async (req, res) => {
    try {
        const { buyer_name, buyer_type, carbon_amount, purpose } = req.body;

        if (!buyer_name || !carbon_amount || parseFloat(carbon_amount) <= 0) {
            return res.status(400).json({
                message: "Nama pembeli (buyer_name) dan jumlah karbon (carbon_amount) wajib diisi valid"
            });
        }

        const result = await carbonAssetService.createOffset({
            buyer_name,
            buyer_type: buyer_type || "Corporate",
            carbon_amount: parseFloat(carbon_amount),
            purpose: purpose || "CSR Carbon Offset"
        });

        return res.status(201).json({
            message: "Transaksi offset dan sertifikat berhasil diproses",
            offset: result.offset,
            certificate: result.certificate
        });
    } catch (error) {
        console.error("Error in createOffset:", error);
        return res.status(500).json({
            message: "Gagal memproses transaksi offset",
            error: error.message
        });
    }
};

/**
 * 5. Mengambil daftar Transaksi Offset
 * GET /api/carbon-assets/offsets
 */
const getOffsets = async (req, res) => {
    try {
        const offsets = await carbonAssetService.getOffsets();
        return res.status(200).json(offsets);
    } catch (error) {
        return res.status(500).json({
            message: "Gagal memuat transaksi offset",
            error: error.message
        });
    }
};

/**
 * 6. Mengambil Sertifikat Karbon berdasarkan ID atau Kode
 * GET /api/carbon-assets/certificate/:id
 */
const getCertificate = async (req, res) => {
    try {
        const certId = req.params.id;
        const cert = await carbonAssetService.getCertificateById(certId);

        if (!cert) {
            return res.status(404).json({
                message: "Sertifikat karbon tidak ditemukan"
            });
        }

        return res.status(200).json({
            certificate_code: cert.certificate_code,
            holder_name: cert.holder_name,
            carbon_amount: cert.carbon_amount,
            issued_date: cert.issued_date,
            unit: "tCO2e",
            details: {
                id: cert.id,
                offset_id: cert.offset_id,
                status: "valid",
                issuer: "PT Jwalita Energi Trenggalek (TGX Waste Coin)",
                standard: "Potential Carbon Asset / Jwalita Environmental Impact Unit"
            }
        });
    } catch (error) {
        console.error("Error in getCertificate:", error);
        return res.status(500).json({
            message: "Gagal memuat sertifikat karbon",
            error: error.message
        });
    }
};

/**
 * 7. Mengambil Semua Sertifikat
 * GET /api/carbon-assets/certificates
 */
const getCertificates = async (req, res) => {
    try {
        const certs = await carbonAssetService.getCertificates();
        return res.status(200).json(certs);
    } catch (error) {
        return res.status(500).json({
            message: "Gagal memuat daftar sertifikat",
            error: error.message
        });
    }
};

module.exports = {
    getCarbonInventory,
    createProject,
    getProjects,
    createOffset,
    getOffsets,
    getCertificate,
    getCertificates
};
