import { environment } from "../config/environment.js";
import type { CateringRequest } from "../validators/cateringSchemas.js";
import { buildCateringRequestEmail } from "./cateringRequestEmail.js";
import { emailTransport } from "./emailTransport.js";

export async function sendCateringRequestEmail(details: CateringRequest) {
  const { CLOUDFLARE_EMAIL_ACCOUNT_ID: accountId, CLOUDFLARE_EMAIL_API_TOKEN: token } = environment;
  const email = buildCateringRequestEmail(details);
  const to = environment.CATERING_REQUEST_EMAIL;

  if (accountId && token) {
    const { replyTo, ...content } = email;
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/email/sending/send`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          ...content,
          from: {
            name: "Patisserie Café",
            address: environment.CLOUDFLARE_EMAIL_FROM ?? environment.SMTP_FROM,
          },
          to,
          reply_to: replyTo,
        }),
        signal: AbortSignal.timeout(15_000),
      },
    );
    if (!response.ok) throw new Error(`Cloudflare Email Sending returned HTTP ${response.status}.`);
    const result = (await response.json()) as {
      success?: boolean;
      result?: { delivered?: string[]; queued?: string[] };
    };
    if (!result.success || !(result.result?.delivered?.length || result.result?.queued?.length)) {
      throw new Error("Cloudflare did not accept the catering recipient.");
    }
    return;
  }

  if (!emailTransport) throw new Error("Catering email delivery is not configured.");
  const delivery = await emailTransport.sendMail({
    ...email,
    from: `Patisserie Café <${environment.SMTP_FROM}>`,
    to,
  });
  if (!delivery.accepted.length) throw new Error("The mail server rejected the catering recipient.");
}
