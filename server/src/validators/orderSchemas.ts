import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(z.object({ itemId: z.string().min(1).max(80), quantity: z.number().int().min(1).max(100) }))
    .min(1)
    .max(30),
});

export const checkoutSchema = z.object({ orderId: z.string().regex(/^[a-f\d]{24}$/i) });
