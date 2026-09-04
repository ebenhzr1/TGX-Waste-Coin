-- Migration 007: AI Waste Verification (Sprint 24)

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
