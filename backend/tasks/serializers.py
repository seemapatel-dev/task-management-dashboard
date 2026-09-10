from rest_framework import serializers

from .models import User,  Task


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'name',
            'role',
        ]
        read_only_fields = [
            'id',
            'name',
        ]

    def get_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'.strip()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    name = serializers.CharField(
        write_only=True,
        required=True,
    )

    class Meta:
        model = User
        fields = [
            'name',
            'email',
            'password',
        ]

    def validate_email(self, value):
        value = value.lower().strip()

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                'An account with this email already exists.'
            )

        return value

    def create(self, validated_data):
        name = validated_data.pop('name')
        email = validated_data.pop('email').lower().strip()
        password = validated_data.pop('password')

        name_parts = name.strip().split(' ', 1)

        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        user = User.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        return user
    

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "project",
            "priority",
            "status",
            "due",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]