const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:fvgXPKg2%2Bq3%26Yu9@db.llutuppvzfuaihhlmpjs.supabase.co:5432/postgres",
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on("connect", () => {
    console.log("Database connected");
});

module.exports = pool;
