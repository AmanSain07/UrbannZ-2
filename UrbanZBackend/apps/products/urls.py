from django.urls import path
from .views import (
    ProductListView,
    ProductDetailView,
    VendorProductCreateView,
    VendorProductUpdateView,
    VendorMyProductsView,
    ToggleStockView,
    AdminProductListView,
    AdminApproveProductView,
    AdminRejectProductView,
)

urlpatterns = [
    # Public
    path("", ProductListView.as_view(), name="product-list"),
    path("<int:pk>/", ProductDetailView.as_view(), name="product-detail"),

    # Vendor
    path("create/", VendorProductCreateView.as_view(), name="product-create"),
    path("my-products/", VendorMyProductsView.as_view(), name="product-my"),
    path("<int:pk>/manage/", VendorProductUpdateView.as_view(), name="product-manage"),
    path("<int:pk>/stock/", ToggleStockView.as_view(), name="product-stock-toggle"),

    # Admin
    path("admin/all/", AdminProductListView.as_view(), name="admin-product-list"),
    path("<int:pk>/approve/", AdminApproveProductView.as_view(), name="product-approve"),
    path("<int:pk>/reject/", AdminRejectProductView.as_view(), name="product-reject"),
]
