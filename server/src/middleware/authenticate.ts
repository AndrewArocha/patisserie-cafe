import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { environment } from "../config/environment.js";
import { HTTP_MESSAGES } from "../config/constants.js";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export const authenticate: RequestHandler = (request, response, next) => {
  const authorization = request.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;
  if (!token) {
    response.status(404).json({ message: HTTP_MESSAGES.routeNotFound });
    return;
  }

  try {
    const payload = jwt.verify(token, environment.JWT_SECRET);
    if (typeof payload === "string" || typeof payload.sub !== "string") {
      response.status(404).json({ message: HTTP_MESSAGES.routeNotFound });
      return;
    }
    request.userId = payload.sub;
    next();
  } catch {
    response.status(404).json({ message: HTTP_MESSAGES.routeNotFound });
  }
};
