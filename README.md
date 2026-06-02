# UrbanZ 🛍️

**Gen-Z Hyperlocal Fashion Marketplace**

A full-stack multi-vendor e-commerce platform built with Next.js 16 + Django 5.2 REST Framework.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16.1 (App Router), React 19, TypeScript, TailwindCSS |
| Backend | Django 5.2.2, Django REST Framework 3.15 |
| Auth | JWT (SimpleJWT) — access + refresh tokens |
| Database | SQLite (dev) → PostgreSQL (prod) |
| Animations | Framer Motion |

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Customer** | Browse, cart, orders, wishlist |
| **Vendor/Shopkeeper** | Store management, product CRUD, order fulfillment |
| **Admin** | Full platform control, approvals, analytics |

---

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+

### Run Everything (one command)
```bash
cd UrbanZFrontend
npm install
npm run dev
```
This starts both Next.js (port 3000) and Django (port 8000) simultaneously.

### Backend Setup (first time)
```bash
cd UrbanZBackend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data    # Creates demo users + 20 products
```

### Environment Variables

**UrbanZFrontend/.env.local**
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=UrbanZ
```

**UrbanZBackend/.env**
```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@urbanz.com | admin@123 |
| Vendor | vendor@urbanz.com | vendor@123 |
| Customer | customer@urbanz.com | customer@123 |

---

## 📁 Project Structure

```
UrbanZ/
├── UrbanZFrontend/          # Next.js App
│   ├── app/                 # Pages (App Router)
│   ├── components/          # UI Components
│   ├── lib/                 # API layer, Auth/Cart/Store contexts
│   └── context/             # Cursor context
│
└── UrbanZBackend/           # Django API
    ├── apps/
    │   ├── accounts/        # Custom User + JWT Auth
    │   ├── vendors/         # Vendor applications
    │   ├── stores/          # Store management
    │   ├── products/        # Products + Categories
    │   ├── cart/            # Shopping cart
    │   ├── orders/          # Orders + Addresses
    │   ├── wishlist/        # Wishlist
    │   ├── reviews/         # Product reviews
    │   └── notifications/   # In-app notifications
    └── urbanz/              # Django settings + URLs
```

---

## 🔌 Key API Endpoints

```
POST   /api/auth/register/
POST   /api/auth/login/
POST   /api/auth/logout/
GET    /api/products/
GET    /api/categories/
GET    /api/cart/
POST   /api/cart/items/
POST   /api/orders/
GET    /api/orders/list/
GET    /api/admin-panel/analytics/
```

---

## 📄 License

MIT
