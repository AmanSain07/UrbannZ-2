"""
UrbanZ — Admin Panel URL Patterns
"""
from django.urls import path
from .admin_views import AdminUserListView, AdminUserStatusView, AdminAnalyticsView

urlpatterns = [
    path("users/", AdminUserListView.as_view(), name="admin-user-list"),
    path("users/<uuid:pk>/status/", AdminUserStatusView.as_view(), name="admin-user-status"),
    path("analytics/", AdminAnalyticsView.as_view(), name="admin-analytics"),
]
