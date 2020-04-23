from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import TennisProfile


# user serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


# register serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])
        return user


# login serializer
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user

        raise serializers.ValidationError("Błędny login i/lub hasło")


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name')


class TennisProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TennisProfile
        fields = ('residence', 'birth_date', 'weight', 'height', 'forehand', 'backhand', 'user_id')

    def update(self, instance, validated_data):
        instance.residence = validated_data['residence']
        instance.birth_date = validated_data['birth_date']
        instance.weight = validated_data['weight']
        instance.height = validated_data['height']
        instance.forehand = validated_data['forehand']
        instance.backhand = validated_data['backhand']
        instance.save()
        return instance
