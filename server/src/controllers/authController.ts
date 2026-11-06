import type { RequestHandler } from "express";
import { HTTP_MESSAGES, ERROR_MESSAGES } from "../config/constants.js";
import { ApiError } from "../middleware/errors.js";
import { User } from "../models/User.js";
import { authenticateUser, createAccessToken, createUser, serializeUser } from "../services/authService.js";

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
