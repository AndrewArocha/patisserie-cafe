import { CATERING_ADDRESS } from "../config/constants.js";
import { environment } from "../config/environment.js";
import type { CateringRequest } from "../validators/cateringSchemas.js";
import { buildCateringRequestEmail } from "./cateringRequestEmail.js";
import { emailTransport } from "./emailTransport.js";

export async function sendCateringEmail(
  to: string,
  email: ReturnType<typeof buildCateringRequestEmail>,
  idempotencyKey: string,
) {
  if (environment.RESEND_API_KEY) {
    const { replyTo, ...content } = email;
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${environment.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        ...content,
        from: `Patisserie Café <${CATERING_ADDRESS}>`,
        to: [to],
        reply_to: replyTo,
      }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) {
      throw Object.assign(new Error("Resend rejected the catering email."), {
        code: `RESEND_HTTP_${response.status}`,
      });
    }
    const result = (await response.json()) as { id?: string };
    if (!result.id) throw new Error("Resend did not return an email ID.");
    return result.id;
  }

  const { CLOUDFLARE_EMAIL_ACCOUNT_ID: accountId, CLOUDFLARE_EMAIL_API_TOKEN: token } = environment;

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
            address: environment.CLOUDFLARE_EMAIL_FROM ?? CATERING_ADDRESS,
          },
          to,
          reply_to: replyTo,
        }),
        signal: AbortSignal.timeout(15_000),
      },
    );
    if (!response.ok) {
      throw Object.assign(new Error("Cloudflare Email Sending rejected the request."), {
        code: `CLOUDFLARE_HTTP_${response.status}`,
      });
    }
    const result = (await response.json()) as {
      success?: boolean;
      result?: { delivered?: string[]; queued?: string[] };
    };
    const accepted = [...(result.result?.delivered ?? []), ...(result.result?.queued ?? [])];
    if (!result.success || !accepted.some((address) => address.toLowerCase() === to.toLowerCase())) {
      throw Object.assign(new Error("Cloudflare did not accept the catering recipient."), {
        code: "CLOUDFLARE_RECIPIENT_NOT_ACCEPTED",
      });
    }
    return;
  }

  if (!emailTransport) {
    throw Object.assign(new Error("Catering email delivery is not configured."), {
      code: "CATERING_EMAIL_NOT_CONFIGURED",
    });
  }
  const delivery = await emailTransport.sendMail({
    ...email,
    from: `Patisserie Café <${environment.SMTP_FROM}>`,
    to,
  });
  if (!delivery.accepted.length) throw new Error("The mail server rejected the catering recipient.");
}

export async function sendCateringRequestEmail(
  details: CateringRequest,
  requestCode: string,
  links?: { accept: string; reject: string },
) {
  await sendCateringEmail(
    environment.CATERING_REQUEST_EMAIL,
    buildCateringRequestEmail(details, requestCode, "staff", links),
    `catering/${requestCode}/staff`,
  );
}

export async function sendCateringReceipt(details: CateringRequest, requestCode: string) {
  await sendCateringEmail(
    details.email,
    buildCateringRequestEmail(details, requestCode, "guest"),
    `catering/${requestCode}/receipt`,
  );
}
