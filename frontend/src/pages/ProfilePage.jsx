import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWaste } from '../context/WasteContext';
import { formatNumber, formatRupiah, TGX_TO_IDR_RATE } from '../utils/carbonCalc';
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Award,
  Coins,
  LogOut,
  Copy,
  Check,
  RotateCcw,
  TreeDeciduous,
  Scale
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { tgxBalance, totalWasteKg, carbonImpactKg, resetData } = useWaste();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const walletAddress = 'TGX-TRK-7829-E41B-9902';

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReset = () => {
    if (window.confirm('Reset data simulasi setor sampah ke kondisi awal?')) {
      resetData();
      alert('Data simulasi berhasil direset.');
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-4xl mx-auto w-full">
      {/* Profile Card Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10 text-center sm:text-left">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-1 shadow-xl shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center text-2xl sm:text-3xl font-black text-white">
                {user?.name?.slice(0, 2).toUpperCase() || 'BS'}
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-slate-950 border-2 border-slate-950">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>{user?.badge || 'Pahlawan Sirkular Level 3'}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {user?.name || 'Budi Santoso'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Warga Binaan Bank Sampah PT Jwalita Energi Trenggalek
            </p>

            {/* Wallet Address Pill */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-white/10 text-xs font-mono text-slate-300">
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span>{walletAddress}</span>
                <button
                  type="button"
                  onClick={handleCopyWallet}
                  title="Salin Wallet ID"
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-2xl glass-card border border-white/10 text-center">
          <Scale className="w-5 h-5 mx-auto mb-1 text-sky-400" />
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Sampah</span>
          <span className="text-xl font-bold text-white mt-0.5 block">{formatNumber(totalWasteKg, 1)} kg</span>
        </div>

        <div className="p-4 rounded-2xl glass-card-eco border border-emerald-500/30 text-center">
          <Coins className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
          <span className="text-[11px] text-emerald-300 uppercase tracking-wider block">Saldo TGX</span>
          <span className="text-xl font-bold text-emerald-400 mt-0.5 block">{formatNumber(tgxBalance, 1)} TGX</span>
          <span className="text-[10px] text-slate-400 block">{formatRupiah(tgxBalance * TGX_TO_IDR_RATE)}</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-white/10 text-center">
          <TreeDeciduous className="w-5 h-5 mx-auto mb-1 text-teal-400" />
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Emisi Terhindar</span>
          <span className="text-xl font-bold text-teal-400 mt-0.5 block">{formatNumber(carbonImpactKg, 2)} kg</span>
          <span className="text-[10px] text-slate-400 block">CO₂e avoided</span>
        </div>
      </div>

      {/* Biodata & Drop Point Section */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white/10 mb-6 space-y-4">
        <h2 className="text-base font-bold text-white mb-2">Informasi Akun</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-white/5 flex items-center gap-3">
            <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="text-[11px] text-slate-400 block">Email Terdaftar</span>
              <span className="text-white font-medium">{user?.email || 'budi.santoso@trenggalek.id'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-white/5 flex items-center gap-3">
            <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div>
              <span className="text-[11px] text-slate-400 block">Nomor Telepon</span>
              <span className="text-white font-medium">{user?.phone || '0812-3456-7890'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-white/5 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <div>
              <span className="text-[11px] text-slate-400 block">Kecamatan Domisili</span>
              <span className="text-white font-medium">{user?.district || 'Trenggalek Kota'}, Kab. Trenggalek</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-white/5 flex items-center gap-3">
            <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div>
              <span className="text-[11px] text-slate-400 block">Drop Point Langganan</span>
              <span className="text-white font-medium">Bank Sampah Jwalita - Hub Pogalan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleReset}
          className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>Reset Data Simulasi Demo</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-3.5 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Keluar dari Akun</span>
        </button>
      </div>
    </div>
  );
}
