-- Migration 009: Circular Economy Marketplace & Business Ecosystem (Sprint 27)

-- 1. ECO PARTNERS
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

-- 2. MARKETPLACE ORDERS
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

-- SEED: UMKM Trenggalek
INSERT INTO eco_partners (partner_name, category, description, address, contact, logo_url, status) VALUES
('Warung Hijau Bu Sari',   'food',      'Warung makan organik menggunakan bahan lokal Trenggalek tanpa plastik sekali pakai.',      'Jl. Soekarno Hatta No. 12, Trenggalek', '081234567890', 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=200&auto=format&fit=crop', 'active'),
('Batik Eco Trenggalek',   'retail',    'Produsen batik ramah lingkungan dengan pewarna alami dari tumbuhan lokal Trenggalek.',      'Jl. Raya Karangan No. 45, Trenggalek',  '085678901234', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&auto=format&fit=crop', 'active'),
('Apotek Sehat Alami',     'health',    'Apotek herbal yang menyediakan obat-obatan tradisional dan suplemen dari bahan alam.',      'Jl. Dr. Soetomo No. 8, Trenggalek',     '087654321098', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop', 'active'),
('Toko Buku & ATK Cerdas', 'education', 'Toko buku dan alat tulis dengan produk daur ulang, mendukung literasi ramah lingkungan.', 'Jl. Ahmad Yani No. 22, Trenggalek',     '082345678901', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200&auto=format&fit=crop', 'active'),
('Laundry Bersih Natural', 'service',   'Laundry menggunakan detergen enzim ramah lingkungan dan air hemat.',                      'Jl. Gatot Subroto No. 5, Trenggalek',   '089012345678', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=200&auto=format&fit=crop', 'active')
ON CONFLICT DO NOTHING;

-- SEED: Exchange rate
INSERT INTO coin_exchange_rates (coin_name, exchange_value, effective_date) VALUES
('TGX', 500.00, CURRENT_DATE)
ON CONFLICT DO NOTHING;
