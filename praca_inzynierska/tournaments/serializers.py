from rest_framework import serializers
from .models import Tournament
import math


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ('id', 'name', 'city', 'address', 'date', 'draw_size', 'description')

    def validate(self, data):
        if math.log2(data['draw_size']).is_integer() and data['draw_size'] <= 64 and data['draw_size'] > 0:
            if data['address'].split(" ").pop().isnumeric() and len(data['address'].split(" ")) > 1:
                return data
            else:
                raise serializers.ValidationError("Błędny adres")
        else:
            raise serializers.ValidationError("Rozmiar drabinki turniejowej musi być potęgą dwójki oraz dodatnią liczbą nie większą niż 64")

    def update(self, instance, validated_data):
        instance.name = validated_data['name']
        instance.city = validated_data['city']
        instance.address = validated_data['address']
        instance.date = validated_data['date']
        instance.draw_size = validated_data['draw_size']
        instance.description = validated_data['description']
        instance.save()
        return instance
