# Installation Guide — TGX Waste Coin Platform
> PT Jwalita Energi Trenggalek | Sprint 26

## Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Node.js | 20.x LTS |
| npm | 10.x |
| PostgreSQL | 15+ (or Supabase) |
| Docker Desktop | 24+ (for containerized deploy) |
| Git | 2.40+ |

---

## 1. Clone Repository

```bash
git clone https://github.com/jwalita/tgx-waste-coin.git
cd tgx-waste-coin
```

---

## 2. Development Setup (Local)

### Backend

```bash
cd backend
cp .env.production .env   # Then edit .env with your values
npm install
npm run dev               # Starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev               # Starts on http://localhost:5173
```

> **Note**: If `DATABASE_URL` is not configured, the backend runs in **in-memory fallback mode** — all endpoints work but data is not persisted.

---

## 3. Database Setup

### Option A: Supabase (Recommended)
1. Create a project at https://supabase.com
2. Copy the connection string from **Project Settings → Database**
3. Paste into `backend/.env` as `DATABASE_URL`
4. Run migrations:

```bash
cd backend
node database/migrate.js
```

### Option B: Local PostgreSQL
```bash
createdb tgx_production
DATABASE_URL=postgresql://localhost/tgx_production node database/migrate.js
```

---

## 4. Production Setup (Docker)

```bash
# Copy and configure production env
cp backend/.env.production backend/.env.production.local
# Edit values in backend/.env.production.local

# Build and start all services
docker compose up --build -d

# Run migrations inside container
docker compose exec backend node database/migrate.js

# Check health
curl http://localhost/api/health
```

**Services started:**
| Service | Port |
|---------|------|
| Nginx (reverse proxy) | 80, 443 |
| Backend API | 5000 (internal) |
| Frontend | 80 (internal) |
| PostgreSQL | 5432 |
| Redis | 6379 |

---

## 5. Environment Variables Reference

See [`backend/.env.production`](../backend/.env.production) for full reference with comments.

**Critical variables:**

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Min 64-char random secret |
| `CORS_ORIGINS` | Comma-separated allowed frontend URLs |
| `PORT` | Backend port (default: 5000) |

---

## 6. Verify Installation

```bash
# Health check
curl http://localhost:5000/api/health

# API docs
open http://localhost:5000/api/docs

# Run full test suite
node backend/src/testSprint26.js
```

Expected health response:
```json
{
  "status": "healthy",
  "database": "connected",
  "version": "1.0.0",
  "uptime": 42,
  "environment": "production"
}
```
