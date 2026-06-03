"""
UrbanZ — Custom DRF Permissions

IsCustomer    - role == customer
IsVendor      - role == vendor (approved)
IsAdmin       - role == admin or is_staff
IsStoreOwner  - checked in view with store.owner == request.user
"""

from rest_framework.permissions import BasePermission


class IsCustomer(BasePermission):
    """Only users with role=customer."""
    message = "Customer access required."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "customer"
            and not request.user.is_suspended
        )


class IsVendor(BasePermission):
    """Only approved vendors."""
    message = "Vendor access required. Submit a vendor application first."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "vendor"
            and not request.user.is_suspended
        )


class IsAdmin(BasePermission):
    """Only admins or staff."""
    message = "Admin access required."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.role == "admin" or request.user.is_staff)
            and not request.user.is_suspended
        )


class IsVendorOrAdmin(BasePermission):
    """Vendor or Admin."""
    message = "Vendor or Admin access required."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return (
            (request.user.role in ("vendor", "admin") or request.user.is_staff)
            and not request.user.is_suspended
        )


class IsOwnerOrAdmin(BasePermission):
    """Object-level: owner or admin can access."""
    message = "You do not have permission to access this resource."

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.role == "admin":
            return True
        # Support objects with .owner or .user FK
        owner = getattr(obj, "owner", None) or getattr(obj, "user", None)
        return owner == request.user


class IsNotSuspended(BasePermission):
    """Rejects suspended users from any action."""
    message = "Your account has been suspended. Contact support."

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and not request.user.is_suspended
