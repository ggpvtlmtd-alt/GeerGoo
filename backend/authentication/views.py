from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
)


# -----------------------------
# Helper Function
# -----------------------------
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


# -----------------------------
# Welcome API
# -----------------------------
@api_view(["GET"])
@permission_classes([AllowAny])
def hello(request):
    return Response(
        {
            "message": "Welcome to GeerGoo API"
        },
        status=status.HTTP_200_OK,
    )


# -----------------------------
# Register API
# -----------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):

    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():

        user = serializer.save()

        tokens = get_tokens_for_user(user)

        return Response(
            {
                "success": True,
                "message": "Registration Successful",
                "user": UserSerializer(user).data,
                "tokens": tokens,
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


# -----------------------------
# Login API
# -----------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):

    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():

        user = serializer.validated_data["user"]

        tokens = get_tokens_for_user(user)

        return Response(
            {
                "success": True,
                "message": "Login Successful",
                "user": UserSerializer(user).data,
                "tokens": tokens,
            },
            status=status.HTTP_200_OK,
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


# -----------------------------
# Profile API
# -----------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile(request):

    serializer = UserSerializer(request.user)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK,
    )


# -----------------------------
# Logout API
# -----------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        print("Request Data:", request.data)

        refresh_token = request.data.get("refresh")
        print("Refresh Token:", refresh_token)

        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response(
            {
                "success": True,
                "message": "Logged Out Successfully"
            },
            status=status.HTTP_205_RESET_CONTENT,
        )

    except Exception as e:
        print("Logout Error:", str(e))

        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST,
        )