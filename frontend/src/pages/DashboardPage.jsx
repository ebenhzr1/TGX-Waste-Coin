import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWaste } from '../context/WasteContext';
import { formatNumber, formatRupiah, TGX_TO_IDR_RATE } from '../utils/carbonCalc';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import {
  Coins,
  Scale,
  Leaf,
  Trophy,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  TreeDeciduous,
  FlameKindling
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { transactions, totalWasteKg, tgxBalance, carbonImpactKg, ranking } = useWaste();

  const rupiahEquivalent = tgxBalance * TGX_TO_IDR_RATE;
  // Pohon setara serapan karbon (1 pohon rata-rata menyerap ~22 kg CO2 per tahun)
  const treesEquivalent = (carbonImpactKg / 22).toFixed(1);
  // Metana terhindar dari TPA Trenggalek (sekitar 0.08 kg CH4 per kg sampah)
  const methaneAvoidedKg = (totalWasteKg * 0.08).toFixed(1);

  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-6xl mx-auto w-full">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 mb-6 border border-emerald-500/20 bg-gradient-to-r from-emerald-950/70 via-slate-900/80 to-sky-950/60 shadow-2xl backdrop-blur-xl">
        {/* Glow orb */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Program Sirkular Trenggalek Bersih</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Halo, <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">{user?.name || 'Budi Santoso'}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Kontribusi Anda telah membantu mengurangi beban sampah di TPA Trenggalek dan menurunkan potensi gas metana.
            </p>
          </div>

          {/* Primary CTA: Setor Sampah */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/setor"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Setor Sampah Sekarang</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Saldo Coin TGX & Nilai Rupiah */}
        <StatCard
          title="Saldo TGX Coin"
          value={formatNumber(tgxBalance, 1)}
          unit="TGX"
          subtitle={`Nilai Rupiah: ${formatRupiah(rupiahEquivalent)}`}
          icon={Coins}
          variant="emerald"
          badgeText="1 TGX = Rp1.000"
        />

        {/* Card 2: Total Sampah Terkumpul */}
        <StatCard
          title="Total Sampah Terkumpul"
          value={formatNumber(totalWasteKg, 1)}
          unit="kg"
          subtitle="Terkumpul dari drop point PT JET"
          icon={Scale}
          variant="blue"
          trend="12.5% bulan ini"
        />

        {/* Card 3: Carbon Impact */}
        <StatCard
          title="Carbon Impact (CO₂e)"
          value={formatNumber(carbonImpactKg, 2)}
          unit="kg CO₂e"
          subtitle={`Setara serapan ${treesEquivalent} bibit pohon`}
          icon={Leaf}
          variant="cyan"
          badgeText="UNFCCC ACM0022"
        />

        {/* Card 4: Ranking Trenggalek */}
        <StatCard
          title="Peringkat Komunitas"
          value={ranking}
          unit=""
          subtitle="Top 5% Kontributor Hijau"
          icon={Trophy}
          variant="amber"
          badgeText="Level 3"
        />
      </div>

      {/* Ecological Impact Deep-Dive Box */}
      <div className="rounded-3xl p-5 sm:p-6 mb-8 border border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Dampak Lingkungan Riil Anda</h2>
              <p className="text-xs text-slate-400">Dihitung otomatis berdasarkan model emisi PT Jwalita Energi Trenggalek</p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-[11px] px-3 py-1 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/20 font-medium">
            SRN PPI KLHK Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TreeDeciduous className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xl font-bold text-white">{treesEquivalent} Pohon</span>
              <span className="text-xs text-slate-400">Ekuivalen penyerapan karbon pohon</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
              <FlameKindling className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xl font-bold text-white">{methaneAvoidedKg} kg CH₄</span>
              <span className="text-xs text-slate-400">Potensi gas metana berhasil dicegah</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xl font-bold text-white">5 Drop Point</span>
              <span className="text-xs text-slate-400">Jejaring aktif di Kab. Trenggalek</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="rounded-3xl p-5 sm:p-6 border border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">Riwayat Setoran Terkini</h2>
            <p className="text-xs text-slate-400">Aktivitas penimbangan dan reward koin terbaru Anda</p>
          </div>
          <Link
            to="/riwayat"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Lihat Semua ({transactions.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            Belum ada data setoran sampah. Ayo mulai setor pertama Anda!
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 hover:border-emerald-500/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5 sm:mt-0">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-white">{tx.wasteTypeName}</span>
                      <Badge status={tx.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {tx.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {tx.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                  <span className="text-emerald-400 font-bold text-sm sm:text-base flex items-center gap-1">
                    +{formatNumber(tx.tgxEarned, 1)} TGX
                  </span>
                  <span className="text-xs text-slate-400">
                    {tx.weightKg} kg ({formatRupiah(tx.idrValue)})
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
