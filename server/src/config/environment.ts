import "dotenv/config";
import { z } from "zod";
import {
  DEFAULT_JWT_EXPIRY,
  DEFAULT_PASSWORD_MIN_LENGTH,
  DEFAULT_PORT,
  ERROR_MESSAGES,
} from "./constants.js";

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(DEFAULT_PORT),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:5173"),
  MONGODB_URI: z.string().min(1).default("mongodb://127.0.0.1:27017/patisserie-cafe"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must contain at least 32 characters."),
  JWT_EXPIRES_IN: z.string().default(DEFAULT_JWT_EXPIRY),
  PASSWORD_MIN_LENGTH: z.coerce.number().int().min(10).default(DEFAULT_PASSWORD_MIN_LENGTH),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_SUCCESS_URL: z.string().url().default("http://localhost:5173/order?checkout=success"),
  STRIPE_CANCEL_URL: z.string().url().default("http://localhost:5173/order?checkout=cancel"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z
    .string()
    .default("false")
    .transform((value) => value.toLowerCase() === "true"),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().default("contact@patisseriecafe.co"),
  CATERING_REQUEST_EMAIL: z.string().email().default("contact@patisseriecafe.co"),
});

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  throw new Error(ERROR_MESSAGES.invalidEnvironment);
}

export const environment = parsedEnvironment.data;
