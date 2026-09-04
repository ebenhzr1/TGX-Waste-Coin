import React, { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { Coins, Leaf, Shield, Lock, Mail, ArrowRight, AlertCircle, KeyRound } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMsg("Harap masukkan email dan kata sandi.");
      return;
    }

    if (cleanPassword.length < 4) {
      setErrorMsg("Kata sandi minimal 4 karakter.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email: cleanEmail, password: cleanPassword });
      
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("tgx_token", res.data.token);
        localStorage.setItem("tgx_user", JSON.stringify(res.data.user));
        
        const userRole = res.data.user?.role || role;
        if (userRole === "admin" || userRole === "super_admin" || userRole === "direksi") {
          navigate("/admin");
        } else if (userRole === "school" || userRole === "operator" || userRole === "operator_sekolah") {
          navigate("/school");
        } else {
          navigate("/dashboard");
        }
        return;
      } else {
        setErrorMsg("Respon autentikasi tidak valid dari server.");
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      if (err.response?.status === 401 || err.response?.status === 404) {
        setErrorMsg(serverMessage || "Email atau kata sandi tidak valid. Silakan periksa kembali.");
      } else if (err.response?.status === 429) {
        setErrorMsg("Terlalu banyak percobaan login. Silakan tunggu beberapa menit.");
      } else if (!err.response) {
        setErrorMsg("Gagal terhubung ke server API. Pastikan koneksi backend aktif.");
      } else {
        setErrorMsg(serverMessage || "Gagal masuk. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredential = (demoEmail, demoPassword, demoRole) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setRole(demoRole);
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Glow Orbs Background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            PT Jwalita Energi Trenggalek
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Coins className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              TGX <span className="text-emerald-400">Waste Coin</span>
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            Platform Ekonomi Sirkular & Insentif Reduksi Karbon Sekolah Trenggalek
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-1">Masuk ke Akun</h2>
          <p className="text-xs text-slate-400 mb-6">Pilih peran dan masukkan email serta kata sandi terdaftar</p>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* Role Picker */}
          <div className="grid grid-cols-3 gap-2 mb-5 p-1 bg-slate-950/60 rounded-xl border border-slate-800">
            {[
              { id: "student", label: "Siswa" },
              { id: "school", label: "Sekolah" },
              { id: "admin", label: "Admin JET" }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                id={`role-btn-${item.id}`}
                onClick={() => {
                  setRole(item.id);
                  setErrorMsg("");
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  role === item.id
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Alamat Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder={
                    role === "admin"
                      ? "admin@jet.co.id"
                      : role === "school"
                      ? "operator@sekolah.id"
                      : "siswa@sekolah.id"
                  }
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  id="login-password"
                  type="password"
                  required
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <button
              id="btn-submit-login"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk Dashboard</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Akun Pengujian Resmi */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                Kredensial Akun Pengujian:
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => fillQuickCredential("siswa@sekolah.id", "siswa123", "student")}
                className="p-2 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-slate-300 text-center transition-all hover:border-emerald-500/40"
              >
                <div className="font-semibold text-white">Siswa</div>
                <div className="text-[10px] text-slate-500">siswa123</div>
              </button>
              <button
                type="button"
                onClick={() => fillQuickCredential("operator@sekolah.id", "operator123", "school")}
                className="p-2 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-slate-300 text-center transition-all hover:border-emerald-500/40"
              >
                <div className="font-semibold text-white">Sekolah</div>
                <div className="text-[10px] text-slate-500">operator123</div>
              </button>
              <button
                type="button"
                onClick={() => fillQuickCredential("admin@jet.co.id", "admin123", "admin")}
                className="p-2 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-slate-300 text-center transition-all hover:border-emerald-500/40"
              >
                <div className="font-semibold text-white">Admin JET</div>
                <div className="text-[10px] text-slate-500">admin123</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 PT Jwalita Energi Trenggalek · TGX Circular Engine
        </p>
      </div>
    </div>
  );
}
