"""
UrbanZ — Store Views

Vendor: Create, Update, View own stores.
Public: List/detail approved stores.
Admin: List pending, approve, reject, suspend.
"""

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdmin, IsVendor, IsOwnerOrAdmin
from apps.notifications.utils import create_notification
from .models import Store
from .serializers import StoreSerializer, StoreCreateSerializer, StoreListSerializer


class StoreCreateView(generics.CreateAPIView):
    """POST /api/stores/ — Vendor creates a store (status=pending)."""
    serializer_class = StoreCreateSerializer
    permission_classes = [IsAuthenticated, IsVendor]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        store = serializer.save()
        return Response(
            {
                "message": "Store created. Awaiting admin approval.",
                "store": StoreSerializer(store).data,
            },
            status=status.HTTP_201_CREATED,
        )


class PublicStoreListView(generics.ListAPIView):
    """GET /api/stores/ — Public listing of approved stores."""
    queryset = Store.objects.filter(status="approved").select_related("owner")
    serializer_class = StoreListSerializer
    permission_classes = [AllowAny]
    search_fields = ["store_name", "description"]


class PublicStoreDetailView(generics.RetrieveAPIView):
    """GET /api/stores/{slug}/ — Public store detail."""
    queryset = Store.objects.filter(status="approved")
    serializer_class = StoreSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"


class MyStoresView(generics.ListAPIView):
    """GET /api/stores/my-stores/ — Vendor's own stores."""
    serializer_class = StoreSerializer
    permission_classes = [IsAuthenticated, IsVendor]

    def get_queryset(self):
        return Store.objects.filter(owner=self.request.user)


class StoreUpdateView(generics.RetrieveUpdateAPIView):
    """GET/PUT /api/stores/{id}/ — Vendor updates their store."""
    serializer_class = StoreSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    queryset = Store.objects.all()

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return StoreCreateSerializer
        return StoreSerializer


class AdminStoreListView(generics.ListAPIView):
    """GET /api/stores/admin/pending/ — Admin sees all stores."""
    queryset = Store.objects.all().select_related("owner", "reviewed_by")
    serializer_class = StoreSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ["status"]
    search_fields = ["store_name", "owner__email"]


class AdminApproveStoreView(APIView):
    """POST /api/stores/{id}/approve/"""
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            store = Store.objects.select_related("owner").get(pk=pk)
        except Store.DoesNotExist:
            return Response({"detail": "Store not found."}, status=status.HTTP_404_NOT_FOUND)

        store.status = Store.Status.APPROVED
        store.reviewed_by = request.user
        store.save()

        create_notification(
            user=store.owner,
            title="Store Approved! 🏪",
            message=f"Your store '{store.store_name}' has been approved and is now live.",
        )

        return Response({"message": f"Store '{store.store_name}' approved.", "store": StoreSerializer(store).data})


class AdminRejectStoreView(APIView):
    """POST /api/stores/{id}/reject/"""
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            store = Store.objects.select_related("owner").get(pk=pk)
        except Store.DoesNotExist:
            return Response({"detail": "Store not found."}, status=status.HTTP_404_NOT_FOUND)

        reason = request.data.get("reason", "Store did not meet requirements.")
        store.status = Store.Status.REJECTED
        store.rejection_reason = reason
        store.reviewed_by = request.user
        store.save()

        create_notification(
            user=store.owner,
            title="Store Application Update",
            message=f"Your store '{store.store_name}' was rejected. Reason: {reason}",
        )

        return Response({"message": "Store rejected.", "store": StoreSerializer(store).data})


class AdminSuspendStoreView(APIView):
    """POST /api/stores/{id}/suspend/"""
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            store = Store.objects.select_related("owner").get(pk=pk)
        except Store.DoesNotExist:
            return Response({"detail": "Store not found."}, status=status.HTTP_404_NOT_FOUND)

        store.status = Store.Status.SUSPENDED
        store.reviewed_by = request.user
        store.save()

        create_notification(
            user=store.owner,
            title="Store Suspended",
            message=f"Your store '{store.store_name}' has been suspended. Contact support.",
        )

        return Response({"message": "Store suspended.", "store": StoreSerializer(store).data})
