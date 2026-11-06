import type { RequestHandler } from "express";
import Stripe from "stripe";
import { ERROR_MESSAGES, HTTP_MESSAGES } from "../config/constants.js";
import { environment } from "../config/environment.js";
import { ApiError } from "../middleware/errors.js";
import { Order } from "../models/Order.js";
import { validateAndPriceItems } from "../services/orderService.js";
import { z } from "zod";

export const createCheckoutSession: RequestHandler = async (request, response) => {
  if (!environment.STRIPE_SECRET_KEY) throw new ApiError(503, ERROR_MESSAGES.stripeMissing);
  const { orderId } = request.body as { orderId: string };
  if (!orderId) throw new ApiError(400, HTTP_MESSAGES.badRequest);
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, HTTP_MESSAGES.orderNotFound);
  if (String(order.owner) !== request.userId) throw new ApiError(403, HTTP_MESSAGES.orderAccessForbidden);
  if (order.status === "paid") throw new ApiError(400, HTTP_MESSAGES.orderAlreadyPaid);

  const pricedItems = validateAndPriceItems(
    order.items.map(({ itemId, quantity }) => ({ itemId, quantity })),
  );
  if (!pricedItems) throw new ApiError(400, HTTP_MESSAGES.checkoutItemUnavailable);
  const stripe = new Stripe(environment.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    automatic_tax: { enabled: true },
    billing_address_collection: "required",
    line_items: pricedItems.map((item) => ({
      quantity: item.quantity,
      price_data: { currency: "usd", unit_amount: item.unitAmount, product_data: { name: item.name } },
    })),
    success_url: `${environment.STRIPE_SUCCESS_URL}${environment.STRIPE_SUCCESS_URL.includes("?") ? "&" : "?"}session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: environment.STRIPE_CANCEL_URL,
    metadata: { orderId: order.id, ownerId: request.userId ?? "" },
  });
  order.checkoutSessionId = session.id;
  await order.save();
  response.status(201).json({ checkoutUrl: session.url });
};

export const confirmCheckoutSession: RequestHandler = async (request, response) => {
  const sessionIdResult = z
    .string()
    .regex(/^cs_(test|live)_[A-Za-z0-9]+$/)
    .safeParse(request.params.sessionId);
  if (!sessionIdResult.success) throw new ApiError(400, HTTP_MESSAGES.checkoutSessionInvalid);
  if (!environment.STRIPE_SECRET_KEY) throw new ApiError(503, ERROR_MESSAGES.stripeMissing);

  const stripe = new Stripe(environment.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.retrieve(sessionIdResult.data);
  const orderId = session.metadata?.orderId;
  if (!orderId) throw new ApiError(404, HTTP_MESSAGES.checkoutSessionNotFound);
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, HTTP_MESSAGES.orderNotFound);
  if (String(order.owner) !== request.userId) throw new ApiError(403, HTTP_MESSAGES.orderAccessForbidden);

  if (session.payment_status === "paid" && order.status !== "paid") {
    order.status = "paid";
    await order.save();
  }
  response.json({
    status: order.status,
    message:
      order.status === "paid"
        ? "Payment received. Thank you for your order."
        : "Your payment is still processing.",
  });
};
