import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Leaf,
  Globe2,
  Award,
  ShieldCheck,
  Calendar,
  DollarSign,
  FileCheck,
  ExternalLink,
  ChevronLeft,
  School,
  GraduationCap
} from "lucide-react";

export default function PartnerProfile() {
  const { id } = useParams();
  const partnerId = id || 1;

  const [partner, setPartner] = useState({
    id: 1,
    company_name: "PT ABC",
    industry: "FMCG & Manufaktur Berkelanjutan",
    contact_person: "Budi Santoso",
    email: "csr@ptabc.co.id",
    phone: "08123456789",
    address: "Kawasan Industri Trenggalek, Jawa Timur",
    status: "active"
  });

  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      campaign_name: "Green School Movement",
      description: "Program CSR pengelolaan sampah terpilah dan sponsorship reward untuk 10 Sekolah Adiwiyata di Trenggalek",
      target_waste_kg: 10000,
      target_co2: 20,
      reward_budget: 50000000,
      start_date: "2026-09-01",
      end_date: "2026-12-31",
      status: "active"
    }
  ]);

  const [impact, setImpact] = useState({
    totalWasteKg: 10000,
    co2Impact: 20,
    students: 500,
    schools: 10
  });

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const [pRes, cRes, iRes] = await Promise.allSettled([
          api.get(`/csr/partners`),
          api.get(`/csr/campaigns`),
          api.get(`/csr/campaigns/${partnerId}/impact`)
        ]);

        if (pRes.status === "fulfilled" && Array.isArray(pRes.value.data)) {
          const found = pRes.value.data.find(p => String(p.id) === String(partnerId)) || pRes.value.data[0];
          if (found) setPartner(found);
        }
        if (cRes.status === "fulfilled" && Array.isArray(cRes.value.data)) {
          setCampaigns(cRes.value.data);
        }
        if (iRes.status === "fulfilled" && iRes.value.data) {
          setImpact(iRes.value.data);
        }
      } catch (e) {
        console.warn("Using fallback partner profile data");
      }
    };
    fetchPartnerData();
  }, [partnerId]);

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-16">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/csr-dashboard"
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center shadow-md shadow-blue-500/20"
            >
              <Building2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </Link>
            <div>
              <h1 className="font-extrabold text-white text-base tracking-tight">Corporate Partner Profile</h1>
              <p className="text-[10px] text-slate-400">Rekam Jejak Kemitraan & Kontribusi Lingkungan</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/csr-report/1"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Sertifikat & Laporan</span>
            </Link>
            <Link
              to="/csr-dashboard"
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-900 transition-all flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Section 1: Company Profile Card */}
        <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-teal-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-lg shadow-blue-500/10">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-white">{partner.company_name}</h2>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                    {partner.status || "active"} Partner
                  </span>
                </div>
                <p className="text-xs font-semibold text-teal-300">{partner.industry}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {partner.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {partner.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {partner.address}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Komitmen CSR</span>
              <span className="text-xl font-black text-amber-400">Rp 50.000.000</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Sponsorship Reward & Program</span>
            </div>
          </div>
        </div>

        {/* Section 2: Environmental & Carbon Impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Environmental Impact */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-4 h-4" />
              <span>Environmental Impact (Dampak Lingkungan)</span>
            </div>
            <h3 className="text-xl font-black text-white">
              {(impact.totalWasteKg / 1000).toFixed(1)} Ton Sampah Terpilah
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kontribusi langsung pada sirkular ekonomi lokal melalui pemilahan plastik botol, kertas, dan kardus dari sekolah Adiwiyata se-Kabupaten Trenggalek.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Sekolah Binaan</span>
                <span className="text-lg font-black text-white">{impact.schools} Adiwiyata</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Siswa Teredukasi</span>
                <span className="text-lg font-black text-emerald-400">{impact.students} Pelajar</span>
              </div>
            </div>
          </div>

          {/* Carbon Impact */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Globe2 className="w-4 h-4" />
              <span>Carbon Impact (Mitigasi Emisi Karbon)</span>
            </div>
            <h3 className="text-xl font-black text-teal-300">
              {impact.co2Impact} tCO2e Emisi Terhindar
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Perhitungan berbasis koefisien emisi GHG Scope 3 waste reduction PT JET. Setara dengan 20 Carbon Impact Unit yang terintegrasi pada modul aset karbon.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Kg CO2e Avoided</span>
                <span className="text-lg font-black text-teal-300">{(impact.co2Impact * 1000).toLocaleString("id-ID")} kg</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Potential Carbon Unit</span>
                <span className="text-lg font-black text-cyan-400">{impact.co2Impact} Unit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: CSR History & Certificate */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base">Riwayat Program CSR & Sertifikasi</h3>
              <p className="text-xs text-slate-400 mt-0.5">Daftar inisiatif dan dokumen pengakuan resmi</p>
            </div>
            <Link
              to="/carbon-certificate?code=TGX-CARBON-2026-00001"
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Lihat Sertifikat Karbon</span>
            </Link>
          </div>

          <div className="space-y-3">
            {campaigns.map(c => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{c.campaign_name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {c.status || "active"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{c.description}</p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2">
                    <span>Target: {(c.target_waste_kg || 10000).toLocaleString("id-ID")} Kg Sampah</span>
                    <span>Emisi: {c.target_co2 || 20} tCO2e</span>
                  </div>
                </div>

                <Link
                  to={`/csr-report/${c.id}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Audit Report</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
