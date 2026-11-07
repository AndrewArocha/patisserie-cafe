import { Schema, model } from "mongoose";

export interface UserRecord {
  _id: Schema.Types.ObjectId;
  email: string;
  passwordHash: string;
  passwordResetTokenHash?: string;
  passwordResetExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserRecord>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    passwordHash: { type: String, required: true, select: false },
    passwordResetTokenHash: { type: String, select: false },
    passwordResetExpiresAt: { type: Date, select: false },
  },
  { timestamps: true, versionKey: false },
);

export const User = model<UserRecord>("User", userSchema);
