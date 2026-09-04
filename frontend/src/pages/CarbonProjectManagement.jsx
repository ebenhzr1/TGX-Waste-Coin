import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import {
  Layers,
  Plus,
  RefreshCw,
  Building2,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Globe2,
  Leaf,
  Award,
  ArrowUpRight,
  Database
} from "lucide-react";

export default function CarbonProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calcLoading, setCalcLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "Trenggalek, Jawa Timur",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "2026-12-31"
  });

  const showFeedback = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, invRes] = await Promise.allSettled([
        api.get("/carbon-assets/projects"),
        api.get("/carbon-assets/inventory")
      ]);

      if (projRes.status === "fulfilled" && Array.isArray(projRes.value.data)) {
        setProjects(projRes.value.data);
      } else {
        setProjects([
          {
            id: 1,
            name: "TGX Waste Carbon Project",
            description: "Inisiatif mitigasi emisi gas rumah kaca berbasis daur ulang sampah terpilah di Kabupaten Trenggalek",
            location: "Trenggalek, Jawa Timur",
            start_date: "2026-01-01",
            end_date: "2026-12-31",
            status: "active"
          }
        ]);
      }

      if (invRes.status === "fulfilled") {
        setInventory(invRes.value.data);
      } else {
        setInventory({
          totalWaste: 10000,
          co2Avoided: 20000,
          carbonUnit: 20
        });
      }
    } catch (err) {
      console.warn("Error fetching project data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate Impact trigger
  const handleCalculateImpact = async () => {
    setCalcLoading(true);
    try {
      const res = await api.get("/carbon-assets/inventory");
      setInventory(res.data);
      showFeedback(`Kalkulasi sukses! ${res.data.carbonUnit} Carbon Unit terhitung (${res.data.totalWaste} Kg sampah)`, "success");
    } catch (err) {
      showFeedback("Gagal menghitung ulang: " + err.message, "error");
    } finally {
      setCalcLoading(false);
    }
  };

  // Create Project handler
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showFeedback("Nama proyek wajib diisi", "error");
      return;
    }

    try {
      const res = await api.post("/carbon-assets/project", formData);
      showFeedback("Proyek karbon berhasil dibuat!", "success");
      setShowModal(false);
      setFormData({
        name: "",
        description: "",
        location: "Trenggalek, Jawa Timur",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "2026-12-31"
      });
      fetchData();
    } catch (err) {
      showFeedback(err.response?.data?.message || "Gagal membuat proyek", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-16">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-300 text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/carbon-assets"
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center shadow-md shadow-teal-500/20"
            >
              <Layers className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </Link>
            <div>
              <h1 className="font-extrabold text-white text-base tracking-tight">Carbon Project Management</h1>
              <p className="text-[10px] text-slate-400">Inisiatif & Inventarisasi Dampak Mitigasi Emisi TGX</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCalculateImpact}
              disabled={calcLoading}
              id="btn-calculate-impact"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${calcLoading ? "animate-spin text-emerald-400" : ""}`} />
              <span>{calcLoading ? "Menghitung..." : "Calculate Impact"}</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              id="btn-create-project"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Project</span>
            </button>
            <Link
              to="/carbon-assets"
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-900 transition-all"
            >
              Kembali
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Inventory Overview Card */}
        <div className="rounded-3xl bg-gradient-to-r from-teal-950/40 via-slate-900/80 to-emerald-950/30 border border-teal-500/30 p-6 backdrop-blur-xl relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-5 h-5 text-teal-400" />
                <h3 className="font-extrabold text-white text-base">Carbon Inventory Status</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  Realtime Agregasi
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Data akumulasi timbulan sampah terpilah yang telah dihitung menjadi satuan emisi tCO2e
              </p>
            </div>

            <button
              onClick={handleCalculateImpact}
              className="self-start sm:self-auto text-xs px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 hover:bg-teal-500/20 flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sinkronisasi Ulang</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total Waste (Kg)
              </span>
              <div className="text-2xl font-black text-white">
                {(inventory?.totalWaste ?? 10000).toLocaleString("id-ID")}{" "}
                <span className="text-xs text-slate-400 font-normal">Kg</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Sampah Sekolah & Masyarakat</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total CO2 Avoided
              </span>
              <div className="text-2xl font-black text-teal-300">
                {((inventory?.co2Avoided ?? 20000) / 1000).toFixed(2)}{" "}
                <span className="text-xs text-slate-400 font-normal">tCO2e</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">{(inventory?.co2Avoided ?? 20000).toLocaleString("id-ID")} kgCO2e terhindar</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/30">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Potential Carbon Unit
              </span>
              <div className="text-2xl font-black text-emerald-400">
                {inventory?.carbonUnit ?? 20}{" "}
                <span className="text-xs text-slate-400 font-normal">Impact Units</span>
              </div>
              <p className="text-[10px] text-emerald-300/70 mt-1">1 Unit = 1 tCO2e Emisi Tereduksi</p>
            </div>
          </div>
        </div>

        {/* Project List */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-extrabold text-white text-base">Daftar Proyek Karbon (Registered Projects)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Seluruh inisiatif mitigasi emisi berbasis wilayah di Trenggalek</p>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Total Proyek: <strong className="text-white">{projects.length}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-teal-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-bold text-white text-sm">{proj.name}</h4>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0 capitalize">
                      {proj.status || "active"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{proj.description}</p>
                </div>

                <div className="border-t border-slate-900 pt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    <span>{proj.location || "Trenggalek, Jawa Timur"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{proj.start_date} s/d {proj.end_date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal: Create Project */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Buat Proyek Karbon Baru</h3>
                <p className="text-xs text-slate-400">Daftarkan inisiatif mitigasi lingkungan baru</p>
              </div>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Nama Proyek
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: TGX Karbon Durenan Lestari"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Deskripsi Proyek
                </label>
                <textarea
                  rows="3"
                  placeholder="Penjelasan fokus inisiatif sampah terpilah dan pengurangan emisi..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Lokasi / Cakupan Wilayah
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-md shadow-teal-500/20"
                >
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
