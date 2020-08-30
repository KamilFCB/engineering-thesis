from django.contrib.auth.models import User
from .serializers import TournamentNameSerializer
from accounts.serializers import TournamentParticipantSerializer, TennisProfile, PlayerMatchSerializer
from .models import Tournament


def prepare_match_data(serialized_data):
    """
        Returns match informations with players profiles
    """
    if serialized_data["player1"] is not None:
        player1 = User.objects.get(pk=serialized_data["player1"])
        serialized_data["player1"] = TournamentParticipantSerializer(player1).data

    if serialized_data["player2"] is not None:
        player2 = User.objects.get(pk=serialized_data["player2"])
        serialized_data["player2"] = TournamentParticipantSerializer(player2).data

    tournament = Tournament.objects.get(pk=serialized_data["tournament"])
    serialized_data["tournament"] = TournamentNameSerializer(tournament).data
    return serialized_data


def prepare_player_match_profile(player_id):
    user = User.objects.get(pk=player_id)
    user_tennis_profile = TennisProfile.objects.get(user=user)
    user_tennis_serializer = PlayerMatchSerializer(user_tennis_profile).data
    user_tennis_serializer['first_name'] = user.first_name
    user_tennis_serializer['last_name'] = user.last_name
    user_tennis_serializer['id'] = user.id
    return user_tennis_serializer


def reverse_score(score):
    """
        Reverses tennis match score
    """
    sets = []
    for set in score.split():
        gems = set.split(":")
        sets.append(gems[1] + ":" + gems[0])

    return (" ").join(sets)


def number_of_first_match_in_round(round_number, draw_size):
    """
        Calculates number of first match in round
    """
    result = 0
    for i in range(1, round_number):
        draw_size /= 2
        result += draw_size

    return int(result + 1)


def match_winner(match):
    """
        Returns match winner
    """
    player1_won_sets = 0
    player2_won_sets = 0

    if match.player1 is None:
        return match.player2

    if match.player2 is None:
        return match.player1

    for set_score in match.score.split(" "):
        games = set_score.split(":")
        if games[0] > games[1]:
            player1_won_sets += 1
        else:
            player2_won_sets += 1

    if player1_won_sets > player2_won_sets:
        return match.player1
    return match.player2
