import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requestPasswordReset, resetPassword, signIn, signUp } from "../controllers/authController.js";
import { HTTP_MESSAGES } from "../config/constants.js";
import { validateBody } from "../middleware/validate.js";
import {
  passwordResetRequestSchema,
  passwordResetSchema,
  signInSchema,
  signUpSchema,
} from "../validators/authSchemas.js";

export const authRoutes = Router();
const authenticationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: HTTP_MESSAGES.rateLimit },
});

authRoutes.post("/signup", authenticationLimiter, validateBody(signUpSchema), signUp);
authRoutes.post("/signin", authenticationLimiter, validateBody(signInSchema), signIn);
authRoutes.post(
  "/forgot-password",
  authenticationLimiter,
  validateBody(passwordResetRequestSchema),
  requestPasswordReset,
);
authRoutes.post("/reset-password", authenticationLimiter, validateBody(passwordResetSchema), resetPassword);
