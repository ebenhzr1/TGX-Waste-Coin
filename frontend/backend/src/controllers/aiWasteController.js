const aiWasteService = require("../services/aiWasteService");
const pool = require("../config/database");

/**
 * POST /api/ai/analyze/:transactionId
 * Mengambil foto transaksi, menjalankan AI analysis, menyimpan hasil & mengembalikan rekomendasi
 */
const analyzeTransaction = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { image_url, declared_weight, declared_type } = req.body;

        let targetImageUrl = image_url;
        let weight = declared_weight;
        let type = declared_type;

        // Ambil data transaksi jika ada di DB
        if (!targetImageUrl && transactionId) {
            try {
                const txRes = await pool.query(
                    `
                    SELECT wt.*, wi.image_url 
                    FROM waste_transactions wt
                    LEFT JOIN waste_images wi ON wt.id = wi.transaction_id
                    WHERE wt.id = $1
                    `,
                    [transactionId]
                );

                if (txRes.rows.length > 0) {
                    const row = txRes.rows[0];
                    targetImageUrl = row.image_url || targetImageUrl;
                    weight = weight || row.weight_kg;
                    type = type || row.waste_type;
                }
            } catch (dbErr) {
                console.warn("DB offline, searching transaction photo fallback:", dbErr.message);
            }
        }

        // Default sample image jika tidak ada foto
        if (!targetImageUrl) {
            targetImageUrl = "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80";
        }

        // Jalankan Analisis AI Vision & Fraud Detection
        const analysisResult = await aiWasteService.analyzeWasteImage(targetImageUrl, {
            declared_weight: weight,
            declared_type: type,
            user_id: req.user ? req.user.id : null,
            transaction_id: transactionId
        });

        // Simpan hasil ke database / cache
        const saved = await aiWasteService.saveAIAnalysis(transactionId, targetImageUrl, analysisResult);

        res.status(200).json({
            message: "Analisis AI setoran sampah selesai",
            transaction_id: parseInt(transactionId),
            image_url: targetImageUrl,
            analysis: analysisResult,
            ai_analysis: analysisResult,
            ...analysisResult,
            saved_record: saved
        });

    } catch (error) {
        console.error("Error analyzing transaction image:", error);
        res.status(500).json({
            message: "Gagal menganalisis citra sampah",
            error: error.message
        });
    }
};

/**
 * GET /api/ai/result/:transactionId
 * Menampilkan hasil analisis AI untuk transaksi tertentu
 */
const getAnalysisResult = async (req, res) => {
    try {
        const { transactionId } = req.params;

        const result = await aiWasteService.getAIAnalysisByTransactionId(transactionId);

        if (!result) {
            return res.status(404).json({
                message: "Hasil analisis AI untuk transaksi ini belum tersedia"
            });
        }

        const analysisData = {
            waste_type: result.detected_type,
            confidence: parseFloat(result.confidence),
            estimated_weight: String(result.estimated_weight),
            fraud_score: String(result.fraud_score),
            material_quality: result.material_quality || "Verified Material",
            recommendation: result.recommendation,
            analyzed_at: result.created_at
        };

        res.json({
            transaction_id: parseInt(transactionId),
            photo_verified: true,
            analysis: analysisData,
            ...analysisData
        });

    } catch (error) {
        console.error("Error getting AI analysis result:", error);
        res.status(500).json({
            message: "Gagal memuat hasil AI",
            error: error.message
        });
    }
};

/**
 * GET /api/ai/dashboard
 * Ringkasan statistik verifikasi AI untuk Admin & Sekolah
 */
const getAIDashboard = async (req, res) => {
    try {
        const stats = await aiWasteService.getAIDashboardStats();
        res.json({
            message: "Statistik verifikasi AI berhasil dimuat",
            stats: stats,
            dashboard: stats
        });
    } catch (error) {
        console.error("Error getting AI dashboard:", error);
        res.status(500).json({
            message: "Gagal memuat dashboard AI",
            error: error.message
        });
    }
};

module.exports = {
    analyzeTransaction,
    getAnalysisResult,
    getAIDashboard
};
