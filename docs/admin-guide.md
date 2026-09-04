# Admin Guide — TGX Waste Coin Platform
> PT Jwalita Energi Trenggalek | Sprint 26

## Roles & Access

| Role | Access Level |
|------|-------------|
| SUPER ADMIN JET | Full system — all modules |
| ADMIN OPERASIONAL | Waste transaction approval, user management |
| ADMIN KARBON | Carbon impact, ESG reports, carbon assets |
| ADMIN LAPORAN | Read-only reports and exports |
| OPERATOR SEKOLAH | School-level waste management |
| GURU PENDAMPING | Student activity monitoring |
| SISWA | Submit waste, view wallet & marketplace |
| direksi | Executive ESG dashboard (read-only) |

---

## Common Admin Tasks

### Approve Waste Transaction
1. Login as ADMIN OPERASIONAL
2. Go to **Admin Dashboard → Verifikasi Sampah**
3. Review photo, weight, and AI analysis score
4. Click **Approve** — coins are credited atomically

### Manage Marketplace Items
1. Go to **Marketplace → Kelola Item**
2. Add/edit items with coin price and stock
3. Review pending redemptions and mark as completed

### Generate ESG Report
1. Go to **ESG Dashboard → Generate Report**
2. Select period (monthly/quarterly/annual)
3. Download PDF or export to Excel

### View Executive Dashboard
- Route: `/executive-dashboard`
- Requires: `direksi` role or `view_executive_dashboard` permission
- Shows: waste totals, carbon impact, SDG alignment, regional map

---

## Monitoring

### Health Check
```
GET http://localhost:5000/api/health
```

### Log Files
Located at: `backend/logs/app-YYYY-MM-DD.log`

Format: JSON lines — search with:
```powershell
Get-Content logs\app-2026-09-04.log | Where-Object { $_ -match '"level":"error"' }
```

### Key Log Events
| Event | Level | When |
|-------|-------|------|
| API error | error | 5xx responses |
| Login failure | warn | Invalid credentials |
| Transaction failure | error | Failed DB transaction |
| DB connection | warn | Fallback to in-memory |

---

## Backup Procedure

Run weekly or before system updates:
```powershell
cd backend
.\database\backup.ps1
```

Backups stored in `backend/database/backups/` — last 30 kept automatically.

---

## Security Checklist (Pre-Production)

- [ ] Change `JWT_SECRET` to random 64+ char string
- [ ] Set `CORS_ORIGINS` to actual frontend domain only
- [ ] Configure real `DATABASE_URL`
- [ ] Set `NODE_ENV=production`
- [ ] Review rate limit values for expected traffic
- [ ] Enable HTTPS in nginx config (uncomment redirect)
- [ ] Set up automated backup cron job
