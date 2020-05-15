from django.urls import path
from .api import (CreateTournamentAPI, TournamentAPI,
                  IncomingTournamentsPageAPI, ParticipateTournamentAPI,
                  HistoryTournamentsPageAPI, TournamentParticipants)


urlpatterns = [
     path('api/tournament/create', CreateTournamentAPI.as_view()),
     path('api/tournament/<int:tournament_id>', TournamentAPI.as_view()),
     path('api/tournaments/incoming/page/<int:page_number>',
          IncomingTournamentsPageAPI.as_view()),
     path('api/tournaments/history/page/<int:page_number>',
          HistoryTournamentsPageAPI.as_view()),
     path('api/tournament/participate',
          ParticipateTournamentAPI.as_view()),
     path('api/tournament/participants/<int:tournament_id>',
          TournamentParticipants.as_view()),
]
