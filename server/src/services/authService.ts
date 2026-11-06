import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { environment } from "../config/environment.js";
import { User } from "../models/User.js";

export async function createUser(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);
  return User.create({ email, passwordHash });
}

export async function authenticateUser(email: string, password: string) {
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return null;
  return user;
}

export function createAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, environment.JWT_SECRET, {
    expiresIn: environment.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
}

export function serializeUser(user: { _id: unknown; email: string; createdAt: Date }) {
  return { id: String(user._id), email: user.email, createdAt: user.createdAt };
}
