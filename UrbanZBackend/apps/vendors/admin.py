from django.contrib import admin
from .models import VendorApplication


@admin.register(VendorApplication)
class VendorApplicationAdmin(admin.ModelAdmin):
    list_display = ("business_name", "user", "status", "approved_by", "created_at")
    list_filter = ("status",)
    search_fields = ("business_name", "user__email")
    readonly_fields = ("created_at", "updated_at")
