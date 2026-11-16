import { Router } from "express";
import rateLimit from "express-rate-limit";
import { HTTP_MESSAGES } from "../config/constants.js";
import { ApiError } from "../middleware/errors.js";
import { validateBody } from "../middleware/validate.js";
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

    try {
      await sendCateringRequestEmail(details);
    } catch (error) {
      logCateringDeliveryFailure("staff", error);
      throw new ApiError(503, deliveryError);
    }

    let receiptSent = false;
    try {
      await sendCateringReceipt(details);
      receiptSent = true;
    } catch (error) {
      logCateringDeliveryFailure("guest receipt", error);
    }

    response.status(201).json({
      receiptSent,
      message: "Request received. The catering team will email you after reviewing availability.",
    });
  },
);
