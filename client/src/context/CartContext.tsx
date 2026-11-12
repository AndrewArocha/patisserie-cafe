import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { findMenuItem } from "../lib/menu";
import type { CartEntry, MenuItem } from "../types";

interface CartContextValue {
  entries: CartEntry[];
  addItem: (item: MenuItem) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<CartEntry[]>(() => {
    try {
      const stored = window.localStorage.getItem("patisserie.cart");
      if (!stored) return [];
      return (JSON.parse(stored) as CartEntry[]).map((entry) => ({
        ...entry,
        item: findMenuItem(entry.item.id) ?? entry.item,
      }));
    } catch {
      return [];
    }
  });
  const update = useCallback((change: (current: CartEntry[]) => CartEntry[]) => {
    setEntries((current) => {
      const next = change(current);
      window.localStorage.setItem("patisserie.cart", JSON.stringify(next));
      return next;
    });
  }, []);
  const addItem = useCallback(
    (item: MenuItem) =>
      update((current) => {
        const existing = current.find((entry) => entry.item.id === item.id);
        return existing
          ? current.map((entry) =>
              entry.item.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
            )
          : [...current, { item, quantity: 1 }];
      }),
    [update],
  );
  const setQuantity = useCallback(
    (itemId: string, quantity: number) =>
      update((current) =>
        current.map((entry) =>
          entry.item.id === itemId ? { ...entry, quantity: Math.max(1, Math.min(100, quantity)) } : entry,
        ),
      ),
    [update],
  );
  const removeItem = useCallback(
    (itemId: string) => update((current) => current.filter((entry) => entry.item.id !== itemId)),
    [update],
  );
  const clearCart = useCallback(() => update(() => []), [update]);
  const cartCount = entries.reduce((sum, entry) => sum + entry.quantity, 0);
  const cartTotal = entries.reduce((sum, entry) => sum + (entry.item.price ?? 0) * entry.quantity, 0);
  const value = useMemo(
    () => ({ entries, addItem, setQuantity, removeItem, clearCart, cartCount, cartTotal }),
    [entries, addItem, setQuantity, removeItem, clearCart, cartCount, cartTotal],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider.");
  return context;
}
