from rest_framework import generics, permissions
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import (UserSerializer, RegisterSerializer, LoginSerializer,
                          UserProfileSerializer, TennisProfileSerializer,
                          PlayerProfileSerializer)
from django.http import JsonResponse
from .models import TennisProfile
from django.contrib.auth.models import User


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


class PlayerProfileAPI(generics.RetrieveAPIView):
    serializer_class = PlayerProfileSerializer

    def get(self, request, *args, **kwargs):
        player_id = kwargs['player_id']
        try:
            tennis_profile = TennisProfile.objects.get(user_id=player_id)
        except TennisProfile.DoesNotExist:
            return Response({
                "message": "Nie ma takiego gracza"
            }, status=406)
        user_profile = User.objects.get(pk=player_id)
        serializer = self.get_serializer(tennis_profile)
        player_profile = serializer.data
        player_profile['first_name'] = user_profile.first_name
        player_profile['last_name'] = user_profile.last_name

        return JsonResponse(player_profile)
