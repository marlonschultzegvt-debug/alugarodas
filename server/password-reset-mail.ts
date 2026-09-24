import nodemailer from "nodemailer";
import { ENV } from "./_core/env";

export function isPasswordResetEmailConfigured() {
  return Boolean(ENV.smtpHost && ENV.smtpPort && ENV.smtpUser && ENV.smtpPassword && ENV.smtpFrom);
}

export async function sendPasswordResetEmail(to: string, token: string) {
  if (!isPasswordResetEmailConfigured()) throw new Error("Password reset email is not configured");
  const resetUrl = `${ENV.publicAppUrl.replace(/\/$/, "")}/redefinir-senha?token=${encodeURIComponent(token)}`;
  const transporter = nodemailer.createTransport({ host: ENV.smtpHost, port: ENV.smtpPort, secure: ENV.smtpSecure, auth: { user: ENV.smtpUser, pass: ENV.smtpPassword } });
  try {
    await transporter.verify();
    await transporter.sendMail({
      from: ENV.smtpFrom,
      to,
      subject: "Redefina sua senha · Aluga Rodas",
      text: `Recebemos um pedido para redefinir sua senha no Aluga Rodas. Acesse este link em até 30 minutos: ${resetUrl}\n\nSe você não fez este pedido, ignore este e-mail.`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#10252b;max-width:560px"><h2>Redefina sua senha</h2><p>Recebemos um pedido para redefinir sua senha no Aluga Rodas.</p><p><a href="${resetUrl}" style="display:inline-block;background:#f26a3d;color:#fff;padding:12px 18px;border-radius:6px;text-decoration:none;font-weight:bold">Criar nova senha</a></p><p>Este link expira em 30 minutos e pode ser usado uma única vez.</p><p>Se você não fez este pedido, ignore este e-mail.</p></div>`,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`[Email] Zoho SMTP reset failed for ${to}: ${detail}`);
    throw new Error("Password reset email could not be sent");
  }
}
