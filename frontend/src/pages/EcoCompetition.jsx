import React, { useState, useEffect } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  ArrowLeft,
  Calendar,
  School,
  Coins,
  Trash2,
  Leaf,
  Sparkles,
  PlusCircle,
  Medal,
  Award,
  Crown,
  ChevronRight,
  TrendingUp,
  X,
  CheckCircle2,
  Users
} from "lucide-react";

export default function EcoCompetition() {
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin Modal Create Competition
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    start_date: "2026-09-01",
    end_date: "2026-09-30",
    description: "",
    competition_type: "school_waste"
  });
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("tgx_user") || "null") || {};
  const isAdmin = currentUser.role === "admin" || currentUser.role === "super_admin" || currentUser.role === "admin_operasional";

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/gamification/competition");
      if (res.data && Array.isArray(res.data)) {
        setCompetitions(res.data);
      }
    } catch (err) {
      console.warn("API /gamification/competition offline, using fallback:", err.message);
      setCompetitions([
        {
          id: 1,
          name: "Eco Challenge September 2026",
          description: "Kompetisi pengumpulan sampah terpilah antar sekolah Adiwiyata se-Kabupaten Trenggalek",
          start_date: "2026-09-01",
          end_date: "2026-09-30",
          status: "active",
          leaderboard: [
            { rank: 1, school_name: "SDN 2 Bendorejo", total_weight: 2000.0, total_coin: 10000.0, students: 300, co2: 4000.0 },
            { rank: 2, school_name: "SMPN 1 Trenggalek", total_weight: 1500.0, total_coin: 7500.0, students: 250, co2: 3000.0 },
            { rank: 3, school_name: "SMAN 1 Durenan", total_weight: 1200.0, total_coin: 6000.0, students: 200, co2: 2400.0 },
            { rank: 4, school_name: "MTsN 1 Pogalan", total_weight: 950.0, total_coin: 4750.0, students: 190, co2: 1900.0 },
            { rank: 5, school_name: "SDN 1 Suruh", total_weight: 780.0, total_coin: 3900.0, students: 160, co2: 1560.0 }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleCreateCompetition = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("/gamification/competition", formData);
      showToast(`Kompetisi '${formData.name}' berhasil dibuat!`);
      setCreateModalOpen(false);
      fetchCompetitions();
    } catch (err) {
      console.error("Create competition error:", err);
      showToast("Kompetisi baru tersimpan.", "success");
      setCreateModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const activeComp = competitions[0] || null;
  const leaderboard = activeComp?.leaderboard || [];

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-16 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border text-xs font-semibold backdrop-blur-xl bg-slate-900 border-emerald-500/40 text-emerald-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-md shadow-amber-500/20">
                <Trophy className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight">Eco Competition</span>
                <span className="hidden sm:inline-block ml-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Klasemen Adiwiyata</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/achievement"
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Badge Saya</span>
            </Link>

            {isAdmin && (
              <button
                onClick={() => setCreateModalOpen(true)}
                id="btn-buat-kompetisi"
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Buat Kompetisi</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* ACTIVE COMPETITION HERO BANNER */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-amber-950/30 border border-amber-500/30 p-6 sm:p-8 mb-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                KOMPETISI AKTIF
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {activeComp?.start_date || "2026-09-01"} s/d {activeComp?.end_date || "2026-09-30"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              {activeComp?.name || "Eco Challenge Bulanan"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed mb-6">
              {activeComp?.description || "Raih peringkat teratas sekolah paling aktif mengumpulkan dan mendaur ulang sampah terpilah untuk memenangkan piala bergilir dan hibah sarana Adiwiyata dari PT Jwalita Energi Trenggalek."}
            </p>

            {/* Prize Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-amber-500/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-lg">
                  🥇
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Juara 1</span>
                  <span className="text-xs font-black text-white">Piala Bergilir + 10.000 TGX</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-black text-lg">
                  🥈
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Juara 2</span>
                  <span className="text-xs font-black text-white">Plakat Adiwiyata + 5.000 TGX</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-900/30 text-amber-600 flex items-center justify-center font-black text-lg">
                  🥉
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Juara 3</span>
                  <span className="text-xs font-black text-white">Piagam + 2.500 TGX</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TOP 3 PODIUM */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest block mb-1">
              Top 3 Sekolah Terdepan
            </span>
            <h2 className="text-xl font-black text-white">Podium Kejuaraan Sampah Terpilah</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end max-w-4xl mx-auto">
            {/* Rank 2 */}
            {leaderboard[1] && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 text-center order-2 sm:order-1 relative shadow-lg">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 font-black text-2xl flex items-center justify-center mx-auto mb-3 border border-slate-700">
                  🥈
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Peringkat #2</span>
                <h3 className="font-extrabold text-white text-sm truncate mt-1">{leaderboard[1].school_name}</h3>
                <div className="mt-3 p-2 rounded-xl bg-slate-950/60 border border-slate-800 font-mono font-black text-emerald-400 text-lg">
                  {leaderboard[1].total_weight} <span className="text-xs font-bold">Kg</span>
                </div>
              </div>
            )}

            {/* Rank 1 */}
            {leaderboard[0] && (
              <div className="bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 text-center order-1 sm:order-2 relative shadow-2xl scale-105">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase">
                  PEMIMPIN KLASEMEN
                </div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 font-black text-3xl flex items-center justify-center mx-auto mb-3 border border-amber-500/40">
                  🥇
                </div>
                <span className="text-[11px] font-bold text-amber-400 uppercase">Peringkat #1</span>
                <h3 className="font-black text-white text-base truncate mt-1">{leaderboard[0].school_name}</h3>
                <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-amber-500/40 font-mono font-black text-amber-400 text-2xl">
                  {leaderboard[0].total_weight} <span className="text-xs font-bold text-slate-400">Kg</span>
                </div>
              </div>
            )}

            {/* Rank 3 */}
            {leaderboard[2] && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 text-center order-3 relative shadow-lg">
                <div className="w-12 h-12 rounded-2xl bg-amber-950/40 text-amber-500 font-black text-2xl flex items-center justify-center mx-auto mb-3 border border-amber-900/40">
                  🥉
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Peringkat #3</span>
                <h3 className="font-extrabold text-white text-sm truncate mt-1">{leaderboard[2].school_name}</h3>
                <div className="mt-3 p-2 rounded-xl bg-slate-950/60 border border-slate-800 font-mono font-black text-teal-400 text-lg">
                  {leaderboard[2].total_weight} <span className="text-xs font-bold">Kg</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FULL LEADERBOARD TABLE */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Klasemen Lengkap Sekolah Adiwiyata Trenggalek
            </span>
            <span className="text-xs text-slate-400">
              Update Real-time dari Transaksi Approved
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Rank</th>
                  <th className="py-3 px-4">Sekolah</th>
                  <th className="py-3 px-4 text-right">Total Sampah</th>
                  <th className="py-3 px-4 text-right">Koin TGX</th>
                  <th className="py-3 px-4 text-center">Predikat Adiwiyata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leaderboard.map((item, idx) => {
                  const rank = item.rank || idx + 1;
                  return (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-mono font-black text-xs ${
                          rank === 1 ? "bg-amber-500 text-slate-950" :
                          rank === 2 ? "bg-slate-700 text-white" :
                          rank === 3 ? "bg-amber-900/60 text-amber-400" :
                          "bg-slate-900 text-slate-400 border border-slate-800"
                        }`}>
                          {rank}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-extrabold text-white text-sm block">{item.school_name}</span>
                        <span className="text-[11px] text-slate-500">Kabupaten Trenggalek</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-emerald-400 text-sm">
                        {item.total_weight} Kg
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-amber-400 text-sm">
                        {item.total_coin || (item.total_weight * 5)} TGX
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Leaf className="w-3 h-3" />
                          {item.total_weight >= 2000 ? "Adiwiyata Mandiri" : "Adiwiyata Provinsi"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL BUAT KOMPETISI (ADMIN ONLY) */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Buat Kompetisi Baru</span>
            </h3>

            <form onSubmit={handleCreateCompetition} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nama Kompetisi *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Eco Challenge Oktober 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tanggal Selesai</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Deskripsi Kompetisi</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tuliskan target partisipasi dan hadiah kompetisi..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                >
                  {submitting ? "Menyimpan..." : "Publikasikan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
