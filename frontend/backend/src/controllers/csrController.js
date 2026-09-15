const csrService = require("../services/csrService");

/**
 * 1. Mengambil semua Mitra CSR
 * GET /api/csr/partners
 */
const getPartners = async (req, res) => {
    try {
        const partners = await csrService.getPartners();
        return res.status(200).json(partners);
    } catch (error) {
        console.error("Error in getPartners controller:", error);
        return res.status(500).json({
            message: "Gagal memuat daftar mitra CSR",
            error: error.message
        });
    }
};

/**
 * 2. Mendaftarkan Mitra CSR Baru
 * POST /api/csr/partners
 * Body: { company_name, industry, contact_person, email, phone, address }
 */
const createPartner = async (req, res) => {
    try {
        const { company_name, industry, contact_person, email, phone, address } = req.body;

        if (!company_name) {
            return res.status(400).json({
                message: "Nama perusahaan (company_name) wajib diisi"
            });
        }

        const partner = await csrService.createPartner({
            company_name,
            industry,
            contact_person,
            email,
            phone,
            address
        });

        return res.status(201).json({
            message: `Mitra CSR '${company_name}' berhasil didaftarkan`,
            partner
        });
    } catch (error) {
        console.error("Error in createPartner controller:", error);
        return res.status(500).json({
            message: "Gagal mendaftarkan mitra CSR",
            error: error.message
        });
    }
};

/**
 * 3. Membuat CSR Campaign Baru
 * POST /api/csr/campaigns
 * Body: { partner_id, campaign_name, description, target_waste_kg, target_co2, reward_budget, start_date, end_date }
 */
const createCampaign = async (req, res) => {
    try {
        const { partner_id, campaign_name, description, target_waste_kg, target_co2, reward_budget, start_date, end_date } = req.body;

        if (!campaign_name) {
            return res.status(400).json({
                message: "Nama program CSR (campaign_name) wajib diisi"
            });
        }

        const campaign = await csrService.createCampaign({
            partner_id,
            campaign_name,
            description,
            target_waste_kg,
            target_co2,
            reward_budget,
            start_date,
            end_date
        });

        return res.status(201).json({
            message: `Program CSR '${campaign_name}' berhasil dibuat`,
            campaign
        });
    } catch (error) {
        console.error("Error in createCampaign controller:", error);
        return res.status(500).json({
            message: "Gagal membuat program CSR",
            error: error.message
        });
    }
};

/**
 * 4. Mengambil Semua Campaign CSR
 * GET /api/csr/campaigns
 */
const getCampaigns = async (req, res) => {
    try {
        const partnerId = req.query.partner_id;
        const campaigns = await csrService.getCampaigns(partnerId);
        return res.status(200).json(campaigns);
    } catch (error) {
        return res.status(500).json({
            message: "Gagal memuat program CSR",
            error: error.message
        });
    }
};

/**
 * 5. Mengambil Data Dampak Nyata Program CSR
 * GET /api/csr/campaigns/:id/impact
 * Return: { totalWasteKg, co2Impact, students, schools }
 */
const getCampaignImpact = async (req, res) => {
    try {
        const campaignId = req.params.id || 1;
        const impact = await csrService.calculateCampaignImpact(campaignId);
        return res.status(200).json(impact);
    } catch (error) {
        console.error("Error in getCampaignImpact controller:", error);
        return res.status(500).json({
            message: "Gagal memuat kalkulasi dampak CSR",
            error: error.message
        });
    }
};

/**
 * 6. Menghasilkan Laporan Dampak Komprehensif CSR
 * GET /api/csr/report/:id
 */
const getCSRReport = async (req, res) => {
    try {
        const campaignId = req.params.id || 1;
        const report = await csrService.generateCSRReport(campaignId);
        return res.status(200).json(report);
    } catch (error) {
        console.error("Error in getCSRReport controller:", error);
        return res.status(500).json({
            message: "Gagal membuat laporan CSR",
            error: error.message
        });
    }
};

/**
 * 7. Sponsor Reward Marketplace via Dana CSR
 * POST /api/csr/campaigns/:id/sponsor-reward
 */
const sponsorReward = async (req, res) => {
    try {
        const campaignId = req.params.id;
        const { reward_name, quantity, coin_pool, sponsor_amount } = req.body;

        const result = await csrService.sponsorReward(campaignId, {
            reward_name,
            quantity,
            coin_pool,
            sponsor_amount
        });

        return res.status(201).json({
            message: `Sponsorship reward '${reward_name || "Item"}' berhasil dialokasikan`,
            result
        });
    } catch (error) {
        console.error("Error in sponsorReward controller:", error);
        return res.status(500).json({
            message: "Gagal mengalokasikan sponsor reward",
            error: error.message
        });
    }
};

module.exports = {
    getPartners,
    createPartner,
    createCampaign,
    getCampaigns,
    getCampaignImpact,
    getCSRReport,
    sponsorReward
};
