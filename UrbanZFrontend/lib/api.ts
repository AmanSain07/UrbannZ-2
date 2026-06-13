/**
 * UrbanZ — Centralized API Layer
 *
 * All requests go through this module.
 * - Bearer token is auto-attached from localStorage.
 * - On 401 Unauthorized, refresh token is used automatically.
 * - On refresh failure, user is logged out.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// ---------------------------------------------------------------------------
// Token Helpers
// ---------------------------------------------------------------------------
export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("urbanz_access");
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("urbanz_refresh");
};

export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem("urbanz_access", access);
  localStorage.setItem("urbanz_refresh", refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("urbanz_access");
  localStorage.removeItem("urbanz_refresh");
  localStorage.removeItem("urbanz_user");
};

// ---------------------------------------------------------------------------
// Core Fetch Wrapper with Auto-Refresh
// ---------------------------------------------------------------------------
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      clearTokens();
      window.location.href = "/login";
      return null;
    }

    const data = await res.json();
    const newAccess = data.access;
    const newRefresh = data.refresh || refresh;
    setTokens(newAccess, newRefresh);
    return newAccess;
  } catch {
    clearTokens();
    window.location.href = "/login";
    return null;
  }
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  const token = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response = await fetch(url, { ...options, headers });

  // Auto-refresh on 401
  if (response.status === 401 && getRefreshToken()) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newToken = await refreshPromise;
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      response = await fetch(url, { ...options, headers });
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    let errMsg = error.detail || error.message;
    if (!errMsg && error && typeof error === "object") {
      errMsg = Object.entries(error)
        .map(([field, errs]) => {
          const prefix = field !== "non_field_errors" ? `${field}: ` : "";
          if (Array.isArray(errs)) return `${prefix}${errs.join(" ")}`;
          if (typeof errs === "string") return `${prefix}${errs}`;
          return `${prefix}${JSON.stringify(errs)}`;
        })
        .join(" | ");
    }
    throw new Error(errMsg || "API request failed");
  }

  // Handle 204 No Content
  if (response.status === 204) return {} as T;

  return response.json();
}

// ---------------------------------------------------------------------------
// Auth APIs
// ---------------------------------------------------------------------------
export async function registerUser(data: { name: string; email: string; password: string; confirm_password: string }) {
  return apiFetch("/api/auth/register/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(email: string, password: string) {
  return apiFetch("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutUser(refresh: string) {
  return apiFetch("/api/auth/logout/", {
    method: "POST",
    body: JSON.stringify({ refresh }),
  });
}

export async function fetchProfile() {
  return apiFetch("/api/auth/profile/");
}

export async function updateProfile(data: Partial<{ name: string; phone: string }>) {
  return apiFetch("/api/auth/profile/", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function uploadAvatarAPI(file: File): Promise<any> {
  const token = getAccessToken();
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await fetch(`${API_BASE_URL}/api/auth/profile/`, {
    method: "PATCH",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.avatar?.[0] || "Avatar upload failed.");
  }
  return res.json();
}

export async function changePassword(data: { old_password: string; new_password: string; confirm_new_password: string }) {
  return apiFetch("/api/auth/change-password/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ---------------------------------------------------------------------------
// Product APIs
// ---------------------------------------------------------------------------
export async function fetchProducts(params?: { category?: string; search?: string; ordering?: string }) {
  const query = new URLSearchParams();
  if (params?.category) query.set("category__slug", params.category);
  if (params?.search) query.set("search", params.search);
  if (params?.ordering) query.set("ordering", params.ordering);
  const qs = query.toString();
  return apiFetch(`/api/products/${qs ? `?${qs}` : ""}`);
}

export async function fetchProduct(id: string | number) {
  return apiFetch(`/api/products/${id}/`);
}

export async function createProduct(data: any) {
  return apiFetch("/api/products/create/", { method: "POST", body: JSON.stringify(data) });
}

export async function updateProductAPI(id: string | number, data: any) {
  return apiFetch(`/api/products/${id}/manage/`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteProductAPI(id: string | number) {
  return apiFetch(`/api/products/${id}/manage/`, { method: "DELETE" });
}

export async function toggleProductStockAPI(id: string | number) {
  return apiFetch(`/api/products/${id}/stock/`, { method: "PUT" });
}

export async function approveProductAPI(id: string | number) {
  return apiFetch(`/api/products/${id}/approve/`, { method: "POST" });
}

export async function rejectProductAPI(id: string | number) {
  return apiFetch(`/api/products/${id}/reject/`, { method: "POST" });
}

export async function fetchMyProducts() {
  return apiFetch("/api/products/my-products/");
}

export async function fetchAllProductsAdmin() {
  return apiFetch("/api/products/admin/all/");
}

export async function fetchProductById(id: string | number) {
  return apiFetch(`/api/products/${id}/manage/`);
}

/**
 * Upload a file image to an existing product.
 * Uses multipart/form-data — browser sets the boundary automatically.
 */
export async function uploadProductImage(productId: string | number, file: File): Promise<any> {
  const token = getAccessToken();
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${API_BASE_URL}/api/products/${productId}/images/`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.image?.[0] || "Image upload failed.");
  }
  return res.json();
}

export async function deleteProductImageAPI(productId: string | number, imageId: string | number) {
  return apiFetch(`/api/products/${productId}/images/${imageId}/`, { method: "DELETE" });
}

export async function reorderProductImagesAPI(productId: string | number, imageIds: (number | string)[]) {
  return apiFetch(`/api/products/${productId}/images/reorder/`, {
    method: "POST",
    body: JSON.stringify({ image_ids: imageIds }),
  });
}

// ---------------------------------------------------------------------------
// Category APIs
// ---------------------------------------------------------------------------
export async function fetchCategories() {
  return apiFetch("/api/categories/");
}

// ---------------------------------------------------------------------------
// Cart APIs
// ---------------------------------------------------------------------------
export async function fetchCart() {
  return apiFetch("/api/cart/");
}

export async function addToCartAPI(productId: number, quantity: number, size: string, color: string) {
  return apiFetch("/api/cart/items/", {
    method: "POST",
    body: JSON.stringify({ product_id: productId, quantity, size, color }),
  });
}

export async function updateCartItemAPI(itemId: number, quantity: number) {
  return apiFetch(`/api/cart/items/${itemId}/`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItemAPI(itemId: number) {
  return apiFetch(`/api/cart/items/${itemId}/`, { method: "DELETE" });
}

export async function clearCartAPI() {
  return apiFetch("/api/cart/clear/", { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Order APIs
// ---------------------------------------------------------------------------
export async function placeOrderAPI(data: { address_id?: number; notes?: string }) {
  return apiFetch("/api/orders/", { method: "POST", body: JSON.stringify(data) });
}

export async function fetchMyOrders() {
  return apiFetch("/api/orders/list/");
}

export async function fetchOrderDetail(id: string | number) {
  return apiFetch(`/api/orders/${id}/`);
}

export async function updateOrderStatusAPI(id: string | number, status: string) {
  return apiFetch(`/api/orders/${id}/status/`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function fetchVendorOrders() {
  return apiFetch("/api/orders/vendor/");
}

// ---------------------------------------------------------------------------
// Wishlist APIs
// ---------------------------------------------------------------------------
export async function fetchWishlist() {
  return apiFetch("/api/wishlist/");
}

export async function addToWishlistAPI(productId: number) {
  return apiFetch("/api/wishlist/", {
    method: "POST",
    body: JSON.stringify({ product_id: productId }),
  });
}

export async function removeFromWishlistAPI(productId: number) {
  return apiFetch("/api/wishlist/", {
    method: "DELETE",
    body: JSON.stringify({ product_id: productId }),
  });
}

// ---------------------------------------------------------------------------
// Vendor Application APIs
// ---------------------------------------------------------------------------
export async function submitVendorApplication(data: { business_name: string; phone: string; description: string; address?: string }) {
  return apiFetch("/api/vendors/apply/", { method: "POST", body: JSON.stringify(data) });
}

export async function fetchMyVendorApplication() {
  return apiFetch("/api/vendors/my-application/");
}

export async function fetchVendorApplications() {
  return apiFetch("/api/vendors/applications/");
}

export async function approveVendorApplication(id: number) {
  return apiFetch(`/api/vendors/applications/${id}/approve/`, { method: "POST" });
}

export async function rejectVendorApplication(id: number, reason?: string) {
  return apiFetch(`/api/vendors/applications/${id}/reject/`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

// ---------------------------------------------------------------------------
// Store APIs
// ---------------------------------------------------------------------------
export async function fetchPublicStores() {
  return apiFetch("/api/stores/public/");
}

export async function fetchStoreDetail(slug: string) {
  return apiFetch(`/api/stores/public/${slug}/`);
}

export async function fetchMyStores() {
  return apiFetch("/api/stores/my-stores/");
}

export async function createStoreAPI(data: any) {
  return apiFetch("/api/stores/", { method: "POST", body: JSON.stringify(data) });
}

export async function approveStoreAPI(id: number) {
  return apiFetch(`/api/stores/${id}/approve/`, { method: "POST" });
}

export async function rejectStoreAPI(id: number, reason?: string) {
  return apiFetch(`/api/stores/${id}/reject/`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

// ---------------------------------------------------------------------------
// Admin APIs
// ---------------------------------------------------------------------------
export async function fetchAllUsers() {
  return apiFetch("/api/admin-panel/users/");
}

export async function updateUserStatusAPI(id: string, action: "suspend" | "activate") {
  return apiFetch(`/api/admin-panel/users/${id}/status/`, {
    method: "PUT",
    body: JSON.stringify({ action }),
  });
}

export async function fetchAdminAnalytics() {
  return apiFetch("/api/admin-panel/analytics/");
}

// ---------------------------------------------------------------------------
// Notifications APIs
// ---------------------------------------------------------------------------
export async function fetchNotifications() {
  return apiFetch("/api/notifications/");
}

export async function markNotificationRead(id: number) {
  return apiFetch(`/api/notifications/${id}/read/`, { method: "POST" });
}

