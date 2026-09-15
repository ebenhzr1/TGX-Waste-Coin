const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
const permissionService = require("../services/permissionService");
const { generateOTP, saveOTP, verifyOTP } = require("../services/otpService");
const { sendOTPEmail } = require("../services/emailService");


// REGISTER USER
const register = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;


        // cek email sudah ada
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );


        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email sudah terdaftar"
            });
        }


        // encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);


        // simpan user
        const result = await pool.query(
            `
            INSERT INTO users
            (name,email,password,role)
            VALUES($1,$2,$3,$4)
            RETURNING id,name,email,role
            `,
            [
                name,
                email,
                hashedPassword,
                role || "student"
            ]
        );


        res.status(201).json({
            message: "User berhasil dibuat",
            user: result.rows[0]
        });


    } catch(error){

        console.error(error);

        res.status(500).json({
            message:"Server error"
        });

    }

};



// LOGIN USER
const login = async (req,res)=>{

    try {

        const {
            email,
            password
        } = req.body;


        const result = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );


        if(result.rows.length === 0){

            return res.status(404).json({
                message:"User tidak ditemukan"
            });

        }


        const user = result.rows[0];


        // cek password
        const validPassword =
            await bcrypt.compare(
                password,
                user.password
            );


        if(!validPassword){

            return res.status(401).json({
                message:"Password salah"
            });

        }



        // Sprint 18: Normalisasi role dan sediakan roles array di token
        const normalizedRole = permissionService.normalizeRole(user.role);
        const rolesList = [normalizedRole];

        // buat token
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                roles: rolesList
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Login berhasil",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                roles: rolesList
            }
        });



    } catch(error){

        console.error(error);

        res.status(500).json({
            message:"Server error"
        });

    }

};





// SEND OTP — kirim kode verifikasi ke email sebelum registrasi
const sendOTP = async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email) return res.status(400).json({ message: "Email wajib diisi." });

        // cek apakah email sudah terdaftar
        const existing = await pool.query("SELECT id FROM users WHERE email=$1", [email.toLowerCase()]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ message: "Email sudah terdaftar. Silakan masuk." });
        }

        const otp = generateOTP();
        saveOTP(email, otp);
        await sendOTPEmail(email, otp, name);

        res.json({ message: "Kode OTP berhasil dikirim ke email Anda." });
    } catch (error) {
        console.error("sendOTP error:", error);
        res.status(500).json({ message: "Gagal mengirim OTP. Coba lagi." });
    }
};


// VERIFY OTP & REGISTER — verifikasi kode lalu buat akun
const verifyAndRegister = async (req, res) => {
    try {
        const { name, email, password, role, otp } = req.body;

        if (!name || !email || !password || !otp) {
            return res.status(400).json({ message: "Semua kolom wajib diisi." });
        }

        const check = verifyOTP(email, otp);
        if (!check.valid) {
            return res.status(400).json({ message: check.reason });
        }

        // cek ulang email duplikat
        const existing = await pool.query("SELECT id FROM users WHERE email=$1", [email.toLowerCase()]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ message: "Email sudah terdaftar." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (name, email, password, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, role`,
            [name.trim(), email.trim().toLowerCase(), hashedPassword, role || "student"]
        );

        res.status(201).json({
            message: "Akun berhasil dibuat! Silakan masuk.",
            user: result.rows[0],
        });
    } catch (error) {
        console.error("verifyAndRegister error:", error);
        res.status(500).json({ message: "Server error." });
    }
};



module.exports = {
    register,
    login,
    sendOTP,
    verifyAndRegister,
};

