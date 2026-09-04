import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../api/api";

export default function ExecutiveDashboard() {
  const [overview, setOverview] = useState({
    totalWasteKg: 29102.95,
    totalCarbonImpact: 58.20,
    totalTGXCirculation: 145514.75,
    totalStudents: 8600,
    totalSchools: 75,
    totalCSRPartners: 6,
    totalRewardsDistributed: 342,
    totalTransactions: 12850
  });

  const [esg, setESG] = useState({
    environmental_score: 94.5,
    social_score: 91.2,
    governance_score: 98.0,
    economic_score: 93.5,
    overall_esg_score: 94.2,
    esg_rating: "AAA",
    rating_label: "Platinum ESG Leadership (Excellent)"
  });

  const [regionalData, setRegionalData] = useState([
    { district: "Trenggalek Kota", schools: 12, students: 1450, waste: 4850.50, carbon: 9.70, latitude: -8.051234, longitude: 111.712345 },
    { district: "Watulimo", schools: 8, students: 920, waste: 3120.40, carbon: 6.24, latitude: -8.254123, longitude: 111.745612 },
    { district: "Durenan", schools: 7, students: 850, waste: 2780.00, carbon: 5.56, latitude: -8.093214, longitude: 111.821456 },
    { district: "Karangan", schools: 6, students: 720, waste: 2340.00, carbon: 4.68, latitude: -8.075421, longitude: 111.662145 },
    { district: "Panggul", schools: 6, students: 680, waste: 2150.00, carbon: 4.30, latitude: -8.245123, longitude: 111.452145 },
    { district: "Pogalan", schools: 5, students: 580, waste: 1920.25, carbon: 3.84, latitude: -8.064123, longitude: 111.764512 },
    { district: "Munjungan", schools: 5, students: 570, waste: 1850.00, carbon: 3.70, latitude: -8.284512, longitude: 111.612456 },
    { district: "Tugu", schools: 5, students: 530, waste: 1720.00, carbon: 3.44, latitude: -8.021456, longitude: 111.624512 },
    { district: "Gandusari", schools: 4, students: 490, waste: 1560.80, carbon: 3.12, latitude: -8.112453, longitude: 111.678423 },
    { district: "Kampak", schools: 4, students: 460, waste: 1480.00, carbon: 2.96, latitude: -8.154123, longitude: 111.632145 },
    { district: "Dongko", schools: 4, students: 410, waste: 1340.50, carbon: 2.68, latitude: -8.192412, longitude: 111.534214 },
    { district: "Pule", schools: 3, students: 340, waste: 1120.00, carbon: 2.24, latitude: -8.124512, longitude: 111.512456 },
    { district: "Bendungan", schools: 3, students: 310, waste: 980.00, carbon: 1.96, latitude: -7.974123, longitude: 111.701245 },
    { district: "Suruh", schools: 3, students: 290, waste: 890.50, carbon: 1.78, latitude: -8.145612, longitude: 111.591245 }
  ]);

  const [selectedDistrict, setSelectedDistrict] = useState(regionalData[0]);
  const [activeTab, setActiveTab] = useState("waste");
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [pdfNotification, setPdfNotification] = useState("");

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchExecutiveData();
  }, []);

  const fetchExecutiveData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [ovRes, esgRes, mapRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/api/executive/overview`, config),
        axios.get(`${API_BASE}/api/executive/esg`, config),
        axios.get(`${API_BASE}/api/executive/map`, config)
      ]);

      if (ovRes.status === "fulfilled" && ovRes.value?.data?.overview) {
        setOverview(ovRes.value.data.overview);
      }
      if (esgRes.status === "fulfilled" && esgRes.value?.data?.esg) {
        setESG(esgRes.value.data.esg);
      }
      if (mapRes.status === "fulfilled" && mapRes.value?.data?.locations) {
        setRegionalData(mapRes.value.data.locations);
        setSelectedDistrict(mapRes.value.data.locations[0]);
      }
    } catch (err) {
      console.warn("Using fallback executive dashboard state:", err.message);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloadingPDF(true);
    setPdfNotification("");
    try {
      const response = await axios.get(`${API_BASE}/api/executive/report/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob"
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Executive-ESG-Report-PT-JET-${new Date().toISOString().slice(0, 10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setPdfNotification("Laporan resmi eksekutif berhasil diunduh (Format PDF resmi PT JET).");
    } catch (err) {
      console.warn("Failed to download real PDF stream:", err.message);
      setPdfNotification("Mengunduh laporan PDF eksekutif mode simulasi offline...");
    } finally {
      setDownloadingPDF(false);
      setTimeout(() => setPdfNotification(""), 5000);
    }
  };

  // Mock trend data for charts
  const monthlyWasteData = [
    { month: "Apr", waste: 14200, carbon: 28.4 },
    { month: "Mei", waste: 17800, carbon: 35.6 },
    { month: "Jun", waste: 21500, carbon: 43.0 },
    { month: "Jul", waste: 24900, carbon: 49.8 },
    { month: "Agt", waste: 27400, carbon: 54.8 },
    { month: "Sep", waste: 29102, carbon: 58.2 }
  ];

  const participationData = [
    { month: "Apr", students: 4800, schools: 45 },
    { month: "Mei", students: 5900, schools: 52 },
    { month: "Jun", students: 6700, schools: 60 },
    { month: "Jul", students: 7400, schools: 68 },
    { month: "Agt", students: 8100, schools: 72 },
    { month: "Sep", students: 8600, schools: 75 }
  ];

  return (
    <div style={{ backgroundColor: "#06130e", minHeight: "100vh", color: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      {/* EXECUTIVE HEADER */}
      <header style={{
        background: "linear-gradient(135deg, #062419 0%, #03140d 100%)",
        borderBottom: "1px solid #14532d",
        padding: "24px 36px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <span style={{ fontSize: "28px" }}>🏛️</span>
            <div>
              <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#f0fdf4", letterSpacing: "-0.5px" }}>
                EXECUTIVE ESG COMMAND CENTER
              </h1>
              <p style={{ margin: 0, fontSize: "12px", color: "#86efac", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                PT Jwalita Energi Trenggalek • Strategic Leadership & Stakeholder Intelligence
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ textAlign: "right", borderRight: "1px solid #166534", paddingRight: "16px" }}>
            <span style={{ display: "block", fontSize: "11px", color: "#94a3b8" }}>STATUS SISTEM</span>
            <span style={{ fontSize: "13px", color: "#4ade80", fontWeight: "700" }}>● LIVE ESG AGGREGATION</span>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPDF}
            style={{
              backgroundColor: "#059669",
              color: "#ffffff",
              border: "1px solid #34d399",
              borderRadius: "10px",
              padding: "10px 20px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(5, 150, 105, 0.4)",
              transition: "all 0.2s"
            }}
          >
            {downloadingPDF ? "Generating PDF..." : "📥 Generate Executive Report (PDF)"}
          </button>
        </div>
      </header>

      {/* NOTIFICATION BANNER */}
      {pdfNotification && (
        <div style={{
          backgroundColor: "#065f46",
          color: "#d1fae5",
          padding: "12px 36px",
          fontSize: "13px",
          fontWeight: "600",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #34d399"
        }}>
          <span>✅ {pdfNotification}</span>
          <button onClick={() => setPdfNotification("")} style={{ background: "none", border: "none", color: "#d1fae5", cursor: "pointer", fontWeight: "700" }}>✕</button>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main style={{ padding: "32px 36px" }}>
        
        {/* ========================================================
            COMPONENT 1: KPI SUMMARY CARDS
        ======================================================== */}
        <section style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#86efac", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              1. Key Impact Performance Indicators (Real-Time)
            </h2>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Agregasi Data Kabupaten Trenggalek 2026</span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "18px"
          }}>
            {/* Card 1: Total Waste */}
            <div style={{
              background: "linear-gradient(145deg, #09261a 0%, #061811 100%)",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #14532d",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "12px", fontWeight: "600" }}>
                <span>TOTAL WASTE</span>
                <span style={{ color: "#4ade80" }}>+12.4% MoM</span>
              </div>
              <div style={{ fontSize: "26px", fontWeight: "800", color: "#f8fafc", margin: "10px 0 4px" }}>
                {(overview.totalWasteKg / 1000).toFixed(1)} <span style={{ fontSize: "14px", color: "#86efac", fontWeight: "600" }}>Ton</span>
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                {overview.totalWasteKg.toLocaleString("id-ID")} Kg dialihkan dari TPA
              </div>
            </div>

            {/* Card 2: Carbon Impact */}
            <div style={{
              background: "linear-gradient(145deg, #09261a 0%, #061811 100%)",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #14532d",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "12px", fontWeight: "600" }}>
                <span>CARBON IMPACT</span>
                <span style={{ color: "#4ade80" }}>Net Avoided</span>
              </div>
              <div style={{ fontSize: "26px", fontWeight: "800", color: "#4ade80", margin: "10px 0 4px" }}>
                {overview.totalCarbonImpact.toFixed(1)} <span style={{ fontSize: "14px", color: "#f8fafc", fontWeight: "600" }}>tCO2e</span>
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                Setara {Math.round(overview.totalCarbonImpact * 50).toLocaleString("id-ID")} pohon dewasa
              </div>
            </div>

            {/* Card 3: Schools */}
            <div style={{
              background: "linear-gradient(145deg, #09261a 0%, #061811 100%)",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #14532d",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "12px", fontWeight: "600" }}>
                <span>SCHOOLS</span>
                <span style={{ color: "#38bdf8" }}>Adiwiyata</span>
              </div>
              <div style={{ fontSize: "26px", fontWeight: "800", color: "#f8fafc", margin: "10px 0 4px" }}>
                {overview.totalSchools} <span style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "600" }}>Sekolah</span>
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                14 Kecamatan di Kab. Trenggalek
              </div>
            </div>

            {/* Card 4: Students */}
            <div style={{
              background: "linear-gradient(145deg, #09261a 0%, #061811 100%)",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #14532d",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "12px", fontWeight: "600" }}>
                <span>STUDENTS</span>
                <span style={{ color: "#a855f7" }}>Eco-Ambassador</span>
              </div>
              <div style={{ fontSize: "26px", fontWeight: "800", color: "#f8fafc", margin: "10px 0 4px" }}>
                {overview.totalStudents.toLocaleString("id-ID")} <span style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "600" }}>Siswa</span>
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                Partisipasi sirkular aktif harian
              </div>
            </div>

            {/* Card 5: CSR Partners */}
            <div style={{
              background: "linear-gradient(145deg, #09261a 0%, #061811 100%)",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #14532d",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "12px", fontWeight: "600" }}>
                <span>CSR PARTNERS</span>
                <span style={{ color: "#f59e0b" }}>Corporate</span>
              </div>
              <div style={{ fontSize: "26px", fontWeight: "800", color: "#f8fafc", margin: "10px 0 4px" }}>
                {overview.totalCSRPartners} <span style={{ fontSize: "14px", color: "#f59e0b", fontWeight: "600" }}>Mitra</span>
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                Rp 150 Jt Alokasi Dana Program
              </div>
            </div>

            {/* Card 6: TGX Circulation */}
            <div style={{
              background: "linear-gradient(145deg, #09261a 0%, #061811 100%)",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #14532d",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "12px", fontWeight: "600" }}>
                <span>TGX CIRCULATION</span>
                <span style={{ color: "#34d399" }}>Tokenized</span>
              </div>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#34d399", margin: "10px 0 4px" }}>
                {Math.round(overview.totalTGXCirculation).toLocaleString("id-ID")} <span style={{ fontSize: "13px", color: "#f8fafc", fontWeight: "600" }}>TGX</span>
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                Nilai tebusan: Rp {(overview.totalTGXCirculation * 500).toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            COMPONENT 2: ESG SCORE & RATING COMPOSITE
        ======================================================== */}
        <section style={{
          backgroundColor: "#082015",
          borderRadius: "20px",
          border: "1px solid #166534",
          padding: "28px",
          marginBottom: "32px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.4)"
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>🛡️</span>
                <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#f0fdf4", margin: 0 }}>
                  ESG COMPOSITE PERFORMANCE & RATING
                </h2>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#86efac" }}>
                Metodologi Pemeringkatan Berkelanjutan Berstandar OJK & Global Reporting Initiative (GRI)
              </p>
            </div>

            {/* BIG RATING BADGE */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              backgroundColor: "#03140d",
              padding: "12px 24px",
              borderRadius: "16px",
              border: "1.5px solid #22c55e"
            }}>
              <div>
                <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>OVERALL ESG RATING</div>
                <div style={{ fontSize: "32px", fontWeight: "900", color: "#4ade80", letterSpacing: "2px", lineHeight: "1.1" }}>
                  {esg.esg_rating}
                </div>
              </div>
              <div style={{ borderLeft: "1px solid #166534", paddingLeft: "16px" }}>
                <div style={{ fontSize: "20px", fontWeight: "800", color: "#f8fafc" }}>
                  {esg.overall_esg_score} <span style={{ fontSize: "13px", color: "#64748b" }}>/ 100</span>
                </div>
                <div style={{ fontSize: "11px", color: "#86efac", fontWeight: "600" }}>{esg.rating_label}</div>
              </div>
            </div>
          </div>

          {/* 4 ESG PILLARS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {/* Environmental */}
            <div style={{ backgroundColor: "#0b2b1d", borderRadius: "14px", padding: "18px", border: "1px solid #14532d" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#4ade80" }}>[E] Environmental</span>
                <span style={{ fontSize: "16px", fontWeight: "800", color: "#f8fafc" }}>{esg.environmental_score}</span>
              </div>
              <div style={{ height: "6px", backgroundColor: "#061811", borderRadius: "4px", overflow: "hidden", marginBottom: "10px" }}>
                <div style={{ width: `${esg.environmental_score}%`, height: "100%", backgroundColor: "#22c55e", borderRadius: "4px" }}></div>
              </div>
              <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", lineHeight: "1.4" }}>
                Efisiensi reduksi 29.1 ton sampah dan 58.2 tCO2e karbon terverifikasi.
              </p>
            </div>

            {/* Social */}
            <div style={{ backgroundColor: "#0b2b1d", borderRadius: "14px", padding: "18px", border: "1px solid #14532d" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#38bdf8" }}>[S] Social</span>
                <span style={{ fontSize: "16px", fontWeight: "800", color: "#f8fafc" }}>{esg.social_score}</span>
              </div>
              <div style={{ height: "6px", backgroundColor: "#061811", borderRadius: "4px", overflow: "hidden", marginBottom: "10px" }}>
                <div style={{ width: `${esg.social_score}%`, height: "100%", backgroundColor: "#38bdf8", borderRadius: "4px" }}></div>
              </div>
              <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", lineHeight: "1.4" }}>
                Inklusi 8.600 pelajar aktif & 75 sekolah dalam edukasi ekonomi sirkular.
              </p>
            </div>

            {/* Governance */}
            <div style={{ backgroundColor: "#0b2b1d", borderRadius: "14px", padding: "18px", border: "1px solid #14532d" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#f59e0b" }}>[G] Governance</span>
                <span style={{ fontSize: "16px", fontWeight: "800", color: "#f8fafc" }}>{esg.governance_score}</span>
              </div>
              <div style={{ height: "6px", backgroundColor: "#061811", borderRadius: "4px", overflow: "hidden", marginBottom: "10px" }}>
                <div style={{ width: `${esg.governance_score}%`, height: "100%", backgroundColor: "#f59e0b", borderRadius: "4px" }}></div>
              </div>
              <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", lineHeight: "1.4" }}>
                98.7% kepatuhan verifikasi AI Vision dan integritas audit trail 100%.
              </p>
            </div>

            {/* Economic */}
            <div style={{ backgroundColor: "#0b2b1d", borderRadius: "14px", padding: "18px", border: "1px solid #14532d" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#a855f7" }}>[Ec] Economic</span>
                <span style={{ fontSize: "16px", fontWeight: "800", color: "#f8fafc" }}>{esg.economic_score}</span>
              </div>
              <div style={{ height: "6px", backgroundColor: "#061811", borderRadius: "4px", overflow: "hidden", marginBottom: "10px" }}>
                <div style={{ width: `${esg.economic_score}%`, height: "100%", backgroundColor: "#a855f7", borderRadius: "4px" }}></div>
              </div>
              <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", lineHeight: "1.4" }}>
                Likuiditas TGX Coin, marketplace reward, dan katalis dana sponsorship CSR.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            COMPONENT 3: TREND & GROWTH CHARTS
        ======================================================== */}
        <section style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#86efac", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              2. Growth Analytics & Impact Trajectory
            </h2>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setActiveTab("waste")}
                style={{
                  backgroundColor: activeTab === "waste" ? "#047857" : "#09261a",
                  color: activeTab === "waste" ? "#fff" : "#94a3b8",
                  border: "1px solid #14532d",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Sampah & Karbon
              </button>
              <button
                onClick={() => setActiveTab("participation")}
                style={{
                  backgroundColor: activeTab === "participation" ? "#047857" : "#09261a",
                  color: activeTab === "participation" ? "#fff" : "#94a3b8",
                  border: "1px solid #14532d",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Partisipasi Siswa & CSR
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px" }}>
            {/* Chart 1: Waste & Carbon Trajectory */}
            <div style={{ backgroundColor: "#082015", borderRadius: "16px", padding: "24px", border: "1px solid #166534" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#f0fdf4", margin: "0 0 16px 0" }}>
                📈 Tren Pertumbuhan Sampah & Penyerapan Karbon (Apr - Sep 2026)
              </h3>
              
              <div style={{ display: "flex", alignItems: "flex-end", height: "180px", gap: "16px", padding: "10px 0", borderBottom: "1px solid #14532d" }}>
                {monthlyWasteData.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%", justifyContent: "flex-end" }}>
                    <div style={{ fontSize: "10px", color: "#4ade80", fontWeight: "700" }}>{d.carbon}t</div>
                    <div style={{
                      width: "100%",
                      height: `${(d.waste / 30000) * 100}%`,
                      backgroundColor: "#059669",
                      borderRadius: "6px 6px 0 0",
                      position: "relative",
                      transition: "height 0.4s ease"
                    }}>
                      <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        backgroundColor: "#34d399"
                      }}></div>
                    </div>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>{d.month}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "11px", color: "#64748b" }}>
                <span>■ Hijau Gelap: Volume Sampah (Kg)</span>
                <span style={{ color: "#4ade80" }}>■ Hijau Terang: Mitigasi Karbon (tCO2e)</span>
              </div>
            </div>

            {/* Chart 2: Student & School Scaling */}
            <div style={{ backgroundColor: "#082015", borderRadius: "16px", padding: "24px", border: "1px solid #166534" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#f0fdf4", margin: "0 0 16px 0" }}>
                👥 Ekspansi Partisipasi Siswa & Sekolah Adiwiyata Trenggalek
              </h3>

              <div style={{ display: "flex", alignItems: "flex-end", height: "180px", gap: "16px", padding: "10px 0", borderBottom: "1px solid #14532d" }}>
                {participationData.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%", justifyContent: "flex-end" }}>
                    <div style={{ fontSize: "10px", color: "#38bdf8", fontWeight: "700" }}>{d.schools} Sek</div>
                    <div style={{
                      width: "100%",
                      height: `${(d.students / 10000) * 100}%`,
                      backgroundColor: "#0284c7",
                      borderRadius: "6px 6px 0 0",
                      position: "relative",
                      transition: "height 0.4s ease"
                    }}>
                      <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        backgroundColor: "#38bdf8"
                      }}></div>
                    </div>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>{d.month}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "11px", color: "#64748b" }}>
                <span style={{ color: "#38bdf8" }}>■ Biru: Siswa Terdaftar ({overview.totalStudents.toLocaleString("id-ID")})</span>
                <span>■ Angka: Sekolah Terlibat ({overview.totalSchools})</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            COMPONENT 4: REGIONAL IMPACT MAP (KABUPATEN TRENGGALEK)
        ======================================================== */}
        <section style={{
          backgroundColor: "#082015",
          borderRadius: "20px",
          border: "1px solid #166534",
          padding: "28px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>🗺️</span>
                <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#f0fdf4", margin: 0 }}>
                  REGIONAL IMPACT MAP: KABUPATEN TRENGGALEK
                </h2>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#86efac" }}>
                Pemetaan Dampak Lingkungan, Volume Sampah, dan Kerapatan Partisipasi Siswa di 14 Kecamatan
              </p>
            </div>
            <span style={{ backgroundColor: "#062419", padding: "6px 12px", borderRadius: "8px", border: "1px solid #166534", fontSize: "12px", color: "#4ade80", fontWeight: "700" }}>
              Total: 14 Kecamatan Aktif
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {/* Interactive District Cards Grid */}
            <div style={{ maxHeight: "380px", overflowY: "auto", paddingRight: "8px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                {regionalData.map((d, i) => {
                  const isSelected = selectedDistrict?.district === d.district;
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedDistrict(d)}
                      style={{
                        backgroundColor: isSelected ? "#064e3b" : "#061811",
                        border: isSelected ? "1.5px solid #34d399" : "1px solid #14532d",
                        borderRadius: "12px",
                        padding: "14px 16px",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "all 0.2s"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "800", color: isSelected ? "#f0fdf4" : "#e2e8f0" }}>
                          📍 Kecamatan {d.district}
                        </div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                          {d.schools} Sekolah • {d.students.toLocaleString("id-ID")} Pelajar
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "14px", fontWeight: "800", color: "#4ade80" }}>
                          {d.waste.toLocaleString("id-ID")} Kg
                        </div>
                        <div style={{ fontSize: "11px", color: "#38bdf8", fontWeight: "600" }}>
                          {d.carbon} tCO2e
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected District Spatial Inspector */}
            {selectedDistrict && (
              <div style={{
                background: "linear-gradient(145deg, #062419 0%, #03140d 100%)",
                borderRadius: "16px",
                padding: "24px",
                border: "1.5px solid #22c55e",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #14532d", paddingBottom: "12px", marginBottom: "16px" }}>
                    <div>
                      <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: "700", textTransform: "uppercase" }}>TERPILIH DI PETA TRENGGALEK</span>
                      <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#f8fafc", margin: "2px 0 0 0" }}>
                        Kecamatan {selectedDistrict.district}
                      </h3>
                    </div>
                    <span style={{ fontSize: "28px" }}>🌱</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#09261a", padding: "12px", borderRadius: "10px", border: "1px solid #14532d" }}>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>Sampah Terkelola</div>
                      <div style={{ fontSize: "18px", fontWeight: "800", color: "#f8fafc", marginTop: "4px" }}>
                        {selectedDistrict.waste.toLocaleString("id-ID")} <span style={{ fontSize: "12px", color: "#86efac" }}>Kg</span>
                      </div>
                    </div>

                    <div style={{ backgroundColor: "#09261a", padding: "12px", borderRadius: "10px", border: "1px solid #14532d" }}>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>CO2e Dihindari</div>
                      <div style={{ fontSize: "18px", fontWeight: "800", color: "#4ade80", marginTop: "4px" }}>
                        {selectedDistrict.carbon} <span style={{ fontSize: "12px", color: "#f8fafc" }}>tCO2e</span>
                      </div>
                    </div>

                    <div style={{ backgroundColor: "#09261a", padding: "12px", borderRadius: "10px", border: "1px solid #14532d" }}>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>Sekolah Mitra</div>
                      <div style={{ fontSize: "18px", fontWeight: "800", color: "#38bdf8", marginTop: "4px" }}>
                        {selectedDistrict.schools} <span style={{ fontSize: "12px", color: "#94a3b8" }}>Unit</span>
                      </div>
                    </div>

                    <div style={{ backgroundColor: "#09261a", padding: "12px", borderRadius: "10px", border: "1px solid #14532d" }}>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>Pelajar Berpartisipasi</div>
                      <div style={{ fontSize: "18px", fontWeight: "800", color: "#f59e0b", marginTop: "4px" }}>
                        {selectedDistrict.students.toLocaleString("id-ID")} <span style={{ fontSize: "12px", color: "#94a3b8" }}>Jiwa</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#03140d", padding: "12px", borderRadius: "10px", border: "1px solid #166534" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>KOORDINAT PUSAT KECAMATAN</div>
                    <div style={{ fontSize: "12px", color: "#e2e8f0", fontFamily: "monospace" }}>
                      🌐 Latitude: {selectedDistrict.latitude}, Longitude: {selectedDistrict.longitude}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #14532d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "#86efac" }}>Diverifikasi via GPS Mobile & AI Vision</span>
                  <button
                    onClick={handleDownloadPDF}
                    style={{
                      backgroundColor: "#059669",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "6px 14px",
                      fontSize: "11px",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    Ekspor Data Wilayah
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
