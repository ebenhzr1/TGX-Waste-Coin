/**
 * Swagger / OpenAPI 3.0 Configuration - Sprint 26
 */
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TGX Waste Coin API',
      version: '1.0.0',
      description: `
## TGX Waste Coin - PT Jwalita Energi Trenggalek

Enterprise circular economy platform converting waste collection into TGX Coins,
enabling marketplace redemption, gamification, carbon asset management, and CSR partnerships.

### Authentication
All protected endpoints require a Bearer JWT token in the \`Authorization\` header:
\`\`\`
Authorization: Bearer <token>
\`\`\`
      `,
      contact: {
        name: 'PT Jwalita Energi Trenggalek',
        email: 'tech@jwalita.co.id',
      },
      license: { name: 'ISC' },
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development' },
      { url: process.env.APP_URL || 'https://api.tgx.jwalita.co.id', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status:   { type: 'string', example: 'healthy' },
            database: { type: 'string', example: 'connected' },
            version:  { type: 'string', example: '1.0.0' },
            uptime:   { type: 'number', example: 3600 },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email:    { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id:    { type: 'integer' },
                name:  { type: 'string' },
                email: { type: 'string' },
                role:  { type: 'string' },
              },
            },
          },
        },
        WasteTransaction: {
          type: 'object',
          properties: {
            id:           { type: 'integer' },
            student_id:   { type: 'integer' },
            waste_type:   { type: 'string', example: 'Plastik' },
            weight_kg:    { type: 'number', example: 2.5 },
            coin_earned:  { type: 'number', example: 25 },
            status:       { type: 'string', enum: ['pending', 'approved', 'rejected'] },
            created_at:   { type: 'string', format: 'date-time' },
          },
        },
        MarketplaceItem: {
          type: 'object',
          properties: {
            id:          { type: 'integer' },
            name:        { type: 'string' },
            description: { type: 'string' },
            coin_price:  { type: 'number' },
            stock:       { type: 'integer' },
            category:    { type: 'string' },
          },
        },
      },
    },
    tags: [
      { name: 'Health',       description: 'System health check' },
      { name: 'Auth',         description: 'Authentication & session management' },
      { name: 'Waste',        description: 'Waste submission & approval' },
      { name: 'Wallet',       description: 'TGX Coin wallet & transactions' },
      { name: 'Carbon',       description: 'Carbon impact calculation & reporting' },
      { name: 'Marketplace',  description: 'Reward marketplace & redemption' },
      { name: 'Gamification', description: 'Achievements, levels & competitions' },
      { name: 'Carbon Assets',description: 'Carbon credit & asset management' },
      { name: 'CSR',          description: 'Corporate CSR campaigns & partnerships' },
      { name: 'AI',           description: 'AI waste image verification' },
      { name: 'Executive',    description: 'Executive ESG Command Center' },
      { name: 'Mobile',       description: 'Mobile app sync endpoints' },
    ],
  },
  // Scan route files for JSDoc @swagger annotations
  apis: [
    './src/routes/*.js',
    './server.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
