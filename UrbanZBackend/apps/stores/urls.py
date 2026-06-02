from django.urls import path
from .views import (
    StoreCreateView,
    PublicStoreListView,
    PublicStoreDetailView,
    MyStoresView,
    StoreUpdateView,
    AdminStoreListView,
    AdminApproveStoreView,
    AdminRejectStoreView,
    AdminSuspendStoreView,
)

urlpatterns = [
    path("", StoreCreateView.as_view(), name="store-create"),
    path("public/", PublicStoreListView.as_view(), name="store-list"),
    path("public/<slug:slug>/", PublicStoreDetailView.as_view(), name="store-detail"),
    path("my-stores/", MyStoresView.as_view(), name="store-my"),
    path("<int:pk>/", StoreUpdateView.as_view(), name="store-update"),
    path("admin/all/", AdminStoreListView.as_view(), name="admin-store-list"),
    path("<int:pk>/approve/", AdminApproveStoreView.as_view(), name="store-approve"),
    path("<int:pk>/reject/", AdminRejectStoreView.as_view(), name="store-reject"),
    path("<int:pk>/suspend/", AdminSuspendStoreView.as_view(), name="store-suspend"),
]
