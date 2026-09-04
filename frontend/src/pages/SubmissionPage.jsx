import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWaste } from '../context/WasteContext';
import { WASTE_TYPES, DROP_POINTS, calculateReward, formatRupiah, formatNumber } from '../utils/carbonCalc';
import {
  Apple,
  Package,
  FileText,
  Shield,
  Cpu,
  Upload,
  Camera,
  MapPin,
  Scale,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Coins,
  Leaf,
  X
} from 'lucide-react';

const ICON_MAP = {
  Apple,
  Package,
  FileText,
  Shield,
  Cpu
};

export default function SubmissionPage() {
  const { addSubmission } = useWaste();
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState('plastic');
  const [weightKg, setWeightKg] = useState('5.0');
  const [selectedDropPoint, setSelectedDropPoint] = useState(DROP_POINTS[0].name);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Live calculation
  const currentCalc = calculateReward(selectedType, weightKg);
  const currentWasteConfig = WASTE_TYPES[selectedType] || WASTE_TYPES.plastic;

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedWeight = parseFloat(weightKg);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setErrorMsg('Harap masukkan estimasi berat sampah yang valid (> 0 kg).');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newTx = addSubmission({
        wasteTypeId: selectedType,
        weightKg: parsedWeight,
        location: selectedDropPoint,
        photoUrl: photoPreview,
        notes
      });

      setIsSubmitting(false);
      setSuccessData(newTx);
    }, 500);
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-4xl mx-auto w-full">
      {/* Page Title */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Form Setoran Sirkular</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Setor Sampah & Dapatkan TGX
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Timbang sampah terpilah Anda, bawa ke drop point PT JET terdekat, dan klaim koin sirkular digital Anda.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Pilih Jenis Sampah */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white/10">
          <label className="block text-sm font-bold text-white mb-1">
            1. Pilih Jenis Sampah
          </label>
          <p className="text-xs text-slate-400 mb-4">
            Pilihlah kategori sampah yang sudah dipilah dalam keadaan bersih dan kering.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.values(WASTE_TYPES).map((type) => {
              const IconComponent = ICON_MAP[type.icon] || Package;
              const isSelected = selectedType === type.id;

              return (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-950/40 shadow-lg shadow-emerald-500/15'
                      : 'border-white/5 bg-slate-950/40 hover:border-white/20'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`p-2.5 rounded-xl border ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                          : 'bg-slate-800 border-white/5 text-slate-400'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{type.shortName}</h3>
                      <span className="text-[11px] font-semibold text-emerald-400">
                        {type.ratePerKg} TGX / kg
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {type.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Berat Sampah (kg) & Live Reward Calculator */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white/10">
          <label className="block text-sm font-bold text-white mb-1">
            2. Estimasi Berat (kg)
          </label>
          <p className="text-xs text-slate-400 mb-4">
            Masukkan perkiraan berat. Timbangan digital resmi akan diverifikasi di drop point.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Scale className="w-5 h-5" />
              </div>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="Contoh: 5.0"
                className="w-full pl-11 pr-14 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-base font-semibold focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
              />
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-sm font-bold text-slate-400">
                kg
              </span>
            </div>

            {/* Quick weight buttons */}
            <div className="flex gap-2">
              {['1', '2.5', '5', '10', '20'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setWeightKg(val)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    weightKg === val
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-slate-950/50 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  +{val}kg
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Calculation Panel */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-950/60 to-sky-950/50 border border-emerald-500/30">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Estimasi Hasil untuk {currentWasteConfig.shortName} ({weightKg || 0} kg)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Coins className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Reward Koin</span>
                </div>
                <div className="text-xl font-bold text-emerald-400">
                  +{formatNumber(currentCalc.tgxEarned, 1)} TGX
                </div>
                <span className="text-[10px] text-slate-400">
                  Rupiah: {formatRupiah(currentCalc.idrEquivalent)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Leaf className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Reduksi Karbon</span>
                </div>
                <div className="text-xl font-bold text-cyan-400">
                  {formatNumber(currentCalc.co2eAvoided, 2)} kg CO₂e
                </div>
                <span className="text-[10px] text-slate-400">
                  Methane Avoidance model
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Nilai Tukar</span>
                </div>
                <div className="text-xl font-bold text-white">
                  Rp 1.000
                </div>
                <span className="text-[10px] text-slate-400">
                  Per 1 TGX Coin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Upload Foto Sampah */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white/10">
          <label className="block text-sm font-bold text-white mb-1">
            3. Upload Foto Sampah
          </label>
          <p className="text-xs text-slate-400 mb-4">
            Unggah foto tumpukan sampah terpilah untuk mempercepat proses verifikasi di lokasi.
          </p>

          {photoPreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 max-w-sm mx-auto">
              <img
                src={photoPreview}
                alt="Preview Sampah"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 text-rose-400 hover:text-white border border-rose-500/30 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="p-2 text-center bg-slate-950/90 text-xs text-emerald-400 font-medium">
                ✓ Foto siap dilampirkan
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-white/15 rounded-2xl p-6 text-center hover:border-emerald-400/50 transition-all bg-slate-950/30">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-200 mb-1">
                Ambil foto atau pilih dari galeri
              </p>
              <p className="text-[11px] text-slate-500 mb-4">
                Mendukung JPG, PNG, atau WEBP (Maks 5 MB)
              </p>

              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 cursor-pointer transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* 4. Lokasi Drop Point */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white/10">
          <label className="block text-sm font-bold text-white mb-1">
            4. Lokasi Penyerahan / Drop Point
          </label>
          <p className="text-xs text-slate-400 mb-4">
            Pilih bank sampah binaan atau hub PT Jwalita Energi Trenggalek yang ingin Anda tuju.
          </p>

          <div className="space-y-2.5">
            {DROP_POINTS.map((dp) => (
              <label
                key={dp.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedDropPoint === dp.name
                    ? 'border-emerald-400/50 bg-emerald-950/30 text-white'
                    : 'border-white/5 bg-slate-950/40 text-slate-300 hover:border-white/15'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-400 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold block">{dp.name}</span>
                    <span className="text-[11px] text-slate-400">{dp.address}</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="dropPoint"
                  value={dp.name}
                  checked={selectedDropPoint === dp.name}
                  onChange={(e) => setSelectedDropPoint(e.target.value)}
                  className="w-4 h-4 text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* 5. Catatan Tambahan (Opsional) */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white/10">
          <label className="block text-sm font-bold text-white mb-1">
            5. Catatan Tambahan (Opsional)
          </label>
          <p className="text-xs text-slate-400 mb-3">
            Tuliskan keterangan bila sampah memerlukan penanganan khusus (misal: botol kaca, kabel panjang).
          </p>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Sudah dicuci bersih dan dipisah tutupnya..."
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
          />
        </div>

        {/* Tombol Kirim */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-extrabold text-base shadow-2xl shadow-emerald-500/30 hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Mengirim Data Penimbangan...</span>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Kirim Setoran & Dapatkan +{formatNumber(currentCalc.tgxEarned, 1)} TGX</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success Modal Confirmation */}
      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full border border-emerald-400/40 text-center shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">
              Setoran Berhasil Terverifikasi!
            </h3>
            <p className="text-xs text-slate-300 mb-6">
              Terima kasih telah berkontribusi bagi lingkungan Kabupaten Trenggalek bersama PT JET.
            </p>

            {/* Receipt highlight */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 text-left space-y-2 mb-6 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>No. Transaksi:</span>
                <span className="text-white font-mono">{successData.id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Jenis Sampah:</span>
                <span className="text-white font-semibold">{successData.wasteTypeName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Berat Terhitung:</span>
                <span className="text-white font-semibold">{successData.weightKg} kg</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Carbon Impact:</span>
                <span className="text-cyan-400 font-semibold">{successData.carbonSavedKg} kg CO₂e</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-sm">
                <span className="text-slate-200">Koin Diperoleh:</span>
                <span className="text-emerald-400">+{successData.tgxEarned} TGX ({formatRupiah(successData.idrValue)})</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => navigate('/riwayat')}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:opacity-95 transition-all cursor-pointer"
              >
                Lihat di Riwayat
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 text-slate-200 font-semibold text-xs hover:bg-slate-700 transition-all cursor-pointer"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
