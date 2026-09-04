const pool = require("../config/database");
const { sendNotification } = require("./notificationService");

// ==========================================
// IN-MEMORY FALLBACK DATASET
// ==========================================
const DEFAULT_BADGES = [
    {
        id: 1,
        name: "First Deposit",
        description: "Setoran sampah pertama kali berhasil diverifikasi oleh petugas",
        icon: "🌱",
        requirement_type: "first_transaction",
        requirement_value: 1.0
    },
    {
        id: 2,
        name: "Plastic Hero",
        description: "Mengumpulkan dan mendaur ulang minimal 50 kg sampah plastik",
        icon: "♻️",
        requirement_type: "plastic_weight",
        requirement_value: 50.0
    },
    {
        id: 3,
        name: "Eco Champion",
        description: "Total pengumpulan seluruh jenis sampah mencapai 100 kg",
        icon: "🏆",
        requirement_type: "total_weight",
        requirement_value: 100.0
    },
    {
        id: 4,
        name: "Earth Guardian",
        description: "Dedikasi luar biasa dengan total sampah terkelola mencapai 1000 kg",
        icon: "🌎",
        requirement_type: "total_weight",
        requirement_value: 1000.0
    }
];

let memoryUserLevels = {
    1: { level: 2, total_weight_kg: 25.0, total_coin: 250.0 },
    7: { level: 3, total_weight_kg: 105.0, total_coin: 525.0 }
};

let memoryUserBadges = [
    { user_id: 1, badge_id: 1, earned_at: "2026-09-02 10:00:00" },
    { user_id: 7, badge_id: 1, earned_at: "2026-09-01 08:00:00" },
    { user_id: 7, badge_id: 2, earned_at: "2026-09-03 14:00:00" },
    { user_id: 7, badge_id: 3, earned_at: "2026-09-04 09:00:00" }
];

let memoryCompetitions = [
    {
        id: 1,
        name: "Eco Challenge September 2026",
        description: "Kompetisi pengumpulan sampah terpilah antar sekolah Adiwiyata se-Kabupaten Trenggalek",
        start_date: "2026-09-01",
        end_date: "2026-09-30",
        competition_type: "school_waste",
        status: "active",
        created_at: "2026-09-01 00:00:00"
    }
];

let memoryCompetitionLeaderboards = {
    1: [
        { rank: 1, school_id: 2, school_name: "SMPN 1 Trenggalek", total_weight: 2450.0, total_coin: 12250.0, students: 420 },
        { rank: 2, school_id: 1, school_name: "SDN 2 Bendorejo", total_weight: 1820.0, total_coin: 9100.0, students: 310 },
        { rank: 3, school_id: 3, school_name: "SMAN 1 Durenan", total_weight: 1400.0, total_coin: 7000.0, students: 280 },
        { rank: 4, school_id: 4, school_name: "MTsN 1 Pogalan", total_weight: 950.0, total_coin: 4750.0, students: 190 }
    ]
};

/**
 * 1. Kalkulasi Level Siswa berdasarkan Total Berat Sampah (Kg)
 * Rules:
 * LEVEL 1: Eco Beginner (0 - 10 Kg)
 * LEVEL 2: Eco Fighter (10 - 50 Kg)
 * LEVEL 3: Eco Champion (50 - 100 Kg)
 * LEVEL 4: Earth Guardian (100 - 500 Kg)
 * LEVEL 5: Planet Hero (> 500 Kg)
 */
function calculateLevel(totalWeightKg) {
    const weight = parseFloat(totalWeightKg) || 0;

    if (weight > 500) {
        return {
            level: 5,
            title: "Planet Hero",
            minKg: 500,
            maxKg: 1000,
            nextLevelKg: null,
            progressPercent: 100
        };
    } else if (weight >= 100) {
        const progress = Math.min(100, Math.round(((weight - 100) / (500 - 100)) * 100));
        return {
            level: 4,
            title: "Earth Guardian",
            minKg: 100,
            maxKg: 500,
            nextLevelKg: 500,
            progressPercent: progress
        };
    } else if (weight >= 50) {
        const progress = Math.min(100, Math.round(((weight - 50) / (100 - 50)) * 100));
        return {
            level: 3,
            title: "Eco Champion",
            minKg: 50,
            maxKg: 100,
            nextLevelKg: 100,
            progressPercent: progress
        };
    } else if (weight >= 10) {
        const progress = Math.min(100, Math.round(((weight - 10) / (50 - 10)) * 100));
        return {
            level: 2,
            title: "Eco Fighter",
            minKg: 10,
            maxKg: 50,
            nextLevelKg: 50,
            progressPercent: progress
        };
    } else {
        const progress = Math.min(100, Math.round((weight / 10) * 100));
        return {
            level: 1,
            title: "Eco Beginner",
            minKg: 0,
            maxKg: 10,
            nextLevelKg: 10,
            progressPercent: progress
        };
    }
}

/**
 * 2. Update Gamification Data Saat Transaksi Disetujui (Approved)
 * Flow:
 * - Update Level & Total Weight
 * - Check & Award Badges
 * - Kirim Notifikasi jika badge baru didapat
 */
async function updateUserGamification(userId, addedWeightKg, addedCoin, wasteType = "") {
    const weight = parseFloat(addedWeightKg) || 0;
    const coin = parseFloat(addedCoin) || 0;
    const uId = parseInt(userId);

    let currentTotalWeight = weight;
    let currentTotalCoin = coin;
    let plasticTotalWeight = 0;
    let totalTransactionsCount = 1;
    let dbConnected = false;

    try {
        // Ambil akumulasi dari database
        const aggRes = await pool.query(
            `
            SELECT 
                COUNT(*) AS total_tx,
                COALESCE(SUM(weight_kg), 0) AS total_weight,
                COALESCE(SUM(coin_amount), 0) AS total_coin,
                COALESCE(SUM(CASE WHEN LOWER(waste_type) LIKE '%plastik%' THEN weight_kg ELSE 0 END), 0) AS plastic_weight
            FROM waste_transactions
            WHERE user_id = $1 AND status = 'approved'
            `,
            [uId]
        );

        if (aggRes.rows.length > 0) {
            dbConnected = true;
            totalTransactionsCount = parseInt(aggRes.rows[0].total_tx);
            currentTotalWeight = parseFloat(aggRes.rows[0].total_weight);
            currentTotalCoin = parseFloat(aggRes.rows[0].total_coin);
            plasticTotalWeight = parseFloat(aggRes.rows[0].plastic_weight);
        }
    } catch (dbErr) {
        console.warn("DB offline, gamification menggunakan in-memory fallback:", dbErr.message);
        if (!memoryUserLevels[uId]) {
            memoryUserLevels[uId] = { level: 1, total_weight_kg: 0, total_coin: 0 };
        }
        memoryUserLevels[uId].total_weight_kg += weight;
        memoryUserLevels[uId].total_coin += coin;

        currentTotalWeight = memoryUserLevels[uId].total_weight_kg;
        currentTotalCoin = memoryUserLevels[uId].total_coin;

        if (wasteType.toLowerCase().includes("plastik")) {
            plasticTotalWeight = currentTotalWeight;
        }
    }

    // 1. Hitung Level Baru
    const levelInfo = calculateLevel(currentTotalWeight);

    // 2. Simpan / Update User Level
    if (dbConnected) {
        try {
            await pool.query(
                `
                INSERT INTO user_levels (user_id, level, total_weight_kg, total_coin, updated_at)
                VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
                ON CONFLICT (user_id)
                DO UPDATE SET
                    level = $2,
                    total_weight_kg = $3,
                    total_coin = $4,
                    updated_at = CURRENT_TIMESTAMP
                `,
                [uId, levelInfo.level, currentTotalWeight, currentTotalCoin]
            );
        } catch (lvlErr) {
            console.warn("Peringatan: Gagal upsert user_levels:", lvlErr.message);
        }
    } else {
        memoryUserLevels[uId].level = levelInfo.level;
    }

    // 3. Evaluasi Badge yang Berhak Didapat
    const newEarnedBadges = [];

    // Ambil daftar badge yang sudah dimiliki user
    let ownedBadgeIds = [];
    if (dbConnected) {
        try {
            const ownedRes = await pool.query(
                "SELECT badge_id FROM user_badges WHERE user_id = $1",
                [uId]
            );
            ownedBadgeIds = ownedRes.rows.map(r => r.badge_id);
        } catch (bErr) {
            console.warn("Peringatan: Gagal query user_badges:", bErr.message);
        }
    } else {
        ownedBadgeIds = memoryUserBadges
            .filter(ub => ub.user_id === uId)
            .map(ub => ub.badge_id);
    }

    // Evaluasi 4 Aturan Badge:
    // Badge 1: First Deposit (1st approved transaction)
    if (!ownedBadgeIds.includes(1)) {
        newEarnedBadges.push(DEFAULT_BADGES[0]);
    }

    // Badge 2: Plastic Hero (plastic >= 50kg)
    if (!ownedBadgeIds.includes(2) && plasticTotalWeight >= 50.0) {
        newEarnedBadges.push(DEFAULT_BADGES[1]);
    }

    // Badge 3: Eco Champion (total_weight >= 100kg)
    if (!ownedBadgeIds.includes(3) && currentTotalWeight >= 100.0) {
        newEarnedBadges.push(DEFAULT_BADGES[2]);
    }

    // Badge 4: Earth Guardian (total_weight >= 1000kg)
    if (!ownedBadgeIds.includes(4) && currentTotalWeight >= 1000.0) {
        newEarnedBadges.push(DEFAULT_BADGES[3]);
    }

    // 4. Simpan Badge Baru & Kirim Notifikasi
    for (const badge of newEarnedBadges) {
        if (dbConnected) {
            try {
                await pool.query(
                    `
                    INSERT INTO user_badges (user_id, badge_id, earned_at)
                    VALUES ($1, $2, CURRENT_TIMESTAMP)
                    ON CONFLICT DO NOTHING
                    `,
                    [uId, badge.id]
                );
            } catch (insErr) {
                console.warn("Peringatan insert user_badge:", insErr.message);
            }
        } else {
            memoryUserBadges.push({
                user_id: uId,
                badge_id: badge.id,
                earned_at: new Date().toISOString()
            });
        }

        // Kirim Notifikasi Sesuai Format:
        // Title: Badge Baru Didapat!
        // Message: Selamat!\nAnda mendapatkan badge:\n{badgeName}
        try {
            await sendNotification(
                uId,
                "Badge Baru Didapat!",
                `Selamat!\nAnda mendapatkan badge:\n${badge.name}`
            );
        } catch (notifErr) {
            console.warn("Peringatan kirim notifikasi badge:", notifErr.message);
        }
    }

    return {
        level: levelInfo.level,
        title: levelInfo.title,
        totalWeight: currentTotalWeight,
        totalCoin: currentTotalCoin,
        newBadges: newEarnedBadges
    };
}

/**
 * 3. Mengambil Informasi Prestasi Siswa (User Achievement)
 * Return: { level, title, totalWaste, totalCoin, badges, progress }
 */
async function getUserAchievement(userId) {
    const uId = parseInt(userId);
    let totalWeight = 0;
    let totalCoin = 0;
    let earnedBadgesMap = {};

    try {
        // Ambil data level dan koin dari database
        const levelRes = await pool.query(
            "SELECT level, total_weight_kg, total_coin FROM user_levels WHERE user_id = $1",
            [uId]
        );

        if (levelRes.rows.length > 0) {
            totalWeight = parseFloat(levelRes.rows[0].total_weight_kg);
            totalCoin = parseFloat(levelRes.rows[0].total_coin);
        } else {
            // Ambil langsung dari waste_transactions jika user_levels belum ada
            const txRes = await pool.query(
                `
                SELECT 
                    COALESCE(SUM(weight_kg), 0) AS total_weight,
                    COALESCE(SUM(coin_amount), 0) AS total_coin
                FROM waste_transactions
                WHERE user_id = $1 AND status = 'approved'
                `,
                [uId]
            );
            if (txRes.rows.length > 0) {
                totalWeight = parseFloat(txRes.rows[0].total_weight);
                totalCoin = parseFloat(txRes.rows[0].total_coin);
            }
        }

        // Ambil badges yang dimiliki
        const badgesRes = await pool.query(
            `
            SELECT b.id, b.name, b.description, b.icon, b.requirement_type, b.requirement_value, ub.earned_at
            FROM badges b
            JOIN user_badges ub ON b.id = ub.badge_id
            WHERE ub.user_id = $1
            ORDER BY ub.earned_at ASC
            `,
            [uId]
        );

        badgesRes.rows.forEach(b => {
            earnedBadgesMap[b.id] = b.earned_at;
        });

    } catch (err) {
        console.warn("DB offline, getUserAchievement fallback aktif:", err.message);
        const mem = memoryUserLevels[uId] || { level: 2, total_weight_kg: 75.0, total_coin: 375.0 };
        totalWeight = mem.total_weight_kg;
        totalCoin = mem.total_coin;

        memoryUserBadges
            .filter(ub => ub.user_id === uId)
            .forEach(ub => {
                earnedBadgesMap[ub.badge_id] = ub.earned_at;
            });
    }

    const levelInfo = calculateLevel(totalWeight);

    // Format all badges (earned & locked)
    const formattedBadges = DEFAULT_BADGES.map(badge => {
        const isEarned = Boolean(earnedBadgesMap[badge.id]);
        return {
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            requirement_type: badge.requirement_type,
            requirement_value: badge.requirement_value,
            is_earned: isEarned,
            earned_at: earnedBadgesMap[badge.id] || null
        };
    });

    return {
        level: levelInfo.level,
        title: levelInfo.title,
        totalWaste: totalWeight,
        totalCoin: totalCoin,
        progressPercent: levelInfo.progressPercent,
        nextLevelKg: levelInfo.nextLevelKg,
        badges: formattedBadges
    };
}

/**
 * 4. Mengambil Prestasi Sekolah (School Achievement)
 */
async function getSchoolAchievement(schoolId) {
    const sId = parseInt(schoolId);
    let schoolName = "SDN 2 Bendorejo";
    let totalWaste = 2000.0;
    let co2Avoided = 4000.0;
    let level = "Eco School Adiwiyata";
    let rank = 2;

    try {
        const res = await pool.query(
            `
            SELECT 
                s.school_name,
                COALESCE(SUM(wt.weight_kg), 0) AS total_weight,
                COUNT(DISTINCT wt.user_id) AS active_students
            FROM schools s
            LEFT JOIN waste_transactions wt ON s.id = wt.school_id AND wt.status = 'approved'
            WHERE s.id = $1
            GROUP BY s.id, s.school_name
            `,
            [sId]
        );

        if (res.rows.length > 0) {
            schoolName = res.rows[0].school_name;
            totalWaste = parseFloat(res.rows[0].total_weight);
            co2Avoided = totalWaste * 2.0; // Rata-rata 2.0 kgCO2e/kg
        }
    } catch (err) {
        console.warn("DB offline, getSchoolAchievement fallback aktif:", err.message);
    }

    // Tentukan predikat level sekolah
    if (totalWaste >= 5000) level = "Eco School Mandiri (Nasional)";
    else if (totalWaste >= 2000) level = "Eco School Adiwiyata Utama";
    else if (totalWaste >= 500) level = "Eco School Adiwiyata Madya";
    else level = "Eco School Pratama";

    return {
        school: schoolName,
        totalWaste: totalWaste,
        co2Avoided: co2Avoided,
        level: level,
        rank: rank
    };
}

/**
 * 5. Mengambil Data Kompetisi Aktif (Eco Competition)
 */
async function getActiveCompetitions() {
    let comps = memoryCompetitions;

    try {
        const res = await pool.query(
            "SELECT * FROM competitions WHERE status = 'active' ORDER BY start_date DESC"
        );
        if (res.rows.length > 0) {
            comps = res.rows;
        }
    } catch (err) {
        console.warn("DB offline, getActiveCompetitions fallback aktif:", err.message);
    }

    // Pasangkan dengan leaderboard sekolah
    return comps.map(c => {
        const leaderboard = memoryCompetitionLeaderboards[c.id] || [
            { rank: 1, school_id: 1, school_name: "SDN 2 Bendorejo", total_weight: 2000.0, total_coin: 10000.0, students: 300 },
            { rank: 2, school_id: 2, school_name: "SMPN 1 Trenggalek", total_weight: 1500.0, total_coin: 7500.0, students: 250 },
            { rank: 3, school_id: 3, school_name: "SMAN 1 Durenan", total_weight: 1200.0, total_coin: 6000.0, students: 200 }
        ];

        return {
            ...c,
            leaderboard
        };
    });
}

/**
 * 6. Admin Membuat Kompetisi Baru
 */
async function createCompetition(data) {
    const { name, description, start_date, end_date, competition_type } = data;

    try {
        const res = await pool.query(
            `
            INSERT INTO competitions (name, description, start_date, end_date, competition_type, status)
            VALUES ($1, $2, $3, $4, $5, 'active')
            RETURNING *
            `,
            [name, description, start_date, end_date, competition_type || 'school_waste']
        );
        if (res.rows.length > 0) {
            return res.rows[0];
        }
    } catch (err) {
        console.warn("DB offline, createCompetition fallback aktif:", err.message);
    }

    const newComp = {
        id: memoryCompetitions.length + 1,
        name,
        description: description || "Tantangan pengumpulan sampah terpilah",
        start_date: start_date || new Date().toISOString().split("T")[0],
        end_date: end_date || "2026-12-31",
        competition_type: competition_type || "school_waste",
        status: "active",
        created_at: new Date().toISOString()
    };
    memoryCompetitions.push(newComp);
    return newComp;
}

/**
 * 7. Admin Menutup Kompetisi
 */
async function closeCompetition(id) {
    const compId = parseInt(id);
    try {
        const res = await pool.query(
            "UPDATE competitions SET status = 'closed' WHERE id = $1 RETURNING *",
            [compId]
        );
        if (res.rows.length > 0) return res.rows[0];
    } catch (err) {
        console.warn("DB offline, closeCompetition fallback aktif:", err.message);
    }

    const comp = memoryCompetitions.find(c => c.id === compId);
    if (comp) comp.status = "closed";
    return comp;
}

// Memory getter for testing
function _getGamificationMemory() {
    return {
        levels: memoryUserLevels,
        badges: memoryUserBadges,
        competitions: memoryCompetitions
    };
}

module.exports = {
    calculateLevel,
    updateUserGamification,
    getUserAchievement,
    getSchoolAchievement,
    getActiveCompetitions,
    createCompetition,
    closeCompetition,
    DEFAULT_BADGES,
    _getGamificationMemory
};
