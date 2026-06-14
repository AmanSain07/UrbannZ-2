from django.urls import path
from .views import (
    SubmitVendorApplicationView,
    MyVendorApplicationView,
    AdminVendorApplicationListView,
    AdminApproveVendorView,
    AdminRejectVendorView,
    VendorAnalyticsView,
    VendorEarningsView,
    VendorStoreView,
)

urlpatterns = [
    path("apply/", SubmitVendorApplicationView.as_view(), name="vendor-apply"),
    path("my-application/", MyVendorApplicationView.as_view(), name="vendor-my-application"),
    path("applications/", AdminVendorApplicationListView.as_view(), name="vendor-applications"),
    path("applications/<int:pk>/approve/", AdminApproveVendorView.as_view(), name="vendor-approve"),
    path("applications/<int:pk>/reject/", AdminRejectVendorView.as_view(), name="vendor-reject"),
    
    # Vendor Dashboard Features
    path("analytics/", VendorAnalyticsView.as_view(), name="vendor-analytics"),
    path("earnings/", VendorEarningsView.as_view(), name="vendor-earnings"),
    path("store/", VendorStoreView.as_view(), name="vendor-store"),
]
