import React, { useState, useEffect } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { School, Users, Trash2, Trophy, ArrowLeft, LogOut, Coins, Sparkles, Leaf, ArrowUpRight, Gift } from "lucide-react";

export default function SchoolDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [carbonData, setCarbonData] = useState(null);
  const [schoolGamification, setSchoolGamification] = useState(null);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const res = await api.get("/dashboard/school/1");
        if (res.data) setStats(res.data);
      } catch {
        setStats({
          school: { name: "SDN 2 Bendorejo", address: "Kecamatan Pogalan, Trenggalek" },
          totalStudents: 300,
          totalWasteKg: 1200,
          totalCoin: 6000,
          rank: "#2"
        });
      }

      // Fetch Carbon Impact Sekolah (Sprint 16)
      try {
        const carbonRes = await api.get("/carbon/school/1");
        if (carbonRes.data) setCarbonData(carbonRes.data);
      } catch {
        setCarbonData({
          school: "SDN 2 Bendorejo",
          totalWasteKg: 1500,
          co2Avoided: 3000
        });
      }

      // Fetch Gamification School Achievement (Sprint 20)
      try {
        const gamRes = await api.get("/gamification/school/1");
        if (gamRes.data) setSchoolGamification(gamRes.data);
      } catch {
        setSchoolGamification({
          school: "SDN 2 Bendorejo",
          totalWaste: 2000,
          co2Avoided: 4000,
          level: "Eco School Adiwiyata Utama",
          rank: 2
        });
      }
    };
    fetchSchoolData();
  }, []);

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-16">
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-emerald-400" />
            <span className="font-extrabold text-white text-base">Portal Sekolah Adiwiyata</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/reward-management"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 transition-all flex items-center gap-1.5"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Verifikasi Reward</span>
            </Link>
            <button
              onClick={() => { localStorage.removeItem("token"); navigate("/"); }}
              className="text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-6">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Dashboard Mitra Sekolah</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">{stats?.school?.name || "SDN 2 Bendorejo"}</h1>
          <p className="text-xs text-slate-400 mt-1">{stats?.school?.address || "Kabupaten Trenggalek, Jawa Timur"}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-bold">
              <span>Jumlah Siswa Terdaftar</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white mt-2">{stats?.totalStudents || 300} <span className="text-sm font-semibold text-slate-400">Siswa</span></div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-bold">
              <span>Total Sampah Sekolah</span>
              <Trash2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400 mt-2">{stats?.totalWasteKg || 1200} <span className="text-sm font-semibold text-slate-300">Kg (1.2 Ton)</span></div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-bold">
              <span>Peringkat Adiwiyata</span>
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400 mt-2">{stats?.rank || "#2"} <span className="text-sm font-semibold text-slate-400">di Trenggalek</span></div>
          </div>
        </div>

        {/* Carbon Impact Sekolah Widget (Sprint 16: Jwalita For Earth) */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-teal-950/40 border border-emerald-500/30 p-6 mb-8 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Carbon Impact Sekolah</h3>
                <p className="text-xs text-slate-400">Dampak mitigasi gas rumah kaca terakumulasi dari seluruh siswa mitra</p>
              </div>
            </div>
            <Link
              to="/carbon"
              className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5 transition-all self-start sm:self-auto"
            >
              <span>Detail Dampak Emisi</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total Sampah
              </span>
              <div className="text-2xl font-black text-white">
                {carbonData?.totalWasteKg ?? 1500} <span className="text-sm text-slate-400 font-semibold">Kg</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Daur ulang oleh siswa {stats?.school?.name || "SDN 2 Bendorejo"}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                CO2 Avoided
              </span>
              <div className="text-2xl font-black text-emerald-400">
                {carbonData?.co2Avoided ?? 3000} <span className="text-sm text-slate-300 font-semibold">kgCO2e</span>
              </div>
              <p className="text-[11px] text-emerald-400/80 mt-1">Setara pencegahan {( (carbonData?.co2Avoided ?? 3000) / 1000 ).toFixed(1)} Ton gas rumah kaca</p>
            </div>
          </div>
        </div>

        {/* Eco School Ranking & Gamification (Sprint 20) */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-emerald-950/30 border border-amber-500/30 p-6 mb-8 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Eco School Ranking & Predikat Adiwiyata</h3>
                <p className="text-xs text-slate-400">Prestasi dan kompetisi pengumpulan sampah terpilah sekolah se-Trenggalek</p>
              </div>
            </div>
            <Link
              to="/competition"
              id="btn-lihat-eco-competition"
              className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 transition-all self-start sm:self-auto"
            >
              <span>Klasemen Eco Challenge</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Peringkat Adiwiyata</span>
              <div className="text-2xl font-black text-amber-400">#{schoolGamification?.rank || 2}</div>
              <p className="text-[10px] text-slate-500 mt-1">di Kabupaten Trenggalek</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Waste</span>
              <div className="text-2xl font-black text-emerald-400">{schoolGamification?.totalWaste || 2000} <span className="text-xs text-slate-400">Kg</span></div>
              <p className="text-[10px] text-slate-500 mt-1">Sampah terkelola</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">CO2 Impact</span>
              <div className="text-2xl font-black text-teal-400">{schoolGamification?.co2Avoided || 4000} <span className="text-xs text-slate-400">kgCO2e</span></div>
              <p className="text-[10px] text-slate-500 mt-1">Emisi gas rumah kaca dicegah</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">School Level</span>
              <div className="text-sm font-black text-white leading-tight mt-1">{schoolGamification?.level || "Eco School Adiwiyata"}</div>
              <p className="text-[10px] text-emerald-400 mt-1">Status Terverifikasi</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/competition" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20">
            <Trophy className="w-3.5 h-3.5" />
            <span>Eco Competition</span>
          </Link>
          <Link to="/ranking" className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-all">
            Lihat Klasemen Lengkap
          </Link>
          <Link to="/dashboard" className="px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-bold text-emerald-400 border border-emerald-500/30 transition-all">
            Simulasi Tampilan Siswa
          </Link>
          <Link to="/carbon" className="px-5 py-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-xs font-bold text-teal-400 border border-teal-500/30 transition-all flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5" />
            <span>Dashboard Carbon Impact</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
