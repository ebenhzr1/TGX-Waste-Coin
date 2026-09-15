/**
 * Ecosystem Routes - Sprint 27
 * Circular Economy Business Ecosystem
 */
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/ecosystemController');
const { authenticate, checkPermission } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/ecosystem/partners:
 *   get:
 *     summary: Get all active eco partners
 *     tags: [Ecosystem]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filter by category (food, retail, health, education, service)
 *     responses:
 *       200:
 *         description: List of partners
 */
router.get('/partners', authenticate, ctrl.getPartners);

/**
 * @swagger
 * /api/ecosystem/partners:
 *   post:
 *     summary: Create a new eco partner
 *     tags: [Ecosystem]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Partner created
 */
router.post('/partners', authenticate, checkPermission('manage_ecosystem_partner'), ctrl.createPartner);

/**
 * @swagger
 * /api/ecosystem/partners/{id}:
 *   get:
 *     summary: Get partner detail with analytics
 *     tags: [Ecosystem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 */
router.get('/partners/:id', authenticate, ctrl.getPartnerById);
router.get('/partners/:id/analytics', authenticate, checkPermission('view_economic_dashboard'), ctrl.getPartnerAnalytics);

/**
 * @swagger
 * /api/ecosystem/order:
 *   post:
 *     summary: Create a marketplace order (deducts TGX coins atomically)
 *     tags: [Ecosystem]
 *     security:
 *       - bearerAuth: []
 */
router.post('/order', authenticate, ctrl.createOrder);

/**
 * @swagger
 * /api/ecosystem/impact:
 *   get:
 *     summary: Get circular economy economic impact metrics
 *     tags: [Ecosystem]
 *     security:
 *       - bearerAuth: []
 */
router.get('/impact', authenticate, checkPermission('view_economic_dashboard'), ctrl.getEconomicImpact);

module.exports = router;
