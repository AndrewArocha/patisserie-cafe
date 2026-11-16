import { Router } from "express";
import rateLimit from "express-rate-limit";
import { HTTP_MESSAGES } from "../config/constants.js";
import { ApiError } from "../middleware/errors.js";
import { validateBody } from "../middleware/validate.js";
import { sendCateringRequestEmail } from "../services/cateringRequestDelivery.js";
import { cateringRequestSchema, type CateringRequest } from "../validators/cateringSchemas.js";

const deliveryError = "We couldn’t send your request. Try again or call catering at (551) 241-8349.";

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
    } catch {
      throw new ApiError(503, deliveryError);
    }
    response
      .status(201)
      .json({ message: "Request sent. The café will contact you to confirm availability." });
  },
);
