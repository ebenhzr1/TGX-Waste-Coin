# API Reference — TGX Waste Coin Platform
> PT Jwalita Energi Trenggalek | Sprint 26
>
> **Interactive docs**: http://localhost:5000/api/docs (Swagger UI)

## Base URL
- **Development**: `http://localhost:5000`
- **Production**: `https://api.tgx.jwalita.co.id`

## Authentication

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "password" }
```

Response: `{ "token": "...", "user": { "id", "name", "email", "role" } }`

---

## Endpoints Summary

| Module | Base Path | Key Endpoints |
|--------|-----------|---------------|
| Auth | `/api/auth` | POST /login, POST /register, GET /me |
| Waste | `/api/waste` | POST /submit, GET /list, PUT /approve/:id |
| Dashboard | `/api/dashboard` | GET /student, GET /school, GET /admin |
| Wallet | `/api/dashboard` | GET /wallet, GET /wallet/transactions |
| Carbon | `/api/carbon` | GET /impact, GET /report |
| Ranking | `/api/ranking` | GET /school, GET /student |
| Marketplace | `/api/marketplace` | GET /items, POST /redeem |
| Gamification | `/api/gamification` | GET /leaderboard, GET /badges, GET /competitions |
| Carbon Assets | `/api/carbon-assets` | GET /projects, GET /inventory, POST /offset |
| CSR | `/api/csr` | GET /partners, GET /campaigns, GET /impact-report |
| AI | `/api/ai` | POST /analyze, GET /history |
| Executive | `/api/executive` | GET /overview, GET /environmental, GET /social, GET /economic |
| Mobile | `/api/mobile` | POST /sync, POST /submit, GET /dashboard |
| Health | `/api/health` | GET (no auth) |
| Docs | `/api/docs` | GET Swagger UI (no auth) |

---

## Response Format

**Success:**
```json
{ "data": { ... } }
```

**Error:**
```json
{ "error": "Error message" }
```

**Validation error (400):**
```json
{ "error": "Validation failed", "details": [...] }
```

## Rate Limits

| Endpoint Group | Limit |
|----------------|-------|
| All `/api/*` | 100 req / 15 min per IP |
| `/api/auth/login` | 10 req / 15 min per IP |
| `/api/auth/register` | 10 req / 15 min per IP |

> See full interactive documentation at `GET /api/docs`
