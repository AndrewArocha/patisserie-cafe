import type { RequestHandler } from "express";
import { ERROR_MESSAGES, HTTP_MESSAGES, MENU_CATALOG } from "../config/constants.js";
import { ApiError } from "../middleware/errors.js";
import { Order } from "../models/Order.js";
import { validateAndPriceItems } from "../services/orderService.js";

export const listOrders: RequestHandler = async (request, response) => {
  const orders = await Order.find({ owner: request.userId }).sort({ createdAt: -1 }).lean();
  response.json({ orders });
};

export const createOrder: RequestHandler = async (request, response) => {
  const { items } = request.body as { items: Array<{ itemId: string; quantity: number }> };
  if (!items?.length) throw new ApiError(400, HTTP_MESSAGES.badRequest);
  const pricedItems = validateAndPriceItems(items);
  if (!pricedItems) throw new ApiError(400, HTTP_MESSAGES.orderItemsUnavailable);
  for (const item of pricedItems) {
    const minimum = MENU_CATALOG[item.itemId as keyof typeof MENU_CATALOG].minimum;
    if (item.quantity < minimum) throw new ApiError(400, ERROR_MESSAGES.orderMinimum(item.name, minimum));
  }
  const order = await Order.create({
    owner: request.userId,
    items: pricedItems.map(({ itemId, quantity }) => ({ itemId, quantity })),
  });
  response.status(201).json({ order });
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
