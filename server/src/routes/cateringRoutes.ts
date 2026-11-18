import { randomBytes } from "node:crypto";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { HTTP_MESSAGES } from "../config/constants.js";
import { ApiError } from "../middleware/errors.js";
import { validateBody } from "../middleware/validate.js";
import { CateringOrder } from "../models/CateringOrder.js";
import { buildCateringReviewLinks, cateringReviewEnabled } from "../services/cateringReview.js";
import { sendCateringReceipt, sendCateringRequestEmail } from "../services/cateringRequestDelivery.js";
import { cateringRequestSchema, type CateringRequest } from "../validators/cateringSchemas.js";

const deliveryError = "We couldn’t send your request to the catering team. Please try again.";

function logCateringDeliveryFailure(stage: "staff" | "guest receipt", error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? error.code : undefined;
  console.error("Catering email delivery failed", {
    stage,
    error: error instanceof Error ? error.name : "Unknown",
    code: typeof code === "string" && /^[A-Z0-9_]+$/.test(code) ? code : undefined,
  });
}

export const cateringRoutes = Router();

cateringRoutes.post(
  "/requests",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message: HTTP_MESSAGES.rateLimit },
  }),
  validateBody(cateringRequestSchema),
  async (request, response) => {
    const details = request.body as CateringRequest;
    const requestCode = `CAT-${randomBytes(5).toString("hex").toUpperCase()}`;

    try {
      if (cateringReviewEnabled) {
        await CateringOrder.create({ requestCode, details, startsAt: new Date(details.startsAt) });
      }
      await sendCateringRequestEmail(
        details,
        requestCode,
        cateringReviewEnabled ? buildCateringReviewLinks(requestCode) : undefined,
      );
    } catch (error) {
      logCateringDeliveryFailure("staff", error);
      throw new ApiError(503, deliveryError);
    }

    let receiptSent = false;
    try {
      await sendCateringReceipt(details, requestCode);
      receiptSent = true;
    } catch (error) {
      logCateringDeliveryFailure("guest receipt", error);
    }

    response.status(201).json({
      requestCode,
      receiptSent,
      message: "Request received. The catering team will email you after reviewing availability.",
    });
  },
);
