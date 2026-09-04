-- Migration 005: Corporate CSR & Impact Partnership (Sprint 22)

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

CREATE TABLE IF NOT EXISTS csr_transactions (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES csr_campaigns(id),
    amount DECIMAL(12,2),
    transaction_type VARCHAR(100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS impact_beneficiaries (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES csr_campaigns(id),
    school_id INTEGER,
    student_count INTEGER DEFAULT 0,
    waste_collected DECIMAL(12,2),
    co2_impact DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO corporate_partners (company_name, industry, contact_person, email, phone, address, status) VALUES
('PT ABC', 'FMCG & Manufaktur Berkelanjutan', 'Budi Santoso', 'csr@ptabc.co.id', '08123456789', 'Kawasan Industri Trenggalek', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO csr_campaigns (partner_id, campaign_name, description, target_waste_kg, target_co2, reward_budget, start_date, end_date, status) VALUES
(1, 'Green School Movement', 'Program CSR pengelolaan sampah terpilah dan sponsorship reward untuk 10 Sekolah Adiwiyata di Trenggalek', 10000.0, 20.0, 50000000.0, '2026-09-01', '2026-12-31', 'active')
ON CONFLICT DO NOTHING;
