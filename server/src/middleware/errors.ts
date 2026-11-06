import type { ErrorRequestHandler, RequestHandler } from "express";
import { HTTP_MESSAGES } from "../config/constants.js";

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const notFoundHandler: RequestHandler = (_request, response) => {
  response.status(404).json({ message: HTTP_MESSAGES.routeNotFound });
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, next) => {
  void next;
  if (error instanceof ApiError) {
    response.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof Error && error.name === "ValidationError") {
    response.status(400).json({ message: HTTP_MESSAGES.badRequest });
    return;
  }

  if (error instanceof SyntaxError && "status" in error && error.status === 400) {
    response.status(400).json({ message: HTTP_MESSAGES.badRequest });
    return;
  }

  if (
    error instanceof Error &&
    error.name === "MongoServerError" &&
    "code" in error &&
    error.code === 11000
  ) {
    response.status(409).json({ message: HTTP_MESSAGES.conflict });
    return;
  }

  response.status(500).json({ message: HTTP_MESSAGES.serverError });
};
