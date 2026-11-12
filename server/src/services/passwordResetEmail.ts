import { ERROR_MESSAGES } from "../config/constants.js";
import { environment } from "../config/environment.js";
import { emailTransport } from "./emailTransport.js";

export function isPasswordResetEmailConfigured(): boolean {
  return emailTransport !== null;
}

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  if (!emailTransport) throw new Error("Password reset email is not configured.");
  await emailTransport.sendMail({
    from: `Patisserie Café <${environment.SMTP_FROM}>`,
    to: email,
    subject: ERROR_MESSAGES.passwordResetEmailSubject,
    text: `Use this link to reset your password. It expires in 30 minutes: ${resetUrl}`,
    html: `<p>Use the link below to reset your Patisserie Café password. It expires in 30 minutes.</p><p><a href="${resetUrl}">Reset your password</a></p>`,
  });
}
