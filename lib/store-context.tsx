"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { products as initialProducts } from "./data";

export type Product = {
  id: number | string;
  name: string;
  price: number;
  category: string;
  image: string;
  tags?: string[];
  description?: string;
  gender?: string;
  style?: string;
  occasion?: string;
  status: "pending" | "approved" | "rejected";
  sellerId?: string;
  hasRefundPolicy?: boolean; // New: Shopkeeper control
  badges?: string[]; // New: Trust badges
  highlights?: string[]; // New: Bullet points
  details?: string; // New: Full product description
  images?: string[]; // New: Multiple images
  inStock?: boolean; // New: Availability status
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "shopkeeper" | "customer";
  status: "active" | "banned";
  joined: string;
};

export type Order = {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered";
  date: string;
  sellerId?: string; // To link orders to shopkeepers
};

export type CustomDesign = {
  id: string;
  userId: string;
  designUrl: string;
  notes: string;
  type: "embroidery" | "pod";
  status: "pending" | "approved" | "rejected" | "completed";
  date: string;
};

type StoreContextType = {
  products: Product[];
  orders: Order[];
  users: User[];
  customDesigns: CustomDesign[]; // New
  addProduct: (product: Omit<Product, "id">) => void;
  deleteProduct: (id: number | string) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  updateProductStatus: (id: number | string, status: Product["status"]) => void;
  toggleProductStock: (id: number | string) => void; // New
  updateUserStatus: (id: string, status: User["status"]) => void;
  placeOrder: (order: Omit<Order, "id" | "date" | "status">) => void;
  addCustomDesign: (design: Omit<CustomDesign, "id" | "date" | "status">) => void; // New
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number | string) => void;
  isLoading: boolean;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  // Initialize products with status
  // Initialize products with status (Default for SSR/Initial Render)
  const [products, setProducts] = useState<Product[]>(() => {
    return initialProducts.map(p => ({
      ...p,
      status: "approved" as const,
      hasRefundPolicy: true,
      inStock: true,
      badges: ["Best Seller", "UrbanZ Assured"],
      highlights: [
        "Premium heavyweight fabric",
        "Pre-shrunk for perfect fit",
        "Double-stitched reinforced seams",
        "Ethically sourced materials"
      ],
      details: "This isn't just a piece of clothing; it's a statement. Crafted from our signature heavyweight cotton blend, this item is designed to withstand the urban grind while keeping you comfortable. The fit is boxy and oversized, perfect for layering or wearing solo. Care instructions: Machine wash cold, tumble dry low. Do not bleach. Iron on low heat if needed."
    }));
  });

  const [orders, setOrders] = useState<Order[]>([
    { id: "ORD-001", customerName: "Rahul Sharma", items: ["Cyberpunk Bomber"], total: 2499, status: "Pending", date: "2025-05-15" },
    { id: "ORD-002", customerName: "Priya Singh", items: ["Neo-Tokyo Runners"], total: 3999, status: "Shipped", date: "2025-05-14" },
  ]);

  // New Custom Designs State
  const [customDesigns, setCustomDesigns] = useState<CustomDesign[]>([]);

  // Load data from localStorage on client mount
  useEffect(() => {
    const savedProducts = localStorage.getItem("urbanZ_products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }

    const savedOrders = localStorage.getItem("urbanZ_orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }

    const savedDesigns = localStorage.getItem("urbanZ_custom_designs");
    if (savedDesigns) {
      setCustomDesigns(JSON.parse(savedDesigns));
    }
    setIsLoading(false);
  }, []);

  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "Rahul Sharma", email: "rahul@gmail.com", role: "customer", status: "active", joined: "May 2025" },
    { id: "2", name: "Clothify Store", email: "shop1@urbanz.com", role: "shopkeeper", status: "active", joined: "April 2025" },
    { id: "3", name: "Admin User", email: "admin@urbanz.com", role: "admin", status: "active", joined: "Jan 2025" },
    // New Specialist Shopkeepers
    { id: "4", name: "Thread Masters", email: "embroidery@urbanz.com", role: "shopkeeper", status: "active", joined: "June 2025" },
    { id: "5", name: "Print Freaks", email: "pod@urbanz.com", role: "shopkeeper", status: "active", joined: "June 2025" },
  ]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    // Load wishlist from local storage on mount
    const saved = localStorage.getItem("wishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Persist Products and Orders
  useEffect(() => {
    localStorage.setItem("urbanZ_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("urbanZ_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("urbanZ_custom_designs", JSON.stringify(customDesigns));
  }, [customDesigns]);

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now(),
      status: "pending", // Default to pending for approval
      inStock: true,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const deleteProduct = (id: number | string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const updateProductStatus = (id: number | string, status: Product["status"]) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const toggleProductStock = (id: number | string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p));
  };

  const updateUserStatus = (id: string, status: User["status"]) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
  };

  const placeOrder = (orderData: Omit<Order, "id" | "date" | "status">) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      status: "Pending",
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const addCustomDesign = (designData: Omit<CustomDesign, "id" | "date" | "status">) => {
    const newDesign: CustomDesign = {
      ...designData,
      id: `CD-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      status: "pending",
    };
    setCustomDesigns(prev => [newDesign, ...prev]);
  };

  const addToWishlist = (product: Product) => {
    if (!wishlist.find(p => p.id === product.id)) {
      setWishlist(prev => [...prev, product]);
    }
  };

  const removeFromWishlist = (id: number | string) => {
    setWishlist(prev => prev.filter(p => p.id !== id));
  };

  const value = React.useMemo(() => ({
    products, orders, users, customDesigns,
    addProduct, deleteProduct, updateOrderStatus, updateProductStatus, toggleProductStock, updateUserStatus, placeOrder, addCustomDesign,
    wishlist, addToWishlist, removeFromWishlist,
    isLoading
  }), [products, orders, users, customDesigns, wishlist, isLoading]);

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
