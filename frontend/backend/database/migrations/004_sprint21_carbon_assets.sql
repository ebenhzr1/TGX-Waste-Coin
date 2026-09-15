-- Migration 004: Carbon Credit & Asset Management (Sprint 21)

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

CREATE TABLE IF NOT EXISTS carbon_inventory (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES carbon_projects(id),
    total_waste_kg DECIMAL(12,2),
    total_co2_avoided DECIMAL(12,2),
    carbon_unit DECIMAL(12,2),
    status VARCHAR(50) DEFAULT 'calculated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carbon_offsets (
    id SERIAL PRIMARY KEY,
    buyer_name VARCHAR(255),
    buyer_type VARCHAR(100),
    carbon_amount DECIMAL(12,2),
    purpose TEXT,
    status VARCHAR(50) DEFAULT 'requested',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carbon_certificates (
    id SERIAL PRIMARY KEY,
    offset_id INTEGER REFERENCES carbon_offsets(id),
    certificate_code VARCHAR(100) UNIQUE,
    holder_name VARCHAR(255),
    carbon_amount DECIMAL(12,2),
    issued_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO carbon_projects (name, description, location, start_date, end_date, status) VALUES
('TGX Waste Carbon Project', 'Inisiatif mitigasi emisi gas rumah kaca berbasis daur ulang sampah terpilah di Kabupaten Trenggalek', 'Trenggalek, Jawa Timur', '2026-01-01', '2026-12-31', 'active')
ON CONFLICT DO NOTHING;
