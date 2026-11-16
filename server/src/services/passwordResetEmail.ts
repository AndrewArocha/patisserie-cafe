import { ERROR_MESSAGES } from "../config/constants.js";
import { environment } from "../config/environment.js";
import { emailTransport } from "./emailTransport.js";

const logoUrl = "https://www.patisseriecafe.co/images/patisserie-logo.png";

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
    html: `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;background:#f3eee6;color:#192b43;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f3eee6">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:560px;border-top:4px solid #192b43;">
          <tr>
            <td align="center" style="padding:16px 24px;background:#fbf8f3;border-bottom:1px solid #d6e1ec;">
              <img src="${logoUrl}" alt="Patisserie Café" width="84" height="84" style="display:block;">
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <h1 style="margin:0;font:normal 26px Georgia,serif;">Reset your password</h1>
              <p style="margin:14px 0 20px;font-size:15px;line-height:1.5;">Use the link below to reset your password. It expires in 30 minutes.</p>
              <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#192b43;color:#ffffff;text-decoration:none;font-size:15px;">Reset your password</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}
