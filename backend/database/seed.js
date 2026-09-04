/**
 * Database Seeder for TGX Waste Coin
 * Seeds default schools, demo users, wallets, and test transactions into Supabase PostgreSQL
 */
const bcrypt = require('bcrypt');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  console.log('🌱 Starting database seeding...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Seed Schools
    console.log('🏫 Seeding schools...');
    const schoolsData = [
      ['SMAN 1 Trenggalek', 'Jl. Sukarno Hatta No. 10, Trenggalek'],
      ['SMKN 1 Trenggalek', 'Jl. Brigjen Soetran No. 3, Trenggalek'],
      ['SMPN 1 Trenggalek', 'Jl. Panglima Sudirman No. 5, Trenggalek']
    ];

    const schoolIds = [];
    for (const [name, addr] of schoolsData) {
      const res = await client.query(
        `INSERT INTO schools (school_name, address) 
         VALUES ($1, $2) 
         ON CONFLICT DO NOTHING 
         RETURNING id`,
        [name, addr]
      );
      if (res.rows.length > 0) {
        schoolIds.push(res.rows[0].id);
      } else {
        const existing = await client.query('SELECT id FROM schools WHERE school_name = $1', [name]);
        if (existing.rows.length > 0) schoolIds.push(existing.rows[0].id);
      }
    }

    const defaultSchoolId = schoolIds[0] || null;

    // 2. Hash default password
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedDireksiPassword = await bcrypt.hash('direksi123', 10);
    const hashedOperatorPassword = await bcrypt.hash('operator123', 10);
    const hashedSiswaPassword = await bcrypt.hash('siswa123', 10);
    const hashedCsrPassword = await bcrypt.hash('csr123', 10);

    // 3. Seed Users
    console.log('👤 Seeding demo users...');
    const users = [
      { name: 'Super Admin JET', email: 'admin@jet.co.id', password: hashedAdminPassword, role: 'admin', school_id: null },
      { name: 'Direktur Utama JET', email: 'direksi@jet.co.id', password: hashedDireksiPassword, role: 'direksi', school_id: null },
      { name: 'Operator Bank Sampah SMAN 1', email: 'operator@sekolah.id', password: hashedOperatorPassword, role: 'operator', school_id: defaultSchoolId },
      { name: 'Bayu Pratama (Siswa Teladan)', email: 'siswa@sekolah.id', password: hashedSiswaPassword, role: 'student', school_id: defaultSchoolId },
      { name: 'CSR PT Pertamina Hijau', email: 'csr@pertamina.com', password: hashedCsrPassword, role: 'csr_partner', school_id: null }
    ];

    const userMap = {};
    for (const u of users) {
      const res = await client.query(
        `INSERT INTO users (name, email, password, role, school_id)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO UPDATE 
         SET password = EXCLUDED.password, role = EXCLUDED.role
         RETURNING id, email, role`,
        [u.name, u.email, u.password, u.role, u.school_id]
      );
      userMap[u.email] = res.rows[0].id;
    }

    // 4. Seed Wallets
    console.log('💰 Initializing wallets...');
    for (const email of Object.keys(userMap)) {
      const userId = userMap[email];
      const initialBalance = email === 'siswa@sekolah.id' ? 1250.00 : 0.00;
      await client.query(
        `INSERT INTO wallets (user_id, balance)
         VALUES ($1, $2)
         ON CONFLICT (user_id) DO UPDATE
         SET balance = CASE WHEN wallets.balance < 100 THEN EXCLUDED.balance ELSE wallets.balance END`,
        [userId, initialBalance]
      );
    }

    // 5. Seed some sample waste transactions & carbon impacts if empty
    const txCount = await client.query('SELECT COUNT(*) FROM waste_transactions');
    if (parseInt(txCount.rows[0].count) === 0 && userMap['siswa@sekolah.id']) {
      console.log('♻️ Seeding sample waste transactions...');
      const studentId = userMap['siswa@sekolah.id'];
      const adminId = userMap['admin@jet.co.id'];

      const sampleTx = [
        { type: 'plastic', weight: 4.5, coins: 45, status: 'verified' },
        { type: 'paper', weight: 8.0, coins: 40, status: 'verified' },
        { type: 'metal', weight: 2.0, coins: 50, status: 'verified' },
        { type: 'organic', weight: 15.0, coins: 30, status: 'verified' }
      ];

      for (const tx of sampleTx) {
        const txRes = await client.query(
          `INSERT INTO waste_transactions (user_id, school_id, waste_type, weight_kg, coin_amount, status, verified_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id`,
          [studentId, defaultSchoolId, tx.type, tx.weight, tx.coins, tx.status, adminId]
        );
        const txId = txRes.rows[0].id;

        // Calculate CO2 avoided (e.g. plastic 2.5 kg CO2/kg, paper 1.3, metal 4.0, organic 0.5)
        const co2Factors = { plastic: 2.5, paper: 1.3, metal: 4.0, organic: 0.5 };
        const co2Avoided = tx.weight * (co2Factors[tx.type] || 1.0);

        await client.query(
          `INSERT INTO carbon_impacts (transaction_id, waste_type, weight_kg, co2_avoided)
           VALUES ($1, $2, $3, $4)`,
          [txId, tx.type, tx.weight, co2Avoided]
        );
      }
    }

    await client.query('COMMIT');
    console.log('\n✅ Database seeded successfully!');
    console.log('\n🔑 Demo Accounts Created:');
    console.log('  1. Super Admin  : admin@jet.co.id / admin123');
    console.log('  2. Direksi      : direksi@jet.co.id / direksi123');
    console.log('  3. Operator     : operator@sekolah.id / operator123');
    console.log('  4. Siswa        : siswa@sekolah.id / siswa123 (Saldo: 1,250 TGX)');
    console.log('  5. CSR Partner  : csr@pertamina.com / csr123\n');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
