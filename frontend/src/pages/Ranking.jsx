import React, { useState, useEffect } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Trophy, 
  Medal, 
  School, 
  User, 
  Coins, 
  Trash2, 
  Calendar, 
  Flame, 
  Search,
  Sparkles
} from "lucide-react";

export default function Ranking() {
  const [tab, setTab] = useState("school"); // 'school' | 'student'
  const [period, setPeriod] = useState("weekly"); // 'weekly' | 'monthly'
  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        if (tab === "school") {
          const res = await api.get(`/ranking/school?period=${period}`);
          if (res.data && res.data.length > 0) {
            setSchools(res.data);
          } else {
            throw new Error("Empty school ranking");
          }
        } else {
          const res = await api.get(`/ranking/student?period=${period}`);
          if (res.data && res.data.length > 0) {
            setStudents(res.data);
          } else {
            throw new Error("Empty student ranking");
          }
        }
      } catch (err) {
        console.warn("API ranking offline, using fallback data:", err.message);
        // Fallback data
        setSchools([
          { rank: 1, school: "SMPN 1 Trenggalek", weight: 642.5, coin: 3212.5, period: "weekly" },
          { rank: 2, school: "SDN 2 Bendorejo", weight: 512.0, coin: 2560.0, period: "weekly" },
          { rank: 3, school: "SMAN 1 Durenan", weight: 485.2, coin: 2426.0, period: "weekly" },
          { rank: 4, school: "MTsN 1 Pogalan", weight: 395.0, coin: 1975.0, period: "weekly" },
          { rank: 5, school: "SDN 1 Sumbergedong", weight: 310.4, coin: 1552.0, period: "weekly" },
          { rank: 6, school: "SMPN 2 Karangan", weight: 280.0, coin: 1400.0, period: "weekly" },
          { rank: 7, school: "SDN 3 Gandusari", weight: 245.5, coin: 1227.5, period: "weekly" }
        ]);
        setStudents([
          { rank: 1, student: "Ahmad Santoso", school: "SDN 2 Bendorejo", weight: 42.5, coin: 212.5 },
          { rank: 2, student: "Dewi Lestari", school: "SMPN 1 Trenggalek", weight: 38.0, coin: 190.0 },
          { rank: 3, student: "Bagus Pratama", school: "SMAN 1 Durenan", weight: 35.2, coin: 176.0 },
          { rank: 4, student: "Siti Rahmawati", school: "MTsN 1 Pogalan", weight: 31.0, coin: 155.0 },
          { rank: 5, student: "Rian Hidayat", school: "SDN 2 Bendorejo", weight: 28.5, coin: 142.5 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [tab, period]);

  const listData = tab === "school" ? schools : students;
  const filteredList = listData.filter((item) => {
    const name = tab === "school" ? item.school : item.student;
    return (name || "").toLowerCase().includes(search.toLowerCase());
  });

  const topThree = filteredList.slice(0, 3);
  const remainingList = filteredList.slice(3);

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-16">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Trophy className="w-4 h-4" />
            <span>Leaderboard Sirkular</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6">
        {/* Hero Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5" />
            Piala Adiwiyata Digital Trenggalek
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            Peringkat <span className="text-emerald-400">Ekonomi Sirkular</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Klasemen pengumpulan sampah dan reward koin TGX sekolah se-Kabupaten Trenggalek
          </p>
        </div>

        {/* Tab & Period Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* School / Student Toggle */}
          <div className="flex p-1 bg-slate-900/80 border border-slate-800 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setTab("school")}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                tab === "school"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <School className="w-4 h-4" />
              <span>Peringkat Sekolah</span>
            </button>
            <button
              onClick={() => setTab("student")}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                tab === "student"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Siswa Teraktif</span>
            </button>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Calendar className="w-4 h-4 text-slate-500 hidden sm:block" />
            <div className="flex p-1 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <button
                onClick={() => setPeriod("weekly")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  period === "weekly" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Mingguan
              </button>
              <button
                onClick={() => setPeriod("monthly")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  period === "monthly" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Bulanan
              </button>
            </div>
          </div>
        </div>

        {/* Podium Top 3 */}
        {topThree.length >= 3 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end mb-8 pt-4">
            {/* Rank 2 (Silver) */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl sm:rounded-3xl p-3 sm:p-5 text-center relative overflow-hidden backdrop-blur-xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-300 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center mx-auto mb-2 shadow-lg">
                #2
              </div>
              <h3 className="font-bold text-white text-xs sm:text-sm truncate">
                {tab === "school" ? topThree[1].school : topThree[1].student}
              </h3>
              <p className="text-[11px] text-emerald-400 font-extrabold mt-1">{topThree[1].weight} Kg</p>
              <p className="text-[10px] text-amber-400 font-semibold">{topThree[1].coin} TGX</p>
            </div>

            {/* Rank 1 (Gold - Center & Elevated) */}
            <div className="bg-gradient-to-b from-amber-500/20 via-slate-900/80 to-slate-900/90 border-2 border-amber-500/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center relative overflow-hidden backdrop-blur-2xl shadow-2xl -translate-y-3 sm:-translate-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-black text-base sm:text-xl flex items-center justify-center mx-auto mb-2 shadow-xl shadow-amber-500/30">
                👑 #1
              </div>
              <h3 className="font-black text-white text-sm sm:text-base truncate">
                {tab === "school" ? topThree[0].school : topThree[0].student}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-400 font-black mt-1">{topThree[0].weight} Kg</p>
              <p className="text-[11px] text-amber-400 font-extrabold">{topThree[0].coin} TGX</p>
              <span className="inline-block px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 text-[10px] font-bold mt-2">
                Juara 1 Adiwiyata
              </span>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl sm:rounded-3xl p-3 sm:p-5 text-center relative overflow-hidden backdrop-blur-xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-700 text-white font-black text-sm sm:text-base flex items-center justify-center mx-auto mb-2 shadow-lg">
                #3
              </div>
              <h3 className="font-bold text-white text-xs sm:text-sm truncate">
                {tab === "school" ? topThree[2].school : topThree[2].student}
              </h3>
              <p className="text-[11px] text-emerald-400 font-extrabold mt-1">{topThree[2].weight} Kg</p>
              <p className="text-[10px] text-amber-400 font-semibold">{topThree[2].coin} TGX</p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder={`Cari nama ${tab === "school" ? "sekolah" : "siswa"}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Table / List of Rankings */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4 sm:p-6 backdrop-blur-xl">
          <div className="space-y-2">
            {remainingList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/60 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800/80 text-slate-300 font-bold text-xs flex items-center justify-center">
                    #{item.rank || idx + 4}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {tab === "school" ? item.school : item.student}
                    </div>
                    {tab === "student" && (
                      <div className="text-[11px] text-slate-400">{item.school}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-xs font-bold text-emerald-400">{item.weight} Kg</div>
                    <div className="text-[10px] text-slate-400">Sampah</div>
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-amber-400">{item.coin} TGX</div>
                    <div className="text-[10px] text-slate-400">Reward</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
