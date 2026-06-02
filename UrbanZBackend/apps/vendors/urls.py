from django.urls import path
from .views import (
    SubmitVendorApplicationView,
    MyVendorApplicationView,
    AdminVendorApplicationListView,
    AdminApproveVendorView,
    AdminRejectVendorView,
)

urlpatterns = [
    path("apply/", SubmitVendorApplicationView.as_view(), name="vendor-apply"),
    path("my-application/", MyVendorApplicationView.as_view(), name="vendor-my-application"),
    path("applications/", AdminVendorApplicationListView.as_view(), name="vendor-applications"),
    path("applications/<int:pk>/approve/", AdminApproveVendorView.as_view(), name="vendor-approve"),
    path("applications/<int:pk>/reject/", AdminRejectVendorView.as_view(), name="vendor-reject"),
]
