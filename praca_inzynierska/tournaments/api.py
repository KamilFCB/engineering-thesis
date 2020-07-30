from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import (TournamentSerializer, TournamentsPageSerializer,
                          TournamentMatchSerializer, TournamentOrganizerSerializer,
                          RankingSerializer)
from .models import Tournament, Participation, Match
from django.core.paginator import Paginator
from accounts.serializers import TournamentParticipantSerializer, PlayerMatchSerializer
from django.http.response import JsonResponse
from django.db.models import Q
from .utils import (prepare_match_data, reverse_score, prepare_player_match_profile,
                    number_of_first_match_in_round, match_winner)
from tournaments.serializers import TournamentNameSerializer
from django.contrib.auth.models import User
from accounts.models import TennisProfile
import random
import datetime


class CreateTournamentAPI(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = TournamentSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['organizer'] = self.request.user
        serializer.save()

        return Response({
            "message": "Turniej został utworzony"
        }, status=201)


class TournamentAPI(generics.ListAPIView):
    serializer_class = TournamentSerializer

    def get(self, request, *args, **kwargs):
        try:
            tournament = Tournament.objects.get(pk=kwargs['tournament_id'])
        except Tournament.DoesNotExist:
            return Response({
                "message": "Taki turniej nie istnieje"
            }, status=400)

        serialized_tournament = self.get_serializer(tournament).data
        if self.request.user.is_authenticated:
            if serialized_tournament['end_of_registration'] >= datetime.datetime.now().date():
                serialized_tournament['can_join'] = True

            try:
                Participation.objects.get(player=self.request.user,
                                          tournament=serialized_tournament['id'])
                serialized_tournament['participate'] = True
            except Participation.DoesNotExist:
                pass

        return Response(serialized_tournament)


class IncomingTournamentsPageAPI(generics.ListAPIView):
    serializer_class = TournamentsPageSerializer
    queryset = (Tournament.objects
                          .filter(date__gt=datetime.datetime.now()).order_by('date'))

    def get(self, request, *args, **kwargs):
        paginator = Paginator(self.queryset, 25)
        page_number = kwargs['page_number']
        page_obj = paginator.get_page(page_number)
        serializer_list = [self.get_serializer(tournament).data
                           for tournament in page_obj.object_list]
        if self.request.user.is_authenticated:
            for tournament in serializer_list:
                if tournament['end_of_registration'] >= datetime.datetime.now().date():
                    tournament['can_join'] = True

                try:
                    Participation.objects.get(player=self.request.user,
                                              tournament=tournament['id'])
                    tournament['participate'] = True
                except Participation.DoesNotExist:
                    pass
        return Response({
            "tournaments": serializer_list,
            "hasMore": page_obj.has_next(),
            'nextPage': page_number+1
        })


class HistoryTournamentsPageAPI(generics.ListAPIView):
    serializer_class = TournamentsPageSerializer
    queryset = (Tournament.objects
                          .filter(date__lt=datetime.datetime.now()).order_by('date'))

    def get(self, request, *args, **kwargs):
        paginator = Paginator(self.queryset, 25)
        page_number = kwargs['page_number']
        page_obj = paginator.get_page(page_number)
        serializer_list = [self.get_serializer(tournament).data
                           for tournament in page_obj.object_list]
        if self.request.user.is_authenticated:
            for tournament in serializer_list:
                try:
                    Participation.objects.get(player=self.request.user,
                                              tournament=tournament['id'])
                    tournament['participate'] = True
                except Participation.DoesNotExist:
                    pass
        return Response({
            "tournaments": serializer_list,
            "hasMore": page_obj.has_next(),
            'nextPage': page_number+1
        })


class ParticipateTournamentAPI(generics.RetrieveDestroyAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = TournamentsPageSerializer

    def post(self, request, *args, **kwargs):
        try:
            tournament = Tournament.objects.get(id=request.data['tournament'])
        except Tournament.DoesNotExist:
            return Response({
                "message": "Taki turniej nie istnieje"
            }, status=400)
        if tournament.end_of_registration < datetime.datetime.now().date():
            return Response({
                "message": "Zapisy zostały zakończone"
            }, status=406)

        participant = (Participation.objects
                                    .filter(tournament=tournament)
                                    .count())
        if participant >= tournament.draw_size:
            return Response({
                "message": "Brak wolnych miejsc"
            }, status=406)

        user = self.request.user
        participation, created = (Participation
                                  .objects
                                  .get_or_create(tournament=tournament,
                                                 player=user))
        serializer_data = self.get_serializer(tournament).data
        serializer_data['participate'] = True
        return Response({
            "tournament": serializer_data
        }, status=201)

    def delete(self, request, *args, **kwargs):
        try:
            tournament = Tournament.objects.get(id=request.data['tournament'])
            user = self.request.user
            participation = Participation.objects.get(tournament=tournament,
                                                      player=user)
            if tournament.end_of_registration <= datetime.datetime.now().date():
                return Response({
                    "message": "Czas wypisów z tego turneju już minął"
                }, status=406)

            participation.delete()
            serializer_data = self.get_serializer(tournament).data
            serializer_data['participate'] = False
            return Response({
                "tournament": serializer_data
            })
        except Exception:
            return Response({
                "message": "Nie byłeś zapisany do tego turnieju"
            }, status=406)


class TournamentParticipantsAPI(generics.ListAPIView):
    serializer_class = TournamentParticipantSerializer

    def get(self, request, *args, **kwargs):
        tournament_id = kwargs['tournament_id']
        try:
            tournament = Tournament.objects.get(pk=tournament_id)
        except Tournament.DoesNotExist:
            return Response({
                "message": "Taki turniej nie istnieje"
            }, status=400)
        else:
            tournament_participants = Participation.objects.filter(tournament=tournament)
            participants_profiles = [self.get_serializer(participant.player).data
                                     for participant in tournament_participants]
            return Response({
                "participants": participants_profiles
            })


class OrganizedTournamentsAPI(generics.ListAPIView):
    serializer_class = TournamentsPageSerializer

    def get(self, request, *args, **kwargs):
        user_id = kwargs['user_id']
        try:
            user = User.objects.get(id=user_id)
            tournaments = Tournament.objects.filter(organizer=user)
        except Tournament.DoesNotExist:
            return Response({
                "participants": []
            })
        except User.DoesNotExist:
            return Response({
                "message": "Nie ma takiego użytkownika"
            }, status=400)
        else:
            serializer_list = [self.get_serializer(tournament).data
                               for tournament in tournaments]
            return Response({
                "tournaments": serializer_list
            })


class TournamentMatchesAPI(generics.ListAPIView):
    serializer_class = TournamentMatchSerializer

    def get(self, request, *args, **kwargs):
        tournament_id = kwargs['tournament_id']
        try:
            matches = Match.objects.filter(tournament_id=tournament_id).order_by("match_number")
        except Match.DoesNotExist:
            return Response({
                "message": "Brak meczów"
            }, status=406)
        else:
            matches_serializer = [prepare_match_data(self.get_serializer(match).data)
                                  for match in matches]

            return Response({
                "matches": matches_serializer
            })


class TournamentOrganizerAPI(generics.ListAPIView):
    serializer_class = TournamentOrganizerSerializer

    def get(self, request, *args, **kwargs):
        tournament_id = kwargs['tournament_id']
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            return Response({
                "message": "Nie ma takiego turnieju"
            }, status=406)
        else:
            return Response({
                "organizer": tournament.organizer.id
            })


class TournamentMatchAPI(generics.RetrieveUpdateAPIView):
    serializer_class = TournamentMatchSerializer

    def get(self, request, *args, **kwargs):
        match_id = kwargs['match_id']
        try:
            match = Match.objects.get(pk=match_id)
        except Match.DoesNotExist:
            return Response({
                "message": "Nie ma takiego meczu"
            }, status=406)
        else:
            match_serializer = self.get_serializer(match).data
            tournament = Tournament.objects.get(pk=match_serializer["tournament"])
            match_serializer["tournament"] = TournamentNameSerializer(tournament).data

            if match_serializer["player1"] is not None:
                match_serializer["player1"] = prepare_player_match_profile(match_serializer["player1"])

            if match_serializer["player2"] is not None:
                match_serializer["player2"] = prepare_player_match_profile(match_serializer["player2"])

            return JsonResponse(match_serializer)

    def put(self, request, *args, **kwargs):
        match_id = kwargs['match_id']
        try:
            match = Match.objects.get(pk=match_id)
        except Match.DoesNotExist:
            return Response({
                "message": "Nie ma takiego meczu"
            }, status=406)
        else:
            if self.request.user.id != match.tournament.organizer.id:
                return Response({
                    "message": "Nie jesteś organizatorem tego turnieju"
                }, status=406)

            serializer_data = self.get_serializer(match).data
            serializer_data["score"] = request.data["score"]
            serializer_data["player1"] = request.data["player1"]
            serializer_data["player2"] = request.data["player2"]
            serializer_data["time"] = request.data["time"]
            new_serializer = self.get_serializer(match, data=serializer_data)
            new_serializer.is_valid(raise_exception=True)
            new_serializer.save()
            return Response({})


class PlayerMatchesAPI(generics.ListAPIView):
    serializer_class = TournamentMatchSerializer

    def get(self, request, *args, **kwargs):
        page_number = kwargs['page_number']
        player_id = kwargs['player_id']
        try:
            queryset = (Match.objects.filter(Q(player1_id=player_id) | Q(player2_id=player_id))
                                     .order_by('-date'))
        except User.DoesNotExist:
            return Response({
                "message": "Nie ma takiego gracza"
            }, status=406)
        else:
            paginator = Paginator(queryset, 25)
            matches = paginator.get_page(page_number)
            matches_serializer = [prepare_match_data(self.get_serializer(match).data)
                                  for match in matches]

            for match in matches_serializer:
                if player_id != match["player1"]["id"]:
                    match["player1"], match["player2"] = match["player2"], match["player1"]
                    match["score"] = reverse_score(match["score"])

            return Response({
                "matches": matches_serializer,
                "hasMore": matches.has_next(),
                "nextPage": page_number+1
            })


class StartTournamentAPI(generics.CreateAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request, *args, **kwargs):
        tournament_id = kwargs['tournament_id']
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            return Response({
                "message": "Nie ma takiego turnieju"
            }, status=406)
        else:
            user = self.request.user
            if user != tournament.organizer:
                return Response({
                    "message": "Nie jesteś organizatorem turnieju"
                }, status=403)
            
            if tournament.started:
                return Response({
                    "message": "Turniej już się rozpoczął"
                }, status=406)
            
            if tournament.end_of_registration != datetime.now():
                return Response({
                    "message": "Nie możesz jeszcze rozpocząć tego turnieju, poczekaj do końca zapisów"
                }, status=406)
            
            matches_in_round = tournament.draw_size // 2
            round = 1
            match_number = 1
            participations = Participation.objects.filter(tournament=tournament)
            participants = [participation.player for participation in participations]
            while len(participants) < tournament.draw_size:
                participants.append(None)

            random.shuffle(participants)
            for player1, player2 in zip(participants[0::2], participants[1::2]):
                Match.objects.create(player1=player1, player2=player2, tournament=tournament,
                                    round=round, match_number=match_number, date=tournament.date)
                match_number += 1

            round += 1
            matches_in_round //= 2

            while matches_in_round >= 1:
                for i in range(matches_in_round):
                    Match.objects.create(tournament=tournament, round=round, 
                                         match_number=match_number, date=tournament.date)
                    match_number += 1
                round += 1
                matches_in_round //= 2

            tournament.started = True
            tournament.save()
            return Response({
                "message": "Pomyślnie rozpoczęto turniej"
            }, status=200)


class PreviousMatchWinnerAPI(generics.ListAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def post(self, request, *args, **kwargs):
        match_id = request.data['match']
        player_number = request.data['player']

        try:
            match = Match.objects.get(id=match_id)
        except Match.DoesNotExist:
            return Response({
                "message": "Nie ma takiego meczu"
            }, status=406)
        else:
            round_number = match.round

            if player_number == "1":
                player = match.player1
            else:
                player = match.player2

            if round_number == 1:
                if player is None:
                    return Response({
                        "player_number": player_number,
                        "player": {}
                    })

                return Response({
                    "player_number": player_number,
                    "player": prepare_player_match_profile(player.id)
                })

            match_number = match.match_number
            tournament = match.tournament
            draw_size = tournament.draw_size
            first_match_number_in_round = number_of_first_match_in_round(round_number, draw_size)
            matches_in_previous_round = draw_size / (2 ** (round_number - 1))
            previous_match_number = match_number - matches_in_previous_round + (match_number - first_match_number_in_round)
            if player_number == "2":
                previous_match_number += 1

            previous_match = Match.objects.get(match_number=previous_match_number, tournament=tournament)
            if previous_match.score == "":
                return Response({
                    "player_number": player_number,
                    "player": {}
                })

            prev_match_winner = match_winner(previous_match)
            return Response({
                    "player_number": player_number,
                    "player": prepare_player_match_profile(prev_match_winner.id)
                })


class PlayersRankingAPI(generics.ListCreateAPIView):
    serializer_class = RankingSerializer

    def get(self, request, *args, **kwargs):
        start_date = datetime.datetime.now() - datetime.timedelta(days=365)
        end_date = datetime.datetime.now()
        matches = Match.objects.filter(date__gte=start_date,
                                       date__lte=end_date,
                                       player1__isnull=False,
                                       player2__isnull=False)

        ranking = {}
        for match in matches:
            winner = match_winner(match)
            if winner in ranking:
                ranking[winner] += match.round * 10
            else:
                ranking[winner] = match.round * 10

        sorted_ranking = sorted(ranking.items(), key=lambda x: x[1], reverse=True)
        serialized_ranking = []
        place = 1
        for player, points in sorted_ranking:
            ranking_position = self.get_serializer(player).data
            ranking_position['points'] = points
            ranking_position['place'] = place
            place += 1
            serialized_ranking.append(ranking_position)

        return Response({'ranking': serialized_ranking,
                         'start_date': start_date.strftime("%Y-%m-%d"),
                         'end_date': end_date.strftime("%Y-%m-%d"),
                         'is_loading': False})
