import { Router } from "express";
import { APPLICATION_NAME } from "../config/constants.js";

export const healthRoutes = Router();
healthRoutes.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok", service: APPLICATION_NAME });
});
