import type { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { HTTP_MESSAGES, ERROR_MESSAGES, PASSWORD_RESET_TTL_MS } from "../config/constants.js";
import { environment } from "../config/environment.js";
import { ApiError } from "../middleware/errors.js";
import { User } from "../models/User.js";
import { authenticateUser, createAccessToken, createUser, serializeUser } from "../services/authService.js";
import { isPasswordResetEmailConfigured, sendPasswordResetEmail } from "../services/passwordResetEmail.js";

export const signUp: RequestHandler = async (request, response) => {
  const { email, password } = request.body as { email: string; password: string };
  if (!email || !password) throw new ApiError(400, HTTP_MESSAGES.badRequest);
  if (await User.exists({ email })) throw new ApiError(409, HTTP_MESSAGES.conflict);
  const user = await createUser(email, password);
  response.status(201).json({ user: serializeUser(user) });
};

export const signIn: RequestHandler = async (request, response) => {
  const { email, password } = request.body as { email: string; password: string };
  if (!email || !password) throw new ApiError(400, HTTP_MESSAGES.badRequest);
  const user = await authenticateUser(email, password);
  if (!user) throw new ApiError(401, ERROR_MESSAGES.invalidCredentials);
  response.status(200).json({ token: createAccessToken(user.id), user: serializeUser(user) });
};

export const requestPasswordReset: RequestHandler = async (request, response) => {
  const { email } = request.body as { email: string };
  if (!email) throw new ApiError(400, HTTP_MESSAGES.badRequest);
  if (!isPasswordResetEmailConfigured()) throw new ApiError(503, HTTP_MESSAGES.passwordResetUnavailable);

  const user = await User.findOne({ email });
  if (user) {
    const token = randomBytes(32).toString("hex");
    user.passwordResetTokenHash = createHash("sha256").update(token).digest("hex");
    user.passwordResetExpiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);
    await user.save();
    const resetUrl = new URL("/reset-password", environment.CLIENT_ORIGIN);
    resetUrl.searchParams.set("token", token);
    try {
      await sendPasswordResetEmail(email, resetUrl.toString());
    } catch {
      user.passwordResetTokenHash = undefined;
      user.passwordResetExpiresAt = undefined;
      await user.save();
    }
  }
  response.status(202).json({ message: HTTP_MESSAGES.passwordResetAccepted });
};

export const resetPassword: RequestHandler = async (request, response) => {
  const { token, password } = request.body as { token: string; password: string };
  if (!token || !password) throw new ApiError(400, HTTP_MESSAGES.badRequest);
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.findOneAndUpdate(
    { passwordResetTokenHash: tokenHash, passwordResetExpiresAt: { $gt: new Date() } },
    { $set: { passwordHash }, $unset: { passwordResetTokenHash: 1, passwordResetExpiresAt: 1 } },
    { new: true, runValidators: true },
  );
  if (!user) throw new ApiError(400, HTTP_MESSAGES.passwordResetInvalid);
  response.status(200).json({ message: HTTP_MESSAGES.passwordResetComplete });
};
