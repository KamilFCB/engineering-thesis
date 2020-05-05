from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import TournamentSerializer, TournamentsPageSerializer
from .models import Tournament, Participation
from django.core.paginator import Paginator
from django.utils.datetime_safe import datetime


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
    queryset = Tournament.objects.order_by('-id')

    def get_object(self):
        serializer = self.get_serializer(self.queryset)
        return serializer.data


class IncomingTournamentsPageAPI(generics.ListAPIView):
    serializer_class = TournamentsPageSerializer
    queryset = (Tournament.objects
                          .filter(date__gt=datetime.now()).order_by('date'))

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


class HistoryTournamentsPageAPI(generics.ListAPIView):
    serializer_class = TournamentsPageSerializer
    queryset = (Tournament.objects
                          .filter(date__lt=datetime.now()).order_by('date'))

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
        tournament = Tournament.objects.get(id=request.data['tournament'])
        if tournament.date < datetime.now().date():
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
            if tournament.date < datetime.now().date():
                return Response({
                    "message": "Nie możesz wypisać się z tego turnieju"
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
