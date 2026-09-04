# Architecture Guide — TGX Waste Coin Platform
> PT Jwalita Energi Trenggalek | Sprint 26

## System Overview

TGX Waste Coin is a circular economy platform that converts waste collection into digital incentive tokens (TGX Coins), enabling marketplace redemption, gamification, carbon asset management, and CSR partnerships.

```
┌─────────────────────────────────────────────────────────────┐
│                     Nginx (Port 80/443)                      │
│               Reverse Proxy + Rate Limiting                  │
└──────────────┬──────────────────────┬───────────────────────┘
               │ /api/*               │ /
               ▼                      ▼
┌──────────────────────┐  ┌──────────────────────┐
│   Backend (Node.js)  │  │  Frontend (React)    │
│   Express.js         │  │  Vite + React Router │
│   Port 5000          │  │  Port 80 (nginx)     │
└──────────┬───────────┘  └──────────────────────┘
           │
     ┌─────┴──────┐
     ▼            ▼
┌─────────┐  ┌─────────┐
│PostgreSQL│  │  Redis  │
│Port 5432 │  │Port 6379│
└─────────┘  └─────────┘
```

## Backend Architecture

Pattern: **Controller → Service → Database**

```
server.js
  ├── middleware/
  │   ├── security.js       (helmet, rate-limit, CORS)
  │   ├── auth.js           (JWT verification)
  │   └── permission.js     (role-based access)
  ├── routes/               (Express Router per module)
  ├── controllers/          (Request handling, HTTP responses)
  ├── services/             (Business logic, DB queries)
  │   └── logger.js         (Structured JSON logging)
  └── config/
      └── swagger.js        (OpenAPI 3.0 spec)
```

## Sprint Modules

| Sprint | Module | Key Tables |
|--------|--------|-----------|
| 1-18 | Core (Auth, Waste, Wallet, Carbon, ESG) | users, schools, waste_transactions, wallets, wallet_transactions, carbon_impacts |
| 19 | Marketplace & Redemption | marketplace_items, reward_redemptions |
| 20 | Gamification | user_levels, badges, user_badges, competitions |
| 21 | Carbon Assets | carbon_projects, carbon_inventory, carbon_offsets, carbon_certificates |
| 22 | CSR Partnership | corporate_partners, csr_campaigns, csr_transactions |
| 23 | Mobile Operations | mobile_devices, location_logs |
| 24 | AI Verification | waste_ai_analysis, ai_verification_logs |
| 25 | Executive ESG | executive_snapshots, impact_locations |
| 26 | Production Hardening | schema_migrations (tracking) |

## Business Flow

```
Waste Collection
    ↓ (Student submits via Mobile/Web)
AI Verification (Sprint 24)
    ↓ (Fraud detection, type classification)
Operator Approval
    ↓ (School/Admin verifies)
TGX Coin Credit (atomic wallet_transaction)
    ↓
Wallet Balance
    ↓         ↓              ↓
Marketplace  Gamification  Carbon Impact
(Sprint 19)  (Sprint 20)   (Sprint 21)
    ↓
CSR Report → Corporate Partners (Sprint 22)
    ↓
Executive ESG Dashboard (Sprint 25)
```

## Security Architecture

- **Helmet**: HTTP security headers (CSP, HSTS, X-Frame-Options)
- **Rate Limiting**: 100 req/15min global, 10 req/15min on auth endpoints
- **CORS Whitelist**: Only approved origins from `CORS_ORIGINS` env
- **JWT**: Short-lived access tokens (15m) with refresh token rotation
- **Role-Based Access Control**: 7 roles, granular permissions per endpoint
- **Input Validation**: Body size limits (10MB for image uploads)
- **Non-root Docker**: Backend runs as `tgx` user, not root

## Data Integrity

- All coin operations use **PostgreSQL transactions** (BEGIN/COMMIT/ROLLBACK)
- `wallet_transactions` is the audit trail — never deleted
- Migrations tracked in `schema_migrations` table
- In-memory fallback for development without DB (clearly logged)
