from django.urls import path
from .views import ProductReviewListView

urlpatterns = [
    path("product/<int:product_id>/", ProductReviewListView.as_view(), name="product-reviews"),
]
