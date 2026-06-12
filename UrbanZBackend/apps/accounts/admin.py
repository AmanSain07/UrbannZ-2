from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("email", "name", "role", "is_active", "is_suspended", "created_at")
    list_filter = ("role", "is_active", "is_suspended", "is_staff")
    search_fields = ("email", "name")
    ordering = ("-created_at",)
    readonly_fields = ("id", "created_at", "updated_at")

    fieldsets = (
        (None, {"fields": ("id", "email", "password")}),
        ("Personal Info", {"fields": ("name", "phone", "avatar")}),
        ("Permissions", {"fields": ("role", "is_active", "is_suspended", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Timestamps", {"fields": ("created_at", "updated_at", "last_login")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "name", "role", "password1", "password2"),
        }),
    )

    actions = ["demote_to_customer", "suspend_users", "activate_users"]

    @admin.action(description="Revoke Vendor Status (Demote to Customer)")
    def demote_to_customer(self, request, queryset):
        vendors = queryset.filter(role=User.Role.VENDOR)
        count = vendors.count()
        for user in vendors:
            user.role = User.Role.CUSTOMER
            user.save()
            
            # Reject their application so they are no longer in approved status
            if hasattr(user, "vendor_application"):
                app = user.vendor_application
                app.status = "rejected"
                app.rejection_reason = "Vendor status revoked by administrator."
                app.save()

            # Suspend all their stores
            user.stores.all().update(status="suspended")

        self.message_user(request, f"Successfully demoted {count} vendor(s) to Customer and suspended their stores.")

    @admin.action(description="Suspend selected accounts")
    def suspend_users(self, request, queryset):
        count = queryset.update(is_suspended=True, is_active=False)
        self.message_user(request, f"Successfully suspended {count} user account(s).")

    @admin.action(description="Activate / Unsuspend selected accounts")
    def activate_users(self, request, queryset):
        count = queryset.update(is_suspended=False, is_active=True)
        self.message_user(request, f"Successfully activated {count} user account(s).")
