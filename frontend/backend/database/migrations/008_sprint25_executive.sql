-- Migration 008: Executive ESG Command Center (Sprint 25)

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

-- 14 Kecamatan di Kabupaten Trenggalek
INSERT INTO impact_locations (district_name, school_count, student_count, waste_total, carbon_total, latitude, longitude) VALUES
('Trenggalek Kota', 12, 1450, 4850.50, 9.70,  -8.051234, 111.712345),
('Karangan',         6,  720, 2340.00, 4.68,  -8.075421, 111.662145),
('Pogalan',          5,  580, 1920.25, 3.84,  -8.064123, 111.764512),
('Durenan',          7,  850, 2780.00, 5.56,  -8.093214, 111.821456),
('Gandusari',        4,  490, 1560.80, 3.12,  -8.112453, 111.678423),
('Watulimo',         8,  920, 3120.40, 6.24,  -8.254123, 111.745612),
('Panggul',          6,  680, 2150.00, 4.30,  -8.245123, 111.452145),
('Dongko',           4,  410, 1340.50, 2.68,  -8.192412, 111.534214),
('Bendungan',        3,  310,  980.00, 1.96,  -7.974123, 111.701245),
('Tugu',             5,  530, 1720.00, 3.44,  -8.021456, 111.624512),
('Kampak',           4,  460, 1480.00, 2.96,  -8.154123, 111.632145),
('Pule',             3,  340, 1120.00, 2.24,  -8.124512, 111.512456),
('Suruh',            3,  290,  890.50, 1.78,  -8.145612, 111.591245),
('Munjungan',        5,  570, 1850.00, 3.70,  -8.284512, 111.612456)
ON CONFLICT DO NOTHING;
