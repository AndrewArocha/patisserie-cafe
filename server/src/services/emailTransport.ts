import nodemailer from "nodemailer";
import { environment } from "../config/environment.js";

export const emailTransport = environment.SMTP_HOST
  ? nodemailer.createTransport({
      host: environment.SMTP_HOST,
      port: environment.SMTP_PORT,
      secure: environment.SMTP_SECURE,
      auth:
        environment.SMTP_USER && environment.SMTP_PASS
          ? { user: environment.SMTP_USER, pass: environment.SMTP_PASS }
          : undefined,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    })
  : null;
