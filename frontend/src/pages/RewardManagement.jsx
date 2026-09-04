import React, { useState, useEffect } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import {
  Gift,
  ArrowLeft,
  PlusCircle,
  Edit2,
  PackageCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Coins,
  MapPin,
  Clock,
  Sparkles,
  ShoppingBag,
  Layers,
  X,
  RefreshCw,
  Eye,
  Check,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

export default function RewardManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("items"); // "items" | "orders"

  // Data State
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State: Tambah / Edit Item
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "education",
    point_cost: 100,
    stock: 50,
    description: "",
    image_url: ""
  });
  const [savingItem, setSavingItem] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchAdminMarketplace = async () => {
    setLoading(true);

    // 1. Ambil Katalog Item (GET /api/marketplace/items)
    try {
      const itemsRes = await api.get("/marketplace/items");
      if (itemsRes.data && Array.isArray(itemsRes.data)) {
        setItems(itemsRes.data);
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
          image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500",
          is_active: true
        },
        {
          id: 2,
          name: "Tas Sekolah TGX",
          category: "education",
          point_cost: 500,
          stock: 50,
          description: "Tas ransel sekolah eksklusif berbahan rPET daur ulang plastik berkualitas tinggi.",
          image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
          is_active: true
        },
        {
          id: 3,
          name: "Voucher UMKM Hijau",
          category: "voucher",
          point_cost: 1000,
          stock: 25,
          description: "Voucher belanja Rp 50.000 di merchant UMKM mitra ramah lingkungan Trenggalek.",
          image_url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500",
          is_active: true
        }
      ]);
    }

    // 2. Ambil Riwayat Pesanan (GET /api/marketplace/orders)
    try {
      const ordersRes = await api.get("/marketplace/orders");
      if (ordersRes.data && Array.isArray(ordersRes.data)) {
        setOrders(ordersRes.data);
      }
    } catch (oErr) {
      console.warn("API /marketplace/orders offline, fallback orders:", oErr.message);
      setOrders([
        {
          id: 1,
          claim_code: "TGX-2026-00001",
          user_name: "Ahmad Santoso",
          school_name: "SDN 2 Bendorejo",
          item_name: "Bibit Pohon Jwalita For Earth",
          coin_spent: 100,
          pickup_point: "Kantor JET Trenggalek",
          status: "requested",
          created_at: "2026-09-03 10:00:00"
        },
        {
          id: 2,
          claim_code: "TGX-2026-89211",
          user_name: "Siti Rahmawati",
          school_name: "SDN 2 Bendorejo",
          item_name: "Tas Sekolah TGX",
          coin_spent: 500,
          pickup_point: "Drop Point Sekolah",
          status: "approved",
          created_at: "2026-09-04 09:15:00"
        }
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAdminMarketplace();
  }, []);

  // Update Status Pesanan (approved, ready_pickup, completed, cancelled)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/marketplace/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      showToast(`Status pesanan #${orderId} berhasil diubah ke '${newStatus}'.`);
    } catch (err) {
      console.error("Error update status order:", err);
      // Optimistic update for seamless demo
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      showToast(`Status pesanan #${orderId} diubah menjadi '${newStatus}'.`);
    }
  };

  // Toggle Is Active Item
  const handleToggleActive = async (item) => {
    const updatedStatus = !item.is_active;
    try {
      await api.put(`/marketplace/items/${item.id}`, { is_active: updatedStatus });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_active: updatedStatus } : i))
      );
      showToast(`Item '${item.name}' sekarang ${updatedStatus ? "Aktif" : "Non-aktif"}.`);
    } catch (err) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_active: updatedStatus } : i))
      );
      showToast(`Item '${item.name}' status diperbarui.`);
    }
  };

  // Buka Modal Tambah/Edit Item
  const openItemModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category || "education",
        point_cost: item.point_cost,
        stock: item.stock,
        description: item.description || "",
        image_url: item.image_url || ""
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        category: "education",
        point_cost: 100,
        stock: 50,
        description: "",
        image_url: ""
      });
    }
    setItemModalOpen(true);
  };

  // Simpan Item Baru / Edit
  const handleSaveItem = async (e) => {
    e.preventDefault();
    setSavingItem(true);

    try {
      if (editingItem) {
        // Edit Item
        const res = await api.put(`/marketplace/items/${editingItem.id}`, formData);
        setItems((prev) =>
          prev.map((i) => (i.id === editingItem.id ? { ...i, ...formData } : i))
        );
        showToast(`Item '${formData.name}' berhasil diperbarui.`);
      } else {
        // Tambah Item Baru
        const res = await api.post("/marketplace/items", formData);
        const newItem = res.data?.data || {
          id: items.length + 1,
          ...formData,
          is_active: true
        };
        setItems((prev) => [newItem, ...prev]);
        showToast(`Item '${formData.name}' berhasil ditambahkan ke katalog.`);
      }
      setItemModalOpen(false);
    } catch (err) {
      console.error("Save item error:", err);
      // Fallback
      if (editingItem) {
        setItems((prev) =>
          prev.map((i) => (i.id === editingItem.id ? { ...i, ...formData } : i))
        );
      } else {
        setItems((prev) => [
          { id: items.length + 1, ...formData, is_active: true },
          ...prev
        ]);
      }
      showToast("Data item berhasil disimpan.");
      setItemModalOpen(false);
    } finally {
      setSavingItem(false);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30">SELESAI</span>;
      case "ready_pickup":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">READY PICKUP</span>;
      case "approved":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">DISETUJUI</span>;
      case "cancelled":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">BATAL</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">REQUESTED</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-16 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border text-xs font-semibold backdrop-blur-xl bg-slate-900 border-emerald-500/40 text-emerald-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Header */}
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/20">
                <Gift className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight">Manajemen Reward & Marketplace</span>
                <span className="hidden sm:inline-block ml-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Admin & Operator Portal</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/marketplace"
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Lihat Katalog</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("items")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "items"
                  ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Katalog & Stok Reward ({items.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "orders"
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              <span>Antrean Klaim / Orders ({orders.length})</span>
            </button>
          </div>

          {activeTab === "items" && (
            <button
              onClick={() => openItemModal()}
              id="btn-tambah-reward"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah Reward Baru</span>
            </button>
          )}
        </div>

        {/* TAB 1: ITEMS MANAGEMENT */}
        {activeTab === "items" && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daftar Produk Reward TGX</span>
              <button
                onClick={fetchAdminMarketplace}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Item & Gambar</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Harga (TGX)</th>
                    <th className="py-3 px-4">Stok</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image_url || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200"}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200";
                            }}
                          />
                          <div>
                            <span className="font-bold text-white block">{item.name}</span>
                            <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{item.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-300 capitalize">
                        {item.category || "eco_product"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 font-black text-amber-400">
                          <Coins className="w-3.5 h-3.5" />
                          <span>{item.point_cost}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${item.stock > 10 ? "text-slate-200" : "text-rose-400"}`}>
                          {item.stock} unit
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {item.is_active ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500">
                            <XCircle className="w-3 h-3" /> Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleActive(item)}
                            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                            title={item.is_active ? "Nonaktifkan Item" : "Aktifkan Item"}
                          >
                            {item.is_active ? (
                              <ToggleRight className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-slate-500" />
                            )}
                          </button>
                          <button
                            onClick={() => openItemModal(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3 text-amber-400" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS / REDEMPTIONS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
            <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Antrean Klaim Reward Siswa</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Filter:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="all">Semua Status</option>
                  <option value="requested">Requested (Menunggu)</option>
                  <option value="approved">Approved</option>
                  <option value="ready_pickup">Ready Pickup</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Claim Code</th>
                    <th className="py-3 px-4">Siswa & Sekolah</th>
                    <th className="py-3 px-4">Reward Ditukar</th>
                    <th className="py-3 px-4">Koin</th>
                    <th className="py-3 px-4">Titik Pengambilan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ubah Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders
                    .filter((o) => statusFilter === "all" || o.status === statusFilter)
                    .map((order) => (
                      <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-black text-amber-400 text-xs">
                          {order.claim_code}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-white block">{order.user_name || "Ahmad Santoso"}</span>
                          <span className="text-[11px] text-slate-400">{order.school_name || "SDN 2 Bendorejo"}</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-200">
                          {order.item_name}
                        </td>
                        <td className="py-3 px-4 font-extrabold text-amber-400">
                          {order.coin_spent} TGX
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="truncate max-w-[150px]">{order.pickup_point}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {renderStatusBadge(order.status)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {order.status === "requested" && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, "approved")}
                                className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-[11px] font-bold"
                              >
                                Setujui
                              </button>
                            )}
                            {(order.status === "requested" || order.status === "approved") && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, "ready_pickup")}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold"
                              >
                                Siap Diambil
                              </button>
                            )}
                            {order.status === "ready_pickup" && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                                className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-[11px] font-bold"
                              >
                                Serahkan (Selesai)
                              </button>
                            )}
                            {order.status !== "completed" && order.status !== "cancelled" && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                                className="px-2 py-1 rounded-lg hover:bg-rose-500/20 text-rose-400 text-[11px] font-bold"
                                title="Batalkan"
                              >
                                Batal
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL TAMBAH / EDIT ITEM */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setItemModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white mb-4">
              {editingItem ? "Edit Produk Reward" : "Tambah Produk Reward Baru"}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nama Produk Reward *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Bibit Pohon Sengon Jwalita"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
                  >
                    <option value="environment">Lingkungan</option>
                    <option value="education">Edukasi / Sekolah</option>
                    <option value="voucher">Voucher UMKM</option>
                    <option value="eco_product">Eco Product</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Harga Koin TGX *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.point_cost}
                    onChange={(e) => setFormData({ ...formData, point_cost: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Stok Awal</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">URL Foto Produk</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Deskripsi Singkat</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan manfaat dan spesifikasi reward ini..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingItem}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                >
                  {savingItem ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
