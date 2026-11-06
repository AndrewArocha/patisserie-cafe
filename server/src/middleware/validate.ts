import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { HTTP_MESSAGES } from "../config/constants.js";
import { ApiError } from "./errors.js";

export function validateBody(schema: ZodType): RequestHandler {
  return (request, _response, next) => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      next(new ApiError(400, result.error.issues[0]?.message ?? HTTP_MESSAGES.badRequestFallback));
      return;
    }
    request.body = result.data;
    next();
  };
}
