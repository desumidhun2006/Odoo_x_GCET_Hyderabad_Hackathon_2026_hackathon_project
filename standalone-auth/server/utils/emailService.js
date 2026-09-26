import nodemailer from 'nodemailer'

let transporter

function getTransporter() {
  if (transporter) return transporter
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('SMTP email settings are not configured')
  }

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: Number(process.env.EMAIL_PORT || 587) === 465,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  })
  return transporter
}

export async function sendPasswordResetOtp(email, otp) {
  const expiresInMinutes = 10
  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM || `StockSense <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your StockSense password reset code',
    text: `Your StockSense verification code is ${otp}. It expires in ${expiresInMinutes} minutes. If you did not request this, you can ignore this email. Never share this code.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:24px auto;color:#202a22"><div style="background:#203e31;color:#f7f8f4;padding:22px 26px;border-radius:8px 8px 0 0;font-size:20px;font-weight:700">StockSense</div><div style="padding:26px;border:1px solid #dfe4de;border-top:0;border-radius:0 0 8px 8px"><p style="font-size:15px">Use this one-time code to reset your password:</p><p style="font-family:monospace;font-size:32px;letter-spacing:8px;font-weight:700;color:#315c45">${otp}</p><p>This code expires in <strong>${expiresInMinutes} minutes</strong>.</p><p style="font-size:13px;color:#788178">If you did not request a password reset, ignore this message. For your security, never share this code.</p></div></div>`,
  })
}