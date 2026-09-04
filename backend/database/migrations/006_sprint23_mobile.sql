-- Migration 006: Mobile App & Field Operation System (Sprint 23)

CREATE TABLE IF NOT EXISTS mobile_devices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    device_token VARCHAR(255) NOT NULL,
    platform VARCHAR(50) DEFAULT 'android',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS location_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    activity VARCHAR(100) DEFAULT 'field_activity',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
