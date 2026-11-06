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
