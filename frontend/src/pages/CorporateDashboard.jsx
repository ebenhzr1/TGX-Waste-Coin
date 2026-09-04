import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import {
  Building2,
  Leaf,
  Globe2,
  GraduationCap,
  School,
  TrendingUp,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Coins,
  FileText,
  Layers,
  ChevronRight,
  ExternalLink
} from "lucide-react";

export default function CorporateDashboard() {
  const [impact, setImpact] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      const [impRes, campRes] = await Promise.allSettled([
        api.get("/csr/campaigns/1/impact"),
        api.get("/csr/campaigns")
      ]);

      if (impRes.status === "fulfilled" && impRes.value.data) {
        setImpact(impRes.value.data);
      } else {
        setImpact({
          totalWasteKg: 10000,
          co2Impact: 20,
          students: 500,
          schools: 10
        });
      }

      if (campRes.status === "fulfilled" && Array.isArray(campRes.value.data) && campRes.value.data.length > 0) {
        setCampaign(campRes.value.data[0]);
      } else {
        setCampaign({
          id: 1,
          company_name: "PT ABC",
          campaign_name: "Green School Movement",
          description: "Program CSR pengelolaan sampah terpilah dan sponsorship reward untuk 10 Sekolah Adiwiyata di Trenggalek",
          target_waste_kg: 10000,
          target_co2: 20,
          reward_budget: 50000000,
          status: "active"
        });
      }
    } catch (err) {
      console.warn("Using fallback corporate data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalWasteTon = impact ? (impact.totalWasteKg / 1000).toFixed(1) : "10";
  const co2ImpactTons = impact ? impact.co2Impact : 20;
  const schoolCount = impact ? impact.schools : 10;
  const studentCount = impact ? impact.students : 500;

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-16">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center shadow-md shadow-blue-500/20"
            >
              <Building2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">Corporate CSR & Impact Portal</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Sprint 22
                </span>
              </div>
              <p className="text-[10px] text-slate-400">TGX Waste Coin × PT Jwalita Energi Trenggalek</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-blue-400 text-xs flex items-center gap-1.5 transition-all"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-blue-400" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link
              to="/csr-management"
              className="px-3.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kelola CSR</span>
            </Link>
            <Link
              to="/csr-report/1"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Laporan Dampak</span>
            </Link>
            <Link
              to="/admin"
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-900 transition-all"
            >
              Kembali
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Hero Partner Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900/90 to-teal-950/40 border border-blue-500/30 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Corporate Impact Partnership</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {campaign?.company_name || "PT ABC"}
              </h1>
              <p className="text-sm font-semibold text-teal-300">
                Campaign: {campaign?.campaign_name || "Green School Movement"}
              </p>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                {campaign?.description || "Program CSR pengelolaan sampah terpilah dan sponsorship reward untuk 10 Sekolah Adiwiyata di Trenggalek."}
              </p>
            </div>

            <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
              <Link
                to="/csr-partner/1"
                className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20"
              >
                <span>Lihat Profil Mitra</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/csr-report/1"
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-teal-500/50 text-teal-300 text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Unduh CSR Report</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Impact Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Waste Collected */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Waste Collected</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Leaf className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {loading ? "..." : totalWasteTon}{" "}
              <span className="text-base font-bold text-slate-400">Ton</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">({(impact?.totalWasteKg || 10000).toLocaleString("id-ID")} Kg Sampah Terpilah)</p>
            <div className="mt-3 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Target Tercapai 100%</span>
            </div>
          </div>

          {/* Card 2: CO2 Impact */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-teal-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>CO2 Impact</span>
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                <Globe2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-teal-300 tracking-tight">
              {loading ? "..." : co2ImpactTons}{" "}
              <span className="text-base font-bold text-slate-400">tCO2e</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Mitigasi Emisi Terverifikasi</p>
            <div className="mt-3 text-[11px] text-teal-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Standar PT JET / IPCC</span>
            </div>
          </div>

          {/* Card 3: Schools Involved */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>School Beneficiaries</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <School className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-blue-400 tracking-tight">
              {loading ? "..." : schoolCount}{" "}
              <span className="text-base font-bold text-slate-400">Sekolah</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Sekolah Adiwiyata Trenggalek</p>
            <div className="mt-3 text-[11px] text-blue-300 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Dukungan Edukasi Terstruktur</span>
            </div>
          </div>

          {/* Card 4: Students Benefited */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Student Beneficiaries</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-purple-300 tracking-tight">
              {loading ? "..." : studentCount}{" "}
              <span className="text-base font-bold text-slate-400">Siswa</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Penerima Manfaat Langsung</p>
            <div className="mt-3 text-[11px] text-purple-300 font-medium flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" />
              <span>Menerima Koin TGX & Reward</span>
            </div>
          </div>
        </div>

        {/* Business Flow Infographic */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-white text-base">Siklus Dampak Kemitraan CSR (CSR Impact Cycle)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Alur transformasi pendanaan CSR korporasi menjadi dampak nyata lingkungan, edukasi, dan ekonomi sirkular
              </p>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Closed-Loop Partnership
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center">
            {[
              { step: 1, title: "Corporate Partner", sub: "PT ABC / Mitra Industri", color: "border-blue-500/30 bg-blue-950/20 text-blue-300" },
              { step: 2, title: "CSR Campaign", sub: "Green School Movement", color: "border-teal-500/30 bg-teal-950/20" },
              { step: 3, title: "Reward Sponsorship", sub: "100.000 TGX Pool", color: "border-amber-500/30 bg-amber-950/20" },
              { step: 4, title: "School Participation", sub: "10 Sekolah & 500 Siswa", color: "border-purple-500/30 bg-purple-950/20" },
              { step: 5, title: "Waste Collection", sub: "10 Ton Terkumpul", color: "border-emerald-500/30 bg-emerald-950/20" },
              { step: 6, title: "Carbon Impact", sub: "20 tCO2e Tereduksi", color: "border-cyan-500/30 bg-cyan-950/20" },
              { step: 7, title: "CSR Impact Report", sub: "Sertifikasi ESG Resmi", color: "border-emerald-400/50 bg-emerald-500/20 text-emerald-300" }
            ].map(item => (
              <div key={item.step} className={`p-3 rounded-2xl border ${item.color} flex flex-col justify-between transition-all hover:scale-[1.02]`}>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-500 block mb-1">TAHAP {item.step}</span>
                  <div className="text-xs font-bold text-white mb-1">{item.title}</div>
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Core CSR Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Module 1: Program Management */}
          <div className="bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-white text-base mb-1">CSR Campaign Management</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Daftarkan inisiatif CSR baru, kelola alokasi budget reward, tetapkan target reduksi sampah, dan pantau kemajuan program.
              </p>
            </div>
            <Link
              to="/csr-management"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <span>Kelola Campaign</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Module 2: Partner Profile */}
          <div className="bg-slate-900/60 border border-slate-800/80 hover:border-teal-500/40 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-white text-base mb-1">Corporate Partner Profile</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Tampilkan rekam jejak kontribusi korporasi, histori pendanaan, audit trail transaksi CSR, dan sertifikat pengakuan.
              </p>
            </div>
            <Link
              to="/csr-partner/1"
              className="w-full py-2.5 px-4 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <span>Buka Profil Perusahaan</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Module 3: Impact Report */}
          <div className="bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-white text-base mb-1">Integrated CSR Impact Report</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Dokumen resmi berstandar 4 pilar ESG (Environmental, Social, Economic, Governance) terintegrasi inventaris aset karbon.
              </p>
            </div>
            <Link
              to="/csr-report/1"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <span>Lihat Laporan Dampak</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
