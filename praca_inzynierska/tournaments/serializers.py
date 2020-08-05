from rest_framework import serializers
from .models import Tournament, Match
from django.contrib.auth.models import User
import math
import datetime
import re


class TournamentSerializer(serializers.BaseSerializer):
    class Meta:
        model = Tournament
        fields = ('id', 'name', 'city', 'address', 'end_of_registration', 'can_join',
                  'date', 'draw_size', 'description', 'started', 'participate')

    def update(self, instance, validated_data):
        instance.name = validated_data['name']
        instance.city = validated_data['city']
        instance.address = validated_data['address']
        instance.date = validated_data['date']
        instance.draw_size = validated_data['draw_size']
        instance.description = validated_data['description']
        instance.end_of_registration = validated_data['end_of_registration']
        instance.save()
        return instance

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'name': instance.name,
            'city': instance.city,
            'address': instance.address,
            'date': instance.date,
            'draw_size': instance.draw_size,
            'description': instance.description,
            'end_of_registration': instance.end_of_registration,
            'participate': False,
            'can_join': False,
        }

    def to_internal_value(self, data):
        return {
            'name': data["name"],
            'city': data["city"],
            'address': data["address"],
            'date': data["date"],
            'draw_size': data["draw_size"],
            'description': data["description"],
            'end_of_registration': data["end_of_registration"]
        }

    def create(self, validated_data):
        return Tournament.objects.create(name=validated_data['name'], city=validated_data['city'],
                                         address=validated_data['address'], draw_size=validated_data['draw_size'],
                                         description=validated_data['description'], organizer=validated_data['organizer'],
                                         date=validated_data['date'], end_of_registration=validated_data['end_of_registration'])


class CreateTournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ('name', 'city', 'address', 'end_of_registration', 'date', 'draw_size', 'description', 'organizer')

    def validate(self, data):
        if not math.log2(data['draw_size']).is_integer() or \
           data['draw_size'] > 64 or data['draw_size'] < 0:
            raise serializers.ValidationError("Rozmiar drabinki turniejowej musi \
                 być potęgą dwójki oraz dodatnią liczbą nie większą niż 64")

        if not data['address'].split(" ").pop().isnumeric() or \
           len(data['address'].split(" ")) <= 1:
            raise serializers.ValidationError("Błędny adres")

        actual_date = datetime.datetime.now().strftime("%Y-%m-%d")
        given_date = data['date'].strftime("%Y-%m-%d")
        if actual_date >= given_date:
            raise serializers.ValidationError("Błędna data, turniej musi odbyć \
                                               się w przyszłości")

        if data['end_of_registration'] >= data['date']:
            raise serializers.ValidationError("Zapisy do turnieju muszą się zakończyc \
                                               przed rozpocząciem turnieju")

        return data


class TournamentsPageSerializer(serializers.BaseSerializer):
    class Meta:
        model = Tournament
        fields = ('id', 'name', 'city', 'date', 'end_of_registration',
                  'draw_size', 'participate', 'can_join')

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'name': instance.name,
            'city': instance.city,
            'date': instance.date,
            'draw_size': instance.draw_size,
            'end_of_registration': instance.end_of_registration,
            'participate': False,
            'can_join': False,
        }


class TournamentNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ('id', 'name', 'draw_size')


class TournamentOrganizerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ('id', 'organizer')


class TournamentMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ('id', 'player1', 'player2', 'tournament', 'date', 'time', 'round', 'score', 'match_number')

    def validate(self, data):
        score = data["score"]
        if score != "":
            if data["player1"] is None and data["player2"] is None:
                raise serializers.ValidationError("Wybierz co najmniej jednego zawodnika")
            if re.match("[0-7]:[0-7] [0-7]:[0-7]( [0-7]:[0-7])?", score) is None:
                raise serializers.ValidationError("Błędny wynik meczu")

            player1_won_sets = 0
            player2_won_sets = 0
            for set_score in score.split():
                games = set_score.split(":")
                if (int(games[0]) - int(games[1]) >= 2 and games[0] <= "6") or (games[0] == "7" and games[1] == "6"):
                    player1_won_sets += 1
                elif (int(games[1]) - int(games[0]) >= 2 and games[1] <= "6") or (games[1] == "7" and games[0] == "6"):
                    player2_won_sets += 1
                else:
                    raise serializers.ValidationError("Błędny wynik meczu")

            if player2_won_sets < 2 and player1_won_sets < 2:
                raise serializers.ValidationError("Błędny wynik meczu")

        return data


class RankingSerializer(serializers.BaseSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'points', 'place')

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'first_name': instance.first_name,
            'last_name': instance.last_name,
            'place': 0,
            'points': 0,
        }


class TournamentDescriptionSerializer(serializers.BaseSerializer):
    class Meta:
        model = Tournament
        fields: ('id', 'date', 'name', 'description')

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'date': instance.date,
            'name': instance.name,
            'description': instance.description,
        }
