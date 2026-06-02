from django.conf import settings
from django.db import models


class Cart(models.Model):
    """One cart per user, server-side."""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cart",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "carts"

    def __str__(self):
        return f"Cart of {self.user.name}"

    @property
    def total(self):
        return sum(item.subtotal for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(
        "products.Product", on_delete=models.CASCADE, related_name="cart_items"
    )
    quantity = models.PositiveIntegerField(default=1)
    size = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=50, blank=True)

    class Meta:
        db_table = "cart_items"
        unique_together = [["cart", "product", "size", "color"]]

    @property
    def subtotal(self):
        return self.product.price * self.quantity
