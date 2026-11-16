function readSpotOnOrderUrl(value?: string) {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value);
    if (url.origin === "https://order.spoton.com" && !url.username && !url.password && url.pathname !== "/") {
      return url.href;
    }
  } catch {
    // An invalid URL must never become a customer-facing checkout link.
  }
  return null;
}

export const spotOnOrderUrl = readSpotOnOrderUrl(import.meta.env.VITE_SPOTON_ORDER_URL);
