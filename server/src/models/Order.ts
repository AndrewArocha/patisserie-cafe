import { Schema, model } from "mongoose";

const orderItemSchema = new Schema(
  {
    itemId: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1, max: 100 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: { type: [orderItemSchema], required: true, validate: (items: unknown[]) => items.length > 0 },
    status: { type: String, enum: ["pending", "paid"], default: "pending", required: true },
    checkoutSessionId: { type: String, select: false },
  },
  { timestamps: true, versionKey: false },
);

export const Order = model("Order", orderSchema);
