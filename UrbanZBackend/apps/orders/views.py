from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdmin, IsVendorOrAdmin, IsCustomer
from apps.cart.models import Cart
from apps.notifications.utils import create_notification
from .models import Address, Order, OrderItem
from .serializers import AddressSerializer, OrderSerializer, PlaceOrderSerializer


class AddressListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/orders/addresses/"""
    serializer_class = AddressSerializer
    permission_classes = [IsCustomer]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PlaceOrderView(APIView):
    """POST /api/orders/ — Customer places order from cart."""
    permission_classes = [IsCustomer]

    def post(self, request):
        serializer = PlaceOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            cart = Cart.objects.prefetch_related(
                "items__product"
            ).get(user=request.user)
        except Cart.DoesNotExist:
            return Response({"detail": "Cart not found."}, status=status.HTTP_404_NOT_FOUND)

        if not cart.items.exists():
            return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        # Resolve address
        address = None
        if data.get("address_id"):
            try:
                address = Address.objects.get(pk=data["address_id"], user=request.user)
            except Address.DoesNotExist:
                return Response({"detail": "Address not found."}, status=status.HTTP_404_NOT_FOUND)
        elif data.get("address"):
            address = Address.objects.create(user=request.user, **data["address"])

        # Create order
        order = Order.objects.create(
            customer=request.user,
            address=address,
            notes=data.get("notes", ""),
        )

        # Create order items from cart
        total = 0
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                product_name=cart_item.product.name,
                quantity=cart_item.quantity,
                price=cart_item.product.price,
                size=cart_item.size,
                color=cart_item.color,
            )
            total += cart_item.product.price * cart_item.quantity

        order.total = total
        order.save()

        # Clear cart
        cart.items.all().delete()

        create_notification(
            user=request.user,
            title="Order Placed! 🎉",
            message=f"Your order #{order.id} has been placed successfully. Total: ₹{total}",
        )

        return Response(
            {"message": "Order placed successfully.", "order": OrderSerializer(order).data},
            status=status.HTTP_201_CREATED,
        )


class CustomerOrderListView(generics.ListAPIView):
    """GET /api/orders/ — Customer's order history."""
    serializer_class = OrderSerializer
    permission_classes = [IsCustomer]
    filterset_fields = ["status"]

    def get_queryset(self):
        return Order.objects.filter(
            customer=self.request.user
        ).prefetch_related("items").select_related("address")


class OrderDetailView(generics.RetrieveAPIView):
    """GET /api/orders/{id}/ — Order detail (owner or admin)."""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin" or user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(customer=user)


class UpdateOrderStatusView(APIView):
    """PUT /api/orders/{id}/status/ — Vendor/Admin updates order status."""
    permission_classes = [IsAuthenticated, IsVendorOrAdmin]

    def put(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get("status")
        valid_statuses = [s[0] for s in Order.Status.choices]
        if new_status not in valid_statuses:
            return Response(
                {"detail": f"Invalid status. Choose from: {valid_statuses}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = new_status
        order.save()

        create_notification(
            user=order.customer,
            title=f"Order Update — #{order.id}",
            message=f"Your order status has been updated to: {new_status.title()}",
        )

        return Response({"message": f"Order status updated to {new_status}.", "order": OrderSerializer(order).data})


class VendorOrderListView(generics.ListAPIView):
    """GET /api/orders/vendor/ — Vendor sees orders for their products."""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin" or user.is_staff:
            return Order.objects.all().prefetch_related("items").select_related("customer", "address")
        # Filter orders that include this vendor's products
        return Order.objects.filter(
            items__product__owner=user
        ).distinct().prefetch_related("items").select_related("customer", "address")
