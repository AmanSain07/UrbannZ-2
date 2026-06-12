"use client";

/**
 * UrbanZ — Store Context (API-backed)
 *
 * Replaces the static data.ts source with real Django API calls.
 * Products, orders, categories, and admin operations are all API-driven.
 * Falls back gracefully if user is not logged in.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  fetchProducts,
  fetchAllProductsAdmin,
  fetchMyOrders,
  fetchVendorOrders,
  fetchAllUsers,
  approveProductAPI,
  rejectProductAPI,
  toggleProductStockAPI,
  updateOrderStatusAPI,
  updateUserStatusAPI,
  fetchCategories,
} from "./api";
import { useAuth } from "./auth-context";

// ---------------------------------------------------------------------------
// Types — preserved from original for frontend compatibility
// ---------------------------------------------------------------------------
export type Product = {
  id: number | string;
  name: string;
  price: number;
  category: string | number;
  category_name?: string;
  image: string | string[];
  images?: Array<{ id: number; src: string; order: number }>;
  image_url?: string;
  tags?: string[];
  description?: string;
  gender?: string;
  style?: string;
  occasion?: string;
  status?: "pending" | "approved" | "rejected";
  sellerId?: string;
  owner?: string;
  in_stock?: boolean;
  inStock?: boolean;
  slug?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "shopkeeper" | "customer";
  status: "active" | "banned";
  joined: string;
  is_suspended?: boolean;
  storeDetails?: { storeName?: string; [key: string]: any };
};

export type Order = {
  id: string | number;
  customerName: string;
  items: any[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "Pending" | "Processing" | "Shipped" | "Delivered";
  date: string;
  sellerId?: string;
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
  customDesigns: CustomDesign[];
  wishlist: Product[];
  categories: any[];
  isLoading: boolean;

  // Actions
  addProduct: (product: any) => Promise<void>;
  updateProduct: (id: string | number, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number | string) => Promise<void>;
  updateOrderStatus: (id: string | number, status: string) => Promise<void>;
  updateProductStatus: (id: number | string, status: Product["status"]) => Promise<void>;
  toggleProductStock: (id: number | string) => Promise<void>;
  updateUserStatus: (id: string, status: User["status"]) => Promise<void>;
  placeOrder: (order: Omit<Order, "id" | "date" | "status">) => Promise<void>;
  addCustomDesign: (design: Omit<CustomDesign, "id" | "date" | "status">) => Promise<void>;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number | string) => void;
  refreshProducts: () => Promise<void>;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Helper — map backend product to frontend Product type
// ---------------------------------------------------------------------------
function mapProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    price: parseFloat(p.price),
    category: p.category_name?.toLowerCase() || p.category,
    category_name: p.category_name,
    image: p.image || p.image_url || "",
    image_url: p.image_url,
    images: p.images || [],
    tags: p.tags || [],
    description: p.description,
    gender: p.gender,
    style: p.style,
    occasion: p.occasion,
    status: p.status,
    owner: p.owner,
    in_stock: p.in_stock,
    inStock: p.in_stock,
    slug: p.slug,
  };
}

function mapOrder(o: any): Order {
  return {
    id: o.id,
    customerName: o.customer_name || "Customer",
    items: o.items || [],
    total: parseFloat(o.total || 0),
    status: o.status,
    date: o.created_at?.split("T")[0] || "",
    sellerId: o.customer,
  };
}

function mapUser(u: any): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role === "vendor" ? "shopkeeper" : u.role,
    status: u.is_suspended ? "banned" : "active",
    joined: u.created_at?.split("T")[0] || "",
    is_suspended: u.is_suspended,
  };
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [customDesigns] = useState<CustomDesign[]>([]);

  // Load wishlist from localStorage (client-side only for now)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("urbanZ_wishlist");
      if (saved) setWishlist(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("urbanZ_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // ---------------------------------------------------------------------------
  // Initial Data Load
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!isMounted) return;
      setIsLoading(true);
      try {
        // Always load public products and categories
        const [productsData, categoriesData] = await Promise.allSettled([
          fetchProducts(),
          fetchCategories(),
        ]);

        if (!isMounted) return;

        if (productsData.status === "fulfilled") {
          const results = productsData.value?.results || productsData.value || [];
          setProducts(Array.isArray(results) ? results.map(mapProduct) : []);
        }

        if (categoriesData.status === "fulfilled") {
          setCategories(categoriesData.value || []);
        }

        // Role-specific data
        if (authUser?.role === "admin") {
          const [allProducts, allUsers, allOrders] = await Promise.allSettled([
            fetchAllProductsAdmin(),
            fetchAllUsers(),
            fetchVendorOrders(), // Admin sees all orders
          ]);

          if (!isMounted) return;

          if (allProducts.status === "fulfilled") {
            const results = allProducts.value?.results || allProducts.value || [];
            setProducts(Array.isArray(results) ? results.map(mapProduct) : []);
          }
          if (allUsers.status === "fulfilled") {
            const results = allUsers.value?.results || allUsers.value || [];
            setUsers(Array.isArray(results) ? results.map(mapUser) : []);
          }
          if (allOrders.status === "fulfilled") {
            const results = allOrders.value?.results || allOrders.value || [];
            setOrders(Array.isArray(results) ? results.map(mapOrder) : []);
          }
        } else if (authUser?.role === "shopkeeper") {
          const [myOrders] = await Promise.allSettled([fetchVendorOrders()]);
          if (!isMounted) return;
          if (myOrders.status === "fulfilled") {
            const results = myOrders.value?.results || myOrders.value || [];
            setOrders(Array.isArray(results) ? results.map(mapOrder) : []);
          }
        } else if (authUser?.role === "customer") {
          const [myOrders] = await Promise.allSettled([fetchMyOrders()]);
          if (!isMounted) return;
          if (myOrders.status === "fulfilled") {
            const results = myOrders.value?.results || myOrders.value || [];
            setOrders(Array.isArray(results) ? results.map(mapOrder) : []);
          }
        }
      } catch (e) {
        console.error("StoreContext load error:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [authUser?.role]);

  const refreshProducts = useCallback(async () => {
    try {
      const data = authUser?.role === "admin" ? await fetchAllProductsAdmin() : await fetchProducts();
      const results = data?.results || data || [];
      const mappedProducts = Array.isArray(results) ? results.map(mapProduct) : [];
      setProducts(mappedProducts);
    } catch (e) {
      console.error("Error refreshing products:", e);
    }
  }, [authUser?.role]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------
  const updateProductStatus = async (id: number | string, status: Product["status"]) => {
    try {
      if (status === "approved") await approveProductAPI(id);
      else if (status === "rejected") await rejectProductAPI(id);
      setProducts((prev) => prev.map((p) => (p.id.toString() === id.toString() ? { ...p, status } : p)));
    } catch (e) {
      console.error("updateProductStatus error:", e);
    }
  };

  const toggleProductStock = async (id: number | string) => {
    try {
      const res = await toggleProductStockAPI(id);
      setProducts((prev) => prev.map((p) => (p.id.toString() === id.toString() ? { ...p, in_stock: res.in_stock, inStock: res.in_stock } : p)));
    } catch (e) {
      console.error("toggleProductStock error:", e);
    }
  };

  const updateOrderStatus = async (id: string | number, status: string) => {
    try {
      await updateOrderStatusAPI(id, status);
      setOrders((prev) => prev.map((o) => (o.id.toString() === id.toString() ? { ...o, status: status as Order["status"] } : o)));
    } catch (e) {
      console.error("updateOrderStatus error:", e);
    }
  };

  const updateUserStatus = async (id: string, status: User["status"]) => {
    try {
      const action = status === "banned" ? "suspend" : "activate";
      await updateUserStatusAPI(id, action);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    } catch (e) {
      console.error("updateUserStatus error:", e);
    }
  };

  const placeOrder = async (orderData: Omit<Order, "id" | "date" | "status">) => {
    // Orders are placed via cart context now; keep for backward compat
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Stub-compatible no-ops for product CRUD (done via api.ts directly from components)
  const addProduct = async () => { await refreshProducts(); };
  const updateProduct = async () => { await refreshProducts(); };
  const deleteProduct = async () => { await refreshProducts(); };
  const addCustomDesign = async () => {};

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.find((p) => p.id.toString() === product.id.toString())) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id: number | string) => {
    setWishlist((prev) => prev.filter((p) => p.id.toString() !== id.toString()));
  };

  const value = React.useMemo(
    () => ({
      products, orders, users, customDesigns, wishlist, categories, isLoading,
      placeOrder, addToWishlist, removeFromWishlist,
      addProduct, updateProduct, deleteProduct,
      updateOrderStatus, updateProductStatus, toggleProductStock,
      updateUserStatus, addCustomDesign, refreshProducts,
    }),
    [products, orders, users, customDesigns, wishlist, categories, isLoading]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
