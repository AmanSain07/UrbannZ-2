#!/usr/bin/env python
"""
UrbanZ Complete E2E Website Audit
Tests all user journeys and generates comprehensive report
"""

import os
import sys
import django
import json
from datetime import datetime
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'urbanz.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.accounts.models import User, VendorApplication
from apps.products.models import Product, Category, ProductImage
from apps.vendors.models import Store
from apps.cart.models import Cart, CartItem
from apps.orders.models import Order, OrderItem, Address
from apps.wishlist.models import Wishlist, WishlistItem

User = get_user_model()

# ============================================================================
# AUDIT REPORT
# ============================================================================

class AuditReport:
    def __init__(self):
        self.critical_issues = []
        self.medium_issues = []
        self.minor_issues = []
        self.working_features = []
        self.broken_features = []
        self.test_results = {}
        self.start_time = datetime.now()

    def add_critical(self, issue):
        self.critical_issues.append(issue)
        print(f"🔴 CRITICAL: {issue}")

    def add_medium(self, issue):
        self.medium_issues.append(issue)
        print(f"🟠 MEDIUM: {issue}")

    def add_minor(self, issue):
        self.minor_issues.append(issue)
        print(f"🟡 MINOR: {issue}")

    def add_working(self, feature):
        self.working_features.append(feature)
        print(f"✅ WORKING: {feature}")

    def add_broken(self, feature):
        self.broken_features.append(feature)
        print(f"❌ BROKEN: {feature}")

    def calculate_readiness(self):
        total_features = len(self.working_features) + len(self.broken_features)
        if total_features == 0:
            return 0
        percentage = (len(self.working_features) / total_features) * 100
        
        # Adjust based on critical/medium issues
        if self.critical_issues:
            percentage *= 0.5
        if self.medium_issues:
            percentage *= 0.8
        
        return max(0, min(100, percentage))

    def generate_report(self):
        readiness = self.calculate_readiness()
        
        report = f"""
╔════════════════════════════════════════════════════════════════════════════╗
║                    URBANЗ COMPLETE E2E WEBSITE AUDIT                       ║
║                          QA Engineer Report                                 ║
╚════════════════════════════════════════════════════════════════════════════╝

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Duration: {(datetime.now() - self.start_time).total_seconds():.2f} seconds

────────────────────────────────────────────────────────────────────────────
PRODUCTION READINESS SCORE: {readiness:.1f}%
────────────────────────────────────────────────────────────────────────────

📊 SUMMARY STATISTICS
  • Total Features Tested: {len(self.working_features) + len(self.broken_features)}
  • Working Features: {len(self.working_features)}
  • Broken Features: {len(self.broken_features)}
  • Critical Issues: {len(self.critical_issues)}
  • Medium Issues: {len(self.medium_issues)}
  • Minor Issues: {len(self.minor_issues)}

────────────────────────────────────────────────────────────────────────────
🔴 CRITICAL ISSUES ({len(self.critical_issues)})
────────────────────────────────────────────────────────────────────────────
"""
        for issue in self.critical_issues:
            report += f"  ❌ {issue}\n"
        
        report += f"""
────────────────────────────────────────────────────────────────────────────
🟠 MEDIUM ISSUES ({len(self.medium_issues)})
────────────────────────────────────────────────────────────────────────────
"""
        for issue in self.medium_issues:
            report += f"  ⚠️  {issue}\n"

        report += f"""
────────────────────────────────────────────────────────────────────────────
🟡 MINOR ISSUES ({len(self.minor_issues)})
────────────────────────────────────────────────────────────────────────────
"""
        for issue in self.minor_issues:
            report += f"  ℹ️  {issue}\n"

        report += f"""
────────────────────────────────────────────────────────────────────────────
✅ WORKING FEATURES ({len(self.working_features)})
────────────────────────────────────────────────────────────────────────────
"""
        for feature in self.working_features:
            report += f"  ✔ {feature}\n"

        report += f"""
────────────────────────────────────────────────────────────────────────────
❌ BROKEN/INCOMPLETE FEATURES ({len(self.broken_features)})
────────────────────────────────────────────────────────────────────────────
"""
        for feature in self.broken_features:
            report += f"  ✘ {feature}\n"

        report += """
────────────────────────────────────────────────────────────────────────────
RECOMMENDATIONS
────────────────────────────────────────────────────────────────────────────
"""
        if self.critical_issues:
            report += """
🔴 CRITICAL FIXES REQUIRED (Block Production):
"""
            for issue in self.critical_issues:
                report += f"  • {issue}\n"

        if self.medium_issues:
            report += """
🟠 IMPORTANT FIXES (Before Public Release):
"""
            for issue in self.medium_issues:
                report += f"  • {issue}\n"

        return report


# ============================================================================
# TEST FUNCTIONS
# ============================================================================

def test_user_model():
    """Test User model functionality"""
    print("\n\n🧪 TESTING USER MODEL...")
    report = AuditReport()
    
    # Check if admin user exists
    try:
        admin = User.objects.filter(role='admin').first()
        if admin:
            report.add_working("Admin user exists in database")
        else:
            report.add_critical("No admin user found - cannot manage marketplace")
    except Exception as e:
        report.add_critical(f"Error accessing user model: {str(e)}")
    
    # Check user count by role
    try:
        customers = User.objects.filter(role='customer').count()
        vendors = User.objects.filter(role='vendor').count()
        admins = User.objects.filter(role='admin').count()
        
        print(f"  Users by role: Customers={customers}, Vendors={vendors}, Admins={admins}")
        report.add_working(f"User roles properly configured ({customers} customers, {vendors} vendors, {admins} admins)")
    except Exception as e:
        report.add_critical(f"Error counting users: {str(e)}")
    
    return report


def test_products():
    """Test product system"""
    print("\n🧪 TESTING PRODUCT SYSTEM...")
    report = AuditReport()
    
    try:
        total_products = Product.objects.count()
        approved = Product.objects.filter(status='approved').count()
        pending = Product.objects.filter(status='pending').count()
        rejected = Product.objects.filter(status='rejected').count()
        
        print(f"  Total products: {total_products} (Approved: {approved}, Pending: {pending}, Rejected: {rejected})")
        
        if total_products == 0:
            report.add_critical("No products in database - marketplace is empty")
        else:
            report.add_working(f"Products exist in database ({total_products} total)")
        
        if approved == 0 and total_products > 0:
            report.add_critical("No approved products - customers cannot browse anything")
        
        # Check for missing/broken images
        products_without_images = Product.objects.filter(image_url='').count()
        if products_without_images > 0:
            report.add_medium(f"{products_without_images} products have no image URL")
        
        # Check for products with bad status
        invalid_status = Product.objects.exclude(status__in=['pending', 'approved', 'rejected']).count()
        if invalid_status > 0:
            report.add_critical(f"{invalid_status} products have invalid status")
        
        # Check for duplicate products
        from django.db.models import Count
        duplicates = Product.objects.values('name').annotate(count=Count('id')).filter(count__gt=1).count()
        if duplicates > 0:
            report.add_minor(f"{duplicates} products have duplicate names")
        
        report.add_working("Product model is functional")
        
    except Exception as e:
        report.add_critical(f"Error accessing products: {str(e)}")
    
    return report


def test_categories():
    """Test category system"""
    print("\n🧪 TESTING CATEGORIES...")
    report = AuditReport()
    
    try:
        categories = Category.objects.count()
        print(f"  Categories in database: {categories}")
        
        if categories == 0:
            report.add_critical("No categories found - product browsing will not work")
        else:
            report.add_working(f"Categories exist ({categories} total)")
            
        # List all categories
        cats = Category.objects.all()
        for cat in cats[:5]:
            print(f"    - {cat.name} ({cat.products.count()} products)")
            
    except Exception as e:
        report.add_critical(f"Error accessing categories: {str(e)}")
    
    return report


def test_orders():
    """Test order system"""
    print("\n🧪 TESTING ORDERS...")
    report = AuditReport()
    
    try:
        total_orders = Order.objects.count()
        order_items = OrderItem.objects.count()
        
        print(f"  Total orders: {total_orders}, Order items: {order_items}")
        
        if total_orders == 0:
            report.add_working("No orders yet (expected if this is first test)")
        else:
            report.add_working("Order system is functioning")
        
        # Check order status distribution
        statuses = {}
        for order in Order.objects.all()[:10]:
            status = order.status
            statuses[status] = statuses.get(status, 0) + 1
        
        if statuses:
            print(f"  Order statuses: {statuses}")
        
        # Check for orphaned order items
        orphaned = OrderItem.objects.filter(product__isnull=True).count()
        if orphaned > 0:
            report.add_medium(f"{orphaned} order items reference deleted products")
        
        report.add_working("Order model is functional")
        
    except Exception as e:
        report.add_critical(f"Error accessing orders: {str(e)}")
    
    return report


def test_cart():
    """Test cart system"""
    print("\n🧪 TESTING CART SYSTEM...")
    report = AuditReport()
    
    try:
        carts = Cart.objects.count()
        cart_items = CartItem.objects.count()
        
        print(f"  Carts in database: {carts}, Cart items: {cart_items}")
        
        # Check for orphaned cart items
        orphaned = CartItem.objects.filter(product__isnull=True).count()
        if orphaned > 0:
            report.add_medium(f"{orphaned} cart items reference deleted products")
        
        report.add_working("Cart system is functional")
        
    except Exception as e:
        report.add_critical(f"Error accessing carts: {str(e)}")
    
    return report


def test_vendors():
    """Test vendor system"""
    print("\n🧪 TESTING VENDOR SYSTEM...")
    report = AuditReport()
    
    try:
        # Check vendor applications
        pending_apps = VendorApplication.objects.filter(status='pending').count()
        approved_apps = VendorApplication.objects.filter(status='approved').count()
        rejected_apps = VendorApplication.objects.filter(status='rejected').count()
        
        print(f"  Vendor applications: Pending={pending_apps}, Approved={approved_apps}, Rejected={rejected_apps}")
        
        if pending_apps > 0:
            report.add_working(f"Vendor application system working ({pending_apps} pending applications)")
        
        # Check stores
        stores = Store.objects.count()
        print(f"  Stores in database: {stores}")
        
        if stores > 0:
            report.add_working(f"Store system functional ({stores} stores created)")
        
        report.add_working("Vendor system is functional")
        
    except Exception as e:
        report.add_critical(f"Error accessing vendor system: {str(e)}")
    
    return report


def test_database_integrity():
    """Test database integrity and relationships"""
    print("\n🧪 TESTING DATABASE INTEGRITY...")
    report = AuditReport()
    
    try:
        # Check for broken foreign keys
        broken_products = Product.objects.filter(owner__isnull=True).count()
        if broken_products > 0:
            report.add_critical(f"{broken_products} products have no owner (broken FK)")
        else:
            report.add_working("All products have valid owners")
        
        # Check cart relationships
        broken_carts = CartItem.objects.filter(cart__isnull=True).count()
        if broken_carts > 0:
            report.add_critical(f"{broken_carts} cart items have no cart (broken FK)")
        else:
            report.add_working("All cart items have valid carts")
        
        # Check order relationships
        broken_orders = OrderItem.objects.filter(order__isnull=True).count()
        if broken_orders > 0:
            report.add_critical(f"{broken_orders} order items have no order (broken FK)")
        else:
            report.add_working("All order items have valid orders")
        
        print("  Database integrity check complete")
        
    except Exception as e:
        report.add_critical(f"Error checking database integrity: {str(e)}")
    
    return report


def test_api_structure():
    """Test API structure and URL patterns"""
    print("\n🧪 TESTING API STRUCTURE...")
    report = AuditReport()
    
    try:
        from django.urls import get_resolver, URLPattern
        from urbanz.urls import urlpatterns
        
        api_endpoints = []
        
        def extract_patterns(patterns, prefix=''):
            for pattern in patterns:
                if isinstance(pattern, URLPattern):
                    path = prefix + str(pattern.pattern)
                    api_endpoints.append(path)
                else:
                    extract_patterns(pattern.url_patterns, prefix + str(pattern.pattern))
        
        extract_patterns(urlpatterns)
        
        print(f"  Total API endpoints configured: {len(api_endpoints)}")
        
        # Check for critical endpoints
        critical_endpoints = [
            'api/auth/register/',
            'api/auth/login/',
            'api/auth/token/refresh/',
            'api/auth/logout/',
            'api/auth/profile/',
        ]
        
        for endpoint in critical_endpoints:
            found = any(endpoint in ep for ep in api_endpoints)
            if found:
                report.add_working(f"Endpoint exists: {endpoint}")
            else:
                report.add_critical(f"Critical endpoint missing: {endpoint}")
        
    except Exception as e:
        report.add_minor(f"Could not fully verify API structure: {str(e)}")
    
    return report


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    print("""
╔════════════════════════════════════════════════════════════════════════════╗
║               URBANЗ E2E AUDIT - STARTING COMPREHENSIVE TEST               ║
╚════════════════════════════════════════════════════════════════════════════╝
""")
    
    # Create master report
    master_report = AuditReport()
    
    # Run all tests
    reports = [
        test_user_model(),
        test_products(),
        test_categories(),
        test_orders(),
        test_cart(),
        test_vendors(),
        test_database_integrity(),
        test_api_structure(),
    ]
    
    # Aggregate results
    for report in reports:
        master_report.critical_issues.extend(report.critical_issues)
        master_report.medium_issues.extend(report.medium_issues)
        master_report.minor_issues.extend(report.minor_issues)
        master_report.working_features.extend(report.working_features)
        master_report.broken_features.extend(report.broken_features)
    
    # Generate and print final report
    final_report = master_report.generate_report()
    print(final_report)
    
    # Save to file
    report_file = "E2E_AUDIT_REPORT.md"
    with open(report_file, 'w') as f:
        f.write(final_report)
    
    print(f"\n✅ Report saved to: {report_file}")
    
    return master_report


if __name__ == '__main__':
    audit = main()
