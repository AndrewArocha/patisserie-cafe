import type { RequestHandler } from "express";
import { HTTP_MESSAGES } from "../config/constants.js";
import { ApiError } from "../middleware/errors.js";
import { Order } from "../models/Order.js";

export const listOrders: RequestHandler = async (request, response) => {
  const orders = await Order.find({ owner: request.userId }).sort({ createdAt: -1 }).lean();
  response.json({ orders });
};

export const deleteOrder: RequestHandler = async (request, response) => {
  const orderId = request.params.id;
  if (typeof orderId !== "string" || !/^[a-f\d]{24}$/i.test(orderId))
    throw new ApiError(400, HTTP_MESSAGES.orderIdInvalid);
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, HTTP_MESSAGES.orderNotFound);
  if (String(order.owner) !== request.userId) throw new ApiError(403, HTTP_MESSAGES.orderAccessForbidden);
  if (order.status === "paid") throw new ApiError(400, HTTP_MESSAGES.paidOrderDelete);
  await order.deleteOne();
  response.json({ message: HTTP_MESSAGES.orderDeleted });
};
