"""
UrbanZ — Product Models

Category → Product → ProductImage
Products require admin approval before being publicly visible.
"""

from django.conf import settings
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    image = models.URLField(blank=True)  # Unsplash URLs supported
    color = models.CharField(max_length=50, blank=True)  # e.g. "bg-rose-200"
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "categories"
        verbose_name_plural = "categories"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    # Ownership — vendor can be linked to a store or just as a user
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="products",
    )
    store = models.ForeignKey(
        "stores.Store",
        on_delete=models.CASCADE,
        related_name="products",
        null=True,
        blank=True,
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name="products",
    )

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    # Frontend-matched fields
    brand = models.CharField(max_length=100, blank=True)
    gender = models.CharField(max_length=50, blank=True)    # Men, Women, Unisex
    style = models.CharField(max_length=100, blank=True)    # Street Style, Vintage, etc.
    occasion = models.CharField(max_length=100, blank=True) # Casual, Party, etc.
    tags = models.JSONField(default=list, blank=True)       # ["New", "Hot", "Limited"]
    sizes = models.JSONField(default=list, blank=True)      # ["S", "M", "L"]
    colors = models.JSONField(default=list, blank=True)     # ["Red", "Blue"]
    discount_percent = models.PositiveIntegerField(default=0)

    # Main image URL (for fast loading / backward compat with Unsplash)
    image_url = models.URLField(blank=True)

    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True
    )
    in_stock = models.BooleanField(default=True)
    stock_quantity = models.PositiveIntegerField(default=0)

    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_products",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "products"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "in_stock"]),
            models.Index(fields=["category"]),
        ]

    def __str__(self):
        return f"{self.name} [{self.status}]"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)


class ProductImage(models.Model):
    """Additional images for a product."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/", blank=True)
    image_url = models.URLField(blank=True)  # Support Unsplash URLs
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        db_table = "product_images"
        ordering = ["order"]

    def get_image(self):
        """Returns file URL if exists, else URL string."""
        if self.image:
            return self.image.url
        return self.image_url
