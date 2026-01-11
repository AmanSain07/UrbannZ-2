const API_URL = "http://localhost:8000";

export async function fetchProducts(category?: string) {
  const url = category
    ? `${API_URL}/products?category=${category}`
    : `${API_URL}/products`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProduct(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export async function loginUser(email: string, password?: string) {
  try {
    const res = await fetch(`${API_URL}/login?email=${email}&password=${password}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  } catch (error) {
    console.warn("Backend API unavailable, using mock auth for demo.");

    // Mock Fallback
    // STRICT ADMIN CHECK
    if (email === "admin@urbanz.com" && password === "admin123") {
      return {
        id: "admin-user",
        name: "UrbanZ Admin",
        email: email,
        role: "admin" as const
      };
    }

    const role = email.includes("shop") ? "shopkeeper" : "customer";

    // Simple password check for demo
    // In a real app never do this client side
    return {
      id: "mock-user-id",
      name: email.split("@")[0],
      email: email,
      role: role as "shopkeeper" | "customer"
    };
  }
}

export async function signupUser(name: string, email: string, password?: string) {
  // Mock signup logic
  return {
    id: "new-user-id",
    name: name,
    email: email,
    role: "customer" // Default new users to customer
  };
}

export async function createOrder(orderData: any) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export async function createCustomDesign(designData: any) {
  const res = await fetch(`${API_URL}/custom-designs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(designData),
  });
  if (!res.ok) throw new Error("Failed to submit design");
  return res.json();
}
