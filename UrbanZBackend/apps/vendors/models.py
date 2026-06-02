"""
UrbanZ — VendorApplication Model

Flow:
  Customer → submits application → status=pending
  Admin → approves → user.role = vendor
  Admin → rejects → status=rejected (user stays customer)
"""

from django.conf import settings
from django.db import models


class VendorApplication(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="vendor_application",
    )
    business_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    description = models.TextField()
    address = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="approved_applications",
    )
    rejection_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "vendor_applications"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.business_name} — {self.status}"
