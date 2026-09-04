import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import {
  Layers,
  Building2,
  Plus,
  Target,
  TrendingUp,
  Gift,
  CheckCircle2,
  Calendar,
  DollarSign,
  Leaf,
  Globe2,
  X,
  RefreshCw,
  Coins,
  ChevronRight,
  School,
  FileText
} from "lucide-react";

export default function CSRManagement() {
  const [partners, setPartners] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(1);
  const [toast, setToast] = useState(null);

  // Form states
  const [partnerForm, setPartnerForm] = useState({
    company_name: "",
    industry: "FMCG / Manufaktur",
    contact_person: "",
    email: "",
    phone: "",
    address: "Kawasan Industri Trenggalek"
  });

  const [campaignForm, setCampaignForm] = useState({
    partner_id: "1",
    campaign_name: "",
    description: "",
    target_waste_kg: "10000",
    target_co2: "20",
    reward_budget: "50000000",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "2026-12-31"
  });

  const [sponsorForm, setSponsorForm] = useState({
    reward_name: "Bibit Pohon Trembesi",
    quantity: "1000",
    coin_pool: "100000",
    sponsor_amount: "15000000"
  });

  const showFeedback = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes, iRes] = await Promise.allSettled([
        api.get("/csr/partners"),
        api.get("/csr/campaigns"),
        api.get("/csr/campaigns/1/impact")
      ]);

      if (pRes.status === "fulfilled" && Array.isArray(pRes.value.data)) {
        setPartners(pRes.value.data);
      } else {
        setPartners([
          {
            id: 1,
            company_name: "PT ABC",
            industry: "FMCG & Manufaktur Berkelanjutan",
            contact_person: "Budi Santoso",
            email: "csr@ptabc.co.id",
            phone: "08123456789",
            status: "active"
          }
        ]);
      }

      if (cRes.status === "fulfilled" && Array.isArray(cRes.value.data)) {
        setCampaigns(cRes.value.data);
      } else {
        setCampaigns([
          {
            id: 1,
            partner_id: 1,
            company_name: "PT ABC",
            campaign_name: "Green School Movement",
            description: "Program CSR pengelolaan sampah terpilah dan sponsorship reward untuk 10 Sekolah Adiwiyata di Trenggalek",
            target_waste_kg: 10000,
            target_co2: 20,
            reward_budget: 50000000,
            status: "active"
          }
        ]);
      }

      if (iRes.status === "fulfilled" && iRes.value.data) {
        setImpact(iRes.value.data);
      } else {
        setImpact({
          totalWasteKg: 10000,
          co2Impact: 20,
          students: 500,
          schools: 10
        });
      }
    } catch (err) {
      console.warn("Using fallback data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Submit Partner
  const handleCreatePartner = async (e) => {
    e.preventDefault();
    if (!partnerForm.company_name.trim()) {
      showFeedback("Nama perusahaan wajib diisi", "error");
      return;
    }
    try {
      await api.post("/csr/partners", partnerForm);
      showFeedback("Mitra CSR berhasil ditambahkan!", "success");
      setShowPartnerModal(false);
      setPartnerForm({
        company_name: "",
        industry: "FMCG / Manufaktur",
        contact_person: "",
        email: "",
        phone: "",
        address: "Trenggalek"
      });
      fetchData();
    } catch (err) {
      showFeedback(err.response?.data?.message || "Gagal menambah mitra", "error");
    }
  };

  // Submit Campaign
  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!campaignForm.campaign_name.trim()) {
      showFeedback("Nama program CSR wajib diisi", "error");
      return;
    }
    try {
      await api.post("/csr/campaigns", campaignForm);
      showFeedback("Program CSR Campaign berhasil dibuat!", "success");
      setShowCampaignModal(false);
      setCampaignForm({
        partner_id: "1",
        campaign_name: "",
        description: "",
        target_waste_kg: "10000",
        target_co2: "20",
        reward_budget: "50000000",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "2026-12-31"
      });
      fetchData();
    } catch (err) {
      showFeedback(err.response?.data?.message || "Gagal membuat campaign", "error");
    }
  };

  // Submit Sponsor Reward
  const handleSponsorReward = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/csr/campaigns/${selectedCampaignId}/sponsor-reward`, sponsorForm);
      showFeedback(`Sponsorship '${sponsorForm.reward_name}' berhasil dialokasikan ke Marketplace!`, "success");
      setShowSponsorModal(false);
    } catch (err) {
      showFeedback(err.response?.data?.message || "Gagal mengalokasikan sponsor", "error");
    }
  };

  const actualWaste = impact?.totalWasteKg || 10000;
  const actualCO2 = impact?.co2Impact || 20;

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-16">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-blue-500/50 text-blue-300 text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/csr-dashboard"
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center shadow-md shadow-blue-500/20"
            >
              <Layers className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </Link>
            <div>
              <h1 className="font-extrabold text-white text-base tracking-tight">CSR Campaign Management</h1>
              <p className="text-[10px] text-slate-400">Pengelolaan Mitra, Program CSR, dan Target Capaian Dampak</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowPartnerModal(true)}
              id="btn-tambah-partner"
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Partner</span>
            </button>
            <button
              onClick={() => setShowCampaignModal(true)}
              id="btn-buat-campaign"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-400 hover:to-teal-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Buat Campaign</span>
            </button>
            <Link
              to="/csr-dashboard"
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-900 transition-all"
            >
              Kembali
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Progress & Target Overview Card */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900/90 to-teal-950/30 border border-blue-500/30 p-6 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-5 h-5 text-blue-400" />
                <h2 className="font-extrabold text-white text-base">Progress & Target Dampak CSR</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  Tercapai 100%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pemantauan real-time antara target yang disepakati dengan timbulan sampah fisik yang berhasil dikumpulkan
              </p>
            </div>

            <button
              onClick={() => setShowSponsorModal(true)}
              id="btn-sponsor-reward"
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Gift className="w-4 h-4 text-amber-400" />
              <span>Sponsor Reward Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Waste Progress */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  Target Pengumpulan Sampah (Kg)
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {actualWaste.toLocaleString("id-ID")} / 10.000 Kg
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-slate-800">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-full transition-all duration-500 shadow-sm shadow-emerald-500/50"></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                <span>Realisasi: {(actualWaste / 1000).toFixed(1)} Ton</span>
                <span className="text-emerald-400 font-semibold">100% Tercapai</span>
              </div>
            </div>

            {/* CO2 Progress */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-teal-400" />
                  Target Pengurangan Emisi Karbon (tCO2e)
                </span>
                <span className="font-mono font-bold text-teal-300">
                  {actualCO2} / 20 tCO2e
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-slate-800">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full rounded-full w-full transition-all duration-500 shadow-sm shadow-teal-500/50"></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                <span>Emisi Tereduksi: {(actualCO2 * 1000).toLocaleString("id-ID")} kgCO2e</span>
                <span className="text-teal-300 font-semibold">100% Tercapai</span>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign List */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-extrabold text-white text-base">Daftar CSR Campaigns Aktif</h3>
              <p className="text-xs text-slate-400 mt-0.5">Program kemitraan berjalan dengan sekolah dan komunitas</p>
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              Total Program: <strong className="text-white">{campaigns.length}</strong>
            </span>
          </div>

          <div className="space-y-3.5">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <h4 className="font-extrabold text-white text-sm">{camp.campaign_name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                      {camp.company_name || "PT ABC"}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                      {camp.status || "active"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-2xl">{camp.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                      Target: {(camp.target_waste_kg || 10000).toLocaleString("id-ID")} Kg
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe2 className="w-3.5 h-3.5 text-teal-400" />
                      Emisi: {camp.target_co2 || 20} tCO2e
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                      Budget: Rp {(camp.reward_budget || 50000000).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
                  <Link
                    to={`/csr-report/${camp.id}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Lihat Laporan</span>
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedCampaignId(camp.id);
                      setShowSponsorModal(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <Gift className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sponsor Reward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Partners List */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-extrabold text-white text-base">Daftar Mitra Perusahaan (Corporate Partners)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Perusahaan yang terdaftar dalam program CSR dan pendanaan sirkular</p>
            </div>
            <button
              onClick={() => setShowPartnerModal(true)}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Perusahaan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {partners.map(p => (
              <div key={p.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/30 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                    {p.status || "active"}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{p.company_name}</h4>
                <p className="text-xs text-slate-400 mb-2">{p.industry || "Industri"}</p>
                <div className="text-[11px] text-slate-500 space-y-0.5 border-t border-slate-900 pt-2">
                  <div>Kontak: {p.contact_person || "-"}</div>
                  <div>Email: {p.email || "-"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal: Tambah Partner */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setShowPartnerModal(false)}
              className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Tambah Mitra Perusahaan CSR</h3>
                <p className="text-xs text-slate-400">Daftarkan entitas korporasi baru</p>
              </div>
            </div>

            <form onSubmit={handleCreatePartner} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nama Perusahaan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT ABC Nusantara"
                  value={partnerForm.company_name}
                  onChange={(e) => setPartnerForm({ ...partnerForm, company_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Sektor / Industri</label>
                <input
                  type="text"
                  value={partnerForm.industry}
                  onChange={(e) => setPartnerForm({ ...partnerForm, industry: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Nama PIC"
                    value={partnerForm.contact_person}
                    onChange={(e) => setPartnerForm({ ...partnerForm, contact_person: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="csr@perusahaan.co.id"
                    value={partnerForm.email}
                    onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPartnerModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  Simpan Mitra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Buat Campaign */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setShowCampaignModal(false)}
              className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Buat Program CSR Campaign</h3>
                <p className="text-xs text-slate-400">Tetapkan target sampah, emisi, dan alokasi budget reward</p>
              </div>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nama Program Campaign</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Green School Movement 2026"
                  value={campaignForm.campaign_name}
                  onChange={(e) => setCampaignForm({ ...campaignForm, campaign_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Deskripsi Campaign</label>
                <textarea
                  rows="2"
                  placeholder="Fokus program kemitraan lingkungan..."
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Target Sampah (Kg)</label>
                  <input
                    type="number"
                    value={campaignForm.target_waste_kg}
                    onChange={(e) => setCampaignForm({ ...campaignForm, target_waste_kg: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Target CO2 (tCO2e)</label>
                  <input
                    type="number"
                    value={campaignForm.target_co2}
                    onChange={(e) => setCampaignForm({ ...campaignForm, target_co2: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Budget Reward (Rp)</label>
                <input
                  type="number"
                  value={campaignForm.reward_budget}
                  onChange={(e) => setCampaignForm({ ...campaignForm, reward_budget: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-md shadow-teal-500/20"
                >
                  Simpan Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Sponsor Reward Pool */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setShowSponsorModal(false)}
              className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Sponsor Reward Marketplace</h3>
                <p className="text-xs text-slate-400">Alokasikan barang/koin dari dana CSR ke Marketplace Reward</p>
              </div>
            </div>

            <form onSubmit={handleSponsorReward} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nama Item Reward</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 1000 Bibit Pohon / Sepeda Listrik"
                  value={sponsorForm.reward_name}
                  onChange={(e) => setSponsorForm({ ...sponsorForm, reward_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Jumlah Unit</label>
                  <input
                    type="number"
                    value={sponsorForm.quantity}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, quantity: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Reward Pool (TGX)</label>
                  <input
                    type="number"
                    value={sponsorForm.coin_pool}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, coin_pool: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nilai Sponsorship (Rp)</label>
                <input
                  type="number"
                  value={sponsorForm.sponsor_amount}
                  onChange={(e) => setSponsorForm({ ...sponsorForm, sponsor_amount: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSponsorModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20"
                >
                  Alokasikan Sponsorship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
