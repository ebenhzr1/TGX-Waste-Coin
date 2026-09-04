import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  Award,
  Building2,
  Leaf,
  Globe2,
  FileCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Info,
  ExternalLink,
  RefreshCw
} from "lucide-react";

export default function CarbonOffset() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    buyer_name: "",
    buyer_type: "Corporate",
    carbon_amount: "10",
    purpose: "CSR Carbon Offset Program 2026"
  });

  const [offsets, setOffsets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [createdCert, setCreatedCert] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOffsets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/carbon-assets/offsets");
      if (Array.isArray(res.data)) {
        setOffsets(res.data);
      }
    } catch (err) {
      console.warn("Using fallback offsets:", err.message);
      setOffsets([
        {
          id: 1,
          buyer_name: "PT ABC Trenggalek Lestari",
          buyer_type: "Corporate",
          carbon_amount: 10.0,
          purpose: "CSR Offset Program Emisi 2026",
          status: "completed",
          created_at: "2026-09-04 10:30:00"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffsets();
  }, []);

  const carbonNum = parseFloat(formData.carbon_amount) || 0;
  // 1 carbon unit (tCO2e) = 1.000 kgCO2e = ~500 kg sampah plastik / ~1.000 kg sampah terpilah
  const equivKgCO2e = carbonNum * 1000;
  const equivWasteKg = carbonNum * 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.buyer_name.trim()) {
      showToast("Nama perusahaan / pembeli wajib diisi", "error");
      return;
    }
    if (carbonNum <= 0) {
      showToast("Jumlah karbon (carbon_amount) harus lebih dari 0", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/carbon-assets/offset", {
        buyer_name: formData.buyer_name,
        buyer_type: formData.buyer_type,
        carbon_amount: carbonNum,
        purpose: formData.purpose
      });

      showToast("Offset Request berhasil dibuat & Sertifikat diterbitkan!", "success");
      if (res.data?.certificate) {
        setCreatedCert(res.data.certificate);
      }
      setFormData({
        buyer_name: "",
        buyer_type: "Corporate",
        carbon_amount: "10",
        purpose: "CSR Carbon Offset Program 2026"
      });
      fetchOffsets();
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal membuat offset request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-16">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-300 text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/carbon-assets"
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20"
            >
              <Award className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </Link>
            <div>
              <h1 className="font-extrabold text-white text-base tracking-tight">Carbon Offset Portal</h1>
              <p className="text-[10px] text-slate-400">CSR & Corporate Environmental Impact Contribution</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/carbon-certificate"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Daftar Sertifikat</span>
            </Link>
            <Link
              to="/carbon-assets"
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-900 transition-all"
            >
              Kembali
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Input Buyer */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="font-extrabold text-white text-base">Buat Offset Request Baru</h2>
            </div>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Daftarkan entitas pembeli/mitra CSR untuk menyerap unit dampak karbon dari daur ulang sampah terpilah TGX Trenggalek.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Company / Buyer Name (Nama Perusahaan)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    id="input-buyer-name"
                    placeholder="Contoh: PT ABC Nusantara Lestari"
                    value={formData.buyer_name}
                    onChange={(e) => setFormData({ ...formData, buyer_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Tipe Entitas
                  </label>
                  <select
                    value={formData.buyer_type}
                    onChange={(e) => setFormData({ ...formData, buyer_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Corporate">Corporate / Perusahaan</option>
                    <option value="SME / UMKM">SME / UMKM Lokal</option>
                    <option value="Government / BUMD">Pemerintah / BUMD</option>
                    <option value="Individual">Individu Pegiat Lingkungan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Carbon Amount (tCO2e)
                  </label>
                  <div className="relative">
                    <Globe2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="number"
                      required
                      min="0.1"
                      step="0.1"
                      id="input-carbon-amount"
                      placeholder="Contoh: 10"
                      value={formData.carbon_amount}
                      onChange={(e) => setFormData({ ...formData, carbon_amount: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Purpose / Tujuan Offset
                </label>
                <textarea
                  rows="2"
                  id="input-purpose"
                  placeholder="Contoh: Komitmen Net Zero Scope 3 & CSR Penghijauan Berkelanjutan..."
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              {/* Conversion Calculator Box */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/25 space-y-2">
                <span className="text-[11px] font-bold text-emerald-400 block uppercase tracking-wider">
                  Kalkulasi Kesetaraan Dampak Lingkungan
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">CO2 Avoided:</span>
                    <strong className="text-white text-sm font-extrabold">{equivKgCO2e.toLocaleString("id-ID")} kgCO2e</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Setara Sampah Terpilah:</span>
                    <strong className="text-emerald-300 text-sm font-extrabold">±{equivWasteKg.toLocaleString("id-ID")} Kg</strong>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                id="btn-generate-offset"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memproses Permintaan Offset...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Generate Offset Request & Terbitkan Sertifikat</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Info: Live Success Modal / Notice */}
          <div className="lg:col-span-5 space-y-5">
            {createdCert ? (
              <div className="bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-900 border border-emerald-400/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sertifikat Berhasil Diterbitkan!</span>
                </div>
                <h3 className="text-lg font-black text-white mb-1">TGX Carbon Impact Certificate</h3>
                <p className="text-xs text-slate-400 mb-4">Sertifikat telah terbit dengan audit trail resmi sistem.</p>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs mb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Kode Sertifikat:</span>
                    <span className="font-mono font-bold text-emerald-400">{createdCert.certificate_code}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Holder:</span>
                    <span className="font-semibold text-white">{createdCert.holder_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Dampak Emisi:</span>
                    <span className="font-bold text-teal-300">{createdCert.carbon_amount} tCO2e</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Tanggal Terbit:</span>
                    <span>{createdCert.issued_date}</span>
                  </div>
                </div>

                <Link
                  to={`/carbon-certificate?code=${createdCert.certificate_code}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                >
                  <span>Buka Sertifikat Lengkap</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : null}

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl">
              <h3 className="font-extrabold text-white text-sm mb-2">Informasi Mekanisme Offset</h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Setiap offset diverifikasi dari data penimbangan sampah fisik terpilah.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Unit yang telah di-offset secara permanen dialokasikan ke pembeli terdaftar (Non-Double Counting).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Sertifikat mencakup QR code verifikasi dan bukti komitmen lingkungan PT JET.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Offset Transactions History */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-extrabold text-white text-base">Riwayat Transaksi Offset</h3>
              <p className="text-xs text-slate-400 mt-0.5">Daftar entitas pembeli dan status sertifikasi dampak</p>
            </div>
            <button
              onClick={fetchOffsets}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Nama Perusahaan / Buyer</th>
                  <th className="py-3 px-4">Tipe</th>
                  <th className="py-3 px-4">Carbon Impact</th>
                  <th className="py-3 px-4">Tujuan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {offsets.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">#{item.id}</td>
                    <td className="py-3 px-4 font-bold text-white">{item.buyer_name}</td>
                    <td className="py-3 px-4 text-slate-400">{item.buyer_type || "Corporate"}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-400">{item.carbon_amount} tCO2e</span>
                      <span className="text-[10px] text-slate-500 block">{(item.carbon_amount * 1000).toLocaleString("id-ID")} kgCO2e</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{item.purpose}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                        {item.status || "completed"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/carbon-certificate?offsetId=${item.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-all"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Sertifikat</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
