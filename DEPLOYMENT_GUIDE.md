# 🚀 Panduan Deployment Online: TGX Waste Coin Platform

Panduan lengkap untuk mendeploy sistem **TGX Waste Coin × PT Jwalita Energi Trenggalek** ke cloud gratis (Render/Railway untuk Backend + Vercel untuk Frontend + Supabase PostgreSQL).

---

## 🏗️ Arsitektur Cloud

```mermaid
graph LR
    User[Pengguna / Siswa / Admin] -->|HTTPS| Frontend[Vercel Frontend]
    Frontend -->|REST API / JWT| Backend[Render / Railway Backend]
    Backend -->|PostgreSQL Protocol + SSL| DB[(Supabase PostgreSQL)]
```

---

## 📦 Tahap 1: Deploy Backend (Render / Railway)

### Opsi A: Deploy di Render (Disarankan - Free Tier)

1. Buka [render.com](https://render.com) dan login (bisa via GitHub).
2. Klik **New +** → Pilih **Web Service**.
3. Hubungkan repository GitHub project TGX ini.
4. Masukkan konfigurasi berikut:
   - **Name**: `tgx-waste-coin-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Di bagian **Environment Variables**, tambahkan:
   - `DATABASE_URL` = `postgresql://postgres:fvgXPKg2%2Bq3%26Yu9@db.llutuppvzfuaihhlmpjs.supabase.co:5432/postgres`
   - `JWT_SECRET` = `tgx_secret_jet_2026_enterprise_production_key`
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `CORS_ORIGINS` = `*` (atau isi URL Vercel kamu nanti)
6. Klik **Deploy Web Service**.
7. Salin URL backend Render kamu (contoh: `https://tgx-backend.onrender.com`).

---

## 🌐 Tahap 2: Deploy Frontend (Vercel)

1. Buka [vercel.com](https://vercel.com) dan login.
2. Klik **Add New...** → **Project** → Import repository GitHub TGX.
3. Konfigurasi Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: klik Edit → pilih folder `frontend`
4. Di bagian **Environment Variables**:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: Masukkan URL Backend Render kamu dari Tahap 1 (contoh: `https://tgx-backend.onrender.com`)
5. Klik **Deploy**.
6. Selesai! Web app TGX kamu sudah online dan dapat diakses publik dengan SSL (HTTPS).

---

## 🔑 Akun Demo Siap Pakai di Production:

| Peran | Email | Password | Hak Akses |
|---|---|---|---|
| **Super Admin JET** | `admin@jet.co.id` | `admin123` | Monitoring total, verifikasi transaksi, audit |
| **Direksi PT JET** | `direksi@jet.co.id` | `direksi123` | Executive ESG Command Center, Eco Impact |
| **Operator Sekolah** | `operator@sekolah.id` | `operator123` | Input & timbang sampah |
| **Siswa Teladan** | `siswa@sekolah.id` | `siswa123` | Saldo awal 1.250 TGX, belanja reward & UMKM |
| **Mitra CSR** | `csr@pertamina.com` | `csr123` | Sponsorship program CSR hijau |

---

## 🔍 Verifikasi Setelah Deploy:
- Healthcheck API: `https://[backend-kamu].onrender.com/api/health`
- Dokumentasi Swagger: `https://[backend-kamu].onrender.com/api/docs`
- Akses Web App: `https://[frontend-kamu].vercel.app`
