"use client";

/**
 * UrbanZ — Cart Context (Server-Synced + localStorage Fallback)
 *
 * Strategy:
 * - Logged-in users: Cart is synced with Django API (server-side).
 * - Guest users: Cart stays in localStorage only.
 * - On login: guest cart is merged with server cart.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./auth-context";
import { fetchCart, addToCartAPI, updateCartItemAPI, removeCartItemAPI, clearCartAPI } from "./api";

export type CartItem = {
  id?: number; // Server-side cart item ID
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, newQuantity: number) => void;
  clearCart: () => void;
  total: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// localStorage helpers (guest fallback)
// ---------------------------------------------------------------------------
const CART_KEY = "urbanZ_cart";

function loadLocalCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveLocalCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

// ---------------------------------------------------------------------------
// Map server cart item to CartItem type
// ---------------------------------------------------------------------------
function mapServerItem(item: any): CartItem {
  return {
    id: item.id,
    productId: String(item.product?.id || ""),
    name: item.product?.name || "",
    price: parseFloat(item.product?.price || 0),
    quantity: item.quantity,
    size: item.size || "",
    color: item.color || "",
    image: item.product?.image || item.product?.image_url || "",
  };
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ---------------------------------------------------------------------------
  // Load cart — server if logged in, localStorage otherwise
  // ---------------------------------------------------------------------------
  const loadCart = useCallback(async () => {
    if (user) {
      setIsLoading(true);
      try {
        const cart = await fetchCart();
        const serverItems = (cart.items || []).map(mapServerItem);
        setItems(serverItems);
      } catch {
        // Fallback to localStorage if API fails
        setItems(loadLocalCart());
      } finally {
        setIsLoading(false);
        setIsLoaded(true);
      }
    } else {
      setItems(loadLocalCart());
      setIsLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Persist locally when not logged in
  useEffect(() => {
    if (isLoaded && !user) {
      saveLocalCart(items);
    }
  }, [items, isLoaded, user]);

  // ---------------------------------------------------------------------------
  // Add to Cart
  // ---------------------------------------------------------------------------
  const addToCart = async (newItem: CartItem) => {
    if (user) {
      try {
        const cart = await addToCartAPI(
          parseInt(newItem.productId),
          newItem.quantity,
          newItem.size,
          newItem.color
        );
        setItems((cart.items || []).map(mapServerItem));
      } catch (e) {
        console.error("addToCart API error:", e);
        // Fallback: optimistic local update
        setItems((prev) => {
          const existing = prev.find(
            (i) => i.productId === newItem.productId && i.size === newItem.size && i.color === newItem.color
          );
          if (existing) {
            return prev.map((i) => i === existing ? { ...i, quantity: i.quantity + newItem.quantity } : i);
          }
          return [...prev, newItem];
        });
      }
    } else {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.productId === newItem.productId && i.size === newItem.size && i.color === newItem.color
        );
        if (existing) {
          return prev.map((i) => i === existing ? { ...i, quantity: i.quantity + newItem.quantity } : i);
        }
        return [...prev, newItem];
      });
    }
  };

  // ---------------------------------------------------------------------------
  // Remove from Cart
  // ---------------------------------------------------------------------------
  const removeFromCart = async (productId: string, size: string, color: string) => {
    const item = items.find(
      (i) => i.productId === productId && i.size === size && i.color === color
    );

    if (user && item?.id) {
      try {
        const cart = await removeCartItemAPI(item.id);
        setItems((cart.items || []).map(mapServerItem));
        return;
      } catch (e) {
        console.error("removeFromCart API error:", e);
      }
    }

    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size && i.color === color))
    );
  };

  // ---------------------------------------------------------------------------
  // Update Quantity
  // ---------------------------------------------------------------------------
  const updateQuantity = async (productId: string, size: string, color: string, newQuantity: number) => {
    const item = items.find(
      (i) => i.productId === productId && i.size === size && i.color === color
    );

    if (user && item?.id) {
      try {
        const cart = await updateCartItemAPI(item.id, Math.max(1, newQuantity));
        setItems((cart.items || []).map(mapServerItem));
        return;
      } catch (e) {
        console.error("updateQuantity API error:", e);
      }
    }

    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size && i.color === color
          ? { ...i, quantity: Math.max(1, newQuantity) }
          : i
      )
    );
  };

  // ---------------------------------------------------------------------------
  // Clear Cart
  // ---------------------------------------------------------------------------
  const clearCart = async () => {
    if (user) {
      try {
        await clearCartAPI();
      } catch (e) {
        console.error("clearCart API error:", e);
      }
    }
    setItems([]);
    saveLocalCart([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = React.useMemo(
    () => ({ items, addToCart, removeFromCart, updateQuantity, clearCart, total, isLoading }),
    [items, total, isLoading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
