import { Schema, model } from "mongoose";
import type { CateringRequest } from "../validators/cateringSchemas.js";

export type CateringDecision = "accepted" | "rejected";

interface CateringOrderRecord {
  requestCode: string;
  details: CateringRequest;
  startsAt: Date;
  decision?: CateringDecision;
  decidedAt?: Date;
  decisionEmailId?: string;
}

const cateringOrderSchema = new Schema<CateringOrderRecord>(
  {
    requestCode: { type: String, required: true, unique: true },
    details: { type: Schema.Types.Mixed, required: true },
    startsAt: { type: Date, required: true },
    decision: { type: String, enum: ["accepted", "rejected"] },
    decidedAt: Date,
    decisionEmailId: String,
  },
  { timestamps: true, versionKey: false },
);

export const CateringOrder = model("CateringOrder", cateringOrderSchema);
