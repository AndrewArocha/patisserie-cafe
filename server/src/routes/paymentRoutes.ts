import { Router } from "express";
import { ERROR_MESSAGES } from "../config/constants.js";
import { confirmCheckoutSession } from "../controllers/paymentController.js";

export const paymentRoutes = Router();
paymentRoutes.post("/checkout", (_request, response) => {
  response.status(410).json({ message: ERROR_MESSAGES.spotOnCheckoutRequired });
});
paymentRoutes.get("/sessions/:sessionId", confirmCheckoutSession);
