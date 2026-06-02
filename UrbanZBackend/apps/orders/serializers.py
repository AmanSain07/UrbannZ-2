from rest_framework import serializers
from apps.products.serializers import ProductSerializer
from .models import Address, Order, OrderItem


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id", "full_name", "phone", "address_line1", "address_line2",
            "city", "state", "postal_code", "country", "is_default",
        ]
        read_only_fields = ["id"]


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "quantity", "price", "size", "color", "subtotal"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    address = AddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "customer", "customer_name", "address",
            "status", "total", "notes", "items",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "customer", "total", "created_at", "updated_at"]


class PlaceOrderSerializer(serializers.Serializer):
    """Used by customer to place an order from their cart."""
    address_id = serializers.IntegerField(required=False, allow_null=True)
    address = AddressSerializer(required=False)  # Inline address
    notes = serializers.CharField(required=False, allow_blank=True, default="")

    def validate(self, attrs):
        if not attrs.get("address_id") and not attrs.get("address"):
            raise serializers.ValidationError("Provide an existing address_id or new address details.")
        return attrs
