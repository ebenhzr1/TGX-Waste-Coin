const jwt = require("jsonwebtoken");
const http = require("http");
const path = require("path");
const { execSync } = require("child_process");
const csrService = require("./services/csrService");

const JWT_SECRET = process.env.JWT_SECRET || "tgx_secret_2026";

// Tokens
const adminCsrToken = jwt.sign(
    { id: 22, name: "Admin CSR JET", role: "admin_csr" },
    JWT_SECRET,
    { expiresIn: "1h" }
);

const superAdminToken = jwt.sign(
    { id: 1, name: "Super Admin JET", role: "super_admin" },
    JWT_SECRET,
    { expiresIn: "1h" }
);

const studentToken = jwt.sign(
    { id: 99, name: "Budi Siswa", role: "siswa", school_id: 1 },
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

async function runSprint22Tests() {
    console.log("=================================================");
    console.log("TESTING SPRINT 22: CORPORATE CSR & IMPACT PARTNERSHIP");
    console.log("=================================================\n");

    let passCount = 0;

    // ----------------------------------------------------
    // TEST 1: Create Corporate Partner
    // ----------------------------------------------------
    console.log("▶ Test 1: Create corporate partner...");
    let createdPartnerId = null;
    try {
        const payload = {
            company_name: "PT Mitra Lingkungan Lestari",
            industry: "Energi & Manufaktur",
            contact_person: "Dewi Sartika",
            email: "csr@mitralestari.com",
            phone: "081298765432",
            address: "Trenggalek, Jawa Timur"
        };

        const res = await makeRequest(
            {
                hostname: "localhost",
                port: 5000,
                path: "/api/csr/partners",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminCsrToken}`
                }
            },
            payload
        );

        if (res.status !== 201 || !res.data || !res.data.partner) {
            throw new Error(`Gagal membuat partner: status ${res.status}, msg: ${JSON.stringify(res.data)}`);
        }

        createdPartnerId = res.data.partner.id;
        console.log(`   Mitra Berhasil Didaftarkan: #${res.data.partner.id} - "${res.data.partner.company_name}"`);
        console.log(`   Sektor: ${res.data.partner.industry}, Kontak: ${res.data.partner.contact_person}`);
        console.log("✔ Test 1: PASS\n");
        passCount++;
    } catch (err) {
        console.error("❌ Test 1 FAILED:", err.message);
    }

    // ----------------------------------------------------
    // TEST 2: Create CSR Campaign
    // ----------------------------------------------------
    console.log("▶ Test 2: Create CSR campaign...");
    let createdCampaignId = null;
    try {
        const payload = {
            partner_id: createdPartnerId || 1,
            campaign_name: "Gerakan Adiwiyata Bersih 2026",
            description: "Program CSR pengelolaan sampah terpilah dan sponsorship reward untuk sekolah",
            target_waste_kg: 10000,
            target_co2: 20,
            reward_budget: 50000000,
            start_date: "2026-09-01",
            end_date: "2026-12-31"
        };

        const res = await makeRequest(
            {
                hostname: "localhost",
                port: 5000,
                path: "/api/csr/campaigns",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminCsrToken}`
                }
            },
            payload
        );

        if (res.status !== 201 || !res.data || !res.data.campaign) {
            throw new Error(`Gagal membuat campaign: status ${res.status}, msg: ${JSON.stringify(res.data)}`);
        }

        createdCampaignId = res.data.campaign.id;
        console.log(`   Campaign Berhasil Dibuat: #${res.data.campaign.id} - "${res.data.campaign.campaign_name}"`);
        console.log(`   Target Sampah: ${res.data.campaign.target_waste_kg} Kg, Target Emisi: ${res.data.campaign.target_co2} tCO2e`);

        // Periksa notifikasi CSR Campaign Created via endpoint /api/notification
        const notifsRes = await makeRequest({
            hostname: "localhost",
            port: 5000,
            path: "/api/notification",
            method: "GET",
            headers: {
                Authorization: `Bearer ${superAdminToken}`
            }
        });

        const notifs = Array.isArray(notifsRes.data) ? notifsRes.data : [];
        const campNotif = notifs.find(n => n.title === "CSR Campaign Created");
        if (!campNotif) {
            throw new Error("Notifikasi 'CSR Campaign Created' tidak ditemukan di inbox admin");
        }

        console.log(`   Notifikasi Terkonfirmasi: Title="${campNotif.title}", Message="${campNotif.message.split("\n")[0]}"`);
        console.log("✔ Test 2: PASS\n");
        passCount++;
    } catch (err) {
        console.error("❌ Test 2 FAILED:", err.message);
    }

    // ----------------------------------------------------
    // TEST 3: Calculate Campaign Impact
    // ----------------------------------------------------
    console.log("▶ Test 3: Calculate campaign impact...");
    try {
        const res = await makeRequest({
            hostname: "localhost",
            port: 5000,
            path: `/api/csr/campaigns/${createdCampaignId || 1}/impact`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${adminCsrToken}`
            }
        });

        if (res.status !== 200 || !res.data) {
            throw new Error(`Gagal calculate impact: status ${res.status}, msg: ${JSON.stringify(res.data)}`);
        }

        const impact = res.data;
        if (
            typeof impact.totalWasteKg !== "number" ||
            typeof impact.co2Impact !== "number" ||
            typeof impact.students !== "number" ||
            typeof impact.schools !== "number"
        ) {
            throw new Error("Format return calculateCampaignImpact tidak sesuai spesifikasi!");
        }

        console.log(`   Kalkulasi Dampak Nyata Program CSR:`);
        console.log(`   - Total Waste: ${impact.totalWasteKg} Kg (${(impact.totalWasteKg / 1000).toFixed(1)} Ton)`);
        console.log(`   - CO2 Impact: ${impact.co2Impact} tCO2e`);
        console.log(`   - Student Beneficiaries: ${impact.students} Pelajar`);
        console.log(`   - School Beneficiaries: ${impact.schools} Sekolah Adiwiyata`);
        console.log("✔ Test 3: PASS\n");
        passCount++;
    } catch (err) {
        console.error("❌ Test 3 FAILED:", err.message);
    }

    // ----------------------------------------------------
    // TEST 4: Connect Waste Data
    // ----------------------------------------------------
    console.log("▶ Test 4: Connect waste data...");
    try {
        const impactData = await csrService.calculateCampaignImpact(createdCampaignId || 1);

        if (impactData.totalWasteKg <= 0 || impactData.co2Impact <= 0) {
            throw new Error("Data setoran sampah dan estimasi emisi tidak terhubung!");
        }

        // Verifikasi korelasi emisi: 10.000 kg * 2.0 kgCO2e/kg = 20.000 kgCO2e = 20 tCO2e
        const expectedCO2 = (impactData.totalWasteKg * 2.0) / 1000.0;
        if (Math.abs(impactData.co2Impact - expectedCO2) > 1.0) {
            throw new Error(`Inkonsistensi konversi sampah ke dampak karbon: got ${impactData.co2Impact}, expected ${expectedCO2}`);
        }

        console.log("   Terhubung Langsung ke Rantai Transaksi Setoran Sampah Siswa");
        console.log(`   ${impactData.totalWasteKg} Kg Sampah Terpilah Terhubung ke ${impactData.co2Impact} tCO2e Mitigasi Karbon`);
        console.log("✔ Test 4: PASS\n");
        passCount++;
    } catch (err) {
        console.error("❌ Test 4 FAILED:", err.message);
    }

    // ----------------------------------------------------
    // TEST 5: Generate CSR Impact Report
    // ----------------------------------------------------
    console.log("▶ Test 5: Generate CSR impact report...");
    try {
        const res = await makeRequest({
            hostname: "localhost",
            port: 5000,
            path: `/api/csr/report/${createdCampaignId || 1}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${adminCsrToken}`
            }
        });

        if (res.status !== 200 || !res.data) {
            throw new Error(`Gagal generate CSR report: status ${res.status}`);
        }

        const report = res.data;
        if (!report.environmental || !report.social || !report.economic || !report.governance) {
            throw new Error("Laporan CSR tidak mencakup 4 pilar lengkap (Environmental, Social, Economic, Governance)");
        }

        console.log(`   Laporan Berhasil Diterbitkan: "${report.report_id}"`);
        console.log(`   - Environmental: Waste Reduction=${report.environmental.wasteReductionTon} Ton, CO2 Avoided=${report.environmental.co2AvoidedTCO2e} tCO2e`);
        console.log(`   - Social: ${report.social.schoolsInvolved} Sekolah, ${report.social.studentsBenefited} Siswa`);
        console.log(`   - Economic: Rp ${report.economic.rewardBudgetIDR.toLocaleString('id-ID')} Budget (${report.economic.rewardDistributedCoin.toLocaleString('id-ID')} TGX Coin)`);
        console.log(`   - Governance: Audit Trail Hash="${report.governance.digitalAuditTrail}"`);
        console.log(`   - Carbon Integration: Proyek="${report.carbonIntegration.projectLinked}", Impact="${report.carbonIntegration.potentialCarbonImpact}"`);
        console.log("✔ Test 5: PASS\n");
        passCount++;
    } catch (err) {
        console.error("❌ Test 5 FAILED:", err.message);
    }

    // ----------------------------------------------------
    // TEST 6: Permission Testing (Student: Denied, Admin CSR: Allowed)
    // ----------------------------------------------------
    console.log("▶ Test 6: Permission testing (Student: Denied, Admin CSR: Allowed)...");
    try {
        // 1. Student mencoba create partner -> Ditolak (403 Forbidden)
        const studentPartnerRes = await makeRequest(
            {
                hostname: "localhost",
                port: 5000,
                path: "/api/csr/partners",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${studentToken}`
                }
            },
            { company_name: "Illegal Partner" }
        );

        if (studentPartnerRes.status !== 403) {
            throw new Error(`Expected student request to be rejected with 403, got ${studentPartnerRes.status}`);
        }

        // 2. Student mencoba create campaign -> Ditolak (403 Forbidden)
        const studentCampaignRes = await makeRequest(
            {
                hostname: "localhost",
                port: 5000,
                path: "/api/csr/campaigns",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${studentToken}`
                }
            },
            { campaign_name: "Illegal Campaign" }
        );

        if (studentCampaignRes.status !== 403) {
            throw new Error(`Expected student campaign creation to be rejected with 403, got ${studentCampaignRes.status}`);
        }

        // 3. Admin CSR membuat campaign -> Diizinkan (201 Created)
        const adminCampaignRes = await makeRequest(
            {
                hostname: "localhost",
                port: 5000,
                path: "/api/csr/campaigns",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminCsrToken}`
                }
            },
            {
                partner_id: 1,
                campaign_name: "Kampanye Binaan CSR Berkelanjutan",
                target_waste_kg: 5000,
                target_co2: 10,
                reward_budget: 25000000
            }
        );

        if (adminCampaignRes.status !== 201) {
            throw new Error(`Expected admin_csr to be allowed with 201, got ${adminCampaignRes.status}`);
        }

        console.log("   Student Request (Create Partner): 403 Forbidden (DITOLAK - Sesuai Aturan)");
        console.log("   Student Request (Create Campaign): 403 Forbidden (DITOLAK - Sesuai Aturan)");
        console.log("   Admin CSR Request (Create Campaign): 201 Created (DIIZINKAN - Sesuai Aturan)");
        console.log("✔ Test 6: PASS\n");
        passCount++;
    } catch (err) {
        console.error("❌ Test 6 FAILED:", err.message);
    }

    // ----------------------------------------------------
    // TEST 7: Frontend Build (npm run build)
    // ----------------------------------------------------
    console.log("▶ Test 7: Frontend build (npm run build)...");
    try {
        const frontendDir = path.resolve(__dirname, "../../frontend");
        const buildOutput = execSync("npm run build", {
            cwd: frontendDir,
            encoding: "utf-8"
        });

        if (!buildOutput.includes("built in")) {
            throw new Error("Build output did not report success");
        }

        console.log("   Vite build client environment for production: SUCCESS");
        console.log("✔ Test 7: PASS\n");
        passCount++;
    } catch (err) {
        console.error("❌ Test 7 FAILED:", err.message);
    }

    console.log("=================================================");
    console.log(`HASIL AKHIR TESTING SPRINT 22: ${passCount}/7 PASS`);
    console.log("=================================================");

    if (passCount === 7) {
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runSprint22Tests();
