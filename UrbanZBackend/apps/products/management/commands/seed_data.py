"""
Management command to seed the database with initial data from frontend data.ts.
Run: python manage.py seed_data
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.products.models import Category, Product, ProductImage

User = get_user_model()

CATEGORIES = [
    {"name": "Clothing", "slug": "clothing", "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80", "color": "bg-rose-200"},
    {"name": "Shoes", "slug": "shoes", "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80", "color": "bg-lime-200"},
    {"name": "Accessories", "slug": "accessories", "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80", "color": "bg-violet-200"},
    {"name": "Tech", "slug": "tech", "image": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80", "color": "bg-amber-200"},
]

PRODUCTS = [
    {"name": "Cyberpunk Bomber", "price": 2499, "category": "clothing", "image": "https://images.unsplash.com/photo-1551028919-ac66c5f8b6b0?auto=format&fit=crop&q=80", "tags": ["New", "Hot"], "gender": "Unisex", "style": "Street Style", "occasion": "Party", "description": "Neon-lit street vibes. Waterproof and reflective.", "extra_images": ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80"]},
    {"name": "Neo-Tokyo Runners", "price": 3999, "category": "shoes", "image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80", "tags": ["Limited"], "description": "Cloud-foam sole for levitating through the grid."},
    {"name": "Holo-Shades", "price": 899, "category": "accessories", "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80", "tags": ["Trending"], "description": "UV protection with a holographic tint."},
    {"name": "Acid Wash Oversized Tee", "price": 699, "category": "clothing", "image": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80", "tags": [], "description": "Vintage feels with a modern oversized cut."},
    {"name": "Cargo Parachute Pants", "price": 1899, "category": "clothing", "image": "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&q=80", "tags": ["Best Seller"], "description": "Loose fit with maximum pockets for utility."},
    {"name": "Chunky Platform Boots", "price": 2999, "category": "shoes", "image": "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80", "tags": [], "description": "Add 3 inches to your height and 100 points to your aura."},
    {"name": "Vintage Denim Jacket", "price": 3499, "category": "clothing", "image": "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80", "tags": ["Vintage"], "gender": "Men", "style": "Vintage", "occasion": "Casual", "description": "Classic oversized denim with distressed details."},
    {"name": "Retro Track Jacket", "price": 1299, "category": "clothing", "image": "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80", "tags": ["Vintage"], "description": "90s vibe colorblock track jacket."},
    {"name": "Basic White Tee", "price": 499, "category": "clothing", "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80", "tags": [], "gender": "Unisex", "style": "Minimal", "occasion": "Daily", "description": "Essential premium cotton tee."},
    {"name": "Street Beanie", "price": 399, "category": "accessories", "image": "https://images.unsplash.com/photo-1576032761414-7b848c4bb1aa?auto=format&fit=crop&q=80", "tags": [], "description": "Keep it cool and warm."},
    {"name": "Lounge Sweatpants", "price": 899, "category": "clothing", "image": "https://images.unsplash.com/photo-1584865288642-42c1440bdd06?auto=format&fit=crop&q=80", "tags": ["Home Wear"], "description": "Maximum comfort for binge-watching."},
    {"name": "Canvas Tote", "price": 299, "category": "accessories", "image": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80", "tags": [], "description": "Eco-friendly and stylish."},
    {"name": "Checkered Vans Style", "price": 2499, "category": "shoes", "image": "https://images.unsplash.com/photo-1525966222134-fcfa99183646?auto=format&fit=crop&q=80", "tags": ["Classic"], "description": "Skater boy aesthetics."},
    {"name": "Oversized Hoodie", "price": 1499, "category": "clothing", "image": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80", "tags": ["Bestseller"], "description": "Your go-to comfort hoodie."},
    {"name": "Bucket Hat", "price": 449, "category": "accessories", "image": "https://images.unsplash.com/photo-1595642527925-4d41cb781653?auto=format&fit=crop&q=80", "tags": [], "style": "Street Style", "occasion": "Outdoors", "description": "Festival season ready."},
    {"name": "Retro Sunglasses", "price": 399, "category": "accessories", "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80", "tags": ["Vintage", "Bestseller"], "description": "Cat-eye frame for that 90s look."},
    {"name": "Graphic Socks (3-Pack)", "price": 299, "category": "accessories", "image": "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?auto=format&fit=crop&q=80", "tags": ["Hot"], "description": "Funky prints for your ankles."},
    {"name": "Minimalist Wallet", "price": 499, "category": "accessories", "image": "https://images.unsplash.com/photo-1627123424574-181ce5171c98?auto=format&fit=crop&q=80", "tags": [], "description": "Sleek synthetic leather."},
    {"name": "Sport Headband", "price": 199, "category": "accessories", "image": "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80", "tags": [], "description": "Keep the sweat away in style."},
    {"name": "Bandana Set", "price": 349, "category": "accessories", "image": "https://images.unsplash.com/photo-1626497764746-6dc36546b388?auto=format&fit=crop&q=80", "tags": ["Vintage"], "description": "Classic paisley prints."},
]


class Command(BaseCommand):
    help = "Seed database with initial categories, products, and admin user."

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.MIGRATE_HEADING(">>> Seeding UrbanZ Database..."))

        # Create admin user
        admin_email = "admin@urbanz.com"
        if not User.objects.filter(email=admin_email).exists():
            User.objects.create_superuser(
                email=admin_email,
                name="UrbanZ Admin",
                password="admin@123",
            )
            self.stdout.write(self.style.SUCCESS(f"[OK] Admin created: {admin_email} / admin@123"))
        else:
            self.stdout.write(f"  Admin already exists: {admin_email}")

        # Create demo vendor user
        vendor_email = "vendor@urbanz.com"
        if not User.objects.filter(email=vendor_email).exists():
            vendor = User.objects.create_user(
                email=vendor_email,
                name="Demo Vendor",
                password="vendor@123",
                role=User.Role.VENDOR,
            )
            self.stdout.write(self.style.SUCCESS(f"[OK] Vendor created: {vendor_email} / vendor@123"))
        else:
            vendor = User.objects.get(email=vendor_email)
            self.stdout.write(f"  Vendor already exists: {vendor_email}")

        # Create demo customer user
        customer_email = "customer@urbanz.com"
        if not User.objects.filter(email=customer_email).exists():
            User.objects.create_user(
                email=customer_email,
                name="Demo Customer",
                password="customer@123",
                role=User.Role.CUSTOMER,
            )
            self.stdout.write(self.style.SUCCESS(f"[OK] Customer created: {customer_email} / customer@123"))
        else:
            self.stdout.write(f"  Customer already exists: {customer_email}")

        # Seed categories
        self.stdout.write("\nSeeding categories...")
        category_map = {}
        for cat_data in CATEGORIES:
            cat, created = Category.objects.get_or_create(
                slug=cat_data["slug"],
                defaults=cat_data,
            )
            category_map[cat_data["slug"]] = cat
            status = "[OK] Created" if created else "  Exists"
            self.stdout.write(f"  {status}: {cat.name}")

        # Seed products
        self.stdout.write("\nSeeding products...")
        for p_data in PRODUCTS:
            cat_slug = p_data["category"]
            category = category_map.get(cat_slug)
            if not category:
                self.stdout.write(self.style.WARNING(f"  ⚠️  Category not found: {cat_slug}"))
                continue

            product, created = Product.objects.get_or_create(
                name=p_data["name"],
                defaults={
                    "owner": vendor,
                    "category": category,
                    "price": p_data["price"],
                    "description": p_data.get("description", ""),
                    "image_url": p_data["image"],
                    "tags": p_data.get("tags", []),
                    "gender": p_data.get("gender", ""),
                    "style": p_data.get("style", ""),
                    "occasion": p_data.get("occasion", ""),
                    "status": Product.Status.APPROVED,
                    "in_stock": True,
                    "stock_quantity": 100,
                },
            )

            if created:
                # Add main image
                ProductImage.objects.create(product=product, image_url=p_data["image"], order=0)
                # Add extra images
                for i, url in enumerate(p_data.get("extra_images", []), 1):
                    ProductImage.objects.create(product=product, image_url=url, order=i)
                self.stdout.write(self.style.SUCCESS(f"  [OK] Created: {product.name}"))
            else:
                self.stdout.write(f"  Exists: {product.name}")

        self.stdout.write(self.style.SUCCESS("\nSeeding complete!\n"))
        self.stdout.write("Demo credentials:")
        self.stdout.write("  Admin:    admin@urbanz.com / admin@123")
        self.stdout.write("  Vendor:   vendor@urbanz.com / vendor@123")
        self.stdout.write("  Customer: customer@urbanz.com / customer@123")
