"""
UrbanZ — Vendor Application Views

Customer: submit application, check status.
Admin: list all applications, approve, reject.
"""

from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdmin
from apps.notifications.utils import create_notification
from .models import VendorApplication
from .serializers import VendorApplicationSerializer, VendorApplicationSubmitSerializer

User = get_user_model()


class SubmitVendorApplicationView(generics.CreateAPIView):
    """
    POST /api/vendors/apply/
    Any authenticated non-admin user can submit a vendor application.
    (Customers applying for the first time; duplicates handled by OneToOne constraint)
    """
    serializer_class = VendorApplicationSubmitSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Admins cannot apply as vendors
        if request.user.role == "admin" or request.user.is_staff:
            return Response(
                {"detail": "Admin accounts cannot submit vendor applications."},
                status=status.HTTP_403_FORBIDDEN,
            )
        # Prevent duplicate applications
        if VendorApplication.objects.filter(user=request.user).exists():
            existing = VendorApplication.objects.get(user=request.user)
            return Response(
                {
                    "detail": f"You already have an application with status: {existing.status}.",
                    "application": VendorApplicationSerializer(existing).data,
                },
                status=status.HTTP_200_OK,
            )
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        application = serializer.save()
        return Response(
            {
                "message": "Vendor application submitted successfully. Pending admin review.",
                "application": VendorApplicationSerializer(application).data,
            },
            status=status.HTTP_201_CREATED,
        )


class MyVendorApplicationView(generics.RetrieveAPIView):
    """
    GET /api/vendors/my-application/
    Customer checks their own application status.
    """
    serializer_class = VendorApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            return VendorApplication.objects.get(user=self.request.user)
        except VendorApplication.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound("No vendor application found.")


class AdminVendorApplicationListView(generics.ListAPIView):
    """
    GET /api/vendors/applications/
    Admin lists all vendor applications.
    """
    queryset = VendorApplication.objects.select_related("user", "approved_by").all()
    serializer_class = VendorApplicationSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ["status"]
    search_fields = ["business_name", "user__email", "user__name"]


class AdminApproveVendorView(APIView):
    """
    POST /api/vendors/applications/{id}/approve/
    Admin approves a vendor application → promotes user to vendor role.
    """
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            application = VendorApplication.objects.select_related("user").get(pk=pk)
        except VendorApplication.DoesNotExist:
            return Response({"detail": "Application not found."}, status=status.HTTP_404_NOT_FOUND)

        if application.status != VendorApplication.Status.PENDING:
            return Response(
                {"detail": f"Application is already {application.status}."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Promote user to vendor
        application.status = VendorApplication.Status.APPROVED
        application.approved_by = request.user
        application.save()

        user = application.user
        user.role = User.Role.VENDOR
        user.save()

        # Notify user
        create_notification(
            user=user,
            title="Vendor Application Approved! 🎉",
            message=f"Congratulations! Your vendor application for '{application.business_name}' has been approved. You can now create your store.",
        )

        return Response(
            {
                "message": f"Vendor application approved. {user.name} is now a vendor.",
                "application": VendorApplicationSerializer(application).data,
            }
        )


class AdminRejectVendorView(APIView):
    """
    POST /api/vendors/applications/{id}/reject/
    Admin rejects a vendor application.
    """
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            application = VendorApplication.objects.select_related("user").get(pk=pk)
        except VendorApplication.DoesNotExist:
            return Response({"detail": "Application not found."}, status=status.HTTP_404_NOT_FOUND)

        if application.status != VendorApplication.Status.PENDING:
            return Response(
                {"detail": f"Application is already {application.status}."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reason = request.data.get("reason", "Application did not meet requirements.")
        application.status = VendorApplication.Status.REJECTED
        application.rejection_reason = reason
        application.approved_by = request.user
        application.save()

        # Notify user
        create_notification(
            user=application.user,
            title="Vendor Application Update",
            message=f"Your vendor application has been reviewed. Reason: {reason}",
        )

        return Response(
            {
                "message": "Application rejected.",
                "application": VendorApplicationSerializer(application).data,
            }
        )

from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from apps.products.models import Product
from apps.orders.models import OrderItem, Order
from apps.stores.models import Store

class VendorAnalyticsView(APIView):
    """GET /api/vendors/analytics/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        products = Product.objects.filter(owner=user)
        total_products = products.count()
        active_products = products.filter(status="approved", in_stock=True).count()
        out_of_stock_products = products.filter(Q(in_stock=False) | Q(stock_quantity=0)).count()

        items = OrderItem.objects.filter(product__owner=user)
        total_orders = items.values("order").distinct().count()
        pending_orders = items.filter(order__status=Order.Status.PENDING).values("order").distinct().count()

        # Revenue = 90% of item price * quantity (10% commission)
        delivered_items = items.filter(order__status=Order.Status.DELIVERED)
        lifetime_revenue_raw = delivered_items.aggregate(total=Sum(models.F('price') * models.F('quantity')))['total'] or 0
        lifetime_revenue = float(lifetime_revenue_raw) * 0.9
        
        pending_items = items.exclude(order__status__in=[Order.Status.DELIVERED, Order.Status.CANCELLED])
        pending_settlement_raw = pending_items.aggregate(total=Sum(models.F('price') * models.F('quantity')))['total'] or 0
        pending_settlement = float(pending_settlement_raw) * 0.9

        # Monthly Revenue
        thirty_days_ago = timezone.now() - timedelta(days=30)
        monthly_items = delivered_items.filter(order__created_at__gte=thirty_days_ago)
        monthly_revenue_raw = monthly_items.aggregate(total=Sum(models.F('price') * models.F('quantity')))['total'] or 0
        monthly_revenue = float(monthly_revenue_raw) * 0.9

        return Response({
            "total_products": total_products,
            "active_products": active_products,
            "out_of_stock_products": out_of_stock_products,
            "total_orders": total_orders,
            "pending_orders": pending_orders,
            "lifetime_revenue": lifetime_revenue,
            "monthly_revenue": monthly_revenue,
            "pending_settlement": pending_settlement,
        })

class VendorEarningsView(APIView):
    """GET /api/vendors/earnings/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        items = OrderItem.objects.filter(product__owner=user).select_related("order", "product").order_by("-order__created_at")
        
        history = []
        for item in items:
            amount = item.price * item.quantity
            commission = float(amount) * 0.10
            vendor_earning = float(amount) * 0.90
            history.append({
                "id": item.id,
                "order_id": item.order.id,
                "product_name": item.product_name,
                "date": item.order.created_at.strftime("%b %d, %Y"),
                "amount": amount,
                "commission": commission,
                "vendor_earning": vendor_earning,
                "status": item.order.status
            })
            
        return Response(history)

class VendorStoreView(APIView):
    """GET / PUT /api/vendors/store/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        store = Store.objects.filter(owner=request.user).first()
        if not store:
            return Response(None)
        
        return Response({
            "id": store.id,
            "store_name": store.store_name,
            "description": store.description,
            "logo": store.logo.url if store.logo else None,
            "banner": store.banner.url if store.banner else None,
            "address": store.address,
            "phone": store.phone,
            "email": store.email,
        })

    def put(self, request):
        store, created = Store.objects.get_or_create(
            owner=request.user,
            defaults={"store_name": f"{request.user.name}'s Store"}
        )
        
        data = request.data
        if "store_name" in data: store.store_name = data["store_name"]
        if "description" in data: store.description = data["description"]
        if "address" in data: store.address = data["address"]
        if "phone" in data: store.phone = data["phone"]
        
        if "logo" in request.FILES: store.logo = request.FILES["logo"]
        if "banner" in request.FILES: store.banner = request.FILES["banner"]
        
        store.save()
        return Response({"message": "Store updated successfully."})
