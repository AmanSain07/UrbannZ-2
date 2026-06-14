import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'urbanz.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

if not User.objects.filter(email='admin@urbanz.com').exists():
    User.objects.create_superuser('admin@urbanz.com', 'admin', 'adminpassword')
    print("Admin user created: admin@urbanz.com / adminpassword")
else:
    print("Admin user already exists")
