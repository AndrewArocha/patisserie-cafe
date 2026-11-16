export const APPLICATION_NAME = "Patisserie Café API";
export const DEFAULT_PORT = 4000;
export const DEFAULT_PASSWORD_MIN_LENGTH = 10;
export const DEFAULT_JWT_EXPIRY = "2h";
export const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000;
export const MAX_DATABASE_POOL_SIZE = 10;
export const API_PREFIX = "/api";
export const CATERING_ADDRESS = "catering@patisseriecafe.co";

const ORDERS_PHONE = "(551) 241-8349";

export const HTTP_MESSAGES = {
  badRequest: "Please check the submitted information and try again.",
  unauthorized: "Your session is not valid. Please sign in again.",
  forbidden: "You do not have access to this record.",
  notFound: "The requested resource could not be found.",
  routeNotFound: "This API route does not exist.",
  conflict: "An account with this email already exists.",
  serverError: "Something went wrong. Please try again.",
  rateLimit: "Too many attempts. Please wait a moment and try again.",
  accountNotFound: "Your account could not be found.",
  accountDeleted: "Your account and its order records have been deleted.",
  orderNotFound: "This order could not be found.",
  orderIdInvalid: "Please check the order ID and try again.",
  orderAccessForbidden: "You do not have access to this order.",
  paidOrderDelete: `A paid order cannot be deleted online. Call our orders line at ${ORDERS_PHONE} for help.`,
  checkoutSessionNotFound: "This checkout session could not be found.",
  checkoutSessionInvalid: "Please check the checkout session and try again.",
  orderDeleted: "Your order has been removed.",
  badRequestFallback: "Please check the submitted information.",
  passwordResetAccepted: "If an account exists for that email, we’ll send a password reset link shortly.",
  passwordResetUnavailable: "Password reset email isn’t available right now. Please call the café for help.",
  passwordResetInvalid: "This reset link is invalid or expired. Request a new one.",
  passwordResetComplete: "Your password has been changed. Please sign in with your new password.",
} as const;

export const ERROR_MESSAGES = {
  invalidCredentials: "Email or password is incorrect.",
  passwordTooShort: (minimum: number) => `Password must be at least ${minimum} characters long.`,
  stripeMissing: `Legacy payment verification is unavailable.`,
  spotOnCheckoutRequired: "Visit /order to start a new online order.",
  invalidEnvironment: "Server environment configuration is invalid.",
  passwordResetEmailSubject: "Reset your Patisserie Café password",
} as const;
