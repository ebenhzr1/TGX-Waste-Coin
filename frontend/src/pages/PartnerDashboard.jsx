import React, { useState, useEffect } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import {
  Store, MapPin, Phone, Tag, BarChart3, Coins,
  ShoppingBag, ArrowLeft, TrendingUp, Users,
  CheckCircle, Package, Filter, ExternalLink
} from "lucide-react";

const CATEGORY_COLORS = {
  food:      { bg: "#dcfce7", text: "#166534", label: "🍃 Makanan & Minuman" },
  retail:    { bg: "#dbeafe", text: "#1e40af", label: "🛍️ Retail & Fashion" },
  health:    { bg: "#fce7f3", text: "#9d174d", label: "💊 Kesehatan" },
  education: { bg: "#fef9c3", text: "#854d0e", label: "📚 Edukasi" },
  service:   { bg: "#ede9fe", text: "#5b21b6", label: "⚙️ Layanan" },
};

export default function PartnerDashboard() {
  const [partners, setPartners]         = useState([]);
  const [impact, setImpact]             = useState(null);
  const [loading, setLoading]           = useState(true);
  const [selectedCategory, setCategory] = useState("all");
  const [selected, setSelected]         = useState(null);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [pRes, iRes] = await Promise.allSettled([
        api.get("/ecosystem/partners"),
        api.get("/ecosystem/impact"),
      ]);
      if (pRes.status === "fulfilled") setPartners(pRes.value.data?.data || []);
      if (iRes.status === "fulfilled") setImpact(iRes.value.data?.data || null);
    } catch (_) {}
    finally { setLoading(false); }
  }

  const fallbackPartners = [
    { id: 1, partner_name: "Warung Hijau Bu Sari",   category: "food",      description: "Warung makan organik bahan lokal Trenggalek.",           address: "Jl. Soekarno Hatta No. 12", contact: "081234567890", logo_url: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&auto=format&fit=crop", status: "active" },
    { id: 2, partner_name: "Batik Eco Trenggalek",   category: "retail",    description: "Batik ramah lingkungan dengan pewarna alami.",            address: "Jl. Raya Karangan No. 45",  contact: "085678901234", logo_url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&auto=format&fit=crop", status: "active" },
    { id: 3, partner_name: "Apotek Sehat Alami",     category: "health",    description: "Herbal & suplemen dari bahan alam Trenggalek.",           address: "Jl. Dr. Soetomo No. 8",    contact: "087654321098", logo_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop", status: "active" },
    { id: 4, partner_name: "Toko Buku & ATK Cerdas", category: "education", description: "Alat tulis daur ulang, mendukung literasi hijau.",        address: "Jl. Ahmad Yani No. 22",    contact: "082345678901", logo_url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&auto=format&fit=crop", status: "active" },
    { id: 5, partner_name: "Laundry Bersih Natural", category: "service",   description: "Laundry detergen enzim ramah lingkungan, hemat air.",     address: "Jl. Gatot Subroto No. 5",  contact: "089012345678", logo_url: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&auto=format&fit=crop", status: "active" },
  ];

  const displayPartners = (partners.length > 0 ? partners : fallbackPartners)
    .filter(p => selectedCategory === "all" || p.category === selectedCategory);

  const fallbackImpact = { partner_count: 5, total_tgx_circulation: 25840, reward_value_tgx: 8420, umkm_impact_idr: 4210000, csr_economic_value_idr: 50000000, exchange_rate: 500 };
  const d = impact || fallbackImpact;

  const categories = ["all", "food", "retail", "health", "education", "service"];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0d3b26 0%,#1a5c3a 40%,#0f2d1e 100%)", fontFamily: "'Inter','Segoe UI',sans-serif", padding: "24px" }}>
      {/* Header */}
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <Link to="/admin" style={{ color: "#4ade80", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <ArrowLeft size={20} /> Kembali
          </Link>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, margin: 0 }}>
              🏪 Ekosistem Mitra UMKM
            </h1>
            <p style={{ color: "#86efac", margin: "4px 0 0", fontSize: 14 }}>
              TGX Waste Coin × Circular Economy Business Ecosystem
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { icon: <Store size={22} />, label: "Mitra Aktif", value: d.partner_count || displayPartners.length, color: "#4ade80" },
            { icon: <Coins size={22} />, label: "TGX Beredar", value: `${(d.total_tgx_circulation || 0).toLocaleString()} TGX`, color: "#fbbf24" },
            { icon: <TrendingUp size={22} />, label: "Nilai UMKM", value: `Rp ${((d.umkm_impact_idr || 0) / 1000000).toFixed(1)}jt`, color: "#34d399" },
            { icon: <ShoppingBag size={22} />, label: "Rate Tukar", value: `1 TGX = Rp ${d.exchange_rate || 500}`, color: "#a78bfa" },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", borderRadius: 16, padding: 20, border: "1px solid rgba(255,255,255,0.12)" }}>
              <div style={{ color: s.color, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>{s.value}</div>
              <div style={{ color: "#86efac", fontSize: 13 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{ padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: selectedCategory === cat ? "#4ade80" : "rgba(255,255,255,0.1)", color: selectedCategory === cat ? "#0d3b26" : "#fff", transition: "all .2s" }}>
              {cat === "all" ? "🌿 Semua" : CATEGORY_COLORS[cat]?.label || cat}
            </button>
          ))}
        </div>

        {/* Partner Grid */}
        {loading ? (
          <div style={{ textAlign: "center", color: "#86efac", padding: 60 }}>Memuat mitra...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 20 }}>
            {displayPartners.map(partner => {
              const cat = CATEGORY_COLORS[partner.category] || { bg: "#f3f4f6", text: "#374151", label: partner.category };
              return (
                <div key={partner.id}
                  onClick={() => setSelected(selected?.id === partner.id ? null : partner)}
                  style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", borderRadius: 20, border: selected?.id === partner.id ? "2px solid #4ade80" : "1px solid rgba(255,255,255,0.12)", overflow: "hidden", cursor: "pointer", transition: "all .25s", transform: selected?.id === partner.id ? "scale(1.02)" : "scale(1)" }}>

                  {/* Partner Image */}
                  <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
                    <img src={partner.logo_url || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop"} alt={partner.partner_name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.6), transparent)" }} />
                    <span style={{ position: "absolute", top: 12, right: 12, background: cat.bg, color: cat.text, padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                      {cat.label}
                    </span>
                  </div>

                  <div style={{ padding: 20 }}>
                    <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}>{partner.partner_name}</h3>
                    <p style={{ color: "#86efac", fontSize: 13, margin: "0 0 12px", lineHeight: 1.5 }}>{partner.description}</p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#d1fae5", fontSize: 12 }}>
                        <MapPin size={14} /> {partner.address}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#d1fae5", fontSize: 12 }}>
                        <Phone size={14} /> {partner.contact}
                      </div>
                    </div>

                    {selected?.id === partner.id && (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ flex: 1, textAlign: "center", background: "rgba(74,222,128,0.15)", borderRadius: 10, padding: "10px 8px" }}>
                            <div style={{ color: "#4ade80", fontSize: 18, fontWeight: 700 }}>∞</div>
                            <div style={{ color: "#86efac", fontSize: 11 }}>Reward Tersedia</div>
                          </div>
                          <div style={{ flex: 1, textAlign: "center", background: "rgba(251,191,36,0.15)", borderRadius: 10, padding: "10px 8px" }}>
                            <div style={{ color: "#fbbf24", fontSize: 18, fontWeight: 700 }}>✓</div>
                            <div style={{ color: "#86efac", fontSize: 11 }}>Terverifikasi TGX</div>
                          </div>
                        </div>
                        <Link to="/marketplace" style={{ display: "block", marginTop: 12, padding: "10px", background: "linear-gradient(135deg,#4ade80,#22c55e)", borderRadius: 10, textAlign: "center", color: "#0d3b26", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                          🛍️ Tukar TGX di Marketplace
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Environmental Impact Banner */}
        <div style={{ marginTop: 32, background: "linear-gradient(135deg,rgba(74,222,128,0.15),rgba(34,197,94,0.1))", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 20, padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌿</div>
          <h3 style={{ color: "#4ade80", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>Dampak Lingkungan Ekosistem TGX</h3>
          <p style={{ color: "#86efac", fontSize: 14, margin: 0 }}>
            Setiap transaksi di mitra TGX mendukung ekonomi sirkular, mengurangi sampah, dan menciptakan dampak sosial-lingkungan nyata di Kabupaten Trenggalek.
          </p>
        </div>
      </div>
    </div>
  );
}
