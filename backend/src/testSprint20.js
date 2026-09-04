const jwt = require("jsonwebtoken");
const http = require("http");
const { execSync } = require("child_process");
const gamificationService = require("./services/gamificationService");
const { getUserNotifications } = require("./services/notificationService");

const JWT_SECRET = process.env.JWT_SECRET || "tgx_secret_2026";

// Generate test tokens
const studentToken = jwt.sign(
    { id: 99, name: "Budi Siswa", role: "siswa", school_id: 1 },
    JWT_SECRET,
    { expiresIn: "1h" }
);

const adminToken = jwt.sign(
    { id: 1, name: "Admin JET", role: "super_admin" },
    JWT_SECRET,
    { expiresIn: "1h" }
);

function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = "";
            res.on("data", chunk => (body += chunk));
            res.on("end", () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on("error", reject);

        if (postData) {
            req.write(typeof postData === "string" ? postData : JSON.stringify(postData));
        }
        req.end();
    });
}

async function runTests() {
    let server;
    try {
        const app = require("./../server");
        server = app.listen(5000);
    } catch (_) {}
    console.log("=================================================");
    console.log("TESTING SPRINT 20: TGX GAMIFICATION & ECO COMPETITION");
    console.log("=================================================\n");

    let passCount = 0;

    // ----------------------------------------------------
    // TEST 1: Approve Transaksi Sampah Siswa -> Level Update
    // ----------------------------------------------------
    console.log("▶ Test 1: Approve transaksi sampah siswa & kalkulasi level...");
    try {
        // Test rule calculateLevel
        const lvl1 = gamificationService.calculateLevel(5);
        const lvl2 = gamificationService.calculateLevel(25);
        const lvl3 = gamificationService.calculateLevel(75);
        const lvl4 = gamificationService.calculateLevel(250);
        const lvl5 = gamificationService.calculateLevel(600);

        if (
            lvl1.level !== 1 || lvl1.title !== "Eco Beginner" ||
            lvl2.level !== 2 || lvl2.title !== "Eco Fighter" ||
            lvl3.level !== 3 || lvl3.title !== "Eco Champion" ||
            lvl4.level !== 4 || lvl4.title !== "Earth Guardian" ||
            lvl5.level !== 5 || lvl5.title !== "Planet Hero"
        ) {
            throw new Error("Kalkulasi level tidak sesuai spesifikasi");
        }

        // Test flow update gamification on transaction approval
        const res = await gamificationService.updateUserGamification(
            99, // student id 99
            15.0, // 15 kg -> Level 2
            75.0,
            "Plastik Botol PET"
        );

        if (res.level < 2 || res.title !== "Eco Fighter") {
            throw new Error(`Expected level 2 (Eco Fighter), got Level ${res.level} (${res.title})`);
        }

        console.log(`   Level Berhasil Diperbarui: Level ${res.level} - "${res.title}" (${res.totalWeight} Kg)`);
        console.log("✔ Test 1: PASS\n");
        passCount++;
    } catch (err) {
        console.error("❌ Test 1 FAILED:", err.message);
    }

    // ----------------------------------------------------
    // TEST 2: Siswa Mencapai Badge Requirement -> Badge Muncul
    // ----------------------------------------------------
    console.log("▶ Test 2: Siswa mencapai badge requirement...");
    try {
        // Tambahkan transaksi plastik hingga mencapai > 50kg & total > 100kg
        const updateRes = await gamificationService.updateUserGamification(
            99,
            90.0, // Total sekarang 15 + 90 = 105 kg
            450.0,
            "Plastik PET Daur Ulang"
        );

        // Ambil pencapaian user
        const achievement = await gamificationService.getUserAchievement(99);
        const earnedBadges = achievement.badges.filter(b => b.is_earned);

        const hasFirstDeposit = earnedBadges.some(b => b.name === "First Deposit");
        const hasPlasticHero = earnedBadges.some(b => b.name === "Plastic Hero");
        const hasEcoChampion = earnedBadges.some(b => b.name === "Eco Champion");

        if (!hasFirstDeposit || !hasPlasticHero || !hasEcoChampion) {
            throw new Error("Badge First Deposit, Plastic Hero, atau Eco Champion tidak terdeteksi!");
        }

        console.log(`   Badges diraih oleh Siswa #99: ${earnedBadges.map(b => `${b.icon} ${b.name}`).join(", ")}`);
        console.log(`   Level Saat ini: Level ${achievement.level} - "${achievement.title}" (Total: ${achievement.totalWaste} Kg)`);
        console.log("✔ Test 2: PASS\n");
        passCount++;
    } catch (err) {
        console.error("❌ Test 2 FAILED:", err.message);
    }

    // ----------------------------------------------------
    // TEST 3: Ranking Kompetisi Muncul (GET /api/gamification/competition)
    // ----------------------------------------------------
    console.log("▶ Test 3: Ranking kompetisi muncul...");
    try {
        const res = await makeRequest({
            hostname: "localhost",
            port: 5000,
            path: "/api/gamification/competition",
            method: "GET",
            headers: {
                Authorization: `Bearer ${studentToken}`
            }
        });

        if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) {
            throw new Error(`Invalid response: status ${res.status}, data: ${JSON.stringify(res.data)}`);
        }

        const comp = res.data[0];
        if (!comp.leaderboard || comp.leaderboard.length === 0) {
            throw new Error("Leaderboard kompetisi tidak ditemukan");
        }

        console.log(`   Kompetisi Aktif: "${comp.name}"`);
        console.log("   Leaderboard:");
        comp.leaderboard.slice(0, 3).forEach((item, idx) => {
            console.log(`     ${idx + 1}. ${item.school_name || item.sekolah} - ${item.total_weight} Kg`);
        });

        console.log("✔ Test 3: PASS\n");
        passCount++;
    } catch (err) {
        console.error("❌ Test 3 FAILED:", err.message);
    }

    // ----------------------------------------------------
    // TEST 4: Admin Membuat Kompetisi Baru (POST /api/gamification/competition)
    // ----------------------------------------------------
    console.log("▶ Test 4: Admin membuat kompetisi baru...");
    try {
        const payload = {
            name: "Eco Challenge September",
            start_date: "2026-09-01",
            end_date: "2026-09-30",
            description: "Tantangan daur ulang sampah tingkat sekolah se-Kabupaten Trenggalek",
            competition_type: "school_waste"
        };

        const res = await makeRequest(
            {
                hostname: "localhost",
                port: 5000,
                path: "/api/gamification/competition",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`
                }
            },
            payload
        );

        if (res.status !== 201 || !res.data || !res.data.data) {
            throw new Error(`Gagal membuat kompetisi: status ${res.status}, msg: ${res.data.message || res.data}`);
        }

        console.log(`   Kompetisi Berhasil Dibuat: ID #${res.data.data.id} - "${res.data.data.name}"`);
        console.log(`   Periode: ${res.data.data.start_date} s/d ${res.data.data.end_date}`);
        console.log("✔ Test 4: PASS\n");
        passCount++;
    } catch (err) {
        console.error("❌ Test 4 FAILED:", err.message);
    }

    // ----------------------------------------------------
    // TEST 5: Notification Badge Masuk
    // ----------------------------------------------------
    console.log("▶ Test 5: Notification badge masuk...");
    try {
        const notifs = await getUserNotifications(99);
        const badgeNotif = notifs.find(n => n.title === "Badge Baru Didapat!");

        if (!badgeNotif) {
            throw new Error("Notifikasi dengan judul 'Badge Baru Didapat!' tidak ditemukan di inbox siswa");
        }

        console.log(`   Notifikasi Diterima Siswa #99:`);
        console.log(`   - Title: "${badgeNotif.title}"`);
        console.log(`   - Message:\n${badgeNotif.message.split("\n").map(l => "       " + l).join("\n")}`);
        console.log("✔ Test 5: PASS\n");
        passCount++;
    } catch (err) {
        console.error("❌ Test 5 FAILED:", err.message);
    }

    // ----------------------------------------------------
    // TEST 6: Frontend Build (npm run build)
    // ----------------------------------------------------
    console.log("▶ Test 6: Frontend build (npm run build)...");
    try {
        const path = require("path");
        const frontendDir = path.resolve(__dirname, "../../frontend");
        const buildOutput = execSync("npm run build", {
            cwd: frontendDir,
            encoding: "utf-8"
        });

        if (!buildOutput.includes("built in")) {
            throw new Error("Build output did not report success");
        }

        console.log("   Vite build client environment for production: SUCCESS");
        console.log("✔ Test 6: PASS\n");
        passCount++;
    } catch (err) {
        console.error("❌ Test 6 FAILED:", err.message);
    }

    console.log("=================================================");
    console.log(`HASIL AKHIR TESTING: ${passCount}/6 PASS`);
    console.log("=================================================");

    if (passCount === 6) {
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runTests();
