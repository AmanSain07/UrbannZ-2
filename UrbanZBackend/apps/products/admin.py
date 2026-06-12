from django.contrib import admin
from .models import Product, Category, ProductImage
from apps.notifications.utils import create_notification


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "store", "owner", "status", "approved_by", "created_at")
    list_filter = ("status", "category", "gender")
    search_fields = ("name", "owner__email", "store__store_name")
    readonly_fields = ("created_at", "updated_at", "slug")
    inlines = [ProductImageInline]
    actions = ["approve_products", "reject_products"]

    @admin.action(description="Approve selected products")
    def approve_products(self, request, queryset):
        pending = queryset.filter(status=Product.Status.PENDING)
        count = pending.count()
        for prod in pending:
            prod.status = Product.Status.APPROVED
            prod.approved_by = request.user
            prod.save()

            # Notify user
            create_notification(
                user=prod.owner,
                title="Product Approved! ✅",
                message=f"Your product '{prod.name}' has been approved and is now live.",
            )
        self.message_user(request, f"Successfully approved {count} product(s).")

    @admin.action(description="Reject selected products")
    def reject_products(self, request, queryset):
        pending = queryset.filter(status=Product.Status.PENDING)
        count = pending.count()
        for prod in pending:
            prod.status = Product.Status.REJECTED
            prod.approved_by = request.user
            prod.save()

            # Notify user
            create_notification(
                user=prod.owner,
                title="Product Rejected ❌",
                message=f"Your product '{prod.name}' was not approved. Please review details and resubmit.",
            )
        self.message_user(request, f"Successfully rejected {count} product(s).")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "created_at")
    search_fields = ("name",)
    readonly_fields = ("slug", "created_at")
