import { Router } from "express";
import { confirmCheckoutSession, createCheckoutSession } from "../controllers/paymentController.js";
import { validateBody } from "../middleware/validate.js";
import { checkoutSchema } from "../validators/orderSchemas.js";

export const paymentRoutes = Router();
paymentRoutes.post("/checkout", validateBody(checkoutSchema), createCheckoutSession);
paymentRoutes.get("/sessions/:sessionId", confirmCheckoutSession);
