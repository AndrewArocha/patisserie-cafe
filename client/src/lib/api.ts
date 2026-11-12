import type { ApiErrorResponse, ApiOrder, AuthResponse, PublicUser, UserResponse } from "../types";
import type { CateringRequest } from "./catering";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:4000/api").replace(/\/$/, "");
const TOKEN_KEY = "patisserie.accessToken";
const API_REQUEST_TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function readAccessToken(): string | null {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function saveAccessToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  const token = readAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: options.signal ?? AbortSignal.timeout(API_REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new ApiError("We couldn’t reach the café right now. Please try again in a moment.", 0);
  }
  const payload = (await response.json().catch(() => ({}))) as Partial<ApiErrorResponse> & T;
  if (!response.ok) {
    throw new ApiError(payload.message ?? "Something went wrong. Please try again.", response.status);
  }
  return payload as T;
}

export const api = {
  requestCatering: (details: CateringRequest) =>
    request<{ message: string }>("/catering/requests", {
      method: "POST",
      body: JSON.stringify(details),
      signal: AbortSignal.timeout(45_000),
    }),
  signUp: (email: string, password: string) =>
    request<{ user: PublicUser }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  signIn: (email: string, password: string) =>
    request<AuthResponse>("/auth/signin", { method: "POST", body: JSON.stringify({ email, password }) }),
  requestPasswordReset: (email: string) =>
    request<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string) =>
    request<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),
  currentUser: () => request<UserResponse>("/users/me"),
  deleteAccount: () => request<{ message: string }>("/users/me", { method: "DELETE" }),
  orders: () => request<{ orders: ApiOrder[] }>("/orders"),
  createOrder: (items: Array<{ itemId: string; quantity: number }>) =>
    request<{ order: ApiOrder }>("/orders", { method: "POST", body: JSON.stringify({ items }) }),
  deleteOrder: (id: string) =>
    request<{ message: string }>(`/orders/${encodeURIComponent(id)}`, { method: "DELETE" }),
  checkout: (orderId: string) =>
    request<{ checkoutUrl: string | null }>("/payments/checkout", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    }),
  confirmCheckout: (sessionId: string) =>
    request<{ status: "pending" | "paid"; message: string }>(
      `/payments/sessions/${encodeURIComponent(sessionId)}`,
    ),
};
