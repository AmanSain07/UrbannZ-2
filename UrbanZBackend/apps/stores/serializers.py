from rest_framework import serializers
from apps.accounts.serializers import UserPublicSerializer
from .models import Store


class StoreSerializer(serializers.ModelSerializer):
    owner = UserPublicSerializer(read_only=True)

    class Meta:
        model = Store
        fields = [
            "id", "owner", "store_name", "slug", "description",
            "logo", "banner", "address", "phone", "email",
            "status", "rejection_reason", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "owner", "slug", "status", "rejection_reason", "created_at", "updated_at"]


class StoreCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ["store_name", "description", "logo", "banner", "address", "phone", "email"]

    def create(self, validated_data):
        return Store.objects.create(owner=self.context["request"].user, **validated_data)


class StoreListSerializer(serializers.ModelSerializer):
    """Minimal store info for public listing."""
    owner_name = serializers.CharField(source="owner.name", read_only=True)
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Store
        fields = ["id", "store_name", "slug", "description", "logo", "owner_name", "product_count", "created_at"]

    def get_product_count(self, obj):
        return obj.products.filter(status="approved").count()
