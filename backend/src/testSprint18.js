const jwt = require("jsonwebtoken");
const http = require("http");

const JWT_SECRET = "tgx_secret_2026";

function requestApi(urlPath, method = "GET", token = null, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (payload) {
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = Buffer.byteLength(payload);
    }

    const req = http.request(
      {
        hostname: "localhost",
        port: 5000,
        path: urlPath,
        method: method,
        headers: headers
      },
      (res) => {
        let chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf8");
          let data = null;
          try {
            data = JSON.parse(raw);
          } catch {
            data = raw;
          }
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      }
    );
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log("==================================================");
  console.log("SPRINT 18: USER MANAGEMENT & ROLE PERMISSION TESTS");
  console.log("==================================================");

  // 1. Test Super Admin Login & Access User Management
  console.log("\n[TEST 1] Login Super Admin -> Access User Management");
  const superAdminToken = jwt.sign(
    { id: 1, name: "Budi Pratama", role: "super_admin", roles: ["super_admin"] },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  const usersRes = await requestApi("/api/users", "GET", superAdminToken);
  console.log("GET /api/users Status:", usersRes.statusCode);
  console.log("Total Users retrieved:", usersRes.body?.users?.length);
  if (usersRes.statusCode !== 200 || !usersRes.body?.users) {
    throw new Error("Test 1 Failed: Super Admin cannot access User Management");
  }
  console.log("-> TEST 1: PASS");

  // 2. Test Admin Karbon -> Try approve transaction -> Expected 403 Forbidden
  console.log("\n[TEST 2] Login Admin Karbon -> Try approve transaction -> Expected 403 Forbidden");
  const adminKarbonToken = jwt.sign(
    { id: 3, name: "Dewi Lestari", role: "admin_karbon", roles: ["admin_karbon"] },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  const verifyRes = await requestApi(
    "/api/waste/verify/1001",
    "PUT",
    adminKarbonToken,
    { status: "approved" }
  );
  console.log("PUT /api/waste/verify/1001 Status:", verifyRes.statusCode);
  console.log("Response Message:", verifyRes.body?.message);
  if (verifyRes.statusCode !== 403) {
    throw new Error(`Test 2 Failed: Expected 403 Forbidden, got ${verifyRes.statusCode}`);
  }
  console.log("-> TEST 2: PASS");

  // 3. Test Operator Sekolah -> Access school/pending transaction
  console.log("\n[TEST 3] Login Operator Sekolah -> Check Transaction Access");
  const schoolToken = jwt.sign(
    { id: 5, name: "Siti Maryam", role: "operator_sekolah", roles: ["operator_sekolah"], school_id: 1 },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  const schoolTxRes = await requestApi("/api/waste/pending", "GET", schoolToken);
  console.log("GET /api/waste/pending Status:", schoolTxRes.statusCode);
  if (schoolTxRes.statusCode !== 200) {
    throw new Error(`Test 3 Failed: Operator Sekolah should access pending transactions, got ${schoolTxRes.statusCode}`);
  }
  console.log("-> TEST 3: PASS");

  // 4. Test Student -> Can submit waste / view wallet / view ranking, but NOT verify transaction
  console.log("\n[TEST 4] Login Student -> Permission Boundaries");
  const studentToken = jwt.sign(
    { id: 7, name: "Ahmad Santoso", role: "siswa", roles: ["siswa"] },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  const studentVerifyAttempt = await requestApi(
    "/api/waste/verify/1001",
    "PUT",
    studentToken,
    { status: "approved" }
  );
  console.log("Student PUT /api/waste/verify Status (Expected 403):", studentVerifyAttempt.statusCode);
  if (studentVerifyAttempt.statusCode !== 403) {
    throw new Error("Test 4 Failed: Student should be blocked from verifying");
  }
  console.log("-> TEST 4: PASS");

  // 5. Test Update Role Endpoint
  console.log("\n[TEST 5] Super Admin updates user role via PUT /api/users/:id/role");
  const updateRoleRes = await requestApi(
    "/api/users/7/role",
    "PUT",
    superAdminToken,
    { role: "admin_operasional" }
  );
  console.log("PUT /api/users/7/role Status:", updateRoleRes.statusCode);
  console.log("Updated Role Message:", updateRoleRes.body?.message);
  if (updateRoleRes.statusCode !== 200) {
    throw new Error("Test 5 Failed: Could not update user role");
  }
  console.log("-> TEST 5: PASS");

  // 6. Test JWT Backward Compatibility
  console.log("\n[TEST 6] JWT Token Backward Compatibility (Legacy format)");
  const legacyToken = jwt.sign(
    { id: 1, role: "admin" },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  const legacyRes = await requestApi("/api/users", "GET", legacyToken);
  console.log("Legacy Admin GET /api/users Status:", legacyRes.statusCode);
  if (legacyRes.statusCode !== 200) {
    throw new Error("Test 6 Failed: Legacy admin token format rejected");
  }
  console.log("-> TEST 6: PASS");

  console.log("\n>>> ALL SPRINT 18 BACKEND TESTS COMPLETED SUCCESSFULLY! <<<");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
