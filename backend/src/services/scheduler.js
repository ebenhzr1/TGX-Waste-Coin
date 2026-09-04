const cron = require("node-cron");
const { generateRanking } = require("./rankingService");

// Jadwal otomatis: Setiap hari Rabu pukul 00:00 WIB
cron.schedule("0 0 * * 3", async () => {
    console.log("[Scheduler] Menjalankan update ranking mingguan otomatis...");
    try {
        await generateRanking("weekly");
        console.log("[Scheduler] Update ranking mingguan sukses.");
    } catch (error) {
        console.error("[Scheduler] Gagal update ranking mingguan:", error.message);
    }
});

console.log("[Scheduler] Ranking scheduler aktif (Setiap Rabu 00:00).");
