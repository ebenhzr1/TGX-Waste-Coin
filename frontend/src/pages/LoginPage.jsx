import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EcoLogo from '../components/EcoLogo';
import { Lock, Mail, User, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Coins } from 'lucide-react';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('budi.santoso@trenggalek.id');
  const [password, setPassword] = useState('trenggalek2026');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (isRegister && !name)) {
      setError('Mohon lengkapi semua data.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (isRegister) {
        register(name, email, password);
      } else {
        login(email, password);
      }
      setLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  const handleDemoLogin = () => {
    login('budi.santoso@trenggalek.id', 'demo123');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-gradient-to-b from-slate-950 via-slate-900 to-[#0a1526] relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[300px] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8 flex flex-col items-center">
          <EcoLogo size="xl" showSubtitle={true} className="justify-center mb-2" />
          <p className="text-sm text-slate-400 mt-2 max-w-xs text-center font-normal">
            Platform Digital Circular Economy & Methane Avoidance Kabupaten Trenggalek
          </p>
        </div>

        {/* Card Form */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/20 backdrop-blur-2xl">
          {/* Header switch Login / Register */}
          <div className="flex rounded-2xl bg-slate-950/60 p-1 mb-6 border border-white/5">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                !isRegister
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                isRegister
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Daftar Warga
            </button>
          </div>

          <div className="mb-5">
            <h2 className="text-xl font-bold text-white mb-1">
              {isRegister ? 'Buat Akun TGX' : 'Selamat Datang Kembali'}
            </h2>
            <p className="text-xs text-slate-400">
              {isRegister
                ? 'Mulai setor sampah, kumpulkan coin, dan kurangi emisi karbon.'
                : 'Masuk untuk memantau saldo coin dan dampak lingkungan Anda.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-left">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-left">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-left">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-bold text-sm hover:opacity-95 active:scale-[0.99] transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Memproses...' : isRegister ? 'Daftar Sekarang' : 'Login'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Preset Button */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-[11px] text-slate-400 mb-2">Ingin coba langsung tanpa ketik?</p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Login Instan Demo (Budi Santoso)</span>
            </button>
          </div>
        </div>

        {/* Feature Eco Highlight Footer */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-slate-400 text-[11px]">
          <div className="p-2 rounded-xl bg-slate-950/40 border border-white/5">
            <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
            <span>Terverifikasi PT JET</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/40 border border-white/5">
            <Coins className="w-4 h-4 mx-auto mb-1 text-teal-400" />
            <span>1 TGX = Rp 1.000</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/40 border border-white/5">
            <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
            <span>Audit Karbon SRN</span>
          </div>
        </div>
      </div>
    </div>
  );
}
