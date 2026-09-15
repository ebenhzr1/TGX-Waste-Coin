const { Resend } = require("resend");

async function sendOTPEmail(toEmail, otp, name) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY belum disetel di server Vercel.");
  }
  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: "TGX Waste Coin <onboarding@resend.dev>",
    to: toEmail,
    subject: `Kode Verifikasi TGX Waste Coin: ${otp}`,
    html: `
      <div style="font-family:'Plus Jakarta Sans',sans-serif;background:#060a11;padding:32px;border-radius:16px;max-width:480px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-flex;align-items:center;gap:8px;background:#10b98120;border:1px solid #10b98140;border-radius:99px;padding:6px 14px;margin-bottom:12px;">
            <span style="color:#34d399;font-size:12px;font-weight:700;letter-spacing:1px;">PT JWALITA ENERGI TRENGGALEK</span>
          </div>
          <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:0;">TGX <span style="color:#34d399;">Waste Coin</span></h1>
        </div>
        <div style="background:#0f172a;border:1px solid #1e293b;border-radius:16px;padding:28px;text-align:center;">
          <p style="color:#94a3b8;font-size:14px;margin:0 0 8px;">Halo, <strong style="color:#e2e8f0;">${name || "Pengguna Baru"}</strong></p>
          <p style="color:#94a3b8;font-size:14px;margin:0 0 24px;">Gunakan kode OTP berikut untuk menyelesaikan pendaftaran akun Anda:</p>
          <div style="background:#064e3b;border:2px dashed #10b981;border-radius:12px;padding:20px;margin-bottom:24px;">
            <span style="color:#34d399;font-size:42px;font-weight:900;letter-spacing:12px;">${otp}</span>
          </div>
          <p style="color:#64748b;font-size:12px;margin:0;">Kode berlaku selama <strong style="color:#94a3b8;">10 menit</strong>. Jangan bagikan kode ini kepada siapapun.</p>
        </div>
        <p style="color:#334155;font-size:11px;text-align:center;margin-top:20px;">© 2026 PT Jwalita Energi Trenggalek · TGX Circular Engine</p>
      </div>
    `,
  });

  if (error) throw new Error(error.message);
  return data;
}

module.exports = { sendOTPEmail };
