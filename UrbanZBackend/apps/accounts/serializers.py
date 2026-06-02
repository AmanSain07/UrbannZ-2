"""
UrbanZ — Accounts Serializers

Handles: Register, Login (JWT), Profile, Password Change.
"""

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Extends JWT payload with user role and name."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["name"] = user.name
        token["email"] = user.email
        token["role"] = user.role
        return token


class RegisterSerializer(serializers.ModelSerializer):
    """Customer registration — creates user with role=customer."""

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["name", "email", "password", "confirm_password"]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user = User.objects.create_user(
            email=validated_data["email"],
            name=validated_data["name"],
            password=validated_data["password"],
            role=User.Role.CUSTOMER,
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Full profile — read/update."""

    class Meta:
        model = User
        fields = [
            "id", "name", "email", "role", "phone",
            "avatar", "is_active", "is_suspended", "created_at",
        ]
        read_only_fields = ["id", "email", "role", "is_active", "is_suspended", "created_at"]


class UserPublicSerializer(serializers.ModelSerializer):
    """Minimal public-safe user info for lists."""

    class Meta:
        model = User
        fields = ["id", "name", "email", "role", "is_active", "is_suspended", "created_at"]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(
        required=True, write_only=True, validators=[validate_password]
    )
    confirm_new_password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_new_password"]:
            raise serializers.ValidationError(
                {"confirm_new_password": "New passwords do not match."}
            )
        return attrs
