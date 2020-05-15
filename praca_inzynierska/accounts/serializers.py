from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import TennisProfile
import re


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'],
                                        validated_data['email'],
                                        validated_data['password'])
        return user

    def validate(self, data):
        first_name = data['first_name']
        last_name = data['last_name']

        if re.match("[A-Z][a-z]+", first_name) is None:
            raise serializers.ValidationError("Imię musi rozpoczynać się wielką \
                                              literą i posiadać co najmniej dwie litery")
        if re.match("[A-Z][a-z]+", last_name) is None:
            raise serializers.ValidationError("Nazwisko musi rozpoczynać się wielką \
                                              literą i posiadać co najmniej dwie litery")

        return data


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

    def validate(self, data):
        first_name = data['first_name']
        last_name = data['last_name']

        if re.match("[A-Z][a-z]+", first_name) is None:
            raise serializers.ValidationError("Imię musi rozpoczynać się wielką \
                                              literą i posiadać co najmniej dwie litery")
        if re.match("[A-Z][a-z]+", last_name) is None:
            raise serializers.ValidationError("Nazwisko musi rozpoczynać się wielką \
                                              literą i posiadać co najmniej dwie litery")

        return data


class TennisProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TennisProfile
        fields = ('residence', 'birth_date', 'weight', 'height', 'forehand',
                  'backhand', 'user_id')

    def update(self, instance, validated_data):
        instance.residence = validated_data['residence']
        instance.birth_date = validated_data['birth_date']
        instance.weight = validated_data['weight']
        instance.height = validated_data['height']
        instance.forehand = validated_data['forehand']
        instance.backhand = validated_data['backhand']
        instance.save()
        return instance


class TournamentParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name')


class PlayerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TennisProfile
        fields = ('residence', 'birth_date', 'weight', 'height', 'forehand',
                  'backhand', 'first_name', 'last_name')

    def to_representation(self, instance):
        return {
            'residence': instance.residence,
            'birth_date': instance.birth_date,
            'weight': instance.weight,
            'height': instance.height,
            'forehand': instance.forehand,
            'backhand': instance.backhand,
            'first_name': "",
            'last_name': "",
        }
