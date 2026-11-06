import { MENU_CATALOG } from "../config/constants.js";

export type RequestedItem = { itemId: string; quantity: number };

export function validateAndPriceItems(items: RequestedItem[]) {
  const pricedItems = items.map((item) => {
    const product = MENU_CATALOG[item.itemId as keyof typeof MENU_CATALOG];
    if (!product) return null;
    return { ...item, name: product.name, unitAmount: product.priceCents };
  });
  if (pricedItems.some((item) => item === null)) return null;
  return pricedItems as Array<RequestedItem & { name: string; unitAmount: number }>;
}
