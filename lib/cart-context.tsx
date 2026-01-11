"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
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
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("urbanZ_cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from local storage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("urbanZ_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === newItem.productId && i.size === newItem.size && i.color === newItem.color
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + newItem.quantity } : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size && i.color === color)));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = React.useMemo(() => ({
    items, addToCart, removeFromCart, clearCart, total
  }), [items, total]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
