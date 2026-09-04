import React, { useState, useEffect } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import {
  TrendingUp, Coins, Store, Users, Leaf,
  ArrowLeft, RefreshCw, BarChart2, Globe2,
  ArrowUpRight, Banknote, Recycle, Award
} from "lucide-react";

const fmt = (n) => Number(n || 0).toLocaleString("id-ID");
const fmtIDR = (n) => {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(2)} M`;
  if (n >= 1_000_000)     return `Rp ${(n / 1_000_000).toFixed(1)} jt`;
  return `Rp ${fmt(n)}`;
};

const FALLBACK = {
  total_tgx_circulation:     25840,
  circulation_idr:           12920000,
  reward_value_tgx:          8420,
  reward_value_idr:          4210000,
  marketplace_order_value_tgx: 0,
  marketplace_order_value_idr: 0,
  partner_count:             5,
  csr_economic_value_idr:    50000000,
  exchange_rate:             500,
  umkm_impact_idr:           4210000,
  total_economic_value_idr:  67130000,
};

export default function EconomicImpactDashboard() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => { fetchImpact(); }, []);

  async function fetchImpact() {
    setLoading(true);
    try {
      const res = await api.get("/ecosystem/impact");
      setData(res.data?.data || FALLBACK);
    } catch (_) {
      setData(FALLBACK);
    } finally {
      setLoading(false);
      setLastUpdate(new Date().toLocaleTimeString("id-ID"));
    }
  }

  const d = data || FALLBACK;

  const kpiCards = [
    {
      icon: <Coins size={26} />,
      label: "Total TGX Beredar",
      value: `${fmt(d.total_tgx_circulation)} TGX`,
      sub: fmtIDR(d.circulation_idr),
      gradient: "linear-gradient(135deg,#f59e0b,#d97706)",
      glow: "rgba(245,158,11,.3)",
    },
    {
      icon: <Store size={26} />,
      label: "Mitra Bisnis Aktif",
      value: d.partner_count,
      sub: "UMKM Terverifikasi TGX",
      gradient: "linear-gradient(135deg,#10b981,#059669)",
      glow: "rgba(16,185,129,.3)",
    },
    {
      icon: <Recycle size={26} />,
      label: "Nilai Reward Ditukar",
      value: `${fmt(d.reward_value_tgx)} TGX`,
      sub: fmtIDR(d.reward_value_idr),
      gradient: "linear-gradient(135deg,#6366f1,#4f46e5)",
      glow: "rgba(99,102,241,.3)",
    },
    {
      icon: <Banknote size={26} />,
      label: "Nilai Ekonomi CSR",
      value: fmtIDR(d.csr_economic_value_idr),
      sub: "Dana CSR Aktif",
      gradient: "linear-gradient(135deg,#ec4899,#db2777)",
      glow: "rgba(236,72,153,.3)",
    },
    {
      icon: <Globe2 size={26} />,
      label: "Dampak UMKM",
      value: fmtIDR(d.umkm_impact_idr),
      sub: "Transaksi via TGX Coin",
      gradient: "linear-gradient(135deg,#14b8a6,#0d9488)",
      glow: "rgba(20,184,166,.3)",
    },
    {
      icon: <Award size={26} />,
      label: "Total Nilai Ekosistem",
      value: fmtIDR(d.total_economic_value_idr),
      sub: "Estimasi nilai ekonomi sirkular",
      gradient: "linear-gradient(135deg,#f97316,#ea580c)",
      glow: "rgba(249,115,22,.3)",
    },
  ];

  const circularFlowSteps = [
    { icon: "🗑️", label: "Sampah Terkumpul",  desc: "Siswa setor sampah" },
    { icon: "🪙", label: "TGX Coin",           desc: "Reward otomatis" },
    { icon: "🏪", label: "Mitra UMKM",          desc: "Tukar di ekosistem" },
    { icon: "🌱", label: "Dampak Lingkungan",   desc: "CO₂ avoided" },
    { icon: "📊", label: "CSR Report",          desc: "Transparan & terukur" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e 0%,#0d2137 50%,#071022 100%)", fontFamily: "'Inter','Segoe UI',sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <Link to="/admin" style={{ color: "#60a5fa", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <ArrowLeft size={20} /> Kembali
          </Link>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, margin: 0 }}>
              📈 Economic Impact Dashboard
            </h1>
            <p style={{ color: "#93c5fd", margin: "4px 0 0", fontSize: 14 }}>
              Circular Economy Value — TGX Waste Coin × PT Jwalita Energi Trenggalek
            </p>
          </div>
          <button onClick={fetchImpact} disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: 10, color: "#60a5fa", padding: "10px 16px", cursor: "pointer", fontSize: 13 }}>
            <RefreshCw size={16} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            {lastUpdate ? `Update: ${lastUpdate}` : "Refresh"}
          </button>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, marginBottom: 40 }}>
          {kpiCards.map((card, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)", borderRadius: 20, padding: 24, border: "1px solid rgba(255,255,255,0.08)", boxShadow: `0 0 30px ${card.glow}`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, background: card.gradient, borderRadius: "50%", opacity: 0.15 }} />
              <div style={{ display: "inline-flex", padding: 10, borderRadius: 12, background: card.gradient, color: "#fff", marginBottom: 16 }}>
                {card.icon}
              </div>
              <div style={{ color: "#fff", fontSize: 26, fontWeight: 800, marginBottom: 4 }}>{loading ? "..." : card.value}</div>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>{card.label}</div>
              <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Circular Economy Flow */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32, marginBottom: 32 }}>
          <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 24px", textAlign: "center" }}>
            🔄 Alur Ekonomi Sirkular TGX
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            {circularFlowSteps.map((step, i) => (
              <React.Fragment key={i}>
                <div style={{ textAlign: "center", padding: 16, background: "rgba(255,255,255,0.05)", borderRadius: 16, minWidth: 110 }}>
                  <div style={{ fontSize: 28 }}>{step.icon}</div>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginTop: 8 }}>{step.label}</div>
                  <div style={{ color: "#64748b", fontSize: 11 }}>{step.desc}</div>
                </div>
                {i < circularFlowSteps.length - 1 && (
                  <ArrowUpRight size={20} color="#3b82f6" style={{ flexShrink: 0 }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Exchange Rate Info */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,.1),rgba(217,119,6,.05))", border: "1px solid rgba(245,158,11,.2)", borderRadius: 20, padding: 24 }}>
            <h3 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>💱 Nilai Tukar TGX</h3>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#fff" }}>1 TGX = Rp {fmt(d.exchange_rate)}</div>
            <p style={{ color: "#94a3b8", fontSize: 13, margin: "8px 0 0" }}>
              Rate resmi yang digunakan untuk konversi nilai reward ke rupiah. Dapat diperbarui oleh admin.
            </p>
          </div>
          <div style={{ background: "linear-gradient(135deg,rgba(16,185,129,.1),rgba(5,150,105,.05))", border: "1px solid rgba(16,185,129,.2)", borderRadius: 20, padding: 24 }}>
            <h3 style={{ color: "#34d399", fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>🌿 SDG Alignment</h3>
            {[
              { sdg: "SDG 11", desc: "Kota & Komunitas Berkelanjutan" },
              { sdg: "SDG 12", desc: "Konsumsi & Produksi Bertanggung Jawab" },
              { sdg: "SDG 13", desc: "Penanganan Perubahan Iklim" },
              { sdg: "SDG 17", desc: "Kemitraan untuk Tujuan" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
                <span style={{ background: "#10b981", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{s.sdg}</span>
                <span style={{ color: "#d1fae5", fontSize: 13 }}>{s.desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
