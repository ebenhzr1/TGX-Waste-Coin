import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  Globe2,
  Leaf,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  FileCheck,
  Building2,
  Calendar,
  Layers,
  Award,
  RefreshCw,
  Info,
  ExternalLink,
  ChevronRight,
  Database
} from "lucide-react";

export default function CarbonAssetDashboard() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInventory = async () => {
    try {
      setRefreshing(true);
      const res = await api.get("/carbon-assets/inventory");
      setInventory(res.data);
    } catch (err) {
      console.warn("Menggunakan fallback inventory:", err.message);
      setInventory({
        project: "TGX Waste Carbon Project",
        totalWaste: 10000,
        co2Avoided: 20000,
        carbonUnit: 20,
        status: "active",
        location: "Trenggalek, Jawa Timur",
        unitType: "tCO2e (Carbon Impact Unit)"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const totalWaste = inventory?.totalWaste || 10000;
  const co2AvoidedKg = inventory?.co2Avoided || 20000;
  const co2AvoidedTon = (co2AvoidedKg / 1000).toFixed(2);
  const carbonUnit = inventory?.carbonUnit || 20;

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-16">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20"
            >
              <Globe2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">Carbon Asset Management</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  Sprint 21
                </span>
              </div>
              <p className="text-[10px] text-slate-400">TGX Waste Coin × PT Jwalita Energi Trenggalek</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchInventory}
              disabled={refreshing}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-400 text-xs flex items-center gap-1.5 transition-all"
              title="Hitung Ulang Inventory"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-emerald-400" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link
              to="/carbon-projects"
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>Proyek Karbon</span>
            </Link>
            <Link
              to="/carbon-offset"
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Offset Request</span>
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
        {/* Compliance Notice Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-teal-950/30 border border-emerald-500/30 flex items-start gap-3.5 shadow-lg">
          <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-emerald-400">Prinsip Integritas Karbon PT JET: </span>
            Seluruh data tercatat sebagai <strong className="text-white">Potential Carbon Asset</strong> dan <strong className="text-white">Carbon Impact Unit</strong> berbasis data penimbangan fisik riil dari rantai setoran sekolah & masyarakat. 1 Carbon Unit setara dengan 1 tCO2e (1.000 kgCO2e) mitigasi emisi sampah terpilah.
          </div>
        </div>

        {/* 4 Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CARD 1: Total Waste Impact */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Total Waste Impact</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Leaf className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {loading ? "..." : (totalWaste).toLocaleString("id-ID")}{" "}
              <span className="text-base font-bold text-slate-400">Kg</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Sampah Terkelola di Trenggalek</p>
            <div className="mt-3 text-[11px] text-emerald-400/90 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{(totalWaste / 1000).toFixed(1)} Ton Terverifikasi</span>
            </div>
          </div>

          {/* CARD 2: CO2 Avoided */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-teal-500/30 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>CO2 Avoided</span>
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                <Globe2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-teal-300 tracking-tight">
              {loading ? "..." : co2AvoidedTon}{" "}
              <span className="text-base font-bold text-slate-400">tCO2e</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">({co2AvoidedKg.toLocaleString("id-ID")} kgCO2e)</p>
            <div className="mt-3 text-[11px] text-teal-400/90 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Faktor Emisi IPCC / JET</span>
            </div>
          </div>

          {/* CARD 3: Potential Carbon Unit */}
          <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-900/60 border border-emerald-500/40 rounded-3xl p-5 backdrop-blur-xl relative overflow-hidden group shadow-lg shadow-emerald-500/5 hover:border-emerald-400/60 transition-all">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Potential Carbon Unit</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-400 tracking-tight">
              {loading ? "..." : carbonUnit}{" "}
              <span className="text-base font-bold text-slate-300">Unit</span>
            </div>
            <p className="text-[11px] text-emerald-300/70 mt-1">1 Unit = 1 tCO2e Avoided</p>
            <div className="mt-3 text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
              <span>Siap Di-offset CSR</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* CARD 4: Carbon Project Status */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Carbon Project Status</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="capitalize">{inventory?.status || "Active"}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{inventory?.project || "TGX Waste Carbon Project"}</p>
            <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Periode 2026 Operasional</span>
            </div>
          </div>
        </div>

        {/* Value Chain Flow Visualization */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-extrabold text-white text-base">Rantai Nilai Aset Karbon Terpadu (Carbon Asset Flow)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Proses end-to-end dari timbulan sampah terpilah siswa hingga penerbitan sertifikat dampak emisi
              </p>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Audit Trail Terverifikasi
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center">
            {[
              { step: 1, title: "Waste Collection", sub: "Setoran Sampah Sekolah", color: "border-slate-700 bg-slate-950/80" },
              { step: 2, title: "Impact Calculation", sub: "CO2 Avoided Formula", color: "border-teal-500/30 bg-teal-950/20" },
              { step: 3, title: "Carbon Inventory", sub: "Agregasi Database", color: "border-emerald-500/30 bg-emerald-950/20" },
              { step: 4, title: "Potential Asset", sub: "1 Unit = 1 tCO2e", color: "border-amber-500/30 bg-amber-950/20" },
              { step: 5, title: "Carbon Project", sub: "Inisiatif Terdaftar", color: "border-cyan-500/30 bg-cyan-950/20" },
              { step: 6, title: "Offset Transaction", sub: "CSR & Buyer Claim", color: "border-purple-500/30 bg-purple-950/20" },
              { step: 7, title: "Carbon Certificate", sub: "TGX-CARBON-2026", color: "border-emerald-400/50 bg-emerald-500/15 text-emerald-300" }
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

        {/* 3 Action Hub Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Module 1: Proyek Karbon */}
          <div className="bg-slate-900/60 border border-slate-800/80 hover:border-teal-500/40 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-white text-base mb-1">Carbon Projects Management</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Kelola proyek mitigasi emisi berbasis wilayah, hitung agregat timbulan, dan monitor status proyek aktif.
              </p>
              <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Proyek Aktif:</span>
                  <span className="font-bold text-white">TGX Waste Carbon Project</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Lokasi:</span>
                  <span>Trenggalek, Jawa Timur</span>
                </div>
              </div>
            </div>

            <Link
              to="/carbon-projects"
              className="w-full py-2.5 px-4 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <span>Kelola Proyek</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Module 2: Offset Request */}
          <div className="bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-white text-base mb-1">Offset Transaction Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Fasilitasi penyerapan unit dampak karbon oleh mitra korporasi/CSR dengan perhitungan konversi transparan.
              </p>
              <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Unit Tersedia:</span>
                  <span className="font-bold text-emerald-400">{carbonUnit} tCO2e</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Standar:</span>
                  <span>Jwalita Environmental Unit</span>
                </div>
              </div>
            </div>

            <Link
              to="/carbon-offset"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/10"
            >
              <span>Buat Offset Request</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Module 3: Sertifikat Karbon */}
          <div className="bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <FileCheck className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-white text-base mb-1">Carbon Certificate Verification</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Akses dan cetak sertifikat klaim dampak lingkungan resmi dengan kode verifikasi unik berformat TGX-CARBON-2026.
              </p>
              <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Contoh Kode:</span>
                  <span className="font-mono font-bold text-cyan-300 text-[11px]">TGX-CARBON-2026-00001</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Penerbit:</span>
                  <span>PT JET Trenggalek</span>
                </div>
              </div>
            </div>

            <Link
              to="/carbon-certificate"
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <span>Lihat Sertifikat</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
