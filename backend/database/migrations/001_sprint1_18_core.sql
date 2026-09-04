-- Migration 001: Core Schema (Sprint 1-18)
-- TGX Waste Coin - PT Jwalita Energi Trenggalek

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    school_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS schools (
    id SERIAL PRIMARY KEY,
    school_name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS waste_images (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES waste_transactions(id),
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wallets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id),
    balance DECIMAL(12,2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    description TEXT,
    reference_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carbon_impacts (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES waste_transactions(id),
    waste_type VARCHAR(100),
    weight_kg DECIMAL(12,2),
    co2_avoided DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

INSERT INTO roles (name, description) VALUES
('SUPER ADMIN JET',   'Full system access'),
('ADMIN OPERASIONAL', 'Waste transaction and verification'),
('ADMIN KARBON',      'Carbon impact and ESG report'),
('ADMIN LAPORAN',     'Reporting access only'),
('OPERATOR SEKOLAH',  'Manage school waste transaction'),
('GURU PENDAMPING',   'Monitor student activity'),
('SISWA',             'Submit waste and view reward')
ON CONFLICT (name) DO NOTHING;
