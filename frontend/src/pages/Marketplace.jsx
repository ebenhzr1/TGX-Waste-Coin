import React, { useState, useEffect } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Coins,
  ArrowLeft,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Gift,
  MapPin,
  X,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Trees,
  GraduationCap,
  Ticket,
  Package
} from "lucide-react";

export default function Marketplace() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(500);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modal State
  const [confirmModalItem, setConfirmModalItem] = useState(null);
  const [pickupPoint, setPickupPoint] = useState("Kantor JET Trenggalek");
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [successModalData, setSuccessModalData] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMessage, setToastMessage]   = useState(null);
  const [partners, setPartners]           = useState([]);   // Sprint 27
  const [activeTab, setActiveTab]         = useState("rewards"); // Sprint 27

  const currentUser = JSON.parse(localStorage.getItem("tgx_user") || "null") || {
    id: 1,
    name: "Ahmad Santoso",
    schoolName: "SDN 2 Bendorejo"
  };

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchMarketplace = async () => {
    setLoading(true);
    try {
      // 1. Ambil Katalog Produk
      const res = await api.get("/marketplace/items");
      if (res.data && Array.isArray(res.data)) {
        setItems(res.data);
      }
    } catch (err) {
      console.warn("API /marketplace/items offline, fallback items:", err.message);
      setItems([
        {
          id: 1,
          name: "Bibit Pohon Jwalita For Earth",
          category: "environment",
          point_cost: 100,
          stock: 100,
          description: "Bibit pohon sengon & mahoni untuk program penghijauan dan reboisasi di Trenggalek.",
          image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=80"
        },
        {
          id: 2,
          name: "Tas Sekolah TGX",
          category: "education",
          point_cost: 500,
          stock: 50,
          description: "Tas ransel sekolah eksklusif berbahan rPET daur ulang plastik berkualitas tinggi.",
          image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80"
        },
        {
          id: 3,
          name: "Voucher UMKM Hijau",
          category: "voucher",
          point_cost: 1000,
          stock: 25,
          description: "Voucher belanja Rp 50.000 di merchant UMKM mitra ramah lingkungan Trenggalek.",
          image_url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=80"
        },
        {
          id: 4,
          name: "Tumbler Ramah Lingkungan JET",
          category: "eco_product",
          point_cost: 250,
          stock: 40,
          description: "Tumbler stainless steel insulasi ganda untuk mengurangi sampah botol plastik sekali pakai.",
          image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80"
        },
        {
          id: 5,
          name: "Paket Alat Tulis Daur Ulang",
          category: "education",
          point_cost: 150,
          stock: 80,
          description: "Buku tulis dari kertas daur ulang dan pensil ramah lingkungan.",
          image_url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80"
        }
      ]);
    }

    // 2. Ambil Saldo Wallet Siswa
    try {
      const studentId = currentUser.id || 1;
      const walletRes = await api.get(`/dashboard/student/${studentId}`);
      if (walletRes.data && walletRes.data.walletBalance !== undefined) {
        setWalletBalance(parseFloat(walletRes.data.walletBalance));
      }
    } catch (wErr) {
      console.warn("API student wallet offline, using fallback balance:", wErr.message);
      setWalletBalance(500);
    }

    setLoading(false);
  };

  // Sprint 27: fetch eco partners
  const fetchPartners = async () => {
    try {
      const res = await api.get("/ecosystem/partners");
      setPartners(res.data?.data || []);
    } catch (_) {
      setPartners([
        { id: 1, partner_name: "Warung Hijau Bu Sari",   category: "food",      description: "Warung makan organik bahan lokal.",   logo_url: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&auto=format&fit=crop", address: "Jl. Soekarno Hatta No. 12" },
        { id: 2, partner_name: "Batik Eco Trenggalek",   category: "retail",    description: "Batik pewarna alami ramah lingkungan.", logo_url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&auto=format&fit=crop", address: "Jl. Raya Karangan No. 45" },
        { id: 3, partner_name: "Toko Buku & ATK Cerdas", category: "education", description: "ATK daur ulang, literasi hijau.",        logo_url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=300&auto=format&fit=crop", address: "Jl. Ahmad Yani No. 22" },
        { id: 4, partner_name: "Apotek Sehat Alami",     category: "health",    description: "Herbal & suplemen alam Trenggalek.",   logo_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop", address: "Jl. Dr. Soetomo No. 8" },
        { id: 5, partner_name: "Laundry Bersih Natural", category: "service",   description: "Laundry detergen enzim hijau.",        logo_url: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&auto=format&fit=crop", address: "Jl. Gatot Subroto No. 5" },
      ]);
    }
  };

  useEffect(() => {
    fetchMarketplace();
    fetchPartners(); // Sprint 27
  }, []);

  // Filter Categories
  const categories = [
    { id: "all",         label: "Semua Reward",  icon: Sparkles },
    { id: "environment", label: "Lingkungan",     icon: Trees },
    { id: "education",   label: "Edukasi & Sekolah", icon: GraduationCap },
    { id: "voucher",     label: "Voucher UMKM",   icon: Ticket },
    { id: "eco_product", label: "Eco Products",   icon: Package },
    { id: "partner",     label: "🏪 Mitra UMKM",  icon: Package }, // Sprint 27
  ];

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Eksekusi Redeem
  const handleConfirmRedeem = async () => {
    if (!confirmModalItem) return;
    setRedeemLoading(true);

    try {
      const res = await api.post(`/marketplace/redeem/${confirmModalItem.id}`, {
        pickup_point: pickupPoint
      });

      const responseData = res.data?.data || {};
      const newBalance = responseData.wallet?.current_balance !== undefined 
        ? responseData.wallet.current_balance 
        : (walletBalance - confirmModalItem.point_cost);

      setWalletBalance(newBalance);

      // Update item stock local
      setItems((prev) =>
        prev.map((it) => (it.id === confirmModalItem.id ? { ...it, stock: Math.max(0, it.stock - 1) } : it))
      );

      setSuccessModalData({
        item: confirmModalItem,
        claim_code: responseData.redemption?.claim_code || `TGX-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        pickup_point: pickupPoint,
        balance_after: newBalance
      });

      setConfirmModalItem(null);
      showToast("Selamat! Penukaran koin TGX berhasil.");
    } catch (err) {
      console.error("Redeem error:", err);
      const errMsg = err.response?.data?.message || err.message || "Gagal melakukan penukaran reward.";
      showToast(errMsg, "error");
    } finally {
      setRedeemLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case "environment":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">🌱 Lingkungan</span>;
      case "education":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">🎒 Edukasi</span>;
      case "voucher":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">🎟️ Voucher UMKM</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">♻️ Eco Product</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-16 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border text-xs font-semibold backdrop-blur-xl ${
          toastMessage.type === "error"
            ? "bg-rose-950/90 border-rose-500/50 text-rose-300"
            : "bg-slate-900/90 border-emerald-500/40 text-emerald-400"
        }`}>
          {toastMessage.type === "error" ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-400 flex items-center justify-center shadow-md shadow-amber-500/20">
                <ShoppingBag className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight">TGX Eco Marketplace</span>
                <span className="hidden sm:inline-block ml-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Circular Economy</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Saldo TGX Pill */}
            <div className="px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block leading-tight">Saldo Koin TGX</span>
                <span className="text-sm font-black text-amber-400">{walletBalance.toLocaleString('id-ID')} TGX</span>
              </div>
            </div>

            {/* Link to My Rewards */}
            <Link
              to="/my-rewards"
              id="btn-reward-saya"
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Gift className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reward Saya</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-amber-950/20 border border-slate-800/90 p-6 sm:p-8 mb-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Tukarkan Sampah Pilahan Jadi Hadiah Bermanfaat
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Katalog Reward Ekonomi Sirkular <span className="text-amber-400">TGX Waste Coin</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Hasil tabungan koin TGX dari setoran sampah terpilah dapat kamu tukarkan dengan bibit pohon, tas sekolah daur ulang, botol ramah lingkungan, hingga voucher merchant UMKM lokal Trenggalek.
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25"
                      : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari produk reward..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Memuat katalog reward TGX...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-300 mb-1">Produk Tidak Ditemukan</p>
            <p className="text-xs text-slate-500">Coba ubah kata kunci atau ganti filter kategori.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => {
              const canAfford = walletBalance >= item.point_cost;
              const hasStock = item.stock > 0;

              return (
                <div
                  key={item.id}
                  className="bg-slate-900/70 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl overflow-hidden backdrop-blur-xl flex flex-col justify-between group transition-all duration-300 shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1"
                >
                  <div>
                    {/* Image Thumbnail */}
                    <div className="h-44 w-full relative overflow-hidden bg-slate-950">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500";
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        {getCategoryBadge(item.category)}
                      </div>
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-semibold text-slate-300">
                        Stok: <span className={hasStock ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>{item.stock}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-extrabold text-white text-base leading-snug mb-1.5 group-hover:text-amber-400 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action Bottom Bar */}
                  <div className="p-5 pt-0 mt-auto">
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Harga Koin</span>
                        <div className="flex items-center gap-1.5 text-amber-400 font-black text-lg">
                          <Coins className="w-4 h-4" />
                          <span>{item.point_cost}</span>
                          <span className="text-xs font-semibold text-slate-400">TGX</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setConfirmModalItem(item)}
                        disabled={!hasStock || !canAfford}
                        className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                          !hasStock
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                            : !canAfford
                            ? "bg-slate-800/80 text-amber-500/60 border border-amber-500/20 cursor-not-allowed"
                            : "bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95"
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{!hasStock ? "Habis" : !canAfford ? "Koin Kurang" : "Tukar"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL KONFIRMASI PENUKARAN */}
      {confirmModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setConfirmModalItem(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Konfirmasi Penukaran Reward</span>
            </div>

            <h3 className="text-xl font-black text-white mb-4">
              Tukarkan Koin TGX
            </h3>

            {/* Selected Item Summary */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 mb-5">
              <img
                src={confirmModalItem.image_url}
                alt={confirmModalItem.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-amber-400 font-bold block">{getCategoryBadge(confirmModalItem.category)}</span>
                <h4 className="font-extrabold text-white text-sm truncate mt-1">{confirmModalItem.name}</h4>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-black mt-0.5">
                  <Coins className="w-3 h-3" />
                  <span>{confirmModalItem.point_cost} TGX</span>
                </div>
              </div>
            </div>

            {/* Saldo Calculation Preview */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-xs mb-5">
              <div className="flex justify-between text-slate-400">
                <span>Saldo Anda saat ini:</span>
                <span className="font-bold text-slate-200">{walletBalance} TGX</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>Biaya Penukaran:</span>
                <span className="font-bold">- {confirmModalItem.point_cost} TGX</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between font-extrabold text-sm text-emerald-400">
                <span>Saldo Setelah Penukaran:</span>
                <span>{walletBalance - confirmModalItem.point_cost} TGX</span>
              </div>
            </div>

            {/* Pickup Point Selection */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Pilih Titik Pengambilan (Pickup Point):</span>
              </label>
              <select
                value={pickupPoint}
                onChange={(e) => setPickupPoint(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500/50"
              >
                <option value="Kantor JET Trenggalek">Kantor PT JET HQ (Trenggalek Pusat)</option>
                <option value="Drop Point Sekolah">Drop Point Bank Sampah Sekolah Siswa</option>
                <option value="TPST Pusat Karbon Trenggalek">TPST & Edu Center Karbon Trenggalek</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmModalItem(null)}
                className="flex-1 py-3 rounded-xl border border-slate-800 hover:bg-slate-800/60 text-xs font-bold text-slate-300 transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmRedeem}
                disabled={redeemLoading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {redeemLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Konfirmasi Tukar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUKSES CLAIM CODE */}
      {successModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 w-full max-w-md rounded-3xl p-6 shadow-2xl relative text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h3 className="text-xl font-black text-white mb-1">
              Penukaran Berhasil!
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Simpan kode klaim ini dan tunjukkan kepada petugas saat pengambilan barang.
            </p>

            {/* Kode Klaim Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 mb-5 relative group">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Kode Klaim Reward</span>
              <span className="text-2xl font-black tracking-widest text-amber-400 font-mono block mb-2">
                {successModalData.claim_code}
              </span>
              <button
                onClick={() => handleCopyCode(successModalData.claim_code)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-slate-300 border border-slate-700 transition-all"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? "Tersalin!" : "Salin Kode"}</span>
              </button>
            </div>

            {/* Details */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-left text-xs space-y-1.5 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">Reward:</span>
                <span className="font-bold text-white">{successModalData.item.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Koin Ditukar:</span>
                <span className="font-bold text-amber-400">{successModalData.item.point_cost} TGX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Titik Pengambilan:</span>
                <span className="font-bold text-slate-300 truncate max-w-[200px]">{successModalData.pickup_point}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sisa Saldo:</span>
                <span className="font-bold text-emerald-400">{successModalData.balance_after} TGX</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSuccessModalData(null)}
                className="flex-1 py-3 rounded-xl border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-300"
              >
                Belanja Lagi
              </button>
              <Link
                to="/my-rewards"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <span>Lihat Reward Saya</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
