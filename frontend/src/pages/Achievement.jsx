import React, { useState, useEffect } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import {
  Award,
  Trophy,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Lock,
  Calendar,
  Coins,
  Trash2,
  Trees,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Star,
  Zap,
  Globe2
} from "lucide-react";

export default function Achievement() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("tgx_user") || "null") || {
    id: 1,
    name: "Ahmad Santoso",
    schoolName: "SDN 2 Bendorejo"
  };

  const fetchAchievement = async () => {
    setLoading(true);
    try {
      const studentId = currentUser.id || 1;
      const res = await api.get(`/gamification/user/${studentId}`);
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.warn("API /gamification/user offline, using demo achievement:", err.message);
      setData({
        level: 3,
        title: "Eco Champion",
        totalWaste: 75.0,
        totalCoin: 375.0,
        progressPercent: 50,
        nextLevelKg: 100,
        badges: [
          {
            id: 1,
            name: "First Deposit",
            description: "Setoran sampah pertama kali berhasil diverifikasi oleh petugas",
            icon: "🌱",
            requirement_type: "first_transaction",
            requirement_value: 1.0,
            is_earned: true,
            earned_at: "2026-09-02"
          },
          {
            id: 2,
            name: "Plastic Hero",
            description: "Mengumpulkan dan mendaur ulang minimal 50 kg sampah plastik",
            icon: "♻️",
            requirement_type: "plastic_weight",
            requirement_value: 50.0,
            is_earned: true,
            earned_at: "2026-09-03"
          },
          {
            id: 3,
            name: "Eco Champion",
            description: "Total pengumpulan seluruh jenis sampah mencapai 100 kg",
            icon: "🏆",
            requirement_type: "total_weight",
            requirement_value: 100.0,
            is_earned: false,
            earned_at: null
          },
          {
            id: 4,
            name: "Earth Guardian",
            description: "Dedikasi luar biasa dengan total sampah terkelola mencapai 1000 kg",
            icon: "🌎",
            requirement_type: "total_weight",
            requirement_value: 1000.0,
            is_earned: false,
            earned_at: null
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievement();
  }, []);

  const levelsRoadmap = [
    { level: 1, title: "Eco Beginner", range: "0 - 10 Kg", desc: "Langkah awal pejuang pilah sampah" },
    { level: 2, title: "Eco Fighter", range: "10 - 50 Kg", desc: "Konsisten menyetor sampah daur ulang" },
    { level: 3, title: "Eco Champion", range: "50 - 100 Kg", desc: "Penggerak Adiwiyata sekolah" },
    { level: 4, title: "Earth Guardian", range: "100 - 500 Kg", desc: "Pahlawan penjaga kelestarian bumi" },
    { level: 5, title: "Planet Hero", range: "> 500 Kg", desc: "Legenda keberlanjutan Trenggalek" }
  ];

  const earnedBadgesCount = data?.badges ? data.badges.filter(b => b.is_earned).length : 0;

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-16 relative">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-400 flex items-center justify-center shadow-md shadow-amber-500/20">
                <Award className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight">Pencapaian & Badge</span>
                <span className="hidden sm:inline-block ml-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">TGX Gamification</span>
              </div>
            </div>
          </div>

          <Link
            to="/competition"
            id="btn-lihat-kompetisi"
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Eco Competition</span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        {/* PROFILE CARD: HERO SECTION */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-slate-800/90 p-6 sm:p-8 mb-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-emerald-400 to-teal-300 p-1 shadow-xl shadow-emerald-500/20 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex flex-col items-center justify-center text-center p-2">
                  <span className="text-2xl sm:text-3xl">🏆</span>
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest mt-0.5">
                    LVL {data?.level || 1}
                  </span>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>{currentUser.schoolName || "SDN 2 Bendorejo"}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {currentUser.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-extrabold text-amber-400">
                    {data?.title || "Eco Fighter"}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400">
                    {earnedBadgesCount} dari {data?.badges?.length || 4} Badge Terbuka
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 backdrop-blur-md">
              <div className="p-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Sampah</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-white">{data?.totalWaste || 0}</span>
                  <span className="text-xs font-bold text-emerald-400">Kg</span>
                </div>
              </div>
              <div className="p-2 border-l border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Koin</span>
                <div className="flex items-baseline gap-1 mt-0.5 text-amber-400">
                  <Coins className="w-3.5 h-3.5" />
                  <span className="text-xl font-black">{data?.totalCoin || 0}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">TGX</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar ke Level Berikutnya */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-300">
                Progress Level {data?.level || 1} ({data?.title || "Eco Fighter"})
              </span>
              <span className="text-emerald-400 font-mono">
                {data?.totalWaste || 0} / {data?.nextLevelKg || 100} Kg ({data?.progressPercent || 0}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-1000 shadow-md shadow-emerald-500/30"
                style={{ width: `${data?.progressPercent || 20}%` }}
              />
            </div>
            {data?.nextLevelKg && (
              <p className="text-[11px] text-slate-500 mt-2">
                Kumpulkan <span className="text-amber-400 font-bold">{Math.max(0, (data.nextLevelKg - data.totalWaste)).toFixed(1)} Kg</span> sampah lagi untuk naik ke level berikutnya!
              </p>
            )}
          </div>
        </div>

        {/* BADGE SHOWCASE SECTION */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Koleksi Badge Prestasi</span>
              </h2>
              <p className="text-xs text-slate-400">Raih lencana eksklusif dari aksi nyata daur ulang sampahmu.</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              {earnedBadgesCount} / {data?.badges?.length || 4} Terbuka
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data?.badges?.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-3xl p-5 border transition-all flex flex-col justify-between relative overflow-hidden backdrop-blur-xl ${
                  badge.is_earned
                    ? "bg-slate-900/80 border-emerald-500/40 hover:border-emerald-500/60 shadow-lg shadow-emerald-500/5 hover:-translate-y-1"
                    : "bg-slate-950/40 border-slate-800/80 opacity-70 hover:opacity-90"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${
                      badge.is_earned ? "bg-emerald-500/15 border border-emerald-500/30" : "bg-slate-900 border border-slate-800"
                    }`}>
                      {badge.icon}
                    </div>

                    {badge.is_earned ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Didapat
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-slate-900 text-slate-500 border border-slate-800">
                        <Lock className="w-3 h-3" /> Terkunci
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-white text-base mb-1">
                    {badge.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80">
                  {badge.is_earned ? (
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {badge.earned_at ? `Diraih ${new Date(badge.earned_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}` : "Telah Diraih"}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      Syarat: {badge.requirement_value} Kg
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LEVEL ROADMAP LADDER */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Jenjang Level Eco Trenggalek</span>
            </h2>
            <p className="text-xs text-slate-400">
              Tingkatkan terus kontribusi setoran sampah untuk membuka status pahlawan lingkungan tertinggi.
            </p>
          </div>

          <div className="space-y-3">
            {levelsRoadmap.map((lvl) => {
              const isCurrent = data?.level === lvl.level;
              const isPassed = (data?.level || 1) > lvl.level;

              return (
                <div
                  key={lvl.level}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCurrent
                      ? "bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/20 border-emerald-500/50 shadow-md shadow-emerald-500/10"
                      : isPassed
                      ? "bg-slate-900/40 border-slate-800/60 opacity-80"
                      : "bg-slate-950/30 border-slate-800/40 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                      isCurrent
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                        : isPassed
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-500"
                    }`}>
                      {lvl.level}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-white text-sm">{lvl.title}</h4>
                        {isCurrent && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            LEVEL ANDA
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{lvl.desc}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      {lvl.range}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
