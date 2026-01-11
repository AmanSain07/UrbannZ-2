from pydantic import BaseModel, Field
from typing import List, Optional, Union, Dict
from enum import Enum

# Enums for consistent data
class Role(str, Enum):
    ADMIN = "admin"
    SHOPKEEPER = "shopkeeper"
    CUSTOMER = "customer"

class OrderStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    SHIPPED = "shipped"
    DELIVERED = "delivered"

class ProductCategory(str, Enum):
    MEN = "men"
    WOMEN = "women"
    KIDS = "kids"
    UNISEX = "unisex"
    ACCESSORIES = "accessories"
    FOOTWEAR = "footwear"
    CUSTOM = "custom"

# Models
class User(BaseModel):
    id: str
    name: str
    email: str
    role: Role
    password: str = "password" # Mock password for simplicity

class Product(BaseModel):
    id: str
    name: str
    description: str
    price: float
    category: ProductCategory
    sub_category: Optional[str] = None # e.g., "Summer", "Casual"
    images: List[str]
    sizes: List[str]
    colors: List[str]
    stock: int
    shopkeeper_id: str # Link to creator

class OrderItem(BaseModel):
    product_id: str
    quantity: int
    size: str
    color: str
    price_at_purchase: float

class Order(BaseModel):
    id: str
    user_id: str
    items: List[OrderItem]
    total_amount: float
    status: OrderStatus
    created_at: str

class CustomDesign(BaseModel):
    id: str
    user_id: str
    design_image_url: str
    notes: str
    status: OrderStatus
    shopkeeper_id: Optional[str] = None # Assigned shopkeeper
    price_quote: Optional[float] = None
