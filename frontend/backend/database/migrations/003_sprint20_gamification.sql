-- Migration 003: Gamification & Eco Competition (Sprint 20)

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

INSERT INTO badges (name, description, icon, requirement_type, requirement_value) VALUES
('First Deposit', 'Setoran sampah pertama kali berhasil diverifikasi oleh petugas', '🌱', 'first_transaction', 1.0),
('Plastic Hero',  'Mengumpulkan dan mendaur ulang minimal 50 kg sampah plastik',     '♻️', 'plastic_weight',   50.0),
('Eco Champion',  'Total pengumpulan seluruh jenis sampah mencapai 100 kg',           '🏆', 'total_weight',    100.0),
('Earth Guardian','Dedikasi luar biasa dengan total sampah terkelola mencapai 1000 kg','🌎','total_weight',  1000.0)
ON CONFLICT (name) DO NOTHING;

INSERT INTO competitions (name, description, start_date, end_date, competition_type, status) VALUES
('Eco Challenge September 2026', 'Kompetisi pengumpulan sampah terpilah antar sekolah Adiwiyata se-Kabupaten Trenggalek', '2026-09-01', '2026-09-30', 'school_waste', 'active')
ON CONFLICT DO NOTHING;
