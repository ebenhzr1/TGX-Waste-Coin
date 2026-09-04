const jwt = require("jsonwebtoken");
const http = require("http");
const marketplaceService = require("./services/marketplaceService");

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
  console.log("SPRINT 19: MARKETPLACE & REWARD SYSTEM TESTS");
  console.log("==================================================");

  // Tokens
  const studentToken = jwt.sign(
    { id: 1, name: "Ahmad Santoso", role: "siswa", roles: ["siswa"], school_id: 1 },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  const adminToken = jwt.sign(
    { id: 2, name: "Budi Santoso", role: "admin_operasional", roles: ["admin_operasional"] },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  const superAdminToken = jwt.sign(
    { id: 9, name: "Director JET", role: "super_admin", roles: ["super_admin"] },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  // 1. Test 1: Login siswa -> GET /api/marketplace/items
  console.log("\n[TEST 1] Login siswa -> GET /api/marketplace/items");
  const itemsRes = await requestApi("/api/marketplace/items", "GET", studentToken);
  console.log("GET /api/marketplace/items Status:", itemsRes.statusCode);
  console.log("Total Items Available:", itemsRes.body?.length);
  if (itemsRes.statusCode !== 200 || !Array.isArray(itemsRes.body) || itemsRes.body.length === 0) {
    throw new Error(`Test 1 Failed: Expected 200 with items list, got ${itemsRes.statusCode}`);
  }
  const targetItem = itemsRes.body[0]; // Bibit Pohon Jwalita For Earth (100 TGX)
  const initialStock = targetItem.stock;
  console.log(`Target Item: '${targetItem.name}', Price: ${targetItem.point_cost} TGX, Stock: ${initialStock}`);
  console.log("-> TEST 1: PASS");

  // 2. Test 2: Redeem reward -> POST /api/marketplace/redeem/:id
  console.log("\n[TEST 2] Redeem reward -> POST /api/marketplace/redeem/:id");
  const redeemRes = await requestApi(
    `/api/marketplace/redeem/${targetItem.id}`,
    "POST",
    studentToken,
    { pickup_point: "Kantor JET Trenggalek" }
  );
  console.log("POST /api/marketplace/redeem Status:", redeemRes.statusCode);
  console.log("Redeem Message:", redeemRes.body?.message);
  if (redeemRes.statusCode !== 201) {
    throw new Error(`Test 2 Failed: Expected 201 Created, got ${redeemRes.statusCode} - ${JSON.stringify(redeemRes.body)}`);
  }
  console.log("-> TEST 2: PASS");

  const redeemData = redeemRes.body?.data;

  // 3. Test 3: Wallet berkurang
  console.log("\n[TEST 3] Wallet berkurang");
  const prevBalance = redeemData.wallet.previous_balance;
  const currBalance = redeemData.wallet.current_balance;
  const coinSpent = redeemData.wallet.coin_spent;
  console.log(`Saldo Awal: ${prevBalance} TGX -> Saldo Akhir: ${currBalance} TGX (Berkurang: ${coinSpent} TGX)`);
  if (currBalance !== prevBalance - coinSpent) {
    throw new Error(`Test 3 Failed: Saldo wallet tidak berkurang secara presisi!`);
  }
  console.log("-> TEST 3: PASS");

  // 4. Test 4: wallet_transactions bertambah (type: 'redeem', amount: negative)
  console.log("\n[TEST 4] wallet_transactions bertambah (type: 'redeem', amount: negative)");
  const tx = redeemData.transaction;
  console.log("Recorded Transaction:", {
    id: tx.id,
    type: tx.transaction_type,
    amount: tx.amount,
    description: tx.description
  });
  if (tx.transaction_type !== "redeem" || parseFloat(tx.amount) >= 0) {
    throw new Error(`Test 4 Failed: Expected transaction_type 'redeem' with negative amount, got ${tx.transaction_type}, amount: ${tx.amount}`);
  }
  console.log("-> TEST 4: PASS");

  // 5. Test 5: Stock reward berkurang
  console.log("\n[TEST 5] Stock reward berkurang");
  const updatedItemsRes = await requestApi("/api/marketplace/items", "GET", studentToken);
  const updatedItem = updatedItemsRes.body.find(i => i.id === targetItem.id);
  console.log(`Stok Awal: ${initialStock} -> Stok Sekarang: ${updatedItem.stock}`);
  if (updatedItem.stock !== initialStock - 1) {
    throw new Error(`Test 5 Failed: Stok tidak berkurang 1!`);
  }
  console.log("-> TEST 5: PASS");

  // 6. Test 6: Claim code terbentuk
  console.log("\n[TEST 6] Claim code terbentuk");
  const claimCode = redeemData.redemption.claim_code;
  console.log("Generated Claim Code:", claimCode);
  if (!claimCode || !claimCode.startsWith("TGX-2026-")) {
    throw new Error(`Test 6 Failed: Claim code tidak sesuai format: ${claimCode}`);
  }
  console.log("-> TEST 6: PASS");

  // 7. Test 7: Notification masuk
  console.log("\n[TEST 7] Notification masuk");
  const notifRes = await requestApi("/api/notification", "GET", studentToken);
  console.log("GET /api/notification Status:", notifRes.statusCode);
  const notifList = Array.isArray(notifRes.body) ? notifRes.body : [];
  const notif = notifList.find(n => n.title && n.title.includes("Reward Berhasil Ditukar"));
  console.log("Found Notification:", notif ? { title: notif.title, message: notif.message.replace(/\n/g, " | ") } : "None");
  if (!notif || !notif.title.includes("Reward Berhasil Ditukar")) {
    throw new Error("Test 7 Failed: Notifikasi penukaran tidak ditemukan!");
  }
  console.log("-> TEST 7: PASS");

  // 8. Test 8: Admin dapat mengelola reward (Orders & Items)
  console.log("\n[TEST 8] Admin dapat mengelola reward");
  // 8a. Admin update status order
  const orderId = redeemData.redemption.id;
  const statusRes = await requestApi(
    `/api/marketplace/orders/${orderId}/status`,
    "PUT",
    adminToken,
    { status: "ready_pickup" }
  );
  console.log("PUT /api/marketplace/orders/:id/status Status:", statusRes.statusCode);
  console.log("Updated Order Message:", statusRes.body?.message);
  if (statusRes.statusCode !== 200) {
    throw new Error(`Test 8 Failed: Admin cannot update order status, got ${statusRes.statusCode}`);
  }

  // 8b. Admin add new item
  const newItemRes = await requestApi(
    "/api/marketplace/items",
    "POST",
    adminToken,
    {
      name: "Kaos Polo Eco Jwalita",
      category: "eco_product",
      point_cost: 350.0,
      stock: 30,
      description: "Kaos polo ramah lingkungan dengan serat bambu organik."
    }
  );
  console.log("POST /api/marketplace/items Status:", newItemRes.statusCode);
  console.log("New Item Created:", newItemRes.body?.data?.name);
  if (newItemRes.statusCode !== 201) {
    throw new Error(`Test 8 Failed: Admin cannot create marketplace item, got ${newItemRes.statusCode}`);
  }
  console.log("-> TEST 8: PASS");

  // 9. Student checks My Rewards
  console.log("\n[TEST 9] Siswa melihat riwayat reward via GET /api/marketplace/my-rewards");
  const myRewardsRes = await requestApi("/api/marketplace/my-rewards", "GET", studentToken);
  console.log("GET /api/marketplace/my-rewards Status:", myRewardsRes.statusCode);
  console.log("Total User Rewards:", myRewardsRes.body?.length);
  if (myRewardsRes.statusCode !== 200 || myRewardsRes.body.length === 0) {
    throw new Error(`Test 9 Failed: Cannot get my-rewards`);
  }
  console.log("-> TEST 9: PASS");

  console.log("\n>>> ALL SPRINT 19 MARKETPLACE & REWARD TESTS PASSED SUCCESSFULLY! <<<\n");
}

runTests().catch((err) => {
  console.error("\nTEST SUITE FAILED:", err.message);
  process.exit(1);
});
