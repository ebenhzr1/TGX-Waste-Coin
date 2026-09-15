const pool = require("../config/database");

/**
 * Faktor Emisi Karbon (kgCO2e per kg sampah)
 * Standar PT JET / Jwalita For Earth (IPCC / GHG Protocol Scope 3 Waste Reduction)
 */
const CARBON_FACTORS = {
    plastic: 2.0,   // 2.0 kgCO2e / kg sampah
    paper: 1.0,     // 1.0 kgCO2e / kg sampah
    metal: 3.0,     // 3.0 kgCO2e / kg sampah
    organic: 0.5,   // 0.5 kgCO2e / kg sampah
    electronic: 4.0 // 4.0 kgCO2e / kg sampah
};

/**
 * Mendapatkan faktor konversi karbon berdasarkan jenis sampah
 * @param {string} wasteType 
 * @returns {number}
 */
const getCarbonFactor = (wasteType) => {
    const type = (wasteType || "").toLowerCase().trim();

    if (type.includes("plastik") || type.includes("plastic") || type.includes("pet") || type.includes("hdpe")) {
        return CARBON_FACTORS.plastic;
    }
    if (type.includes("kertas") || type.includes("paper") || type.includes("karton") || type.includes("kardus")) {
        return CARBON_FACTORS.paper;
    }
    if (type.includes("logam") || type.includes("metal") || type.includes("kaleng") || type.includes("besi") || type.includes("tembaga")) {
        return CARBON_FACTORS.metal;
    }
    if (type.includes("organik") || type.includes("organic") || type.includes("kompos") || type.includes("makanan") || type.includes("food")) {
        return CARBON_FACTORS.organic;
    }
    if (type.includes("elektronik") || type.includes("electronic") || type.includes("ewaste") || type.includes("b3")) {
        return CARBON_FACTORS.electronic;
    }

    return 1.0; // Nilai default konservatif
};

/**
 * Menghitung estimasi dampak pengurangan emisi karbon (CO2 Avoided)
 * @param {string} wasteType 
 * @param {number|string} weightKg 
 * @returns {{ wasteType: string, weightKg: number, co2Avoided: number }}
 */
const calculateCarbonImpact = (wasteType, weightKg) => {
    const weight = parseFloat(weightKg) || 0;
    const factor = getCarbonFactor(wasteType);
    const co2Avoided = parseFloat((weight * factor).toFixed(2));

    return {
        wasteType,
        weightKg: weight,
        co2Avoided
    };
};

/**
 * Menyimpan data dampak karbon ke tabel carbon_impacts
 * @param {number} transactionId 
 * @param {string} wasteType 
 * @param {number} weightKg 
 * @param {number} co2Avoided 
 * @returns {Promise<object>}
 */
const saveCarbonImpact = async (transactionId, wasteType, weightKg, co2Avoided) => {
    try {
        const result = await pool.query(
            `
            INSERT INTO carbon_impacts (transaction_id, waste_type, weight_kg, co2_avoided)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [transactionId, wasteType, weightKg, co2Avoided]
        );
        return result.rows[0];
    } catch (error) {
        console.warn("Peringatan: Gagal menyimpan carbon impact ke DB (mode fallback aktif):", error.message);
        return {
            id: Date.now(),
            transaction_id: transactionId,
            waste_type: wasteType,
            weight_kg: weightKg,
            co2_avoided: co2Avoided,
            created_at: new Date().toISOString()
        };
    }
};

module.exports = {
    CARBON_FACTORS,
    getCarbonFactor,
    calculateCarbonImpact,
    saveCarbonImpact
};
