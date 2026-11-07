import { z } from "zod";
import { environment } from "../config/environment.js";
import { ERROR_MESSAGES } from "../config/constants.js";

export const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(environment.PASSWORD_MIN_LENGTH, ERROR_MESSAGES.passwordTooShort(environment.PASSWORD_MIN_LENGTH))
    .max(128),
});

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1).max(128),
});

export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((email) => email.toLowerCase()),
});

export const passwordResetSchema = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/),
  password: z
    .string()
    .min(environment.PASSWORD_MIN_LENGTH, ERROR_MESSAGES.passwordTooShort(environment.PASSWORD_MIN_LENGTH))
    .max(128),
});
