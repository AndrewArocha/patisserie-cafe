import { Router } from "express";
import { deleteCurrentUser, getCurrentUser } from "../controllers/userController.js";

export const userRoutes = Router();
userRoutes.get("/me", getCurrentUser);
userRoutes.delete("/me", deleteCurrentUser);
