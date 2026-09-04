import React, { useState, useEffect } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import {
  Gift,
  ArrowLeft,
  Coins,
  Clock,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
  ShoppingBag,
  MapPin,
  Copy,
  Check,
  Search,
  ExternalLink,
  Sparkles
} from "lucide-react";

export default function MyRewards() {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const fetchMyRewards = async () => {
    setLoading(true);
    try {
      const res = await api.get("/marketplace/my-rewards");
      if (res.data && Array.isArray(res.data)) {
        setRewards(res.data);
      }
    } catch (err) {
      console.warn("API /marketplace/my-rewards offline, fallback data:", err.message);
      setRewards([
        {
          id: 1,
          item_name: "Bibit Pohon Jwalita For Earth",
          category: "environment",
          coin_spent: 100,
          claim_code: "TGX-2026-00001",
          status: "ready_pickup",
          pickup_point: "Kantor JET Trenggalek",
          created_at: "2026-09-03 10:00:00",
          image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500"
        },
        {
          id: 2,
          item_name: "Tumbler Ramah Lingkungan JET",
          category: "eco_product",
          coin_spent: 250,
          claim_code: "TGX-2026-58291",
          status: "requested",
          pickup_point: "Drop Point Sekolah",
          created_at: "2026-09-04 08:30:00",
          image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRewards();
  }, []);

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30">
            <PackageCheck className="w-3.5 h-3.5" /> SELESAI / SUDAH DIAMBIL
          </span>
        );
      case "ready_pickup":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5" /> READY PICKUP
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> DISETUJUI PETUGAS
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3.5 h-3.5" /> DIBATALKAN
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" /> MENUNGGU VERIFIKASI
          </span>
        );
    }
  };

  const filteredRewards = rewards.filter((r) => {
    const q = searchQuery.toLowerCase();
    const name = (r.item_name || "").toLowerCase();
    const code = (r.claim_code || "").toLowerCase();
    return name.includes(q) || code.includes(q);
  });

  const totalSpent = rewards.reduce((acc, r) => acc + parseFloat(r.coin_spent || 0), 0);
  const readyCount = rewards.filter((r) => r.status === "ready_pickup").length;

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-16 relative">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Gift className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight">Reward Saya</span>
                <span className="hidden sm:inline-block ml-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Claim Voucher</span>
              </div>
            </div>
          </div>

          <Link
            to="/marketplace"
            id="btn-kembali-ke-marketplace"
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>Katalog Reward</span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Total Reward Ditukar</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{rewards.length}</span>
              <span className="text-xs font-bold text-emerald-400">Hadiah</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Total Koin Digunakan</span>
            <div className="flex items-baseline gap-2 text-amber-400">
              <Coins className="w-5 h-5" />
              <span className="text-3xl font-black">{totalSpent}</span>
              <span className="text-xs font-bold text-slate-400">TGX</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Siap Diambil (Ready Pickup)</span>
            <div className="flex items-baseline gap-2 text-emerald-400">
              <PackageCheck className="w-5 h-5" />
              <span className="text-3xl font-black">{readyCount}</span>
              <span className="text-xs font-bold text-slate-400">Voucher</span>
            </div>
          </div>
        </div>

        {/* Search & Info Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama reward atau claim code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1.5 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tunjukkan <b>Claim Code</b> saat mengambil di titik lokasi.</span>
          </div>
        </div>

        {/* Reward List */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Memuat daftar reward Anda...</p>
          </div>
        ) : filteredRewards.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8">
            <Gift className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-300 mb-1">Belum Ada Reward Ditukar</p>
            <p className="text-xs text-slate-500 mb-5">Yuk tukarkan saldo koin TGX kamu dengan hadiah menarik di katalog!</p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-black"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buka Marketplace</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRewards.map((reward) => {
              const isCopied = copiedId === reward.id;

              return (
                <div
                  key={reward.id}
                  className="bg-slate-900/70 border border-slate-800/80 hover:border-emerald-500/30 rounded-3xl p-5 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all shadow-lg"
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={reward.image_url || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300"}
                      alt={reward.item_name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300";
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                          {reward.category || "Eco Reward"}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] text-slate-500">
                          {reward.created_at ? new Date(reward.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "Baru saja"}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-white text-base truncate mb-1">
                        {reward.item_name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{reward.pickup_point || "Kantor JET Trenggalek"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Claim Code, Price, and Status Badge */}
                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                    {/* Coin Spent */}
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Koin Ditukar</span>
                      <div className="flex items-center gap-1 text-amber-400 font-extrabold text-sm">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{reward.coin_spent} TGX</span>
                      </div>
                    </div>

                    {/* Claim Code Box */}
                    <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-bold block">Claim Code</span>
                        <span className="font-mono font-black text-amber-400 text-xs tracking-wider">
                          {reward.claim_code}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(reward.claim_code, reward.id)}
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                        title="Salin Kode"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {renderStatusBadge(reward.status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
