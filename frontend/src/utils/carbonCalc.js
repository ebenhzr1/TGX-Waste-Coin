// Logika Perhitungan Reduksi Emisi & Token TGX Waste Coin
// Berdasarkan acuan metodologi UNFCCC ACM0022 / IPCC 2006 & Jwalita For Earth (PT JET)

export const WASTE_TYPES = {
  organic: {
    id: 'organic',
    name: 'Sampah Organik / Sisa Makanan',
    shortName: 'Organik',
    icon: 'Apple',
    ratePerKg: 3.5, // 3.5 TGX per kg
    co2eFactor: 1.85, // kg CO2e dicegah per kg sampah organik (methane avoidance)
    desc: 'Sisa makanan, kulit buah, sayuran untuk pengomposan & pakan maggot PT JET'
  },
  plastic: {
    id: 'plastic',
    name: 'Plastik (PET / HDPE / Gelas)',
    shortName: 'Plastik',
    icon: 'Package',
    ratePerKg: 5.0, // 5 TGX per kg
    co2eFactor: 2.10, // kg CO2e dicegah per kg plastik daur ulang
    desc: 'Botol plastik bersih, botol deterjen, cup minuman bening'
  },
  paper: {
    id: 'paper',
    name: 'Kertas & Karton / Kardus',
    shortName: 'Kertas & Kardus',
    icon: 'FileText',
    ratePerKg: 2.5, // 2.5 TGX per kg
    co2eFactor: 1.20, // kg CO2e dicegah
    desc: 'Kardus cokelat, kertas HVS bekas, koran, majalah bersih'
  },
  metal: {
    id: 'metal',
    name: 'Logam & Kaleng Aluminium',
    shortName: 'Logam / Kaleng',
    icon: 'Shield',
    ratePerKg: 8.0, // 8 TGX per kg
    co2eFactor: 4.50, // kg CO2e dicegah (energi smelting dihindari)
    desc: 'Kaleng minuman, seng, tembaga, besi bekas tanpa oli'
  },
  ewaste: {
    id: 'ewaste',
    name: 'Elektronik & B3 Domestik',
    shortName: 'Elektronik (E-Waste)',
    icon: 'Cpu',
    ratePerKg: 12.0, // 12 TGX per kg
    co2eFactor: 5.80, // kg CO2e dicegah
    desc: 'Baterai bekas, charger rusak, kabel, komponen elektronik kecil'
  }
};

export const DROP_POINTS = [
  { id: 'dp-1', name: 'TPST Pusat Trenggalek', address: 'Jl. Raya Tulungagung - Trenggalek KM 3' },
  { id: 'dp-2', name: 'Bank Sampah Jwalita - Hub Pogalan', address: 'Kecamatan Pogalan, Trenggalek' },
  { id: 'dp-3', name: 'Drop Point Watulimo Pesisir', address: 'Jl. Raya Prigi, Watulimo' },
  { id: 'dp-4', name: 'Hub Kompos Durenan Indah', address: 'Kec. Durenan, Kab. Trenggalek' },
  { id: 'dp-5', name: 'Layanan Pick-up JET Express (Jemput ke Rumah)', address: 'Armada Pengangkut PT JET' }
];

// 1 TGX Coin = Rp 1.000 (Rasio nilai tukar ekosistem circular PT JET)
export const TGX_TO_IDR_RATE = 1000;

export function calculateReward(wasteTypeId, weightKg) {
  const weight = parseFloat(weightKg) || 0;
  const waste = WASTE_TYPES[wasteTypeId] || WASTE_TYPES.plastic;
  
  const tgxEarned = parseFloat((weight * waste.ratePerKg).toFixed(1));
  const idrEquivalent = Math.round(tgxEarned * TGX_TO_IDR_RATE);
  const co2eAvoided = parseFloat((weight * waste.co2eFactor).toFixed(2));

  return {
    tgxEarned,
    idrEquivalent,
    co2eAvoided
  };
}

export function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

export function formatNumber(number, decimals = 1) {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0
  }).format(number);
}
