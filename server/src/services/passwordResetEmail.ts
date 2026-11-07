import nodemailer from "nodemailer";
import { ERROR_MESSAGES } from "../config/constants.js";
import { environment } from "../config/environment.js";

const transporter = environment.SMTP_HOST
  ? nodemailer.createTransport({
      host: environment.SMTP_HOST,
      port: environment.SMTP_PORT,
      secure: environment.SMTP_SECURE,
      auth:
        environment.SMTP_USER && environment.SMTP_PASS
          ? { user: environment.SMTP_USER, pass: environment.SMTP_PASS }
          : undefined,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    })
  : null;

export function isPasswordResetEmailConfigured(): boolean {
  return transporter !== null;
}

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  if (!transporter) throw new Error("Password reset email is not configured.");
  await transporter.sendMail({
    from: `Patisserie Café <${environment.SMTP_FROM}>`,
    to: email,
    subject: ERROR_MESSAGES.passwordResetEmailSubject,
    text: `Use this link to reset your password. It expires in 30 minutes: ${resetUrl}`,
    html: `<p>Use the link below to reset your Patisserie Café password. It expires in 30 minutes.</p><p><a href="${resetUrl}">Reset your password</a></p>`,
  });
}
