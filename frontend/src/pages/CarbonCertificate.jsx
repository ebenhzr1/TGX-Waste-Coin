import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/api";
import {
  FileCheck,
  ShieldCheck,
  Printer,
  Download,
  Award,
  Leaf,
  Globe2,
  Calendar,
  Building2,
  CheckCircle2,
  Share2,
  ChevronLeft,
  QrCode
} from "lucide-react";

export default function CarbonCertificate() {
  const [searchParams] = useSearchParams();
  const queryCode = searchParams.get("code");
  const queryOffsetId = searchParams.get("offsetId");

  const [cert, setCert] = useState({
    certificate_code: queryCode || "TGX-CARBON-2026-00001",
    holder_name: "PT ABC Trenggalek Lestari",
    carbon_amount: 10.0,
    issued_date: "2026-09-04",
    unit: "tCO2e"
  });

  const [allCerts, setAllCerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCert = async () => {
      setLoading(true);
      const targetId = queryCode || queryOffsetId || 1;
      try {
        const res = await api.get(`/carbon-assets/certificate/${targetId}`);
        if (res.data) {
          setCert(res.data);
        }
      } catch (err) {
        console.warn("Using default certificate display:", err.message);
      } finally {
        setLoading(false);
      }

      // Fetch list for switcher
      try {
        const listRes = await api.get("/carbon-assets/certificates");
        if (Array.isArray(listRes.data) && listRes.data.length > 0) {
          setAllCerts(listRes.data);
        }
      } catch (e) {
        // ignore
      }
    };

    fetchCert();
  }, [queryCode, queryOffsetId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-16 print:bg-white print:text-slate-900">
      {/* Top Header - Hide in print */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/carbon-assets"
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center shadow-md shadow-cyan-500/20"
            >
              <FileCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </Link>
            <div>
              <h1 className="font-extrabold text-white text-base tracking-tight">Official Carbon Certificate</h1>
              <p className="text-[10px] text-slate-400">Bukti Verifikasi Mitigasi Emisi PT Jwalita Energi Trenggalek</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              id="btn-print-certificate"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sertifikat</span>
            </button>
            <Link
              to="/carbon-offset"
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-900 transition-all"
            >
              Kembali
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Certificate Card Container */}
        <div className="relative bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 border-2 border-emerald-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden print:border-2 print:border-emerald-800 print:bg-white print:shadow-none print:p-8">
          {/* Decorative Corner Borders */}
          <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-emerald-400/60 rounded-tl-2xl pointer-events-none"></div>
          <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-emerald-400/60 rounded-tr-2xl pointer-events-none"></div>
          <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-emerald-400/60 rounded-bl-2xl pointer-events-none"></div>
          <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-emerald-400/60 rounded-br-2xl pointer-events-none"></div>

          {/* Certificate Header */}
          <div className="text-center space-y-3 pb-8 border-b border-slate-800/80 print:border-slate-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider print:text-emerald-800 print:border-emerald-800">
              <ShieldCheck className="w-4 h-4" />
              <span>PT Jwalita Energi Trenggalek · TGX Waste Coin</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase print:text-slate-900">
              TGX Carbon Impact Certificate
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto print:text-slate-600">
              Sertifikat Pengakuan Kontribusi Mitigasi Emisi Karbon Berbasis Sirkular Ekonomi Daur Ulang Sampah Terpilah
            </p>
          </div>

          {/* Main Body */}
          <div className="py-8 space-y-6 text-center">
            <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold print:text-slate-600">
              Diberikan dengan Bangga Kepada:
            </div>

            {/* Holder Name */}
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 print:text-emerald-800 py-1">
              {cert.holder_name || "PT ABC"}
            </div>

            <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed print:text-slate-700">
              Telah berpartisipasi aktif dalam mitigasi perubahan iklim dan penyerapan unit dampak emisi lingkungan melalui program TGX Waste Coin di Kabupaten Trenggalek dengan kontribusi:
            </p>

            {/* Impact Metric Box */}
            <div className="inline-block p-6 rounded-3xl bg-emerald-950/30 border border-emerald-500/30 shadow-lg print:bg-slate-100 print:border-slate-300 my-2">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 print:text-emerald-800">
                Total Verified Carbon Impact
              </div>
              <div className="text-4xl sm:text-5xl font-black text-white print:text-slate-900">
                {cert.carbon_amount} <span className="text-2xl text-emerald-400 print:text-emerald-800">tCO2e</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 print:text-slate-600">
                Setara dengan {(cert.carbon_amount * 1000).toLocaleString("id-ID")} kgCO2e Pengurangan Emisi Gas Rumah Kaca
              </div>
            </div>
          </div>

          {/* Certificate Metadata & Signature Row */}
          <div className="pt-6 border-t border-slate-800/80 print:border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-xs">
            {/* Metadata */}
            <div className="space-y-1.5 text-left text-slate-400 print:text-slate-600">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Certificate Code:</span>
                <span className="font-mono font-bold text-emerald-400 print:text-emerald-800 text-sm">
                  {cert.certificate_code || "TGX-CARBON-2026-00001"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Tanggal Terbit:</span>
                <span className="font-medium text-white print:text-slate-900">{cert.issued_date || "2026-09-04"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Lokasi Proyek:</span>
                <span className="font-medium text-white print:text-slate-900">Trenggalek, Jawa Timur</span>
              </div>
            </div>

            {/* QR Code Simulation */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950/80 border border-slate-800 print:bg-white print:border-slate-300">
              <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center text-slate-950">
                <QrCode className="w-full h-full" />
              </div>
              <span className="text-[9px] text-slate-500 mt-1.5 font-mono">VERIFIED AUDIT TRAIL</span>
            </div>

            {/* Signature Block */}
            <div className="space-y-1 text-center sm:text-right">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Diterbitkan Oleh:</div>
              <div className="font-extrabold text-white print:text-slate-900 text-sm">PT Jwalita Energi Trenggalek</div>
              <div className="text-[11px] text-emerald-400 font-semibold print:text-emerald-800">Direksi & Verifikator Karbon TGX</div>
              <div className="pt-3 text-[10px] text-slate-500 italic">Dokumen Digital Sah & Tersimpan di Ledger TGX</div>
            </div>
          </div>
        </div>

        {/* Available Certificates Switcher */}
        {allCerts.length > 1 && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 print:hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Sertifikat Lainnya Terdaftar:
            </span>
            <div className="flex flex-wrap gap-2">
              {allCerts.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCert(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                    cert.certificate_code === c.certificate_code
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {c.certificate_code} ({c.holder_name})
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
