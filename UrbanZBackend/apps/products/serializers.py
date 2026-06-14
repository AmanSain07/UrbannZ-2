from rest_framework import serializers
from .models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "image", "color"]
        read_only_fields = ["id", "slug"]


class ProductImageSerializer(serializers.ModelSerializer):
    src = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["id", "src", "order"]

    def get_src(self, obj):
        request = self.context.get("request")
        if obj.image:
            url = obj.image.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return obj.image_url


class ProductImageUploadSerializer(serializers.ModelSerializer):
    """Accepts a file upload OR a URL string for a product image."""
    image = serializers.ImageField(required=False)
    image_url = serializers.URLField(required=False)

    class Meta:
        model = ProductImage
        fields = ["id", "image", "image_url", "order"]

    def validate(self, attrs):
        if not attrs.get("image") and not attrs.get("image_url"):
            raise serializers.ValidationError("Provide either an image file or an image URL.")
        return attrs


class ProductSerializer(serializers.ModelSerializer):
    """Full product serializer — matches frontend Product type exactly."""
    category_name = serializers.CharField(source="category.name", read_only=True)
    owner_name = serializers.CharField(source="owner.name", read_only=True)
    store_name = serializers.CharField(source="store.store_name", read_only=True, allow_null=True)
    images = ProductImageSerializer(many=True, read_only=True)

    # Map image_url → image for frontend compatibility
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "price", "discount_percent", "description",
            "category", "category_name",
            "image", "image_url", "images",
            "brand", "sizes", "colors",
            "gender", "style", "occasion", "tags",
            "status", "in_stock", "stock_quantity",
            "owner", "owner_name", "store", "store_name",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "slug", "owner", "status", "created_at", "updated_at"]

    def get_image(self, obj):
        """Returns primary image URL — either uploaded or Unsplash URL."""
        first_img = obj.images.first()
        if first_img:
            request = self.context.get("request")
            img_url = first_img.get_image()
            if img_url and img_url.startswith("/") and request:
                return request.build_absolute_uri(img_url)
            return img_url
        return obj.image_url or ""


class ProductCreateSerializer(serializers.ModelSerializer):
    """Used when vendor creates/updates a product."""
    image_urls = serializers.ListField(
        child=serializers.URLField(), write_only=True, required=False
    )

    class Meta:
        model = Product
        fields = [
            "name", "price", "discount_percent", "description", "category",
            "image_url", "image_urls",
            "brand", "sizes", "colors",
            "gender", "style", "occasion", "tags",
            "stock_quantity", "in_stock",
        ]

    def create(self, validated_data):
        image_urls = validated_data.pop("image_urls", [])
        product = Product.objects.create(
            owner=self.context["request"].user,
            **validated_data,
        )
        for i, url in enumerate(image_urls):
            ProductImage.objects.create(product=product, image_url=url, order=i)
        return product

    def update(self, instance, validated_data):
        image_urls = validated_data.pop("image_urls", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if image_urls is not None:
            instance.images.all().delete()
            for i, url in enumerate(image_urls):
                ProductImage.objects.create(product=instance, image_url=url, order=i)
        return instance
