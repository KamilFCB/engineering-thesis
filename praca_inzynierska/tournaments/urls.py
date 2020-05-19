from django.urls import path
from .api import (CreateTournamentAPI, TournamentAPI,
                  IncomingTournamentsPageAPI, ParticipateTournamentAPI,
                  HistoryTournamentsPageAPI, TournamentParticipants,
                  TournamentMatches, TournamentMatch, PlayerMatches)


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
     path('api/tournament/<int:tournament_id>/matches', TournamentMatches.as_view()),
     path('api/tournament/<int:tournament_id>/match/<int:match_id>',
          TournamentMatch.as_view()),
     path('api/player/<int:player_id>/matches/<int:page_number>', PlayerMatches.as_view())
]
