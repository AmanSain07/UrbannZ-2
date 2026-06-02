"""
UrbanZ — Product Views

Public: List/Search approved products, Product detail.
Vendor: CRUD own products.
Admin: Approve/Reject products, view all.
"""

from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend

from apps.accounts.permissions import IsAdmin, IsVendor, IsOwnerOrAdmin
from apps.notifications.utils import create_notification
from .models import Product, Category
from .serializers import (
    ProductSerializer,
    ProductCreateSerializer,
    CategorySerializer,
)


# ---------------------------------------------------------------------------
# Category Views
# ---------------------------------------------------------------------------

class CategoryListView(generics.ListCreateAPIView):
    """GET /api/categories/ — Public list. POST — Admin creates."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdmin()]


# ---------------------------------------------------------------------------
# Public Product Views
# ---------------------------------------------------------------------------

class ProductListView(generics.ListAPIView):
    """
    GET /api/products/ — Public approved product listing.
    Supports: ?category=clothing&search=bomber&ordering=-price
    """
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category__slug", "gender", "style", "occasion", "in_stock"]
    search_fields = ["name", "description", "tags"]
    ordering_fields = ["price", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        qs = Product.objects.filter(
            status="approved", in_stock=True
        ).select_related("category", "owner", "store").prefetch_related("images")

        # Allow filtering by category name (frontend uses category slug like 'clothing')
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__slug=category)

        return qs


class ProductDetailView(generics.RetrieveAPIView):
    """GET /api/products/{id}/ — Public product detail."""
    queryset = Product.objects.filter(status="approved").select_related(
        "category", "owner", "store"
    ).prefetch_related("images")
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


# ---------------------------------------------------------------------------
# Vendor Product Views
# ---------------------------------------------------------------------------

class VendorProductCreateView(generics.CreateAPIView):
    """POST /api/products/create/ — Vendor creates a product."""
    serializer_class = ProductCreateSerializer
    permission_classes = [IsAuthenticated, IsVendor]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response(
            {
                "message": "Product submitted for review.",
                "product": ProductSerializer(product).data,
            },
            status=status.HTTP_201_CREATED,
        )


class VendorProductUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/DELETE /api/products/{id}/manage/ — Vendor manages own product."""
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin" or user.is_staff:
            return Product.objects.all()
        return Product.objects.filter(owner=user)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ProductSerializer
        return ProductCreateSerializer


class VendorMyProductsView(generics.ListAPIView):
    """GET /api/products/my-products/ — Vendor's own product list."""
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsVendor]

    def get_queryset(self):
        return Product.objects.filter(
            owner=self.request.user
        ).select_related("category").prefetch_related("images")


class ToggleStockView(APIView):
    """PUT /api/products/{id}/stock/ — Toggle product in_stock."""
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def put(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, product)
        product.in_stock = not product.in_stock
        product.save()
        return Response({"in_stock": product.in_stock, "message": f"Stock set to {'available' if product.in_stock else 'unavailable'}."})


# ---------------------------------------------------------------------------
# Admin Product Views
# ---------------------------------------------------------------------------

class AdminProductListView(generics.ListAPIView):
    """GET /api/products/admin/all/ — All products (admin)."""
    queryset = Product.objects.all().select_related("category", "owner", "store").prefetch_related("images")
    serializer_class = ProductSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ["status", "category__slug"]
    search_fields = ["name", "owner__email"]


class AdminApproveProductView(APIView):
    """POST /api/products/{id}/approve/"""
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            product = Product.objects.select_related("owner").get(pk=pk)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        product.status = Product.Status.APPROVED
        product.approved_by = request.user
        product.save()

        create_notification(
            user=product.owner,
            title="Product Approved! ✅",
            message=f"Your product '{product.name}' is now live on the marketplace.",
        )

        return Response({"message": "Product approved.", "product": ProductSerializer(product).data})


class AdminRejectProductView(APIView):
    """POST /api/products/{id}/reject/"""
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            product = Product.objects.select_related("owner").get(pk=pk)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        product.status = Product.Status.REJECTED
        product.save()

        create_notification(
            user=product.owner,
            title="Product Rejected",
            message=f"Your product '{product.name}' was not approved. Please review and resubmit.",
        )

        return Response({"message": "Product rejected.", "product": ProductSerializer(product).data})
