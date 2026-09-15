import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import {
  Leaf, Lock, Mail, ArrowRight, AlertCircle,
  Eye, EyeOff, CheckSquare, Square, User, CheckCircle2,
  ShieldCheck, RotateCcw
} from "lucide-react";

const INPUT_CLS = "w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all";

export default function Login() {
  const navigate = useNavigate();

  // "login" | "register" | "otp"
  const [mode, setMode] = useState("login");

  // shared
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // login-only
  const [rememberMe, setRememberMe] = useState(false);

  // register-only
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // OTP step
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const savedEmail = localStorage.getItem("tgx_remember_email");
    if (savedEmail) { setEmail(savedEmail); setRememberMe(true); }
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const resetForm = () => {
    setEmail(""); setPassword(""); setConfirmPassword(""); setName("");
    setOtp(""); setErrorMsg(""); setSuccessMsg(""); setRole("student");
    setShowPassword(false); setShowConfirm(false); setResendCooldown(0);
  };

  const switchMode = (m) => { setMode(m); resetForm(); };

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    if (!cleanEmail || !cleanPassword) return setErrorMsg("Harap masukkan email dan kata sandi.");
    if (cleanPassword.length < 4) return setErrorMsg("Kata sandi minimal 4 karakter.");
    if (rememberMe) localStorage.setItem("tgx_remember_email", cleanEmail);
    else localStorage.removeItem("tgx_remember_email");

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email: cleanEmail, password: cleanPassword });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("tgx_token", res.data.token);
        localStorage.setItem("tgx_user", JSON.stringify(res.data.user));
        const r = res.data.user?.role || role;
        if (["admin", "super_admin", "direksi"].includes(r)) navigate("/admin");
        else if (["school", "operator", "operator_sekolah"].includes(r)) navigate("/school");
        else navigate("/dashboard");
      } else setErrorMsg("Respon autentikasi tidak valid dari server.");
    } catch (err) {
      const msg = err.response?.data?.message;
      if (err.response?.status === 401 || err.response?.status === 404) setErrorMsg(msg || "Email atau kata sandi tidak valid.");
      else if (err.response?.status === 429) setErrorMsg("Terlalu banyak percobaan. Coba beberapa menit lagi.");
      else if (!err.response) setErrorMsg("Gagal terhubung ke server.");
      else setErrorMsg(msg || "Gagal masuk. Coba lagi.");
    } finally { setLoading(false); }
  };

  // ── SEND OTP ───────────────────────────────────────────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPwd = password.trim();
    if (!cleanName || !cleanEmail || !cleanPwd || !confirmPassword)
      return setErrorMsg("Harap lengkapi semua kolom.");
    if (cleanPwd.length < 6) return setErrorMsg("Kata sandi minimal 6 karakter.");
    if (cleanPwd !== confirmPassword.trim()) return setErrorMsg("Kata sandi dan konfirmasi tidak cocok.");

    setLoading(true);
    try {
      await api.post("/auth/send-otp", { email: cleanEmail, name: cleanName });
      setMode("otp");
      setResendCooldown(60);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal mengirim OTP. Coba lagi.");
    } finally { setLoading(false); }
  };

  // ── VERIFY OTP & COMPLETE REGISTER ────────────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!otp.trim() || otp.trim().length !== 6) return setErrorMsg("Masukkan kode 6 digit yang dikirim ke email.");

    setLoading(true);
    try {
      await api.post("/auth/verify-register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        role,
        otp: otp.trim(),
      });
      setSuccessMsg("Akun berhasil dibuat! Silakan masuk.");
      setTimeout(() => switchMode("login"), 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Verifikasi gagal. Coba lagi.");
    } finally { setLoading(false); }
  };

  // ── RESEND OTP ─────────────────────────────────────────────────────────────
  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    setErrorMsg(""); setOtp("");
    try {
      await api.post("/auth/send-otp", { email: email.trim().toLowerCase(), name: name.trim() });
      setResendCooldown(60);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal kirim ulang OTP.");
    }
  };

  const ROLES_REGISTER = [{ id: "student", label: "Siswa" }, { id: "school", label: "Sekolah" }];
  const ROLES_LOGIN = [{ id: "student", label: "Siswa" }, { id: "school", label: "Sekolah" }, { id: "admin", label: "Admin JET" }];

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-7">
          <img
            src="/logo.jpg"
            alt="TGX Waste Coin #OffsetNow"
            className="h-20 sm:h-24 mx-auto mb-3 object-contain drop-shadow-lg"
          />
          <p className="text-sm text-slate-400 mt-1">
            Platform Ekonomi Sirkular &amp; Insentif Reduksi Karbon Sekolah Trenggalek
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">

          {/* ── OTP STEP ── */}
          {mode === "otp" ? (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-7 h-7 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Verifikasi Email</h2>
                <p className="text-xs text-slate-400">
                  Kode 6 digit telah dikirim ke<br />
                  <span className="text-emerald-400 font-semibold">{email}</span>
                </p>
              </div>

              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Kode OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="Masukkan 6 digit kode"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setErrorMsg(""); }}
                    className="w-full text-center py-4 bg-slate-950/80 border border-slate-800 rounded-xl text-2xl font-bold text-emerald-400 tracking-[12px] placeholder-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {loading
                    ? <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    : <><span>Verifikasi &amp; Buat Akun</span><ArrowRight className="w-4 h-4 stroke-[2.5]" /></>}
                </button>
              </form>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <button
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${resendCooldown > 0 ? "opacity-40 cursor-not-allowed" : "text-emerald-400 hover:text-emerald-300"}`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {resendCooldown > 0 ? `Kirim ulang dalam ${resendCooldown}s` : "Kirim ulang OTP"}
                </button>
                <span>·</span>
                <button onClick={() => switchMode("register")} className="text-slate-400 hover:text-white cursor-pointer">
                  Kembali
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Mode Toggle */}
              <div className="grid grid-cols-2 gap-1 mb-6 p-1 bg-slate-950/60 rounded-xl border border-slate-800">
                {[{ id: "login", label: "Masuk" }, { id: "register", label: "Daftar Akun" }].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => switchMode(m.id)}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      mode === m.id ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 font-bold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <h2 className="text-xl font-bold text-white mb-1">
                {mode === "login" ? "Masuk ke Akun" : "Buat Akun Baru"}
              </h2>
              <p className="text-xs text-slate-400 mb-5">
                {mode === "login"
                  ? "Pilih peran dan masukkan email serta kata sandi Anda"
                  : "Isi data berikut, lalu masukkan kode OTP yang dikirim ke email"}
              </p>

              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{errorMsg}</span>
                </div>
              )}

              {/* Role Picker */}
              <div className={`grid gap-2 mb-5 p-1 bg-slate-950/60 rounded-xl border border-slate-800 ${mode === "login" ? "grid-cols-3" : "grid-cols-2"}`}>
                {(mode === "login" ? ROLES_LOGIN : ROLES_REGISTER).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setRole(item.id); setErrorMsg(""); }}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      role === item.id ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 font-bold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <form onSubmit={mode === "login" ? handleLogin : handleSendOTP} className="space-y-4">
                {mode === "register" && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Nama Lengkap</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input type="text" required placeholder="Nama lengkap Anda" value={name}
                        onChange={(e) => { setName(e.target.value); setErrorMsg(""); }}
                        className={INPUT_CLS} />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Alamat Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input type="email" required placeholder="nama@email.com" value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
                      className={INPUT_CLS} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Kata Sandi</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input type={showPassword ? "text" : "password"} required
                      placeholder={mode === "register" ? "Minimal 6 karakter" : "Masukkan kata sandi..."}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                      className="w-full pl-10 pr-11 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === "register" && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Konfirmasi Kata Sandi</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input type={showConfirm ? "text" : "password"} required
                        placeholder="Ulangi kata sandi" value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setErrorMsg(""); }}
                        className="w-full pl-10 pr-11 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === "login" && (
                  <div className="flex items-center text-xs text-slate-400 py-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="hidden" />
                      {rememberMe ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-slate-600 hover:text-slate-500" />}
                      <span>Ingat email saya</span>
                    </label>
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer">
                  {loading
                    ? <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    : <><span>{mode === "login" ? "Masuk Dashboard" : "Kirim Kode Verifikasi"}</span><ArrowRight className="w-4 h-4 stroke-[2.5]" /></>}
                </button>
              </form>

              <p className="text-center text-xs text-slate-500 mt-5">
                {mode === "login" ? (
                  <>Belum punya akun?{" "}
                    <button onClick={() => switchMode("register")} className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer">Daftar di sini</button>
                  </>
                ) : (
                  <>Sudah punya akun?{" "}
                    <button onClick={() => switchMode("login")} className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer">Masuk</button>
                  </>
                )}
              </p>
            </>
          )}
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">© 2026 PT Jwalita Energi Trenggalek · TGX Circular Engine</p>
      </div>
    </div>
  );
}
