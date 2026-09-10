from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .serializers import UserSerializer


class LoginSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['user_id'] = user.id
        token['email'] = user.email
        token['role'] = user.role

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        data['user'] = UserSerializer(
            self.user
        ).data

        return data