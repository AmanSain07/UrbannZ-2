"""Utility to create notifications from any app."""
from .models import Notification


def create_notification(user, title, message):
    """Create a notification for a user."""
    return Notification.objects.create(user=user, title=title, message=message)
