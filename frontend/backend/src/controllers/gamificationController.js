const gamificationService = require("../services/gamificationService");

/**
 * 1. Mengambil pencapaian & badge siswa
 * GET /api/gamification/user/:id
 */
const getUserAchievement = async (req, res) => {
    try {
        const userId = req.params.id || req.user?.id || 1;
        const achievement = await gamificationService.getUserAchievement(userId);
        return res.status(200).json(achievement);
    } catch (error) {
        console.error("Error in getUserAchievement controller:", error);
        return res.status(500).json({
            message: "Gagal memuat pencapaian pengguna",
            error: error.message
        });
    }
};

/**
 * 2. Mengambil pencapaian sekolah
 * GET /api/gamification/school/:id
 */
const getSchoolAchievement = async (req, res) => {
    try {
        const schoolId = req.params.id || 1;
        const schoolData = await gamificationService.getSchoolAchievement(schoolId);
        return res.status(200).json(schoolData);
    } catch (error) {
        console.error("Error in getSchoolAchievement controller:", error);
        return res.status(500).json({
            message: "Gagal memuat pencapaian sekolah",
            error: error.message
        });
    }
};

/**
 * 3. Menampilkan kompetisi aktif dan leaderboard
 * GET /api/gamification/competition
 */
const getCompetition = async (req, res) => {
    try {
        const competitions = await gamificationService.getActiveCompetitions();
        return res.status(200).json(competitions);
    } catch (error) {
        console.error("Error in getCompetition controller:", error);
        return res.status(500).json({
            message: "Gagal memuat data kompetisi",
            error: error.message
        });
    }
};

/**
 * 4. Admin membuat kompetisi baru
 * POST /api/gamification/competition
 * Body: { name, start_date, end_date, description, competition_type }
 */
const createCompetition = async (req, res) => {
    try {
        const { name, start_date, end_date, description, competition_type } = req.body;

        if (!name || !start_date || !end_date) {
            return res.status(400).json({
                message: "Nama kompetisi, tanggal mulai, dan tanggal selesai wajib diisi"
            });
        }

        const newComp = await gamificationService.createCompetition({
            name,
            start_date,
            end_date,
            description,
            competition_type
        });

        return res.status(201).json({
            message: `Kompetisi '${name}' berhasil dibuat`,
            data: newComp
        });
    } catch (error) {
        console.error("Error in createCompetition controller:", error);
        return res.status(500).json({
            message: "Gagal membuat kompetisi",
            error: error.message
        });
    }
};

/**
 * 5. Admin menutup kompetisi
 * PUT /api/gamification/competition/:id/close
 */
const closeCompetition = async (req, res) => {
    try {
        const compId = req.params.id;
        const closedComp = await gamificationService.closeCompetition(compId);

        return res.status(200).json({
            message: `Kompetisi #${compId} berhasil ditutup`,
            data: closedComp
        });
    } catch (error) {
        console.error("Error in closeCompetition controller:", error);
        return res.status(500).json({
            message: "Gagal menutup kompetisi",
            error: error.message
        });
    }
};

module.exports = {
    getUserAchievement,
    getSchoolAchievement,
    getCompetition,
    createCompetition,
    closeCompetition
};
