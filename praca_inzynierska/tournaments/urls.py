from django.urls import path
from .api import (CreateTournamentAPI, TournamentAPI,
                  IncomingTournamentsPageAPI, ParticipateTournamentAPI,
                  HistoryTournamentsPageAPI)


urlpatterns = [
    path('api/tournament/create', CreateTournamentAPI.as_view()),
    path('api/tournament/get', TournamentAPI.as_view()),
    path('api/tournaments/incoming/page/<int:page_number>',
         IncomingTournamentsPageAPI.as_view()),
    path('api/tournaments/history/page/<int:page_number>',
         HistoryTournamentsPageAPI.as_view()),
    path('api/tournament/participate',
         ParticipateTournamentAPI.as_view())
]
