from django.urls import path
from .views import (
    AddressListCreateView,
    PlaceOrderView,
    CustomerOrderListView,
    OrderDetailView,
    UpdateOrderStatusView,
    VendorOrderListView,
)

urlpatterns = [
    path("", PlaceOrderView.as_view(), name="order-place"),
    path("list/", CustomerOrderListView.as_view(), name="order-list"),
    path("<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
    path("<int:pk>/status/", UpdateOrderStatusView.as_view(), name="order-status"),
    path("vendor/", VendorOrderListView.as_view(), name="vendor-orders"),
    path("addresses/", AddressListCreateView.as_view(), name="address-list"),
]
