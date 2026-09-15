// OTP disimpan di memory, expire 10 menit
const otpStore = new Map();

const OTP_TTL_MS = 10 * 60 * 1000; // 10 menit

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
}

function saveOTP(email, otp) {
  otpStore.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + OTP_TTL_MS,
  });
}

function verifyOTP(email, inputOtp) {
  const entry = otpStore.get(email.toLowerCase());
  if (!entry) return { valid: false, reason: "OTP tidak ditemukan. Minta OTP baru." };
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return { valid: false, reason: "OTP sudah kedaluwarsa. Minta OTP baru." };
  }
  if (entry.otp !== inputOtp.trim()) {
    return { valid: false, reason: "Kode OTP tidak valid." };
  }
  otpStore.delete(email.toLowerCase());
  return { valid: true };
}

module.exports = { generateOTP, saveOTP, verifyOTP };
