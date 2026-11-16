import { Router } from "express";
import { ERROR_MESSAGES } from "../config/constants.js";
import { deleteOrder, listOrders } from "../controllers/orderController.js";

export const orderRoutes = Router();
orderRoutes.get("/", listOrders);
orderRoutes.post("/", (_request, response) => {
  response.status(410).json({ message: ERROR_MESSAGES.spotOnCheckoutRequired });
});
orderRoutes.delete("/:id", deleteOrder);
