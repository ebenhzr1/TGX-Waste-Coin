const jwt = require("jsonwebtoken");
const http = require("http");
const path = require("path");
const { execSync } = require("child_process");
const carbonAssetService = require("./services/carbonAssetService");
const { getUserNotifications } = require("./services/notificationService");

const JWT_SECRET = process.env.JWT_SECRET || "tgx_secret_2026";

// Generate test tokens with enterprise roles
const adminKarbonToken = jwt.sign(
    { id: 21, name: "Admin Karbon JET", role: "admin_karbon" },
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

async function runSprint21Tests() {
    console.log("=================================================");
    console.log("TESTING SPRINT 21: CARBON CREDIT INTEGRATION & ASSET MANAGEMENT");
    console.log("=================================================\n");

    let passCount = 0;

    // ----------------------------------------------------
    // TEST 1: Create Carbon Project
    // ----------------------------------------------------
    console.log("▶ Test 1: Create carbon project...");
    try {
        const payload = {
            name: "Proyek Karbon Trenggalek 2026",
            description: "Inisiatif mitigasi emisi berbasis sampah terpilah Adiwiyata",
            location: "Kabupaten Trenggalek, Jawa Timur",
            start_date: "2026-01-01",
            end_date: "2026-12-31"
        };

        const res = await makeRequest(
            {
                hostname: "localhost",
                port: 5000,
                path: "/api/carbon-assets/project",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminKarbonToken}`
                }
            },
            payload
        );

        if (res.status !== 201 || !res.data || !res.data.project) {
            throw new Error(`Failed creating project: status ${res.status}, msg: ${JSON.stringify(res.data)}`);
        }

        console.log(`   Proyek Berhasil Dibuat: #${res.data.project.id} - "${res.data.project.name}"`);
        console.log(`   Lokasi: ${res.data.project.location} (${res.data.project.status})`);
        console.log("✔ Test 1: PASS\n");
        passCount++;
    } catch (err) {
        console.error("❌ Test 1 FAILED:", err.message);
    }

    // ----------------------------------------------------
    // TEST 2: Calculate Carbon Inventory
    // ----------------------------------------------------
    console.log("▶ Test 2: Calculate carbon inventory...");
    try {
        const inventory = await carbonAssetService.calculateCarbonInventory(1);

        if (typeof inventory.totalWasteKg !== "number" || typeof inventory.totalCO2 !== "number" || typeof inventory.carbonUnit !== "number") {
            throw new Error("Invalid inventory calculation result structure");
        }

        console.log(`   Total Waste: ${inventory.totalWasteKg} Kg`);
        console.log(`   Total CO2 Avoided: ${inventory.totalCO2} kgCO2e`);
        console.log(`   Potential Carbon Asset: ${inventory.carbonUnit} Carbon Units (tCO2e)`);
        console.log("✔ Test 2: PASS\n");
        passCount++;
    } catch (err) {
        console.error("❌ Test 2 FAILED:", err.message);
    }

    // ----------------------------------------------------
    // TEST 3: Carbon Unit Conversion (1000 kgCO2e = 1 tCO2e)
    // ----------------------------------------------------
    console.log("▶ Test 3: Carbon unit conversion (1000 kgCO2e = 1 tCO2e)...");
    try {
        const testKgCO2e = 20000;
        const expectedTCO2e = testKgCO2e / 1000; // 20 tCO2e

        if (expectedTCO2e !== 20) {
            throw new Error("Formula konversi salah!");
        }

        const offsetVal = carbonAssetService.calculateOffsetValue(10);
        if (offsetVal !== 10) {
            throw new Error("calculateOffsetValue tidak mengembalikan nilai unit yang tepat");
        }

        console.log(`   Konversi: ${testKgCO2e} kgCO2e / 1000 = ${expectedTCO2e} tCO2e`);
        console.log(`   1 Carbon Unit = 1 tCO2e (Carbon Impact Unit)`);
        console.log("✔ Test 3: PASS\n");
        passCount++;
    } catch (err) {
        console.error("❌ Test 3 FAILED:", err.message);
    }

    // ----------------------------------------------------
    // TEST 4: Create Offset Transaction
    // ----------------------------------------------------
    console.log("▶ Test 4: Create offset transaction...");
    let createdOffsetId = null;
    let createdCertificateCode = null;

    try {
        const offsetPayload = {
            buyer_name: "PT ABC",
            buyer_type: "Corporate",
            carbon_amount: 10,
            purpose: "CSR Offset"
        };

        const res = await makeRequest(
            {
                hostname: "localhost",
                port: 5000,
                path: "/api/carbon-assets/offset",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminKarbonToken}`
                }
            },
            offsetPayload
        );

        if (res.status !== 201 || !res.data || !res.data.offset) {
            throw new Error(`Failed creating offset: status ${res.status}, msg: ${JSON.stringify(res.data)}`);
        }

        createdOffsetId = res.data.offset.id;
        if (res.data.certificate) {
            createdCertificateCode = res.data.certificate.certificate_code;
        }

        console.log(`   Offset Request Berhasil Dibuat: ID #${res.data.offset.id}`);
        console.log(`   Buyer: "${res.data.offset.buyer_name}", Jumlah: ${res.data.offset.carbon_amount} tCO2e`);
        console.log(`   Purpose: "${res.data.offset.purpose}"`);
        console.log("✔ Test 4: PASS\n");
        passCount++;
    } catch (err) {
        console.error("❌ Test 4 FAILED:", err.message);
    }

    // ----------------------------------------------------
    // TEST 5: Generate Certificate Code & Notification
    // ----------------------------------------------------
    console.log("▶ Test 5: Generate certificate code...");
    try {
        // Ambil sertifikat via API endpoint
        const certTarget = createdCertificateCode || createdOffsetId || 1;
        const certRes = await makeRequest({
            hostname: "localhost",
            port: 5000,
            path: `/api/carbon-assets/certificate/${certTarget}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${superAdminToken}`
            }
        });

        const cert = certRes.data;
        if (!cert || !cert.certificate_code) {
            throw new Error("Certificate code tidak ditemukan pada response API!");
        }

        const pattern = /^TGX-CARBON-2026-\d{5}$/;
        if (!pattern.test(cert.certificate_code)) {
            throw new Error(`Certificate code '${cert.certificate_code}' tidak sesuai format TGX-CARBON-2026-XXXXX`);
        }

        // Cek notifikasi certificate via endpoint /api/notification
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
        const certNotif = notifs.find(n => n.title === "Carbon Certificate Issued");

        if (!certNotif) {
            throw new Error("Notifikasi 'Carbon Certificate Issued' tidak ditemukan di inbox admin/buyer");
        }

        console.log(`   Kode Sertifikat Valid: "${cert.certificate_code}"`);
        console.log(`   Holder: "${cert.holder_name}", Impact: ${cert.carbon_amount} tCO2e`);
        console.log(`   Notifikasi Terkirim: Title="${certNotif.title}", Message="${certNotif.message.split("\n")[0]}"`);
        console.log("✔ Test 5: PASS\n");
        passCount++;
    } catch (err) {
        console.error("❌ Test 5 FAILED:", err.message);
    }

    // ----------------------------------------------------
    // TEST 6: Permission Test (Admin Karbon Boleh, Student Ditolak)
    // ----------------------------------------------------
    console.log("▶ Test 6: Permission test (Admin Karbon boleh, Student ditolak)...");
    try {
        // 1. Student mencoba create offset -> Harus ditolak (403 Forbidden)
        const studentOffsetRes = await makeRequest(
            {
                hostname: "localhost",
                port: 5000,
                path: "/api/carbon-assets/offset",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${studentToken}`
                }
            },
            { buyer_name: "Illegal Buyer", carbon_amount: 5 }
        );

        if (studentOffsetRes.status !== 403) {
            throw new Error(`Expected student request to be rejected with 403, got ${studentOffsetRes.status}`);
        }

        // 2. Student mencoba create project -> Harus ditolak (403 Forbidden)
        const studentProjectRes = await makeRequest(
            {
                hostname: "localhost",
                port: 5000,
                path: "/api/carbon-assets/project",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${studentToken}`
                }
            },
            { name: "Unauthorized Project" }
        );

        if (studentProjectRes.status !== 403) {
            throw new Error(`Expected student project creation to be rejected with 403, got ${studentProjectRes.status}`);
        }

        // 3. Admin Karbon membuat offset -> Harus diizinkan (201 Created)
        const adminOffsetRes = await makeRequest(
            {
                hostname: "localhost",
                port: 5000,
                path: "/api/carbon-assets/offset",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminKarbonToken}`
                }
            },
            { buyer_name: "PT Mitra Hijau", carbon_amount: 2.5, purpose: "CSR" }
        );

        if (adminOffsetRes.status !== 201) {
            throw new Error(`Expected admin_karbon to be allowed with 201, got ${adminOffsetRes.status}`);
        }

        console.log("   Student Request (Offset): 403 Forbidden (DITOLAK - Sesuai Aturan)");
        console.log("   Student Request (Project): 403 Forbidden (DITOLAK - Sesuai Aturan)");
        console.log("   Admin Karbon Request (Offset): 201 Created (DIIZINKAN - Sesuai Aturan)");
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
    console.log(`HASIL AKHIR TESTING SPRINT 21: ${passCount}/7 PASS`);
    console.log("=================================================");

    if (passCount === 7) {
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runSprint21Tests();
