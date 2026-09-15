-- Migration 002: Marketplace & Reward Redemption (Sprint 19)

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
    status VARCHAR(50) DEFAULT 'requested',
    pickup_point VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO marketplace_items (name, category, point_cost, stock, description, image_url) VALUES
('Bibit Pohon Jwalita For Earth', 'environment', 100.0,  100, 'Bibit pohon sengon & mahoni untuk program penghijauan dan reboisasi di Trenggalek.', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=80'),
('Tas Sekolah TGX',               'education',   500.0,   50, 'Tas ransel sekolah eksklusif berbahan rPET daur ulang plastik berkualitas tinggi.',   'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80'),
('Voucher UMKM Hijau',            'voucher',     1000.0,  25, 'Voucher belanja Rp 50.000 di merchant UMKM mitra ramah lingkungan Trenggalek.',        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=80'),
('Tumbler Ramah Lingkungan JET',  'eco_product',  250.0,  40, 'Tumbler stainless steel insulasi ganda untuk mengurangi sampah botol plastik sekali pakai.', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80'),
('Paket Alat Tulis Daur Ulang',   'education',    150.0,  80, 'Buku tulis dari kertas daur ulang dan pensil ramah lingkungan.',                       'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80')
ON CONFLICT DO NOTHING;
