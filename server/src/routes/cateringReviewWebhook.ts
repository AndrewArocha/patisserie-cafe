import type { RequestHandler } from "express";
import { Webhook } from "svix";
import { z } from "zod";
import { environment } from "../config/environment.js";
import { applyCateringReview, cateringReviewEnabled } from "../services/cateringReview.js";

const receivedEmail = z.object({
  type: z.literal("email.received"),
  data: z.object({ from: z.string(), to: z.array(z.string()), subject: z.string() }),
});

export const cateringReviewWebhook: RequestHandler = async (request, response) => {
  const secret = environment.RESEND_WEBHOOK_SECRET;
  if (!cateringReviewEnabled || !secret) {
    response.sendStatus(503);
    return;
  }

  let payload: unknown;
  try {
    payload = new Webhook(secret).verify(request.body, {
      "svix-id": request.get("svix-id") ?? "",
      "svix-timestamp": request.get("svix-timestamp") ?? "",
      "svix-signature": request.get("svix-signature") ?? "",
    });
  } catch {
    response.sendStatus(400);
    return;
  }

  const verified = receivedEmail.safeParse(payload);
  if (verified.success) {
    const { from, to, subject } = verified.data.data;
    await applyCateringReview(from, to, subject);
  }
  response.sendStatus(204);
};
