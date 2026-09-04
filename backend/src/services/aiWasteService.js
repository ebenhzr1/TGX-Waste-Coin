const pool = require("../config/database");

// In-memory cache & fallback stores for AI analysis
const memoryAIAnalysis = [
    {
        id: 1,
        waste_transaction_id: 1001,
        image_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80",
        detected_type: "Plastik",
        confidence: 96.2,
        estimated_weight: 12.0,
        fraud_score: 4.5,
        material_quality: "Clean PET (Botol Bening) - Layak Daur Ulang",
        recommendation: "approve",
        created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
        id: 2,
        waste_transaction_id: 1002,
        image_url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80",
        detected_type: "Kardus",
        confidence: 92.8,
        estimated_weight: 8.5,
        fraud_score: 8.0,
        material_quality: "Corrugated Cardboard (Kering & Terlipat)",
        recommendation: "approve",
        created_at: new Date(Date.now() - 1800000).toISOString()
    },
    {
        id: 3,
        waste_transaction_id: 1003,
        image_url: "https://images.unsplash.com/photo-1591193686104-fddba4d0e4d8?w=600&auto=format&fit=crop&q=80",
        detected_type: "Campuran",
        confidence: 74.0,
        estimated_weight: 4.2,
        fraud_score: 38.5,
        material_quality: "Mixed Packaging / Perlu Pemilahan Ulang",
        recommendation: "review",
        created_at: new Date(Date.now() - 900000).toISOString()
    }
];

const memoryAILogs = [];
const imageUsageHistory = new Map(); // Untuk duplicate image fraud detection
const userTransactionTimestamps = new Map(); // Untuk spam frequency detection

const CATEGORIES = [
    "Plastik",
    "Kertas",
    "Kardus",
    "Organik",
    "Logam",
    "Elektronik",
    "Campuran"
];

/**
 * 1. AI Simulation & Computer Vision Analysis Engine
 * Menganalisa citra sampah, estimasi berat, klasifikasi material, dan menghitung fraud score.
 */
const analyzeWasteImage = async (imageUrl, context = {}) => {
    if (!imageUrl) {
        throw new Error("URL foto sampah wajib disertakan untuk analisis AI");
    }

    const declared_weight = context.declared_weight || context.reported_weight || context.weight;
    const declared_type = context.declared_type || context.reported_type || context.waste_type;
    const user_id = context.user_id || context.submitter_id;
    const transaction_id = context.transaction_id || context.id;

    // Normalisasi url dan identifikasi pattern
    const urlLower = (imageUrl || "").toLowerCase();
    const declaredLower = (declared_type || "").toLowerCase();

    // 1. Detect Category based on vision heuristics & image patterns
    let detectedType = "Plastik";
    let confidence = 94.5;
    let materialQuality = "Grade A Clean Material";
    let baseEstimatedWeight = 2.5;

    if (urlLower.includes("kardus") || declaredLower.includes("kardus") || urlLower.includes("box")) {
        detectedType = "Kardus";
        confidence = 93.2;
        materialQuality = "Corrugated Cardboard (Kering & Padat)";
        baseEstimatedWeight = 3.5;
    } else if (urlLower.includes("kertas") || declaredLower.includes("kertas") || urlLower.includes("paper")) {
        detectedType = "Kertas";
        confidence = 91.8;
        materialQuality = "HVS / White Office Paper Terpilah";
        baseEstimatedWeight = 2.0;
    } else if (urlLower.includes("organik") || declaredLower.includes("organik") || urlLower.includes("leaf") || urlLower.includes("food")) {
        detectedType = "Organik";
        confidence = 89.4;
        materialQuality = "Sisa Makanan & Dedaunan Kompos";
        baseEstimatedWeight = 3.0;
    } else if (urlLower.includes("logam") || declaredLower.includes("logam") || urlLower.includes("metal") || urlLower.includes("can")) {
        detectedType = "Logam";
        confidence = 95.0;
        materialQuality = "Aluminium Can & Kaleng Terkompaksi";
        baseEstimatedWeight = 2.5;
    } else if (urlLower.includes("elektronik") || declaredLower.includes("elektronik") || urlLower.includes("ewaste")) {
        detectedType = "Elektronik";
        confidence = 96.5;
        materialQuality = "PCB & Small Household E-Waste";
        baseEstimatedWeight = 1.8;
    } else if (urlLower.includes("campur") || declaredLower.includes("campur") || urlLower.includes("mixed") || declaredLower.includes("mixed")) {
        detectedType = "Campuran";
        confidence = 72.0;
        materialQuality = "Sampah Campuran Belum Terpilah Maksimal";
        baseEstimatedWeight = 4.0;
    } else {
        // Default detected as Plastik (PET/HDPE)
        detectedType = "Plastik";
        confidence = 94.8;
        materialQuality = "Clear PET Bottles (Bersih Tanpa Label)";
        baseEstimatedWeight = 2.5;
    }

    // Penyesuaian variasi confidence jika ada declared_type tapi tidak cocok
    if (declared_type && declared_type.toLowerCase() !== detectedType.toLowerCase()) {
        confidence = Math.max(68.0, confidence - 22.0);
    }

    // 2. Visual Estimated Weight (Perkiraan bobot dari densitas visual)
    const variationFactor = 0.95 + (Math.sin(imageUrl.length) * 0.1);
    const estimatedWeight = parseFloat((baseEstimatedWeight * variationFactor).toFixed(2));

    // 3. AI Fraud Detection Engine
    let fraudScore = 3.0; // Base baseline minimal
    const fraudReasons = [];

    // 3a. Duplicate Image Detection (Foto sama digunakan berkali-kali)
    const cleanImageKey = imageUrl.split("?")[0];
    const previousUsage = imageUsageHistory.get(cleanImageKey) || 0;
    if (previousUsage >= 2) {
        fraudScore += 65.0;
        fraudReasons.push(`Foto duplikat terdeteksi (telah digunakan ${previousUsage} kali sebelumnya)`);
    } else if (previousUsage === 1) {
        fraudScore += 30.0;
        fraudReasons.push("Foto serupa pernah diunggah sebelumnya");
    }
    imageUsageHistory.set(cleanImageKey, previousUsage + 1);

    // 3b. Weight Anomaly Detection (Berat fisik jauh melenceng dari estimasi visual)
    if (declared_weight) {
        const declared = parseFloat(declared_weight);
        const ratio = declared / (estimatedWeight || 1);
        if (ratio > 3.0 || ratio < 0.2) {
            fraudScore += 50.0;
            fraudReasons.push(`Anomali berat: Klaim timbangan ${declared} kg tidak proporsional dengan estimasi visual ${estimatedWeight} kg`);
        } else if (ratio > 1.8 || ratio < 0.5) {
            fraudScore += 25.0;
            fraudReasons.push("Perbedaan bobot signifikan antara visual dan timbangan");
        }
    }

    // 3c. Frequency / Spam Detection (Multiple uploads dalam interval sangat singkat)
    if (user_id) {
        const lastTime = userTransactionTimestamps.get(user_id);
        const now = Date.now();
        if (lastTime && (now - lastTime) < 30000) { // Kurang dari 30 detik
            fraudScore += 35.0;
            fraudReasons.push("Frekuensi unggahan terlalu cepat (potensi spam transaksi)");
        }
        userTransactionTimestamps.set(user_id, now);
    }

    fraudScore = parseFloat(Math.min(99.9, Math.max(1.0, fraudScore)).toFixed(1));

    // 4. Approval Recommendation Engine
    let recommendation = "approve";
    if (fraudScore >= 50.0 || confidence < 65.0) {
        recommendation = "reject";
    } else if (confidence < 80.0 || fraudScore >= 20.0) {
        recommendation = "review";
    } else {
        recommendation = "approve";
    }

    const analysisOutput = {
        waste_type: detectedType,
        confidence: parseFloat(confidence.toFixed(1)),
        estimated_weight: String(estimatedWeight),
        material_quality: materialQuality,
        fraud_score: String(fraudScore),
        recommendation,
        fraud_reasons: fraudReasons,
        model_version: "TGX-Vision-AI-v2.4-Trenggalek",
        analyzed_at: new Date().toISOString()
    };

    return analysisOutput;
};

/**
 * 2. Simpan Hasil Analisis AI ke Database / Cache
 */
const saveAIAnalysis = async (transactionId, imageUrl, analysisResult) => {
    try {
        const res = await pool.query(
            `
            INSERT INTO waste_ai_analysis
            (waste_transaction_id, image_url, detected_type, confidence, estimated_weight, fraud_score, recommendation)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            `,
            [
                transactionId || null,
                imageUrl,
                analysisResult.waste_type,
                analysisResult.confidence,
                parseFloat(analysisResult.estimated_weight),
                parseFloat(analysisResult.fraud_score),
                analysisResult.recommendation
            ]
        );

        // Catat ke audit log AI
        try {
            await pool.query(
                `
                INSERT INTO ai_verification_logs (transaction_id, model_version, analysis_result)
                VALUES ($1, $2, $3)
                `,
                [transactionId || null, analysisResult.model_version || "v2.4", analysisResult]
            );
        } catch (logErr) {}

        return res.rows[0];
    } catch (err) {
        console.warn("DB offline, saveAIAnalysis memory fallback:", err.message);
        const item = {
            id: memoryAIAnalysis.length + 1,
            waste_transaction_id: parseInt(transactionId) || (memoryAIAnalysis.length + 1001),
            image_url: imageUrl,
            detected_type: analysisResult.waste_type,
            confidence: analysisResult.confidence,
            estimated_weight: parseFloat(analysisResult.estimated_weight),
            fraud_score: parseFloat(analysisResult.fraud_score),
            material_quality: analysisResult.material_quality,
            recommendation: analysisResult.recommendation,
            created_at: new Date().toISOString()
        };

        const existingIdx = memoryAIAnalysis.findIndex(a => a.waste_transaction_id === item.waste_transaction_id);
        if (existingIdx >= 0) {
            memoryAIAnalysis[existingIdx] = item;
        } else {
            memoryAIAnalysis.unshift(item);
        }

        memoryAILogs.push({
            id: memoryAILogs.length + 1,
            transaction_id: item.waste_transaction_id,
            model_version: "TGX-Vision-AI-v2.4-Trenggalek",
            analysis_result: analysisResult,
            created_at: new Date().toISOString()
        });

        return item;
    }
};

/**
 * 3. Ambil Hasil Analisis AI berdasarkan Transaction ID
 */
const getAIAnalysisByTransactionId = async (transactionId) => {
    try {
        const res = await pool.query(
            `SELECT * FROM waste_ai_analysis WHERE waste_transaction_id = $1 ORDER BY created_at DESC LIMIT 1`,
            [transactionId]
        );
        if (res.rows.length > 0) {
            return res.rows[0];
        }
        return memoryAIAnalysis.find(a => a.waste_transaction_id === parseInt(transactionId)) || null;
    } catch (err) {
        console.warn("DB offline, getAIAnalysisByTransactionId memory fallback:", err.message);
        return memoryAIAnalysis.find(a => a.waste_transaction_id === parseInt(transactionId)) || null;
    }
};

/**
 * 4. Dashboard Stats & Queue untuk Admin & Operator
 */
const getAIDashboardStats = async () => {
    try {
        const res = await pool.query(`SELECT * FROM waste_ai_analysis ORDER BY created_at DESC`);
        const list = res.rows.length > 0 ? res.rows : memoryAIAnalysis;

        const totalChecked = list.length;
        const autoApproved = list.filter(i => i.recommendation === "approve").length;
        const needReview = list.filter(i => i.recommendation === "review").length;
        const fraudDetection = list.filter(i => i.recommendation === "reject" || parseFloat(i.fraud_score) >= 25.0).length;

        return {
            total_ai_checked: totalChecked,
            auto_approved: autoApproved,
            need_review: needReview,
            fraud_detection: fraudDetection,
            queue: list
        };
    } catch (err) {
        const list = memoryAIAnalysis;
        return {
            total_ai_checked: list.length,
            auto_approved: list.filter(i => i.recommendation === "approve").length,
            need_review: list.filter(i => i.recommendation === "review").length,
            fraud_detection: list.filter(i => i.recommendation === "reject" || parseFloat(i.fraud_score) >= 25.0).length,
            queue: list
        };
    }
};

module.exports = {
    CATEGORIES,
    analyzeWasteImage,
    saveAIAnalysis,
    getAIAnalysisByTransactionId,
    getAIDashboardStats,
    memoryAIAnalysis
};
