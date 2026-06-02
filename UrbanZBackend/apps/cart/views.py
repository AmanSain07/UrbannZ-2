"""
UrbanZ — Cart Views

GET    /api/cart/           — Full cart
POST   /api/cart/items/     — Add item
PUT    /api/cart/items/{id}/ — Update quantity
DELETE /api/cart/items/{id}/ — Remove item
DELETE /api/cart/clear/     — Empty cart
"""

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.products.models import Product
from .models import Cart, CartItem
from .serializers import CartSerializer, AddToCartSerializer


def get_or_create_cart(user):
    """Get or create a cart for the given user."""
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


def cart_with_prefetch(user):
    """Fetch cart with prefetched items and products for efficiency."""
    cart = get_or_create_cart(user)
    return Cart.objects.prefetch_related(
        "items__product__images",
        "items__product__category",
    ).get(pk=cart.pk)


class CartView(APIView):
    """GET /api/cart/ — Return full cart with nested products."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = cart_with_prefetch(request.user)
        return Response(CartSerializer(cart).data)


class AddToCartView(APIView):
    """POST /api/cart/items/ — Add a product to the cart."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            product = Product.objects.get(
                pk=data["product_id"], status="approved", in_stock=True
            )
        except Product.DoesNotExist:
            return Response(
                {"detail": "Product not found or not available."},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart = get_or_create_cart(request.user)
        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            size=data["size"],
            color=data["color"],
            defaults={"quantity": data["quantity"]},
        )
        if not created:
            item.quantity += data["quantity"]
            item.save()

        # Return full refreshed cart
        return Response(
            CartSerializer(cart_with_prefetch(request.user)).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class CartItemUpdateView(APIView):
    """
    PUT    /api/cart/items/{id}/ — Update quantity of a cart item.
    DELETE /api/cart/items/{id}/ — Remove a cart item.
    """
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            item = CartItem.objects.get(pk=pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({"detail": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        quantity = request.data.get("quantity")
        try:
            quantity = int(quantity)
            if quantity < 1:
                raise ValueError
        except (TypeError, ValueError):
            return Response({"detail": "Quantity must be a positive integer."}, status=status.HTTP_400_BAD_REQUEST)

        item.quantity = quantity
        item.save()
        return Response(CartSerializer(cart_with_prefetch(request.user)).data)

    def delete(self, request, pk):
        try:
            item = CartItem.objects.get(pk=pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({"detail": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        item.delete()
        return Response(CartSerializer(cart_with_prefetch(request.user)).data)


class ClearCartView(APIView):
    """DELETE /api/cart/clear/ — Remove all items from the cart."""
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        cart = get_or_create_cart(request.user)
        cart.items.all().delete()
        return Response({"message": "Cart cleared.", "items": [], "total": 0, "item_count": 0})
