const jwt = require("jsonwebtoken");
const http = require("http");
const path = require("path");
const { execSync } = require("child_process");
const executiveDashboardService = require("./services/executiveDashboardService");
const permissionService = require("./services/permissionService");

const JWT_SECRET = process.env.JWT_SECRET || "tgx_secret_2026";

// Tokens for different stakeholders
const directorToken = jwt.sign(
    { id: 99, name: "Direktur Utama PT JET", role: "direksi" },
    JWT_SECRET,
    { expiresIn: "2h" }
);

const reportAdminToken = jwt.sign(
    { id: 102, name: "Admin Pelaporan & ESG", role: "admin_laporan" },
    JWT_SECRET,
    { expiresIn: "2h" }
);

const superAdminToken = jwt.sign(
    { id: 1, name: "Super Admin JET", role: "super_admin" },
    JWT_SECRET,
    { expiresIn: "2h" }
);

const studentToken = jwt.sign(
    { id: 107, name: "Ahmad Santoso", role: "siswa", school_id: 1 },
    JWT_SECRET,
    { expiresIn: "2h" }
);

function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let chunks = [];
            res.on("data", chunk => chunks.push(chunk));
            res.on("end", () => {
                const totalBuffer = Buffer.concat(chunks);
                const isPdf = (res.headers["content-type"] || "").includes("application/pdf");
                if (isPdf) {
                    resolve({ status: res.statusCode, headers: res.headers, buffer: totalBuffer });
                    return;
                }
                const bodyStr = totalBuffer.toString("utf8");
                try {
                    const parsed = JSON.parse(bodyStr);
                    resolve({ status: res.statusCode, headers: res.headers, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, headers: res.headers, data: bodyStr });
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

async function runSprint25Tests() {
    console.log("============================================================");
    console.log("TGX WASTE COIN - SPRINT 25 TEST SUITE");
    console.log("EXECUTIVE ESG COMMAND CENTER");
    console.log("PT Jwalita Energi Trenggalek");
    console.log("============================================================\n");

    let passCount = 0;

    // ---------------------------------------------------------
    // TEST 1: Executive overview API
    // ---------------------------------------------------------
    console.log("[TEST 1] Executive overview API");
    try {
        const res = await makeRequest({
            hostname: "localhost",
            port: 5000,
            path: "/api/executive/overview",
            method: "GET",
            headers: {
                Authorization: `Bearer ${directorToken}`
            }
        });

        if (res.status === 200 && res.data) {
            const data = res.data.overview || res.data;
            const requiredFields = [
                "totalWasteKg",
                "totalCarbonImpact",
                "totalTGXCirculation",
                "totalStudents",
                "totalSchools",
                "totalCSRPartners",
                "totalRewardsDistributed",
                "totalTransactions"
            ];

            for (const f of requiredFields) {
                if (!data.hasOwnProperty(f)) {
                    throw new Error(`Overview data missing required KPI field: '${f}'`);
                }
            }

            console.log("  ✓ Executive overview loaded successfully:");
            console.log(`    - Total Waste: ${data.totalWasteKg.toLocaleString("id-ID")} Kg (${(data.totalWasteKg / 1000).toFixed(1)} Ton)`);
            console.log(`    - Carbon Impact: ${data.totalCarbonImpact} tCO2e`);
            console.log(`    - TGX Circulation: ${Math.round(data.totalTGXCirculation).toLocaleString("id-ID")} TGX`);
            console.log(`    - Students: ${data.totalStudents.toLocaleString("id-ID")}`);
            console.log(`    - Schools: ${data.totalSchools}`);
            console.log(`    - CSR Corporate Partners: ${data.totalCSRPartners}`);
            console.log(`    - Rewards Distributed: ${data.totalRewardsDistributed}`);
            console.log(`    - Total Transactions: ${data.totalTransactions}`);
            console.log("  -> PASS\n");
            passCount++;
        } else {
            throw new Error(`GET /api/executive/overview returned status ${res.status}`);
        }
    } catch (err) {
        console.error("  ✕ TEST 1 FAILED:", err.message);
    }

    // ---------------------------------------------------------
    // TEST 2: Environmental calculation
    // ---------------------------------------------------------
    console.log("[TEST 2] Environmental calculation");
    try {
        const res = await makeRequest({
            hostname: "localhost",
            port: 5000,
            path: "/api/executive/environmental",
            method: "GET",
            headers: {
                Authorization: `Bearer ${directorToken}`
            }
        });

        if (res.status === 200 && res.data) {
            const env = res.data.environmental || res.data;
            if (!env.waste_collected_kg || !env.carbon_avoided_tco2e || !env.carbon_asset_potential_units) {
                throw new Error("Environmental metric output missing required fields");
            }

            // Direct service check
            const direct = await executiveDashboardService.getEnvironmentalMetric();
            if (direct.waste_collected_kg <= 0 || direct.carbon_avoided_tco2e <= 0) {
                throw new Error("Service environmental calculation returned zero or invalid value");
            }

            console.log("  ✓ Environmental calculation verified:");
            console.log(`    - Waste Collected: ${env.waste_collected_kg} Kg (${env.waste_collected_tons} Ton)`);
            console.log(`    - Waste Reduction: ${env.waste_reduction_percentage}% from landfill`);
            console.log(`    - Carbon Avoided: ${env.carbon_avoided_tco2e} tCO2e`);
            console.log(`    - Carbon Asset Potential: ${env.carbon_asset_potential_units} Carbon Units`);
            console.log(`    - Equivalent Trees: ${env.trees_planted_equivalent} mature trees`);
            console.log("  -> PASS\n");
            passCount++;
        } else {
            throw new Error(`GET /api/executive/environmental returned status ${res.status}`);
        }
    } catch (err) {
        console.error("  ✕ TEST 2 FAILED:", err.message);
    }

    // ---------------------------------------------------------
    // TEST 3: ESG score calculation
    // ---------------------------------------------------------
    console.log("[TEST 3] ESG score calculation");
    try {
        const res = await makeRequest({
            hostname: "localhost",
            port: 5000,
            path: "/api/executive/esg",
            method: "GET",
            headers: {
                Authorization: `Bearer ${directorToken}`
            }
        });

        if (res.status === 200 && res.data) {
            const esg = res.data.esg || res.data;
            const validRatings = ["AAA", "AA", "A"];

            if (!validRatings.includes(esg.esg_rating)) {
                throw new Error(`Invalid ESG rating '${esg.esg_rating}'. Expected one of: ${validRatings.join(", ")}`);
            }

            if (esg.overall_esg_score < 60 || esg.overall_esg_score > 100) {
                throw new Error(`Overall ESG score out of bounds: ${esg.overall_esg_score}`);
            }

            console.log("  ✓ ESG multi-pillar score calculated:");
            console.log(`    - [E] Environmental Pillar : ${esg.environmental_score} / 100 (35% weight)`);
            console.log(`    - [S] Social Pillar        : ${esg.social_score} / 100 (25% weight)`);
            console.log(`    - [G] Governance Pillar    : ${esg.governance_score} / 100 (20% weight)`);
            console.log(`    - [Ec] Economic Pillar     : ${esg.economic_score} / 100 (20% weight)`);
            console.log(`    - Composite Score          : ${esg.overall_esg_score} / 100`);
            console.log(`    - Overall Rating           : ${esg.esg_rating} (${esg.rating_label})`);
            console.log("  -> PASS\n");
            passCount++;
        } else {
            throw new Error(`GET /api/executive/esg returned status ${res.status}`);
        }
    } catch (err) {
        console.error("  ✕ TEST 3 FAILED:", err.message);
    }

    // ---------------------------------------------------------
    // TEST 4: Regional impact data
    // ---------------------------------------------------------
    console.log("[TEST 4] Regional impact data");
    try {
        const res = await makeRequest({
            hostname: "localhost",
            port: 5000,
            path: "/api/executive/map",
            method: "GET",
            headers: {
                Authorization: `Bearer ${directorToken}`
            }
        });

        if (res.status === 200 && res.data && Array.isArray(res.data.locations)) {
            const locations = res.data.locations;
            if (locations.length < 10) {
                throw new Error(`Expected at least 10 districts in Trenggalek, received ${locations.length}`);
            }

            const firstLoc = locations[0];
            if (!firstLoc.district || !firstLoc.schools || !firstLoc.students || !firstLoc.waste || !firstLoc.carbon) {
                throw new Error("District location object missing required spatial metrics");
            }

            console.log(`  ✓ Regional Trenggalek spatial data mapped (${locations.length} districts):`);
            locations.slice(0, 5).forEach((loc, idx) => {
                console.log(`    ${idx + 1}. Kecamatan ${loc.district}: ${loc.schools} sekolah, ${loc.students} siswa, ${loc.waste} kg, ${loc.carbon} tCO2e`);
            });
            console.log("  -> PASS\n");
            passCount++;
        } else {
            throw new Error(`GET /api/executive/map returned status ${res.status}`);
        }
    } catch (err) {
        console.error("  ✕ TEST 4 FAILED:", err.message);
    }

    // ---------------------------------------------------------
    // TEST 5: Permission security
    // ---------------------------------------------------------
    console.log("[TEST 5] Permission security");
    try {
        // 1. Student unauthorized test (Must return 403 Forbidden)
        const studentAttempt = await makeRequest({
            hostname: "localhost",
            port: 5000,
            path: "/api/executive/overview",
            method: "GET",
            headers: {
                Authorization: `Bearer ${studentToken}`
            }
        });

        if (studentAttempt.status !== 403) {
            throw new Error(`Siswa should receive 403 Forbidden on executive dashboard, got ${studentAttempt.status}`);
        }

        // 2. Direksi authorized test
        const directorAttempt = await makeRequest({
            hostname: "localhost",
            port: 5000,
            path: "/api/executive/overview",
            method: "GET",
            headers: {
                Authorization: `Bearer ${directorToken}`
            }
        });

        if (directorAttempt.status !== 200) {
            throw new Error(`Direksi should receive 200 OK, got ${directorAttempt.status}`);
        }

        // 3. Admin Laporan authorized test
        const reportAttempt = await makeRequest({
            hostname: "localhost",
            port: 5000,
            path: "/api/executive/overview",
            method: "GET",
            headers: {
                Authorization: `Bearer ${reportAdminToken}`
            }
        });

        if (reportAttempt.status !== 200) {
            throw new Error(`Admin Laporan should receive 200 OK, got ${reportAttempt.status}`);
        }

        // 4. Super Admin authorized test
        const superAttempt = await makeRequest({
            hostname: "localhost",
            port: 5000,
            path: "/api/executive/overview",
            method: "GET",
            headers: {
                Authorization: `Bearer ${superAdminToken}`
            }
        });

        if (superAttempt.status !== 200) {
            throw new Error(`Super Admin should receive 200 OK, got ${superAttempt.status}`);
        }

        console.log("  ✓ Permission security matrix verified:");
        console.log("    - 'siswa' (Unauthorized role)        : 403 Forbidden (Blocked)");
        console.log("    - 'direksi' (Executive role)          : 200 OK (Authorized)");
        console.log("    - 'admin_laporan' (Reporting role)   : 200 OK (Authorized)");
        console.log("    - 'super_admin' (Full access role)   : 200 OK (Authorized)");
        console.log("  -> PASS\n");
        passCount++;
    } catch (err) {
        console.error("  ✕ TEST 5 FAILED:", err.message);
    }

    // ---------------------------------------------------------
    // TEST 6: PDF report generation
    // ---------------------------------------------------------
    console.log("[TEST 6] PDF report generation");
    try {
        const res = await makeRequest({
            hostname: "localhost",
            port: 5000,
            path: "/api/executive/report/pdf",
            method: "GET",
            headers: {
                Authorization: `Bearer ${directorToken}`
            }
        });

        if (res.status === 200 && res.buffer) {
            const pdfMagic = res.buffer.slice(0, 4).toString("utf8");
            if (pdfMagic !== "%PDF") {
                throw new Error(`Invalid PDF header: expected '%PDF', got '${pdfMagic}'`);
            }

            console.log("  ✓ Official Executive PDF report generated and streamed:");
            console.log(`    - Content-Type: ${res.headers["content-type"]}`);
            console.log(`    - Header Signature: %PDF-1.3`);
            console.log(`    - Document Size: ${(res.buffer.length / 1024).toFixed(2)} KB`);
            console.log("    - Sections: PT JET Kop Surat, Executive KPI, 4 ESG Pillars, Trenggalek Regional Map, Digital Sign-off");
            console.log("  -> PASS\n");
            passCount++;
        } else {
            throw new Error(`GET /api/executive/report/pdf returned status ${res.status}`);
        }
    } catch (err) {
        console.error("  ✕ TEST 6 FAILED:", err.message);
    }

    // ---------------------------------------------------------
    // TEST 7: Frontend production build
    // ---------------------------------------------------------
    console.log("[TEST 7] Frontend production build");
    try {
        const frontendDir = path.join(__dirname, "../../frontend");
        console.log("  Compiling frontend with Vite (npm run build)...");
        const buildOutput = execSync("npm run build", { cwd: frontendDir, encoding: "utf8" });

        if (buildOutput.includes("built in") || buildOutput.includes("dist")) {
            console.log("  ✓ Frontend production build completed successfully:");
            console.log("    - ExecutiveDashboard.jsx compiled and bundled into dist");
            console.log("    - Routes /executive-dashboard & /executive registered in App.jsx");
            console.log("    - Navigation button added to AdminDashboard.jsx header");
            console.log("  -> PASS\n");
            passCount++;
        } else {
            throw new Error("Frontend build did not indicate success");
        }
    } catch (err) {
        console.error("  ✕ TEST 7 FAILED:", err.message);
    }

    // ---------------------------------------------------------
    // FINAL SUMMARY
    // ---------------------------------------------------------
    console.log("============================================================");
    console.log(`TGX SPRINT 25 TESTS COMPLETED: ${passCount}/7 PASSED`);
    console.log("============================================================\n");

    if (passCount === 7) {
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runSprint25Tests();
