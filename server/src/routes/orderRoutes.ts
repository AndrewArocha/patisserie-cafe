import { Router } from "express";
import { createOrder, deleteOrder, listOrders } from "../controllers/orderController.js";
import { validateBody } from "../middleware/validate.js";
import { createOrderSchema } from "../validators/orderSchemas.js";

export const orderRoutes = Router();
orderRoutes.get("/", listOrders);
orderRoutes.post("/", validateBody(createOrderSchema), createOrder);
orderRoutes.delete("/:id", deleteOrder);
