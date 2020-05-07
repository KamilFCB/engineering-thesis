from rest_framework import serializers
from .models import Tournament
import math
import datetime


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ('id', 'name', 'city', 'address',
                  'date', 'draw_size', 'description')

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
