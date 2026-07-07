"use client";

import { createContext, useCallback, useContext, useMemo, ReactNode } from "react";
import { CartItem, Product } from "@/types";
import { getProductById, getEffectivePrice } from "@/data/products";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TAX_RATE, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING } from "@/lib/constants";

interface StoredCartItem {
  productId: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [storedItems, setStoredItems, isHydrated] = useLocalStorage<StoredCartItem[]>("value-partners-cart", []);

  const items: CartItem[] = useMemo(() => {
    return storedItems
      .map((item) => {
        const product = getProductById(item.productId);
        if (!product) return null;
        return { product, quantity: item.quantity };
      })
      .filter((item): item is CartItem => item !== null);
  }, [storedItems]);

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      setStoredItems((prev) => {
        const existing = prev.find((i) => i.productId === product.id);
        if (existing) {
          return prev.map((i) =>
            i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [...prev, { productId: product.id, quantity }];
      });
    },
    [setStoredItems]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setStoredItems((prev) => prev.filter((i) => i.productId !== productId));
    },
    [setStoredItems]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        setStoredItems((prev) => prev.filter((i) => i.productId !== productId));
        return;
      }
      setStoredItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
      );
    },
    [setStoredItems]
  );

  const clearCart = useCallback(() => setStoredItems([]), [setStoredItems]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + getEffectivePrice(item.product) * item.quantity, 0),
    [items]
  );

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      shipping,
      tax,
      total,
      isHydrated,
    }),
    [items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, subtotal, shipping, tax, total, isHydrated]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
