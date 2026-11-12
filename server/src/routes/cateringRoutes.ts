import { Router } from "express";
import rateLimit from "express-rate-limit";
import { HTTP_MESSAGES } from "../config/constants.js";
import { environment } from "../config/environment.js";
import { ApiError } from "../middleware/errors.js";
import { validateBody } from "../middleware/validate.js";
import { emailTransport } from "../services/emailTransport.js";
import { cateringRequestSchema, type CateringRequest } from "../validators/cateringSchemas.js";

const eventNames = {
  private: "Private room rental",
  corporate: "Corporate room rental",
  "full-service": "Full-service catering",
};
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
    if (!emailTransport) throw new ApiError(503, deliveryError);
    const details = request.body as CateringRequest;
    const event = eventNames[details.eventType];
    const selections =
      details.eventType === "full-service"
        ? [`Requested services: ${details.services.join(", ") || "None selected"}`]
        : [
            `Refreshments: ${details.refreshment ?? "None requested"}`,
            `Audio visual: ${details.audioVisual ? "Requested" : "Not requested"}`,
          ];

    try {
      await emailTransport.sendMail({
        from: `Patisserie Café <${environment.SMTP_FROM}>`,
        to: environment.CATERING_REQUEST_EMAIL,
        replyTo: details.email,
        subject: `New catering request · ${event}`,
        text: [
          event,
          `Requested date (New York): ${details.date}`,
          `Number of guests: ${details.guests}`,
          ...selections,
          "",
          `Name: ${details.name}`,
          `Phone: ${details.phone}`,
          `Email: ${details.email}`,
        ].join("\n"),
      });
    } catch {
      throw new ApiError(503, deliveryError);
    }
    response
      .status(201)
      .json({ message: "Request sent. The café will contact you to confirm availability." });
  },
);
