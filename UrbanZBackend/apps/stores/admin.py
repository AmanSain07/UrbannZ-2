from django.contrib import admin
from .models import Store
from apps.notifications.utils import create_notification


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ("store_name", "owner", "status", "reviewed_by", "created_at")
    list_filter = ("status",)
    search_fields = ("store_name", "owner__email", "owner__name")
    readonly_fields = ("created_at", "updated_at", "slug")
    actions = ["approve_stores", "reject_stores", "suspend_stores"]

    @admin.action(description="Approve selected stores")
    def approve_stores(self, request, queryset):
        pending = queryset.filter(status=Store.Status.PENDING)
        count = pending.count()
        for store in pending:
            store.status = Store.Status.APPROVED
            store.reviewed_by = request.user
            store.save()

            # Notify user
            create_notification(
                user=store.owner,
                title="Store Approved! 🏪",
                message=f"Your store '{store.store_name}' has been approved and is now live.",
            )
        self.message_user(request, f"Successfully approved {count} store(s).")

    @admin.action(description="Reject selected stores")
    def reject_stores(self, request, queryset):
        pending = queryset.filter(status=Store.Status.PENDING)
        count = pending.count()
        for store in pending:
            store.status = Store.Status.REJECTED
            store.rejection_reason = "Store does not meet quality standards."
            store.reviewed_by = request.user
            store.save()

            # Notify user
            create_notification(
                user=store.owner,
                title="Store Application Update",
                message=f"Your store application for '{store.store_name}' was rejected.",
            )
        self.message_user(request, f"Successfully rejected {count} store(s).")

    @admin.action(description="Suspend selected stores")
    def suspend_stores(self, request, queryset):
        approved = queryset.filter(status=Store.Status.APPROVED)
        count = approved.count()
        for store in approved:
            store.status = Store.Status.SUSPENDED
            store.reviewed_by = request.user
            store.save()

            # Notify user
            create_notification(
                user=store.owner,
                title="Store Suspended",
                message=f"Your store '{store.store_name}' has been suspended. Please contact support.",
            )
        self.message_user(request, f"Successfully suspended {count} store(s).")
