from django.contrib import admin
from .models import VendorApplication
from apps.notifications.utils import create_notification
from django.contrib.auth import get_user_model

User = get_user_model()


@admin.register(VendorApplication)
class VendorApplicationAdmin(admin.ModelAdmin):
    list_display = ("business_name", "user", "status", "approved_by", "created_at")
    list_filter = ("status",)
    search_fields = ("business_name", "user__email", "user__name")
    readonly_fields = ("created_at", "updated_at")
    actions = ["approve_applications", "reject_applications"]

    @admin.action(description="Approve selected vendor applications")
    def approve_applications(self, request, queryset):
        pending = queryset.filter(status=VendorApplication.Status.PENDING)
        count = pending.count()
        for app in pending:
            app.status = VendorApplication.Status.APPROVED
            app.approved_by = request.user
            app.save()

            # Promote user to vendor
            user = app.user
            user.role = User.Role.VENDOR
            user.save()

            # Notify user
            create_notification(
                user=user,
                title="Vendor Application Approved! 🎉",
                message=f"Congratulations! Your vendor application for '{app.business_name}' has been approved. You can now create your store.",
            )
        self.message_user(request, f"Successfully approved {count} vendor application(s).")

    @admin.action(description="Reject selected vendor applications")
    def reject_applications(self, request, queryset):
        pending = queryset.filter(status=VendorApplication.Status.PENDING)
        count = pending.count()
        for app in pending:
            app.status = VendorApplication.Status.REJECTED
            app.rejection_reason = "Application did not meet requirements."
            app.approved_by = request.user
            app.save()

            # Notify user
            create_notification(
                user=app.user,
                title="Vendor Application Update",
                message="Your vendor application has been reviewed and rejected.",
            )
        self.message_user(request, f"Successfully rejected {count} vendor application(s).")
