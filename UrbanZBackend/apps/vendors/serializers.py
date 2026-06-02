from rest_framework import serializers
from .models import VendorApplication
from apps.accounts.serializers import UserPublicSerializer


class VendorApplicationSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)
    approved_by = UserPublicSerializer(read_only=True)

    class Meta:
        model = VendorApplication
        fields = [
            "id", "user", "business_name", "phone", "description",
            "address", "status", "approved_by", "rejection_reason",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "user", "status", "approved_by", "created_at", "updated_at"]


class VendorApplicationSubmitSerializer(serializers.ModelSerializer):
    """Used when a customer submits their application."""

    class Meta:
        model = VendorApplication
        fields = ["business_name", "phone", "description", "address"]

    def create(self, validated_data):
        user = self.context["request"].user
        return VendorApplication.objects.create(user=user, **validated_data)

