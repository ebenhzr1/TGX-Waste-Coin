-- TGX Waste Coin Database
-- PT Jwalita Energi Trenggalek


-- =====================
-- USERS
-- =====================

CREATE TABLE IF NOT EXISTS users (

    id SERIAL PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    role VARCHAR(50) DEFAULT 'student',

    school_id INTEGER,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

);



-- =====================
-- SCHOOLS
-- =====================

CREATE TABLE IF NOT EXISTS schools (

    id SERIAL PRIMARY KEY,

    school_name VARCHAR(255) NOT NULL,

    address TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



-- =====================
-- WASTE TRANSACTIONS
-- =====================

CREATE TABLE IF NOT EXISTS waste_transactions (

    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES users(id),

    school_id INTEGER REFERENCES schools(id),

    waste_type VARCHAR(100) NOT NULL,

    weight_kg DECIMAL(10,2) NOT NULL,

    coin_amount DECIMAL(10,2) DEFAULT 0,

    status VARCHAR(50) DEFAULT 'pending',

    verified_by INTEGER REFERENCES users(id),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



-- =====================
-- WASTE IMAGES (DIGITAL VERIFICATION)
-- =====================

CREATE TABLE IF NOT EXISTS waste_images (

    id SERIAL PRIMARY KEY,

    transaction_id INTEGER REFERENCES waste_transactions(id),

    image_url TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



-- =====================
-- WALLET TGX COIN
-- =====================

CREATE TABLE IF NOT EXISTS wallets (

    id SERIAL PRIMARY KEY,

    user_id INTEGER UNIQUE REFERENCES users(id),

    balance DECIMAL(12,2) DEFAULT 0,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



-- =====================
-- WALLET TRANSACTIONS (AUDIT & MUTASI COIN)
-- =====================

CREATE TABLE IF NOT EXISTS wallet_transactions (

    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES users(id),

    transaction_type VARCHAR(50) NOT NULL, -- 'waste_deposit', 'reward_ranking', 'redeem'

    amount DECIMAL(12,2) NOT NULL, -- +50, +100, -200

    description TEXT,

    reference_id INTEGER, -- id waste_transaction atau event referensi

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



-- =====================
-- RANKING
-- =====================

CREATE TABLE IF NOT EXISTS rankings (

    id SERIAL PRIMARY KEY,

    school_id INTEGER REFERENCES schools(id),

    user_id INTEGER REFERENCES users(id),

    period VARCHAR(50),

    total_weight DECIMAL(12,2),

    total_coin DECIMAL(12,2),

    rank INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



-- =====================
-- NOTIFICATIONS
-- =====================

CREATE TABLE IF NOT EXISTS notifications (

    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES users(id),

    title VARCHAR(255),

    message TEXT,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



-- =====================
-- CARBON IMPACTS (JWALITA FOR EARTH)
-- =====================

CREATE TABLE IF NOT EXISTS carbon_impacts (

    id SERIAL PRIMARY KEY,

    transaction_id INTEGER REFERENCES waste_transactions(id),

    waste_type VARCHAR(100),

    weight_kg DECIMAL(12,2),

    co2_avoided DECIMAL(12,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



-- =====================
-- IMPACT REPORTS (ESG REPORTING)
-- =====================

CREATE TABLE IF NOT EXISTS impact_reports (

    id SERIAL PRIMARY KEY,

    report_type VARCHAR(50),

    period_start DATE,

    period_end DATE,

    total_waste DECIMAL(12,2),

    total_co2 DECIMAL(12,2),

    total_users INTEGER,

    total_school INTEGER,

    total_transaction INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



-- =====================
-- PROFESSIONAL ROLES & PERMISSIONS (SPRINT 18)
-- =====================

CREATE TABLE IF NOT EXISTS roles (

    id SERIAL PRIMARY KEY,

    name VARCHAR(100) UNIQUE NOT NULL,

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



CREATE TABLE IF NOT EXISTS permissions (

    id SERIAL PRIMARY KEY,

    name VARCHAR(100) UNIQUE NOT NULL,

    description TEXT

);



CREATE TABLE IF NOT EXISTS user_roles (

    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES users(id),

    role_id INTEGER REFERENCES roles(id)

);



CREATE TABLE IF NOT EXISTS role_permissions (

    id SERIAL PRIMARY KEY,

    role_id INTEGER REFERENCES roles(id),

    permission_id INTEGER REFERENCES permissions(id)

);



-- DEFAULT ROLES SEED
INSERT INTO roles (name, description) VALUES
('SUPER ADMIN JET', 'Full system access'),
('ADMIN OPERASIONAL', 'Waste transaction and verification'),
('ADMIN KARBON', 'Carbon impact and ESG report'),
('ADMIN LAPORAN', 'Reporting access only'),
('OPERATOR SEKOLAH', 'Manage school waste transaction'),
('GURU PENDAMPING', 'Monitor student activity'),
('SISWA', 'Submit waste and view reward')
ON CONFLICT (name) DO NOTHING;



-- =====================
-- MARKETPLACE & REWARD SYSTEM (SPRINT 19)
-- =====================

CREATE TABLE IF NOT EXISTS marketplace_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    point_cost DECIMAL(12,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS reward_redemptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    item_id INTEGER REFERENCES marketplace_items(id),
    coin_spent DECIMAL(12,2),
    claim_code VARCHAR(100) UNIQUE,
    status VARCHAR(50) DEFAULT 'requested', -- requested, approved, ready_pickup, completed, cancelled
    pickup_point VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- SEED DATA MARKETPLACE ITEMS
INSERT INTO marketplace_items (name, category, point_cost, stock, description, image_url) VALUES
('Bibit Pohon Jwalita For Earth', 'environment', 100.0, 100, 'Bibit pohon sengon & mahoni untuk program penghijauan dan reboisasi di Trenggalek.', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=80'),
('Tas Sekolah TGX', 'education', 500.0, 50, 'Tas ransel sekolah eksklusif berbahan rPET daur ulang plastik berkualitas tinggi.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80'),
('Voucher UMKM Hijau', 'voucher', 1000.0, 25, 'Voucher belanja Rp 50.000 di merchant UMKM mitra ramah lingkungan Trenggalek.', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=80'),
('Tumbler Ramah Lingkungan JET', 'eco_product', 250.0, 40, 'Tumbler stainless steel insulasi ganda untuk mengurangi sampah botol plastik sekali pakai.', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80'),
('Paket Alat Tulis Daur Ulang', 'education', 150.0, 80, 'Buku tulis dari kertas daur ulang dan pensil ramah lingkungan.', 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80')
ON CONFLICT DO NOTHING;



-- =====================
-- GAMIFICATION & ECO COMPETITION (SPRINT 20)
-- =====================

CREATE TABLE IF NOT EXISTS user_levels (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id),
    level INTEGER DEFAULT 1,
    total_weight_kg DECIMAL(12,2) DEFAULT 0,
    total_coin DECIMAL(12,2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    requirement_type VARCHAR(100),
    requirement_value DECIMAL(12,2)
);


CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    badge_id INTEGER REFERENCES badges(id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);


CREATE TABLE IF NOT EXISTS competitions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    start_date DATE,
    end_date DATE,
    competition_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active'
);


CREATE TABLE IF NOT EXISTS competition_results (
    id SERIAL PRIMARY KEY,
    competition_id INTEGER REFERENCES competitions(id),
    user_id INTEGER REFERENCES users(id),
    school_id INTEGER,
    rank INTEGER,
    score DECIMAL(12,2)
);


-- SEED DEFAULT BADGES
INSERT INTO badges (name, description, icon, requirement_type, requirement_value) VALUES
('First Deposit', 'Setoran sampah pertama kali berhasil diverifikasi oleh petugas', '🌱', 'first_transaction', 1.0),
('Plastic Hero', 'Mengumpulkan dan mendaur ulang minimal 50 kg sampah plastik', '♻️', 'plastic_weight', 50.0),
('Eco Champion', 'Total pengumpulan seluruh jenis sampah mencapai 100 kg', '🏆', 'total_weight', 100.0),
('Earth Guardian', 'Dedikasi luar biasa dengan total sampah terkelola mencapai 1000 kg', '🌎', 'total_weight', 1000.0)
ON CONFLICT (name) DO NOTHING;


-- SEED DEFAULT COMPETITION
INSERT INTO competitions (name, description, start_date, end_date, competition_type, status) VALUES
('Eco Challenge September 2026', 'Kompetisi pengumpulan sampah terpilah antar sekolah Adiwiyata se-Kabupaten Trenggalek', '2026-09-01', '2026-09-30', 'school_waste', 'active')
ON CONFLICT DO NOTHING;


-- ================================================
-- SPRINT 21: CARBON CREDIT INTEGRATION & ASSET MANAGEMENT
-- ================================================

-- 1. CARBON PROJECTS
CREATE TABLE IF NOT EXISTS carbon_projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CARBON INVENTORY
CREATE TABLE IF NOT EXISTS carbon_inventory (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES carbon_projects(id),
    total_waste_kg DECIMAL(12,2),
    total_co2_avoided DECIMAL(12,2),
    carbon_unit DECIMAL(12,2),
    status VARCHAR(50) DEFAULT 'calculated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CARBON OFFSET TRANSACTION
CREATE TABLE IF NOT EXISTS carbon_offsets (
    id SERIAL PRIMARY KEY,
    buyer_name VARCHAR(255),
    buyer_type VARCHAR(100),
    carbon_amount DECIMAL(12,2),
    purpose TEXT,
    status VARCHAR(50) DEFAULT 'requested',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. CARBON CERTIFICATE
CREATE TABLE IF NOT EXISTS carbon_certificates (
    id SERIAL PRIMARY KEY,
    offset_id INTEGER REFERENCES carbon_offsets(id),
    certificate_code VARCHAR(100) UNIQUE,
    holder_name VARCHAR(255),
    carbon_amount DECIMAL(12,2),
    issued_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEED DEFAULT CARBON PROJECT
INSERT INTO carbon_projects (name, description, location, start_date, end_date, status) VALUES
('TGX Waste Carbon Project', 'Inisiatif mitigasi emisi gas rumah kaca berbasis daur ulang sampah terpilah di Kabupaten Trenggalek', 'Trenggalek, Jawa Timur', '2026-01-01', '2026-12-31', 'active')
ON CONFLICT DO NOTHING;


-- ================================================
-- SPRINT 22: CORPORATE CSR & IMPACT PARTNERSHIP
-- ================================================

-- 1. CORPORATE PARTNERS
CREATE TABLE IF NOT EXISTS corporate_partners (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CSR CAMPAIGNS
CREATE TABLE IF NOT EXISTS csr_campaigns (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES corporate_partners(id),
    campaign_name VARCHAR(255),
    description TEXT,
    target_waste_kg DECIMAL(12,2),
    target_co2 DECIMAL(12,2),
    reward_budget DECIMAL(12,2),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CSR FUNDING TRANSACTION
CREATE TABLE IF NOT EXISTS csr_transactions (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES csr_campaigns(id),
    amount DECIMAL(12,2),
    transaction_type VARCHAR(100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. IMPACT BENEFICIARY
CREATE TABLE IF NOT EXISTS impact_beneficiaries (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES csr_campaigns(id),
    school_id INTEGER,
    student_count INTEGER DEFAULT 0,
    waste_collected DECIMAL(12,2),
    co2_impact DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEED DEFAULT CORPORATE PARTNER & CSR CAMPAIGN
INSERT INTO corporate_partners (company_name, industry, contact_person, email, phone, address, status) VALUES
('PT ABC', 'FMCG & Manufaktur Berkelanjutan', 'Budi Santoso', 'csr@ptabc.co.id', '08123456789', 'Kawasan Industri Trenggalek', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO csr_campaigns (partner_id, campaign_name, description, target_waste_kg, target_co2, reward_budget, start_date, end_date, status) VALUES
(1, 'Green School Movement', 'Program CSR pengelolaan sampah terpilah dan sponsorship reward untuk 10 Sekolah Adiwiyata di Trenggalek', 10000.0, 20.0, 50000000.0, '2026-09-01', '2026-12-31', 'active')
ON CONFLICT DO NOTHING;


-- ================================================
-- SPRINT 23: TGX MOBILE & FIELD OPERATION SYSTEM
-- ================================================

-- 1. MOBILE DEVICES
CREATE TABLE IF NOT EXISTS mobile_devices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    device_token VARCHAR(255) NOT NULL,
    platform VARCHAR(50) DEFAULT 'android',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. LOCATION LOGS
CREATE TABLE IF NOT EXISTS location_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    activity VARCHAR(100) DEFAULT 'field_activity',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- SPRINT 24: AI WASTE VERIFICATION & SORTING
-- ================================================

CREATE TABLE IF NOT EXISTS waste_ai_analysis (
    id SERIAL PRIMARY KEY,
    waste_transaction_id INTEGER REFERENCES waste_transactions(id),
    image_url TEXT,
    detected_type VARCHAR(100),
    confidence DECIMAL(5,2),
    estimated_weight DECIMAL(10,2),
    fraud_score DECIMAL(5,2),
    recommendation VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_verification_logs (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER,
    model_version VARCHAR(50),
    analysis_result JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- SPRINT 25: EXECUTIVE ESG COMMAND CENTER
-- ================================================

CREATE TABLE IF NOT EXISTS executive_snapshots (
    id SERIAL PRIMARY KEY,
    snapshot_date DATE DEFAULT CURRENT_DATE,
    total_waste DECIMAL(12,2) DEFAULT 0.00,
    total_carbon DECIMAL(12,2) DEFAULT 0.00,
    total_students INTEGER DEFAULT 0,
    total_school INTEGER DEFAULT 0,
    total_csr INTEGER DEFAULT 0,
    esg_score DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS impact_locations (
    id SERIAL PRIMARY KEY,
    district_name VARCHAR(100) NOT NULL,
    school_count INTEGER DEFAULT 0,
    student_count INTEGER DEFAULT 0,
    waste_total DECIMAL(12,2) DEFAULT 0.00,
    carbon_total DECIMAL(12,2) DEFAULT 0.00,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Seed Data: 14 Kecamatan di Kabupaten Trenggalek
INSERT INTO impact_locations (district_name, school_count, student_count, waste_total, carbon_total, latitude, longitude) VALUES
('Trenggalek Kota', 12, 1450, 4850.50, 9.70, -8.051234, 111.712345),
('Karangan', 6, 720, 2340.00, 4.68, -8.075421, 111.662145),
('Pogalan', 5, 580, 1920.25, 3.84, -8.064123, 111.764512),
('Durenan', 7, 850, 2780.00, 5.56, -8.093214, 111.821456),
('Gandusari', 4, 490, 1560.80, 3.12, -8.112453, 111.678423),
('Watulimo', 8, 920, 3120.40, 6.24, -8.254123, 111.745612),
('Panggul', 6, 680, 2150.00, 4.30, -8.245123, 111.452145),
('Dongko', 4, 410, 1340.50, 2.68, -8.192412, 111.534214),
('Bendungan', 3, 310, 980.00, 1.96, -7.974123, 111.701245),
('Tugu', 5, 530, 1720.00, 3.44, -8.021456, 111.624512),
('Kampak', 4, 460, 1480.00, 2.96, -8.154123, 111.632145),
('Pule', 3, 340, 1120.00, 2.24, -8.124512, 111.512456),
('Suruh', 3, 290, 890.50, 1.78, -8.145612, 111.591245),
('Munjungan', 5, 570, 1850.00, 3.70, -8.284512, 111.612456)
ON CONFLICT DO NOTHING;


-- ================================================
-- SPRINT 27: CIRCULAR ECONOMY MARKETPLACE & BUSINESS ECOSYSTEM
-- ================================================

-- 1. ECO PARTNERS (UMKM & Business Partners)
CREATE TABLE IF NOT EXISTS eco_partners (
    id SERIAL PRIMARY KEY,
    partner_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    address TEXT,
    contact VARCHAR(255),
    logo_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. MARKETPLACE ORDERS (Partner product transactions)
CREATE TABLE IF NOT EXISTS marketplace_orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    partner_id INTEGER REFERENCES eco_partners(id),
    item_id INTEGER REFERENCES marketplace_items(id),
    coin_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. COIN EXCHANGE RATES
CREATE TABLE IF NOT EXISTS coin_exchange_rates (
    id SERIAL PRIMARY KEY,
    coin_name VARCHAR(100) DEFAULT 'TGX',
    exchange_value DECIMAL(12,2) NOT NULL,
    effective_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEED: Default eco partners (UMKM Trenggalek)
INSERT INTO eco_partners (partner_name, category, description, address, contact, logo_url, status) VALUES
('Warung Hijau Bu Sari',   'food',      'Warung makan organik menggunakan bahan lokal Trenggalek tanpa plastik sekali pakai.',      'Jl. Soekarno Hatta No. 12, Trenggalek', '081234567890', 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=200&auto=format&fit=crop', 'active'),
('Batik Eco Trenggalek',   'retail',    'Produsen batik ramah lingkungan dengan pewarna alami dari tumbuhan lokal Trenggalek.',      'Jl. Raya Karangan No. 45, Trenggalek',  '085678901234', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&auto=format&fit=crop', 'active'),
('Apotek Sehat Alami',     'health',    'Apotek herbal yang menyediakan obat-obatan tradisional dan suplemen dari bahan alam.',      'Jl. Dr. Soetomo No. 8, Trenggalek',     '087654321098', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop', 'active'),
('Toko Buku & ATK Cerdas', 'education', 'Toko buku dan alat tulis dengan produk daur ulang, mendukung literasi ramah lingkungan.', 'Jl. Ahmad Yani No. 22, Trenggalek',     '082345678901', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200&auto=format&fit=crop', 'active'),
('Laundry Bersih Natural', 'service',   'Laundry menggunakan detergen enzim ramah lingkungan dan air hemat.',                      'Jl. Gatot Subroto No. 5, Trenggalek',   '089012345678', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=200&auto=format&fit=crop', 'active')
ON CONFLICT DO NOTHING;

-- SEED: Default TGX exchange rate (1 TGX = Rp 500)
INSERT INTO coin_exchange_rates (coin_name, exchange_value, effective_date) VALUES
('TGX', 500.00, CURRENT_DATE)
ON CONFLICT DO NOTHING;
