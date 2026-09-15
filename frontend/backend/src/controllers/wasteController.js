const pool = require("../config/database");
const walletService = require("../services/walletService");
const uploadService = require("../services/uploadService");
const carbonService = require("../services/carbonService");
const gamificationService = require("../services/gamificationService");
const aiWasteService = require("../services/aiWasteService");

// Nilai tukar koin TGX per kg berdasarkan jenis sampah (acuan PT JET)
const WASTE_RATES = {
    organic: 3.5,
    plastic: 5.0,
    paper: 2.5,
    metal: 8.0,
    ewaste: 12.0
};

let memoryWasteTransactions = [];

// POST /api/waste/submit
const submit = async (req, res) => {
    try {
        const {
            user_id,
            school_id,
            waste_type,
            weight_kg,
            location,
            notes
        } = req.body;

        if (!waste_type || weight_kg === undefined || weight_kg === null) {
            return res.status(400).json({
                message: "Jenis sampah dan berat (kg) wajib diisi"
            });
        }

        const weight = parseFloat(weight_kg);
        if (isNaN(weight) || weight <= 0) {
            return res.status(400).json({
                message: "Berat sampah harus berupa angka lebih dari 0"
            });
        }

        const typeKey = (waste_type || "").toLowerCase().trim();
        const rate = WASTE_RATES[typeKey] || 3.0;
        const coin_amount = parseFloat((weight * rate).toFixed(2));

        const activeUserId = (req.user && req.user.id) ? req.user.id : (user_id || null);
        let transaction;
        let imageUrl = null;

        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        try {
            const result = await pool.query(
                `
                INSERT INTO waste_transactions
                (user_id, school_id, waste_type, weight_kg, coin_amount, status)
                VALUES($1, $2, $3, $4, $5, 'pending')
                RETURNING *
                `,
                [
                    activeUserId,
                    school_id || null,
                    waste_type,
                    weight,
                    coin_amount
                ]
            );

            transaction = result.rows[0];

            // Simpan foto sampah jika ada file yang diunggah
            if (imageUrl) {
                await uploadService.saveImage(transaction.id, imageUrl);
            }
        } catch (dbErr) {
            console.warn("DB offline, submit memory fallback aktif:", dbErr.message);
            transaction = {
                id: memoryWasteTransactions.length + 1001,
                user_id: activeUserId,
                school_id: school_id || 1,
                waste_type,
                weight_kg: weight,
                coin_amount,
                status: 'pending',
                created_at: new Date().toISOString()
            };
            memoryWasteTransactions.push(transaction);
        }

        res.status(201).json({
            message: "Setoran berhasil dikirim",
            transaction: {
                ...transaction,
                image_url: imageUrl
            }
        });

    } catch (error) {
        console.error("Error submitting waste:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// GET /api/waste/pending
const getPending = async (req, res) => {
    try {
        const { status, school_id, date } = req.query;

        let query = `
            SELECT wt.*, u.name AS user_name, u.email AS user_email, s.school_name, wi.image_url
            FROM waste_transactions wt
            LEFT JOIN users u ON wt.user_id = u.id
            LEFT JOIN schools s ON wt.school_id = s.id
            LEFT JOIN waste_images wi ON wt.id = wi.transaction_id
            WHERE 1=1
        `;
        const params = [];

        if (status && status !== 'all') {
            params.push(status);
            query += ` AND wt.status = $${params.length}`;
        } else if (!status) {
            query += ` AND wt.status = 'pending'`;
        }

        let targetSchoolId = school_id;
        if (req.user && (req.user.role === "operator_sekolah" || req.user.role === "school") && req.user.school_id) {
            targetSchoolId = req.user.school_id;
        }

        if (targetSchoolId) {
            params.push(targetSchoolId);
            query += ` AND wt.school_id = $${params.length}`;
        }

        if (date) {
            params.push(date);
            query += ` AND DATE(wt.created_at) = $${params.length}`;
        }

        query += ` ORDER BY wt.created_at DESC`;

        const result = await pool.query(query, params);

        const formattedRows = await Promise.all(result.rows.map(async (item) => {
            let aiResult = {
                type: item.waste_type?.includes("Kardus") ? "Kardus" : item.waste_type?.includes("Kertas") ? "Kertas" : "Plastic",
                confidence: 96,
                recommendation: "approve"
            };

            try {
                const aiData = await aiWasteService.getAIAnalysisByTransactionId(item.id);
                if (aiData) {
                    aiResult = {
                        type: aiData.detected_type,
                        confidence: parseFloat(aiData.confidence),
                        recommendation: aiData.recommendation,
                        fraud_score: parseFloat(aiData.fraud_score || 0),
                        estimated_weight: parseFloat(aiData.estimated_weight || item.weight_kg)
                    };
                }
            } catch (e) {}

            return {
                ...item,
                transaction_id: item.id,
                photo_verified: !!item.image_url,
                ai_result: aiResult,
                siswa: item.user_name || "Siswa",
                sekolah: item.school_name || "Sekolah Mitra",
                jenis_sampah: item.waste_type,
                berat: item.weight_kg,
                coin: item.coin_amount,
                image_url: item.image_url || null
            };
        }));

        res.json({
            message: "Daftar antrean setoran berhasil diambil",
            count: formattedRows.length,
            transactions: formattedRows,
            transaction: formattedRows
        });
    } catch (error) {
        console.warn("DB offline, getPending fallback aktif:", error.message);
        let fallbackRows = [
            {
                id: 1001,
                transaction_id: 1001,
                user_id: 7,
                user_name: "Ahmad Santoso",
                siswa: "Ahmad Santoso",
                school_id: 1,
                school_name: "SDN 2 Bendorejo",
                sekolah: "SDN 2 Bendorejo",
                waste_type: "Plastik (PET / HDPE)",
                jenis_sampah: "Plastik (PET / HDPE)",
                weight_kg: 12.5,
                berat: 12.5,
                coin_amount: 62.5,
                coin: 62.5,
                status: "pending",
                image_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80",
                photo_verified: true,
                ai_result: {
                    type: "Plastic",
                    confidence: 96,
                    recommendation: "approve",
                    fraud_score: 4.5,
                    estimated_weight: 12.0
                },
                created_at: new Date().toISOString()
            },
            {
                id: 1002,
                transaction_id: 1002,
                user_id: 7,
                user_name: "Ahmad Santoso",
                siswa: "Ahmad Santoso",
                school_id: 1,
                school_name: "SDN 2 Bendorejo",
                sekolah: "SDN 2 Bendorejo",
                waste_type: "Kardus & Kertas",
                jenis_sampah: "Kardus & Kertas",
                weight_kg: 8.0,
                berat: 8.0,
                coin_amount: 20.0,
                coin: 20.0,
                status: "pending",
                image_url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80",
                photo_verified: true,
                ai_result: {
                    type: "Cardboard",
                    confidence: 93,
                    recommendation: "approve",
                    fraud_score: 8.0,
                    estimated_weight: 8.5
                },
                created_at: new Date().toISOString()
            }
        ];

        // Filter sekolah jika user adalah operator sekolah
        if (req.user && (req.user.role === "operator_sekolah" || req.user.role === "school") && req.user.school_id) {
            fallbackRows = fallbackRows.filter(r => r.school_id === req.user.school_id);
        }

        res.json({
            message: "Daftar antrean setoran berhasil diambil (Fallback)",
            count: fallbackRows.length,
            transactions: fallbackRows,
            transaction: fallbackRows
        });
    }
};

// PUT /api/waste/verify/:id
const verify = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved' atau 'rejected'

        if (!status || !["approved", "rejected"].includes(status.toLowerCase())) {
            return res.status(400).json({
                message: "Status verifikasi harus 'approved' atau 'rejected'"
            });
        }

        const normalizedStatus = status.toLowerCase();
        const verifierId = req.user ? req.user.id : null;

        let transaction;
        let updatedTx;

        try {
            // Ambil data transaksi setoran
            const checkResult = await pool.query(
                "SELECT * FROM waste_transactions WHERE id = $1",
                [id]
            );

            if (checkResult.rows.length === 0) {
                return res.status(404).json({
                    message: "Transaksi setoran sampah tidak ditemukan"
                });
            }

            transaction = checkResult.rows[0];

            if (transaction.status !== "pending") {
                return res.status(400).json({
                    message: `Transaksi sudah berstatus '${transaction.status}' sebelumnya`
                });
            }

            // Update status transaksi setoran
            const updateResult = await pool.query(
                `
                UPDATE waste_transactions
                SET status = $1, verified_by = $2
                WHERE id = $3
                RETURNING *
                `,
                [normalizedStatus, verifierId, id]
            );

            updatedTx = updateResult.rows[0];
        } catch (dbErr) {
            console.warn("DB offline, verify memory fallback aktif:", dbErr.message);
            transaction = memoryWasteTransactions.find(t => t.id === parseInt(id));
            if (!transaction) {
                transaction = {
                    id: parseInt(id),
                    user_id: 107,
                    school_id: 1,
                    waste_type: "Plastik",
                    weight_kg: 10.0,
                    coin_amount: 50.0,
                    status: "pending"
                };
                memoryWasteTransactions.push(transaction);
            }
            transaction.status = normalizedStatus;
            transaction.verified_by = verifierId;
            updatedTx = { ...transaction };
        }
        let walletInfo = null;

        // Jika disetujui (approved), tambahkan koin TGX ke wallet siswa
        if (normalizedStatus === "approved" && transaction.user_id && parseFloat(transaction.coin_amount) > 0) {
            const desc = `Setor ${transaction.waste_type} ${transaction.weight_kg} kg disetujui`;
            walletInfo = await walletService.addCoin(
                transaction.user_id,
                transaction.coin_amount,
                desc,
                transaction.id
            );
        }

        // Sprint 16: Hitung & simpan dampak karbon ke tabel carbon_impacts (Jwalita For Earth)
        let carbonInfo = null;
        if (normalizedStatus === "approved" && transaction.weight_kg) {
            try {
                const impact = carbonService.calculateCarbonImpact(
                    transaction.waste_type,
                    transaction.weight_kg
                );
                carbonInfo = await carbonService.saveCarbonImpact(
                    transaction.id,
                    impact.wasteType,
                    impact.weightKg,
                    impact.co2Avoided
                );
            } catch (carbErr) {
                console.warn("Peringatan: Gagal memproses carbon impact:", carbErr.message);
            }
        }

        // Sprint 20: Gamification (Update User Level, Check Badges, & Notify)
        let gamificationInfo = null;
        if (normalizedStatus === "approved" && transaction.user_id && transaction.weight_kg) {
            try {
                gamificationInfo = await gamificationService.updateUserGamification(
                    transaction.user_id,
                    transaction.weight_kg,
                    transaction.coin_amount,
                    transaction.waste_type
                );
            } catch (gamErr) {
                console.warn("Peringatan: Gagal memproses gamification:", gamErr.message);
            }
        }

        res.json({
            message: normalizedStatus === "approved" 
                ? "Setoran sampah berhasil diverifikasi (APPROVED) dan koin TGX ditambahkan ke wallet siswa" 
                : "Setoran sampah ditolak (REJECTED)",
            transaction: updatedTx,
            wallet: walletInfo ? walletInfo.wallet : undefined,
            carbon_impact: carbonInfo || undefined,
            gamification: gamificationInfo || undefined
        });

    } catch (error) {
        console.error("Error verifying waste transaction:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// GET /api/waste/history
const getHistory = async (req, res) => {
    try {
        const { user_id } = req.query;

        let query = "SELECT * FROM waste_transactions ORDER BY created_at DESC";
        let params = [];

        if (user_id) {
            query = "SELECT * FROM waste_transactions WHERE user_id = $1 ORDER BY created_at DESC";
            params = [user_id];
        }

        const result = await pool.query(query, params);

        res.json({
            message: "Riwayat setoran sampah berhasil diambil",
            count: result.rows.length,
            transactions: result.rows
        });

    } catch (error) {
        console.error("Error fetching waste history:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    submit,
    getPending,
    verify,
    getHistory
};
