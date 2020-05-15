from rest_framework import generics, permissions
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import (UserSerializer, RegisterSerializer, LoginSerializer,
                          UserProfileSerializer, TennisProfileSerializer)
from django.http import JsonResponse
from .models import TennisProfile


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        TennisProfile.objects.create(user_id=user.id)
        return Response({
            "user": UserSerializer(user,
                                   context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        }, status=201)


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user,
                                   context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserProfileAPI(generics.RetrieveUpdateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

    def put(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.request.user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)


class TennisProfileAPI(generics.RetrieveUpdateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = TennisProfileSerializer

    def get_object(self):
        profile = TennisProfile.objects.get(user_id=self.request.user)
        serializer = self.get_serializer(profile)

        return serializer.data

    def put(self, request, *args, **kwargs):
        if self.request.data['birth_date'] == "":
        self.request.data['birth_date'] = None
        profile = TennisProfile.objects.get(user_id=self.request.user)
        serializer = self.get_serializer(profile, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)
