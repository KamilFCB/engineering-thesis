from django.contrib.auth.models import User
from .serializers import TournamentNameSerializer
from accounts.serializers import TournamentParticipantSerializer
from .models import Tournament


def prepare_match_data(serialized_data):
    player1 = User.objects.get(pk=serialized_data["player1"])
    player2 = User.objects.get(pk=serialized_data["player2"])
    tournament = Tournament.objects.get(pk=serialized_data["tournament"])
    serialized_data["tournament"] = TournamentNameSerializer(tournament).data
    serialized_data["player1"] = TournamentParticipantSerializer(player1).data
    serialized_data["player2"] = TournamentParticipantSerializer(player2).data

    return serialized_data


def reverse_score(score):
    sets = []
    for set in score.split():
        gems = set.split(":")
        sets.append(gems[1] + ":" + gems[0])

    return (" ").join(sets)
