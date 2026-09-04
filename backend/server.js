const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// ── Sprint 26: Security middleware (before everything) ─────────────────────
const { applySecurityMiddleware } = require('./src/middleware/security');
applySecurityMiddleware(app);

app.use(express.static(path.join(__dirname, 'src/uploads'), { maxAge: '1d' }));
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// ── Sprint 26: Request logger ──────────────────────────────────────────────
const logger = require('./src/services/logger');
app.use(logger.requestLogger);

// ── Sprint 26: Swagger docs ────────────────────────────────────────────────
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'TGX Waste Coin API Docs',
  customCss: '.swagger-ui .topbar { background-color: #1a7a4a; }',
}));

// ── Routes (Sprint 1-25 unchanged) ────────────────────────────────────────
const authRoutes        = require('./src/routes/authRoutes');
const wasteRoutes       = require('./src/routes/wasteRoutes');
const dashboardRoutes   = require('./src/routes/dashboardRoutes');
const rankingRoutes     = require('./src/routes/rankingRoutes');
const notificationRoutes= require('./src/routes/notificationRoutes');
const exportRoutes      = require('./src/routes/exportRoutes');
const carbonRoutes      = require('./src/routes/carbonRoutes');
const reportRoutes      = require('./src/routes/reportRoutes');
const userRoutes        = require('./src/routes/userRoutes');
const marketplaceRoutes = require('./src/routes/marketplaceRoutes');
const gamificationRoutes= require('./src/routes/gamificationRoutes');
const carbonAssetRoutes = require('./src/routes/carbonAssetRoutes');
const csrRoutes         = require('./src/routes/csrRoutes');
const mobileRoutes      = require('./src/routes/mobileRoutes');
const aiWasteRoutes     = require('./src/routes/aiWasteRoutes');
const executiveRoutes   = require('./src/routes/executiveRoutes');
const ecosystemRoutes   = require('./src/routes/ecosystemRoutes');

app.use('/api/auth',        authRoutes);
app.use('/api/waste',       wasteRoutes);
app.use('/api/dashboard',   dashboardRoutes);
app.use('/api/ranking',     rankingRoutes);
app.use('/api/notification',notificationRoutes);
app.use('/api/export',      exportRoutes);
app.use('/api/carbon',      carbonRoutes);
app.use('/api/report',      reportRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/gamification',gamificationRoutes);
app.use('/api/carbon-assets',carbonAssetRoutes);
app.use('/api/csr',         csrRoutes);
app.use('/api/mobile',      mobileRoutes);
app.use('/api/ai',          aiWasteRoutes);
app.use('/api/executive',   executiveRoutes);
app.use('/api/ecosystem',   ecosystemRoutes);

// ── Schedulers ────────────────────────────────────────────────────────────
if (!process.env.VERCEL) {
  try { require('./src/services/scheduler'); } catch (e) {}
}

// ── Sprint 26: Health endpoint ─────────────────────────────────────────────
const { Pool } = require('pg');
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: System health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: System is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    await pool.query('SELECT 1');
    await pool.end();
    dbStatus = 'connected';
  } catch (_) {
    dbStatus = 'offline (fallback active)';
  }
  res.json({
    status: 'healthy',
    database: dbStatus,
    version: '1.0.0',
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/', (req, res) => {
  res.json({
    message: 'TGX Waste Coin API Running',
    docs: '/api/docs',
    health: '/api/health',
  });
});

// ── Sprint 26: Global error handler (last middleware) ─────────────────────
app.use(logger.errorHandler);

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`, {
      env: process.env.NODE_ENV || 'development',
      docs: `http://localhost:${PORT}/api/docs`,
    });
  });
}

module.exports = app;