from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import json
import os
from .models import Product, User, Order, CustomDesign, Role, ProductCategory, OrderStatus

app = FastAPI(title="UrbanZ API", description="Backend for UrbanZ Marketplace")

# CORS Setup
origins = [
    "http://localhost:3000", # Next.js frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Persistence Helper ---
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

FILES = {
    "products": os.path.join(DATA_DIR, "products.json"),
    "users": os.path.join(DATA_DIR, "users.json"),
    "orders": os.path.join(DATA_DIR, "orders.json"),
    "custom_designs": os.path.join(DATA_DIR, "custom_designs.json"),
}

def load_data(key: str):
    if not os.path.exists(FILES[key]):
        return []
    with open(FILES[key], "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def save_data(key: str, data: list):
    with open(FILES[key], "w") as f:
        json.dump(data, f, indent=2)

# Initialize files if empty
for key in FILES:
    if not os.path.exists(FILES[key]):
        save_data(key, [])

# --- Routes: Products ---

@app.get("/products", response_model=List[Product])
def get_products(category: Optional[ProductCategory] = None):
    products = load_data("products")
    if category:
        return [p for p in products if p["category"] == category]
    return products

@app.get("/products/{product_id}", response_model=Product)
def get_product(product_id: str):
    products = load_data("products")
    product = next((p for p in products if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/products", status_code=status.HTTP_201_CREATED)
def create_product(product: Product):
    products = load_data("products")
    if any(p["id"] == product.id for p in products):
        raise HTTPException(status_code=400, detail="Product ID already exists")
    
    products.append(product.dict())
    save_data("products", products)
    return product

# --- Routes: Users (Mock Auth) ---

@app.post("/login")
def login(email: str):
    # Mock login: Just find by email
    users = load_data("users")
    user = next((u for u in users if u["email"] == email), None)
    if not user:
         # Auto-create customer if not exists for demo flow
         new_user = {
             "id": f"user_{len(users)+1}",
             "name": email.split("@")[0],
             "email": email,
             "role": Role.CUSTOMER,
             "password": "password"
         }
         users.append(new_user)
         save_data("users", users)
         return new_user
    return user

# --- Routes: Orders ---

@app.post("/orders", status_code=status.HTTP_201_CREATED)
def create_order(order: Order):
    orders = load_data("orders")
    orders.append(order.dict())
    save_data("orders", orders)
    return order

@app.get("/orders", response_model=List[Order])
def get_orders(user_id: Optional[str] = None):
    # If user_id provided, filter by it (for customers)
    # real app would check token
    orders = load_data("orders")
    if user_id:
        return [o for o in orders if o["user_id"] == user_id]
    return orders

# --- Routes: Custom Designs ---

@app.post("/custom-designs", status_code=status.HTTP_201_CREATED)
def create_custom_design(design: CustomDesign):
    designs = load_data("custom_designs")
    designs.append(design.dict())
    save_data("custom_designs", designs)
    return design

@app.get("/custom-designs", response_model=List[CustomDesign])
def get_custom_designs():
    return load_data("custom_designs")

@app.put("/custom-designs/{design_id}/status")
def update_design_status(design_id: str, status: OrderStatus):
    designs = load_data("custom_designs")
    for d in designs:
        if d["id"] == design_id:
            d["status"] = status
            save_data("custom_designs", designs)
            return d
    raise HTTPException(status_code=404, detail="Design not found")
