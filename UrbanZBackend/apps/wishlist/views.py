from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.products.models import Product
from .models import Wishlist
from .serializers import WishlistSerializer


class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = Wishlist.objects.filter(user=request.user).select_related("product")
        return Response(WishlistSerializer(items, many=True).data)

    def post(self, request):
        product_id = request.data.get("product_id")
        try:
            product = Product.objects.get(pk=product_id, status="approved")
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        item, created = Wishlist.objects.get_or_create(user=request.user, product=product)
        if not created:
            return Response({"detail": "Already in wishlist."}, status=status.HTTP_200_OK)
        return Response(WishlistSerializer(item).data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        product_id = request.data.get("product_id")
        deleted, _ = Wishlist.objects.filter(user=request.user, product_id=product_id).delete()
        if deleted:
            return Response({"message": "Removed from wishlist."})
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
