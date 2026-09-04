# Database Guide — TGX Waste Coin Platform
> PT Jwalita Energi Trenggalek | Sprint 26

## Migration System

Migrations are stored in `backend/database/migrations/` and tracked in the `schema_migrations` table.

### Run Migrations

```bash
cd backend
node database/migrate.js
```

Migrations are applied in filename order (001, 002, ...) and are **idempotent** — safe to run multiple times.

### Migration Files

| File | Sprint | Contents |
|------|--------|----------|
| `001_sprint1_18_core.sql` | 1-18 | users, schools, waste_transactions, wallets, wallet_transactions, rankings, notifications, carbon_impacts, impact_reports, roles, permissions |
| `002_sprint19_marketplace.sql` | 19 | marketplace_items, reward_redemptions + seed items |
| `003_sprint20_gamification.sql` | 20 | user_levels, badges, user_badges, competitions, competition_results + seed badges |
| `004_sprint21_carbon_assets.sql` | 21 | carbon_projects, carbon_inventory, carbon_offsets, carbon_certificates |
| `005_sprint22_csr.sql` | 22 | corporate_partners, csr_campaigns, csr_transactions, impact_beneficiaries |
| `006_sprint23_mobile.sql` | 23 | mobile_devices, location_logs |
| `007_sprint24_ai.sql` | 24 | waste_ai_analysis, ai_verification_logs |
| `008_sprint25_executive.sql` | 25 | executive_snapshots, impact_locations + 14 Trenggalek kecamatan seed |

---

## Backup & Restore

### Backup (Windows PowerShell)
```powershell
cd backend
.\database\backup.ps1
# Saves to: backend/database/backups/tgx_backup_YYYYMMDD_HHMMSS.sql
# Keeps last 30 backups automatically
```

### Backup (Linux/Docker)
```bash
cd backend
./database/backup.sh
```

### Restore (Windows)
```powershell
.\database\restore.ps1 -BackupFile .\database\backups\tgx_backup_20260904_120000.sql
```

> ⚠️ **Warning**: Restore overwrites the database. Always confirm you have a recent backup before restoring.

---

## Key Tables Reference

### `wallet_transactions` (Audit Trail)
```
transaction_type: 'waste_deposit' | 'reward_ranking' | 'redeem' | 'csr_bonus'
amount: positive = credit, negative = debit
```
**Never delete rows from this table.** It is the financial audit trail.

### `waste_transactions` (Core)
```
status: 'pending' → 'approved' | 'rejected'
coin_amount: calculated at approval time
```

### `schema_migrations` (Auto-managed)
```
filename: migration filename
applied_at: when it was applied
```

---

## Performance Tips

- Index `waste_transactions(user_id, created_at)` for student dashboards
- Index `wallet_transactions(user_id, created_at)` for wallet history
- Use `EXPLAIN ANALYZE` on ranking queries (they aggregate large tables)
- `carbon_impacts` can grow large — consider partitioning by month after 1M rows
