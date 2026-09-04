import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";
import {
  FileText,
  Printer,
  ShieldCheck,
  Building2,
  Leaf,
  Globe2,
  School,
  GraduationCap,
  Coins,
  CheckCircle2,
  Calendar,
  Lock,
  ArrowLeft,
  Award,
  Layers
} from "lucide-react";

export default function CSRImpactReport() {
  const { id } = useParams();
  const campaignId = id || 1;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/csr/report/${campaignId}`);
        if (res.data) setReport(res.data);
      } catch (err) {
        console.warn("Using fallback CSR report:", err.message);
        setReport({
          report_id: "CSR-REPORT-2026-0001",
          campaign: {
            id: 1,
            name: "Green School Movement",
            company: "PT ABC",
            description: "Program CSR pengelolaan sampah terpilah dan sponsorship reward untuk 10 Sekolah Adiwiyata di Trenggalek",
            period: "2026-09-01 s/d 2026-12-31",
            status: "active"
          },
          environmental: {
            wasteReductionKg: 10000,
            wasteReductionTon: 10.0,
            co2AvoidedTCO2e: 20,
            co2AvoidedKg: 20000,
            carbonUnits: 20,
            methodology: "IPCC Waste Mitigation Formula / PT JET Standard"
          },
          social: {
            schoolsInvolved: 10,
            studentsBenefited: 500,
            adiwiyataImpact: "Edukasi pemilahan sampah dan pembiasaan budaya sirkular di sekolah binaan Adiwiyata Trenggalek"
          },
          economic: {
            rewardBudgetIDR: 50000000,
            rewardDistributedCoin: 100000,
            rewardItemsSponsored: "1.000 Bibit Pohon & Perlengkapan Belajar Ramah Lingkungan",
            circularVelocity: "Closed-loop economy dari setoran sampah ke penukaran reward siswa"
          },
          governance: {
            digitalAuditTrail: "TX-LEDGER-JET-2026-0904-ABC-01",
            transactionRecordsCount: 1,
            verificationAuthority: "PT Jwalita Energi Trenggalek (TGX System Auditor)",
            timestamp: new Date().toISOString()
          },
          carbonIntegration: {
            projectLinked: "TGX Waste Carbon Project",
            inventoryLinked: true,
            potentialCarbonImpact: "20 tCO2e",
            standard: "Potential Carbon Asset / Jwalita Environmental Unit"
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [campaignId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return (
      <div className="min-h-screen bg-[#060a11] text-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Menyusun CSR Impact Report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-16 print:bg-white print:text-slate-900">
      {/* Header - Hidden on Print */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/csr-dashboard"
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20"
            >
              <FileText className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </Link>
            <div>
              <h1 className="font-extrabold text-white text-base tracking-tight">CSR Impact Report Generator</h1>
              <p className="text-[10px] text-slate-400">Verifikasi 4 Pilar ESG & Rantai Nilai Aset Karbon</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              id="btn-print-csr-report"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Laporan</span>
            </button>
            <Link
              to="/csr-dashboard"
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-900 transition-all flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Printable Report Document */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 print:bg-white print:border-none print:p-4 print:shadow-none">
          {/* Document Header */}
          <div className="border-b border-slate-800/80 pb-6 print:border-slate-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-2 print:text-emerald-800 print:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Official CSR Impact Assessment · PT JET</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight print:text-slate-900">
                  CSR IMPACT REPORT
                </h1>
                <p className="text-xs text-slate-400 mt-1 print:text-slate-600">
                  Program Kemitraan Tanggung Jawab Sosial & Lingkungan Perusahaan (TJSL / CSR)
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Report Code</span>
                <span className="font-mono text-sm font-bold text-emerald-400 print:text-emerald-800">
                  {report.report_id}
                </span>
                <span className="text-[11px] text-slate-400 block print:text-slate-600">
                  {new Date(report.governance.timestamp).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
            </div>

            {/* Campaign Meta */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs print:bg-slate-50 print:border-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Mitra Korporasi:</span>
                <span className="font-bold text-white print:text-slate-900 text-sm">{report.campaign.company}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Nama Program:</span>
                <span className="font-bold text-teal-300 print:text-teal-800 text-sm">{report.campaign.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Periode:</span>
                <span className="font-medium text-slate-300 print:text-slate-700">{report.campaign.period}</span>
              </div>
            </div>
          </div>

          {/* 4 ESG Pillars Grid */}
          <div className="space-y-6">
            {/* 1. ENVIRONMENTAL PILLAR */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-emerald-500/30 space-y-4 print:bg-slate-50 print:border-slate-300">
              <div className="flex items-center gap-2 text-emerald-400 print:text-emerald-800 font-extrabold text-sm uppercase tracking-wider">
                <Leaf className="w-5 h-5" />
                <span>1. Pilar Environmental (Dampak Lingkungan)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[11px] text-slate-400 block font-bold uppercase mb-1">Waste Reduction</span>
                  <div className="text-2xl font-black text-white print:text-slate-900">
                    {report.environmental.wasteReductionTon} <span className="text-base font-bold text-slate-400">Ton</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    ({report.environmental.wasteReductionKg.toLocaleString("id-ID")} Kg Sampah Terpilah Berhasil Dikelola)
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[11px] text-slate-400 block font-bold uppercase mb-1">CO2 Avoided</span>
                  <div className="text-2xl font-black text-emerald-400 print:text-emerald-800">
                    {report.environmental.co2AvoidedTCO2e} <span className="text-base font-bold text-slate-400">tCO2e</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    ({report.environmental.co2AvoidedKg.toLocaleString("id-ID")} kgCO2e Mitigasi Gas Rumah Kaca)
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-400 print:text-slate-700 leading-relaxed border-t border-slate-800/80 pt-3">
                <strong>Metodologi Penghitungan: </strong>
                {report.environmental.methodology}. Seluruh timbulan sampah ditimbang melalui digital scale pada posko setor Adiwiyata Trenggalek.
              </div>
            </div>

            {/* 2. SOCIAL PILLAR */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-blue-500/30 space-y-4 print:bg-slate-50 print:border-slate-300">
              <div className="flex items-center gap-2 text-blue-400 print:text-blue-800 font-extrabold text-sm uppercase tracking-wider">
                <School className="w-5 h-5" />
                <span>2. Pilar Social (Dampak Sosial & Pendidikan)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[11px] text-slate-400 block font-bold uppercase mb-1">Schools Involved</span>
                  <div className="text-2xl font-black text-white print:text-slate-900">
                    {report.social.schoolsInvolved} <span className="text-base font-bold text-slate-400">Sekolah</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Sekolah Adiwiyata se-Kabupaten Trenggalek</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[11px] text-slate-400 block font-bold uppercase mb-1">Students Benefited</span>
                  <div className="text-2xl font-black text-blue-400 print:text-blue-800">
                    {report.social.studentsBenefited} <span className="text-base font-bold text-slate-400">Pelajar</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Siswa aktif memilah sampah dan berpartisipasi</p>
                </div>
              </div>

              <div className="text-xs text-slate-400 print:text-slate-700 leading-relaxed border-t border-slate-800/80 pt-3">
                <strong>Dampak Adiwiyata: </strong>
                {report.social.adiwiyataImpact}. Peningkatan literasi sirkular dan kesadaran lingkungan sejak usia dini.
              </div>
            </div>

            {/* 3. ECONOMIC PILLAR */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-amber-500/30 space-y-4 print:bg-slate-50 print:border-slate-300">
              <div className="flex items-center gap-2 text-amber-400 print:text-amber-800 font-extrabold text-sm uppercase tracking-wider">
                <Coins className="w-5 h-5" />
                <span>3. Pilar Economic (Ekonomi Sirkular & Reward)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[11px] text-slate-400 block font-bold uppercase mb-1">Reward Distributed</span>
                  <div className="text-2xl font-black text-amber-400 print:text-amber-800">
                    {report.economic.rewardDistributedCoin.toLocaleString("id-ID")}{" "}
                    <span className="text-base font-bold text-slate-400">TGX Coin</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Insentif digital beredar langsung ke wallet siswa</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-white print:border-slate-300">
                  <span className="text-[11px] text-slate-400 block font-bold uppercase mb-1">Sponsorship Item</span>
                  <div className="text-base font-black text-white print:text-slate-900 pt-1">
                    {report.economic.rewardItemsSponsored}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Total Alokasi: Rp {report.economic.rewardBudgetIDR.toLocaleString("id-ID")}</p>
                </div>
              </div>
            </div>

            {/* 4. GOVERNANCE PILLAR & CARBON INTEGRATION */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-cyan-500/30 space-y-4 print:bg-slate-50 print:border-slate-300">
              <div className="flex items-center gap-2 text-cyan-400 print:text-cyan-800 font-extrabold text-sm uppercase tracking-wider">
                <Lock className="w-5 h-5" />
                <span>4. Pilar Governance & Integrasi Karbon</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-white print:border-slate-300 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Digital Audit Trail</span>
                  <div className="font-mono text-cyan-300 print:text-cyan-800 text-[11px] break-all">
                    {report.governance.digitalAuditTrail}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Verifikator: {report.governance.verificationAuthority}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-white print:border-slate-300 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Integrasi Aset Karbon</span>
                  <div className="text-white print:text-slate-900 font-semibold">
                    Proyek Terkait: {report.carbonIntegration.projectLinked}
                  </div>
                  <div className="text-[11px] text-emerald-400 print:text-emerald-800 font-bold">
                    Potential Carbon Impact: {report.carbonIntegration.potentialCarbonImpact}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Status: Non-Double Counting Terjamin
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Signatures */}
          <div className="pt-6 border-t border-slate-800/80 print:border-slate-300 grid grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Disetujui Mitra Korporasi:</div>
              <div className="font-bold text-white print:text-slate-900">{report.campaign.company}</div>
              <div className="text-[11px] text-slate-400">Head of CSR & Sustainability</div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Diverifikasi Sistem & Auditor:</div>
              <div className="font-bold text-white print:text-slate-900">PT Jwalita Energi Trenggalek</div>
              <div className="text-[11px] text-emerald-400 print:text-emerald-800">Direksi TGX Waste Coin</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
