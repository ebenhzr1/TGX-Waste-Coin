// Leaderboard Kontributor Hijau PT Jwalita Energi Trenggalek
import React from 'react';
import { useWaste } from '../context/WasteContext';
import { useAuth } from '../context/AuthContext';
import { formatNumber, formatRupiah, TGX_TO_IDR_RATE } from '../utils/carbonCalc';
import { Trophy, Medal, MapPin } from 'lucide-react';

const LEADERBOARD_DATA = [
  {
    rank: 1,
    name: 'Siti Rahayu',
    district: 'Watulimo',
    totalKg: 185.4,
    tgxEarned: 927.0,
    carbonKg: 389.3,
    badge: 'Duta Sirkular Emas'
  },
  {
    rank: 2,
    name: 'Joko Prabowo',
    district: 'Pogalan',
    totalKg: 152.0,
    tgxEarned: 760.0,
    carbonKg: 319.2,
    badge: 'Pahlawan Kompos'
  },
  {
    rank: 3,
    name: 'Agus Prasetyo',
    district: 'Trenggalek Kota',
    totalKg: 120.5,
    tgxEarned: 602.5,
    carbonKg: 253.0,
    badge: 'Agen Daur Ulang'
  },
  {
    rank: 4,
    name: 'Budi Santoso (Anda)',
    district: 'Trenggalek Kota',
    isCurrentUser: true,
    badge: 'Pahlawan Sirkular Level 3'
  },
  {
    rank: 5,
    name: 'Dewi Lestari',
    district: 'Durenan',
    totalKg: 94.2,
    tgxEarned: 471.0,
    carbonKg: 197.8,
    badge: 'Sahabat Bumi'
  },
  {
    rank: 6,
    name: 'Hadi Sucipto',
    district: 'Karangan',
    totalKg: 82.0,
    tgxEarned: 410.0,
    carbonKg: 172.2,
    badge: 'Pejuang Lingkungan'
  },
  {
    rank: 7,
    name: 'Rina Kusuma',
    district: 'Gandusari',
    totalKg: 76.5,
    tgxEarned: 382.5,
    carbonKg: 160.6,
    badge: 'Relawan Hijau'
  }
];

export default function RankingPage() {
  const { user } = useAuth();
  const { totalWasteKg, tgxBalance, carbonImpactKg } = useWaste();

  // Inject current user live stats into leaderboard rank 4
  const leaders = LEADERBOARD_DATA.map((item) => {
    if (item.isCurrentUser) {
      return {
        ...item,
        name: `${user?.name || 'Budi Santoso'} (Anda)`,
        totalKg: totalWasteKg,
        tgxEarned: tgxBalance,
        carbonKg: carbonImpactKg
      };
    }
    return item;
  });

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
          <Trophy className="w-3.5 h-3.5" />
          <span>Leaderboard Sirkular Trenggalek</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Peringkat Kontributor Hijau
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Apresiasi bagi warga dan komunitas Kabupaten Trenggalek yang terdepan dalam memilah sampah dan mereduksi emisi karbon.
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 items-end">
        {/* 2nd Place */}
        <div className="glass-card rounded-3xl p-5 border border-slate-700/50 text-center relative order-2 sm:order-1">
          <div className="w-12 h-12 rounded-full bg-slate-400/20 text-slate-200 border border-slate-300/40 flex items-center justify-center mx-auto mb-2 text-lg font-black">
            2
          </div>
          <h3 className="font-bold text-white text-sm">{leaders[1].name}</h3>
          <span className="text-[11px] text-slate-400 block mb-3">{leaders[1].district}</span>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
            <span className="text-base font-bold text-sky-400">{leaders[1].totalKg} kg</span>
            <span className="text-[11px] text-emerald-400 block font-semibold">+{leaders[1].tgxEarned} TGX</span>
          </div>
        </div>

        {/* 1st Place (Gold Champion) */}
        <div className="glass-card-eco rounded-3xl p-6 border border-amber-400/40 text-center relative order-1 sm:order-2 sm:-translate-y-3 shadow-xl shadow-amber-500/10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-amber-500/30">
            <Trophy className="w-8 h-8" />
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 mb-1">
            👑 Juara 1 Sirkular
          </span>
          <h3 className="font-extrabold text-white text-base">{leaders[0].name}</h3>
          <span className="text-xs text-slate-400 block mb-3">{leaders[0].district}</span>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-400/30 space-y-1">
            <span className="text-xl font-black text-amber-300">{leaders[0].totalKg} kg</span>
            <span className="text-xs text-emerald-400 block font-bold">+{leaders[0].tgxEarned} TGX</span>
            <span className="text-[10px] text-slate-400 block">{formatRupiah(leaders[0].tgxEarned * TGX_TO_IDR_RATE)}</span>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="glass-card rounded-3xl p-5 border border-amber-700/40 text-center relative order-3">
          <div className="w-12 h-12 rounded-full bg-amber-700/20 text-amber-300 border border-amber-600/40 flex items-center justify-center mx-auto mb-2 text-lg font-black">
            3
          </div>
          <h3 className="font-bold text-white text-sm">{leaders[2].name}</h3>
          <span className="text-[11px] text-slate-400 block mb-3">{leaders[2].district}</span>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
            <span className="text-base font-bold text-sky-400">{leaders[2].totalKg} kg</span>
            <span className="text-[11px] text-emerald-400 block font-semibold">+{leaders[2].tgxEarned} TGX</span>
          </div>
        </div>
      </div>

      {/* Community Total Stats Banner */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-3xl bg-slate-900/60 border border-white/10 mb-8 text-center backdrop-blur-xl">
        <div>
          <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider block">Warga Aktif</span>
          <span className="text-base sm:text-xl font-bold text-white">1.420 Orang</span>
        </div>
        <div className="border-x border-white/10">
          <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider block">Sampah Terkelola</span>
          <span className="text-base sm:text-xl font-bold text-emerald-400">12,8 Ton</span>
        </div>
        <div>
          <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider block">Metana Dicegah</span>
          <span className="text-base sm:text-xl font-bold text-cyan-400">1.02 Ton CH₄</span>
        </div>
      </div>

      {/* Full Leaderboard List */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white/10">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Medal className="w-5 h-5 text-emerald-400" />
          <span>Daftar Kontributor Teratas</span>
        </h2>

        <div className="space-y-2.5">
          {leaders.map((item) => (
            <div
              key={item.rank}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                item.isCurrentUser
                  ? 'border-emerald-400/60 bg-emerald-950/40 shadow-lg shadow-emerald-500/10 scale-[1.01]'
                  : 'border-white/5 bg-slate-950/40 hover:border-white/15'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm ${
                    item.rank === 1
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                      : item.rank === 2
                      ? 'bg-slate-400/20 text-slate-200 border border-slate-300/40'
                      : item.rank === 3
                      ? 'bg-amber-700/20 text-amber-300 border border-amber-600/40'
                      : item.isCurrentUser
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  #{item.rank}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-bold text-xs sm:text-sm ${item.isCurrentUser ? 'text-emerald-300' : 'text-white'}`}>
                      {item.name}
                    </span>
                    {item.isCurrentUser && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Anda
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      Kec. {item.district}
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-slate-500">
                      • {item.badge}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-xs sm:text-sm font-bold text-white">
                  {formatNumber(item.totalKg, 1)} kg
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 block">
                  +{formatNumber(item.tgxEarned, 1)} TGX
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
