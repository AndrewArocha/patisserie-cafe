import type { RequestHandler } from "express";
import { HTTP_MESSAGES } from "../config/constants.js";
import { ApiError } from "../middleware/errors.js";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { serializeUser } from "../services/authService.js";

export const getCurrentUser: RequestHandler = async (request, response) => {
  const user = await User.findById(request.userId);
  if (!user) throw new ApiError(404, HTTP_MESSAGES.accountNotFound);
  response.json({ user: serializeUser(user) });
};

export const deleteCurrentUser: RequestHandler = async (request, response) => {
  const user = await User.findById(request.userId);
  if (!user) throw new ApiError(404, HTTP_MESSAGES.accountNotFound);
  await Order.deleteMany({ owner: user._id });
  await user.deleteOne();
  response.status(200).json({ message: HTTP_MESSAGES.accountDeleted });
};
