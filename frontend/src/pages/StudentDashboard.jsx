import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { 
  Coins, 
  Trash2, 
  Trophy, 
  ArrowUpRight, 
  PlusCircle, 
  Sparkles, 
  History, 
  School, 
  LogOut, 
  Flame,
  CheckCircle2,
  Clock,
  Leaf,
  Trees,
  Globe2,
  ShoppingBag,
  Gift,
  Award,
  Medal
} from "lucide-react";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [carbonData, setCarbonData] = useState(null);
  const [achievement, setAchievement] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil user dari localStorage
  const savedUser = JSON.parse(localStorage.getItem("tgx_user") || "null") || {
    id: 1,
    name: "Ahmad Santoso",
    email: "ahmad@siswa.id",
    schoolName: "SDN 2 Bendorejo"
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const studentId = savedUser.id || 1;
        const res = await api.get(`/dashboard/student/${studentId}`);
        if (res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.warn("API dashboard offline, using rich demo metrics:", err.message);
        // Fallback rich demo data
        setData({
          student: {
            id: savedUser.id,
            name: savedUser.name || "Ahmad Santoso",
            schoolName: savedUser.schoolName || "SDN 2 Bendorejo"
          },
          totalWasteKg: 25.0,
          totalCoin: 250.0,
          walletBalance: 250.0,
          ranking: "#5",
          recentTransactions: [
            { id: 101, waste_type: "Plastik PET", weight_kg: 10.0, coin_amount: 50.0, status: "approved", created_at: "Hari ini, 09:15" },
            { id: 102, waste_type: "Kardus & Kertas", weight_kg: 8.0, coin_amount: 20.0, status: "approved", created_at: "Kemarin, 14:20" },
            { id: 103, waste_type: "Organik Kompos", weight_kg: 7.0, coin_amount: 24.5, status: "pending", created_at: "2 Sep 2026" }
          ]
        });
      }

      // Ambil ranking
      try {
        const rankRes = await api.get("/ranking/school");
        if (rankRes.data && rankRes.data.length > 0) {
          setLeaderboard(rankRes.data);
        } else {
          throw new Error("Empty leaderboard");
        }
      } catch {
        setLeaderboard([
          { rank: 1, school: "SMPN 1 Trenggalek", weight: 620, coin: 3100 },
          { rank: 2, school: "SDN 2 Bendorejo", weight: 512, coin: 2560 },
          { rank: 3, school: "SMAN 1 Durenan", weight: 480, coin: 2400 },
          { rank: 4, school: "MTsN 1 Pogalan", weight: 395, coin: 1975 },
          { rank: 5, school: "SDN 1 Sumbergedong", weight: 310, coin: 1550 }
        ]);
      }

      // Ambil carbon impact siswa (Sprint 16)
      try {
        const studentId = savedUser.id || 1;
        const carbonRes = await api.get(`/carbon/user/${studentId}`);
        if (carbonRes.data) {
          setCarbonData(carbonRes.data);
        }
      } catch {
        setCarbonData({
          totalWasteKg: 25,
          co2Avoided: 50,
          treeEquivalent: 5
        });
      }

      // Ambil data Gamification & Badges (Sprint 20)
      try {
        const studentId = savedUser.id || 1;
        const gamRes = await api.get(`/gamification/user/${studentId}`);
        if (gamRes.data) {
          setAchievement(gamRes.data);
        }
      } catch {
        setAchievement({
          level: 2,
          title: "Eco Fighter",
          badges: [{ id: 1 }, { id: 2 }, { id: 3 }],
          ranking: "#5"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tgx_token");
    navigate("/");
  };

  const studentName = data?.student?.name || savedUser.name || "Ahmad";
  const totalWaste = data?.totalWasteKg ?? 25.0;
  const coinBalance = data?.walletBalance ?? data?.totalCoin ?? 250.0;
  const rankNumber = data?.ranking || "#5";
  const userLevel = achievement?.title || "Eco Fighter";
  const badgeCount = achievement?.badges ? achievement.badges.filter(b => b.is_earned !== false).length : 3;

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-16">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Coins className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight">TGX Waste Coin</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Portal Siswa</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/achievement"
              id="menu-achievement"
              className="text-xs font-semibold text-slate-300 hover:text-amber-400 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/50 transition-all flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Achievement</span>
            </Link>
            <Link
              to="/competition"
              id="menu-competition"
              className="text-xs font-semibold text-slate-300 hover:text-emerald-400 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/50 transition-all flex items-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Competition</span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-red-400 hover:text-red-300 px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        {/* User Greeting Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-emerald-950/30 border border-slate-800/90 p-6 sm:p-8 mb-6 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
                <School className="w-3.5 h-3.5" />
                {savedUser.schoolName || "SDN 2 Bendorejo - Trenggalek"}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                Halo, <span className="text-emerald-400">{studentName}</span> 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Setorkan sampah pilahanmu di Bank Sampah sekolah atau hub TPST PT JET untuk menambah koin TGX dan naikkan peringkat sekolahmu!
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto shrink-0">
              <Link
                to="/marketplace"
                id="btn-tukar-reward-marketplace"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-sm active:scale-95 transition-all shadow-lg"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Marketplace</span>
              </Link>
              <Link
                to="/submit"
                id="btn-setor-sampah-cta"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition-all"
              >
                <PlusCircle className="w-5 h-5 stroke-[2.5]" />
                <span>Setor Sampah</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Main Metric Cards (Including Sprint 20: My Achievement) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total Sampah */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sampah Terkumpul</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Trash2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tight">{totalWaste}</span>
              <span className="text-base font-bold text-emerald-400">Kg</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Terverifikasi oleh PT JET
            </p>
          </div>

          {/* Card 2: Saldo Koin TGX */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/40 transition-all shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saldo Koin TGX</span>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white tracking-tight">{coinBalance}</span>
                <span className="text-base font-bold text-amber-400">TGX</span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Rp {(coinBalance * 1000).toLocaleString('id-ID')}</span>
              <Link to="/marketplace" className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300">
                <Gift className="w-3.5 h-3.5" />
                <span>Tukar Reward →</span>
              </Link>
            </div>
          </div>

          {/* Card 3: Peringkat / Ranking */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Peringkat Sekolah</span>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tight">{rankNumber}</span>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">di Trenggalek</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Peringkat Mingguan (Update Setiap Rabu)
            </p>
          </div>

          {/* Card 4: My Achievement (Sprint 20) */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/40 transition-all shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Achievement</span>
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-white tracking-tight">{userLevel}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                <Medal className="w-3.5 h-3.5 text-amber-400" />
                <span><b>{badgeCount}</b> Badge Terkumpul</span>
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Ranking: <b className="text-slate-300">{rankNumber}</b></span>
              <Link to="/achievement" className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300">
                <span>Detail →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 🌱 Carbon Impact Widget (Sprint 16: Jwalita For Earth) */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/50 via-slate-900/80 to-teal-950/40 border border-emerald-500/30 p-5 sm:p-6 mb-8 backdrop-blur-xl relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-base">🌱 Carbon Impact</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Jwalita For Earth
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Setiap sampah terpilahmu mencegah timbulan gas rumah kaca di Trenggalek
                </p>
              </div>
            </div>

            <Link
              to="/carbon"
              className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5 transition-all self-start sm:self-auto"
            >
              <span>Lihat Detail Impact</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-800/80">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Sampah Terkumpul
              </span>
              <div className="text-xl font-black text-white">
                {carbonData?.totalWasteKg ?? 25} <span className="text-xs text-slate-400 font-semibold">Kg</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                CO2 Dicegah
              </span>
              <div className="text-xl font-black text-emerald-400">
                {carbonData?.co2Avoided ?? 50} <span className="text-xs text-slate-300 font-semibold">kgCO2e</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Setara
              </span>
              <div className="text-xl font-black text-teal-300 flex items-center gap-1.5">
                <Trees className="w-4 h-4 text-emerald-400" />
                <span>{carbonData?.treeEquivalent ?? 5} pohon</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2 Columns: Recent Transactions & Leaderboard Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Recent Transactions List (3 cols) */}
          <div className="lg:col-span-3 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Riwayat Setoran Terakhir</h3>
              </div>
              <Link to="/submit" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                Setor Baru <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {(data?.recentTransactions || []).length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">Belum ada transaksi setoran sampah.</p>
              ) : (
                (data?.recentTransactions || []).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/70 hover:border-slate-700/80 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{tx.waste_type}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{tx.weight_kg} Kg</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3" />
                            {tx.created_at || "Baru saja"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-extrabold text-emerald-400 text-sm">+{tx.coin_amount} TGX</div>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                        tx.status === "approved" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {tx.status === "approved" ? "Disetujui" : "Menunggu"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Leaderboard Schools (2 cols) */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-base">Top Leaderboard</h3>
              </div>
              <Link to="/ranking" className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {leaderboard.slice(0, 5).map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    item.school === "SDN 2 Bendorejo"
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-slate-950/40 border-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                      idx === 0 ? "bg-amber-400 text-slate-950" :
                      idx === 1 ? "bg-slate-300 text-slate-950" :
                      idx === 2 ? "bg-amber-700 text-white" :
                      "bg-slate-800 text-slate-300"
                    }`}>
                      #{item.rank || idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-[170px]">
                        {item.school}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.weight} Kg sampah</div>
                    </div>
                  </div>

                  <div className="text-xs font-extrabold text-amber-400">
                    {item.coin} <span className="text-[10px] font-normal text-slate-400">TGX</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
