from django.urls import path
from .views import CartView, AddToCartView, CartItemUpdateView, ClearCartView

urlpatterns = [
    path("", CartView.as_view(), name="cart"),
    path("items/", AddToCartView.as_view(), name="cart-add"),
    path("items/<int:pk>/", CartItemUpdateView.as_view(), name="cart-item"),
    path("clear/", ClearCartView.as_view(), name="cart-clear"),
]
