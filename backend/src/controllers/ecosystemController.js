/**
 * Ecosystem Controller - Sprint 27
 * Circular Economy Business Ecosystem
 */
const ecosystemService = require('../services/ecosystemService');

/**
 * GET /api/ecosystem/partners
 */
async function getPartners(req, res) {
  try {
    const { category } = req.query;
    const partners = await ecosystemService.getPartners(category || null);
    res.json({ data: partners, count: partners.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * POST /api/ecosystem/partners
 */
async function createPartner(req, res) {
  try {
    const { partner_name, category, description, address, contact, logo_url } = req.body;
    if (!partner_name || !category) {
      return res.status(400).json({ error: 'partner_name dan category wajib diisi' });
    }
    const partner = await ecosystemService.createPartner({ partner_name, category, description, address, contact, logo_url });
    res.status(201).json({ data: partner, message: 'Partner berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/ecosystem/partners/:id
 */
async function getPartnerById(req, res) {
  try {
    const partner = await ecosystemService.getPartnerById(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partner tidak ditemukan' });
    const analytics = await ecosystemService.getPartnerAnalytics(req.params.id);
    res.json({ data: { ...partner, analytics } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * POST /api/ecosystem/order
 */
async function createOrder(req, res) {
  try {
    const userId = req.user?.id || req.body.user_id;
    const { item_id, partner_id, coin_amount } = req.body;

    if (!item_id || !partner_id || !coin_amount) {
      return res.status(400).json({ error: 'item_id, partner_id, dan coin_amount wajib diisi' });
    }
    if (coin_amount <= 0) {
      return res.status(400).json({ error: 'coin_amount harus lebih dari 0' });
    }

    const result = await ecosystemService.createOrder(userId, item_id, partner_id, coin_amount);
    if (result.error) return res.status(400).json({ error: result.error });

    res.status(201).json({ data: result.order, message: 'Order berhasil dibuat', success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/ecosystem/impact
 */
async function getEconomicImpact(req, res) {
  try {
    const impact = await ecosystemService.calculateEconomicImpact();
    const rate   = await ecosystemService.getExchangeRate();
    res.json({ data: impact, exchange_rate: rate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/ecosystem/partners/:id/analytics
 */
async function getPartnerAnalytics(req, res) {
  try {
    const analytics = await ecosystemService.getPartnerAnalytics(req.params.id);
    res.json({ data: analytics });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getPartners, createPartner, getPartnerById, createOrder, getEconomicImpact, getPartnerAnalytics };
