"""
UrbanZ — Vendor Application Views

Customer: submit application, check status.
Admin: list all applications, approve, reject.
"""

from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdmin
from apps.notifications.utils import create_notification
from .models import VendorApplication
from .serializers import VendorApplicationSerializer, VendorApplicationSubmitSerializer

User = get_user_model()


class SubmitVendorApplicationView(generics.CreateAPIView):
    """
    POST /api/vendors/apply/
    Any authenticated non-admin user can submit a vendor application.
    (Customers applying for the first time; duplicates handled by OneToOne constraint)
    """
    serializer_class = VendorApplicationSubmitSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Admins cannot apply as vendors
        if request.user.role == "admin" or request.user.is_staff:
            return Response(
                {"detail": "Admin accounts cannot submit vendor applications."},
                status=status.HTTP_403_FORBIDDEN,
            )
        # Prevent duplicate applications
        if VendorApplication.objects.filter(user=request.user).exists():
            existing = VendorApplication.objects.get(user=request.user)
            return Response(
                {
                    "detail": f"You already have an application with status: {existing.status}.",
                    "application": VendorApplicationSerializer(existing).data,
                },
                status=status.HTTP_200_OK,
            )
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        application = serializer.save()
        return Response(
            {
                "message": "Vendor application submitted successfully. Pending admin review.",
                "application": VendorApplicationSerializer(application).data,
            },
            status=status.HTTP_201_CREATED,
        )


class MyVendorApplicationView(generics.RetrieveAPIView):
    """
    GET /api/vendors/my-application/
    Customer checks their own application status.
    """
    serializer_class = VendorApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            return VendorApplication.objects.get(user=self.request.user)
        except VendorApplication.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound("No vendor application found.")


class AdminVendorApplicationListView(generics.ListAPIView):
    """
    GET /api/vendors/applications/
    Admin lists all vendor applications.
    """
    queryset = VendorApplication.objects.select_related("user", "approved_by").all()
    serializer_class = VendorApplicationSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ["status"]
    search_fields = ["business_name", "user__email", "user__name"]


class AdminApproveVendorView(APIView):
    """
    POST /api/vendors/applications/{id}/approve/
    Admin approves a vendor application → promotes user to vendor role.
    """
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            application = VendorApplication.objects.select_related("user").get(pk=pk)
        except VendorApplication.DoesNotExist:
            return Response({"detail": "Application not found."}, status=status.HTTP_404_NOT_FOUND)

        if application.status != VendorApplication.Status.PENDING:
            return Response(
                {"detail": f"Application is already {application.status}."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Promote user to vendor
        application.status = VendorApplication.Status.APPROVED
        application.approved_by = request.user
        application.save()

        user = application.user
        user.role = User.Role.VENDOR
        user.save()

        # Notify user
        create_notification(
            user=user,
            title="Vendor Application Approved! 🎉",
            message=f"Congratulations! Your vendor application for '{application.business_name}' has been approved. You can now create your store.",
        )

        return Response(
            {
                "message": f"Vendor application approved. {user.name} is now a vendor.",
                "application": VendorApplicationSerializer(application).data,
            }
        )


class AdminRejectVendorView(APIView):
    """
    POST /api/vendors/applications/{id}/reject/
    Admin rejects a vendor application.
    """
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            application = VendorApplication.objects.select_related("user").get(pk=pk)
        except VendorApplication.DoesNotExist:
            return Response({"detail": "Application not found."}, status=status.HTTP_404_NOT_FOUND)

        if application.status != VendorApplication.Status.PENDING:
            return Response(
                {"detail": f"Application is already {application.status}."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reason = request.data.get("reason", "Application did not meet requirements.")
        application.status = VendorApplication.Status.REJECTED
        application.rejection_reason = reason
        application.approved_by = request.user
        application.save()

        # Notify user
        create_notification(
            user=application.user,
            title="Vendor Application Update",
            message=f"Your vendor application has been reviewed. Reason: {reason}",
        )

        return Response(
            {
                "message": "Application rejected.",
                "application": VendorApplicationSerializer(application).data,
            }
        )
