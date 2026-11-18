import { createHmac, timingSafeEqual } from "node:crypto";
import { CATERING_REVIEW_ADDRESS } from "../config/constants.js";
import { environment } from "../config/environment.js";
import { CateringOrder, type CateringDecision } from "../models/CateringOrder.js";
import { sendCateringEmail } from "./cateringRequestDelivery.js";
import { buildCateringRequestEmail } from "./cateringRequestEmail.js";

export const cateringReviewEnabled = Boolean(environment.RESEND_API_KEY && environment.RESEND_WEBHOOK_SECRET);

const allowedSenders = new Set(
  [environment.CATERING_REQUEST_EMAIL, ...environment.CATERING_REVIEW_SENDERS.split(",")]
    .map((address) => address.trim().toLowerCase())
    .filter(Boolean),
);

function reviewSignature(requestCode: string, decision: CateringDecision) {
  return createHmac("sha256", environment.JWT_SECRET)
    .update(`catering-review/${requestCode}/${decision}`)
    .digest("hex");
}

export function buildCateringReviewLinks(requestCode: string) {
  const link = (label: "ACCEPT" | "REJECT", decision: CateringDecision) => {
    const subject = `[${requestCode}] ${label} ${reviewSignature(requestCode, decision)}`;
    const body = `Send this email to ${label.toLowerCase()} catering order ${requestCode}.`;
    return `mailto:${CATERING_REVIEW_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return { accept: link("ACCEPT", "accepted"), reject: link("REJECT", "rejected") };
}

export async function applyCateringReview(from: string, to: string[], subject: string) {
  if (!allowedSenders.has(from.trim().toLowerCase())) return;
  if (!to.some((address) => address.trim().toLowerCase() === CATERING_REVIEW_ADDRESS)) return;

  const match = /^\[(CAT-[0-9A-F]{10})\] (ACCEPT|REJECT) ([0-9a-f]{64})$/.exec(subject.trim());
  if (!match) return;
  const [, requestCode, action, signature] = match;
  const decision = action === "ACCEPT" ? "accepted" : "rejected";
  if (
    !timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(reviewSignature(requestCode, decision), "hex"),
    )
  )
    return;

  // The first valid decision wins. A retry can only send the same decision.
  const now = new Date();
  const order =
    (await CateringOrder.findOneAndUpdate(
      { requestCode, startsAt: { $gt: now }, decision: { $exists: false } },
      { $set: { decision, decidedAt: now } },
      { returnDocument: "after" },
    )) ?? (await CateringOrder.findOne({ requestCode, decision }));
  if (!order || order.decisionEmailId) return;

  // Resend retains idempotency keys for 24 hours. Older uncertain sends need manual follow-up.
  if (!order.decidedAt || now.getTime() - order.decidedAt.getTime() >= 24 * 60 * 60 * 1000) {
    console.error("Catering decision email needs manual follow-up", { requestCode });
    return;
  }

  const emailId = await sendCateringEmail(
    order.details.email,
    buildCateringRequestEmail(order.details, requestCode, decision),
    `catering/${requestCode}/decision`,
  );
  if (emailId) await CateringOrder.updateOne({ _id: order.id }, { $set: { decisionEmailId: emailId } });
}
