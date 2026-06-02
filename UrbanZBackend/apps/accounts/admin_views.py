"""
UrbanZ — Admin Panel Views (User Management)
"""
from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsAdmin
from .serializers import UserPublicSerializer

User = get_user_model()


class AdminUserListView(generics.ListAPIView):
    """
    GET /api/admin-panel/users/
    List all users (admin only).
    """
    queryset = User.objects.all().order_by("-created_at")
    serializer_class = UserPublicSerializer
    permission_classes = [IsAdmin]
    search_fields = ["name", "email", "role"]
    filterset_fields = ["role", "is_active", "is_suspended"]


class AdminUserStatusView(APIView):
    """
    PUT /api/admin-panel/users/{id}/status/
    Suspend or activate a user account.
    """
    permission_classes = [IsAdmin]

    def put(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get("action")  # "suspend" | "activate"
        if action == "suspend":
            user.is_suspended = True
            user.save()
            return Response({"message": f"{user.name} has been suspended."})
        elif action == "activate":
            user.is_suspended = False
            user.save()
            return Response({"message": f"{user.name} has been activated."})
        else:
            return Response(
                {"detail": "Invalid action. Use 'suspend' or 'activate'."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class AdminAnalyticsView(APIView):
    """
    GET /api/admin-panel/analytics/
    Platform-wide stats.
    """
    permission_classes = [IsAdmin]

    def get(self, request):
        from apps.orders.models import Order
        from apps.products.models import Product
        from apps.stores.models import Store
        from apps.vendors.models import VendorApplication

        total_users = User.objects.count()
        total_customers = User.objects.filter(role="customer").count()
        total_vendors = User.objects.filter(role="vendor").count()
        total_orders = Order.objects.count()
        total_revenue = sum(
            o.total for o in Order.objects.filter(status__in=["delivered", "shipped"])
        )
        pending_applications = VendorApplication.objects.filter(status="pending").count()
        pending_stores = Store.objects.filter(status="pending").count()
        pending_products = Product.objects.filter(status="pending").count()
        total_products = Product.objects.filter(status="approved").count()

        return Response({
            "users": {
                "total": total_users,
                "customers": total_customers,
                "vendors": total_vendors,
            },
            "orders": {
                "total": total_orders,
                "revenue": float(total_revenue),
            },
            "pending": {
                "vendor_applications": pending_applications,
                "stores": pending_stores,
                "products": pending_products,
            },
            "products": {
                "approved": total_products,
            },
        })
