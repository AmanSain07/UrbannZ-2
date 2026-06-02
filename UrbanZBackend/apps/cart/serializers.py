"""
UrbanZ — Cart Serializers

Produces the exact format the frontend cart-context expects:
{ id, items: [{id, product: {...}, quantity, size, color, subtotal}], total, item_count }
"""

from rest_framework import serializers
from apps.products.models import Product
from apps.products.serializers import ProductSerializer
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    """Full cart item with nested product — matches frontend mapServerItem()."""
    product = ProductSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "product", "quantity", "size", "color", "subtotal"]

    def get_subtotal(self, obj):
        return float(obj.product.price * obj.quantity)


class CartSerializer(serializers.ModelSerializer):
    """Full cart serializer — frontend expects {items: [...], total, item_count}."""
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "items", "total", "item_count", "updated_at"]

    def get_total(self, obj):
        return float(sum(item.product.price * item.quantity for item in obj.items.all()))

    def get_item_count(self, obj):
        return sum(item.quantity for item in obj.items.all())


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)
    size = serializers.CharField(max_length=50, default="", allow_blank=True)
    color = serializers.CharField(max_length=50, default="", allow_blank=True)
