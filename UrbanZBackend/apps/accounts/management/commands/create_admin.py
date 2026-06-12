"""
Management command to create or verify the production admin superuser.
Run: python manage.py create_admin
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

ADMIN_EMAIL = "admin@urbanz.com"
ADMIN_NAME = "UrbanZ Admin"
ADMIN_PASSWORD = "admin@123"


class Command(BaseCommand):
    help = "Create or verify the production admin superuser."

    def handle(self, *args, **kwargs):
        self.stdout.write("=== UrbanZ Production Admin Setup ===\n")

        # Check existing superusers
        superusers = User.objects.filter(is_superuser=True)
        self.stdout.write(f"Total superusers in DB: {superusers.count()}")

        for u in superusers:
            self.stdout.write(
                f"  FOUND: {u.email} | name={u.name} | "
                f"is_staff={u.is_staff} | is_active={u.is_active} | role={u.role}"
            )

        # Create or update admin
        user, created = User.objects.get_or_create(
            email=ADMIN_EMAIL,
            defaults={
                "name": ADMIN_NAME,
                "role": User.Role.ADMIN,
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
            },
        )

        if created:
            user.set_password(ADMIN_PASSWORD)
            user.save()
            self.stdout.write(self.style.SUCCESS(
                f"\n[CREATED] Admin: {ADMIN_EMAIL} / {ADMIN_PASSWORD}"
            ))
        else:
            # Force-update flags and password on existing user
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True
            user.role = User.Role.ADMIN
            user.set_password(ADMIN_PASSWORD)
            user.save()
            self.stdout.write(self.style.SUCCESS(
                f"\n[UPDATED] Admin password reset: {ADMIN_EMAIL} / {ADMIN_PASSWORD}"
            ))

        self.stdout.write("\n=== Login Details ===")
        self.stdout.write(f"  URL:      https://urbanz-backend-production.up.railway.app/admin/")
        self.stdout.write(f"  Email:    {ADMIN_EMAIL}")
        self.stdout.write(f"  Password: {ADMIN_PASSWORD}")
        self.stdout.write(self.style.SUCCESS("\n[DONE] Admin is ready.\n"))
