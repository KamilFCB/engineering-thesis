from rest_framework import serializers
from .models import Tournament, Match
import math
import datetime
import re


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ('id', 'name', 'city', 'address',
                  'date', 'draw_size', 'description', 'started')

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

        return data

    def update(self, instance, validated_data):
        instance.name = validated_data['name']
        instance.city = validated_data['city']
        instance.address = validated_data['address']
        instance.date = validated_data['date']
        instance.draw_size = validated_data['draw_size']
        instance.description = validated_data['description']
        instance.save()
        return instance


class TournamentsPageSerializer(serializers.BaseSerializer):
    class Meta:
        model = Tournament
        fields = ('id', 'name', 'city', 'date', 'draw_size', 'participate')

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'name': instance.name,
            'city': instance.city,
            'date': instance.date,
            'draw_size': instance.draw_size,
            'participate': False
        }


class TournamentNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ('id', 'name')


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
        if score != "" and data["player1"] is None and data["player2"] is None:
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
