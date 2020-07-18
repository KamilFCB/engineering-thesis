from django.urls import path
from .api import (CreateTournamentAPI, TournamentAPI, IncomingTournamentsPageAPI,
                  ParticipateTournamentAPI, HistoryTournamentsPageAPI, TournamentParticipantsAPI,
                  TournamentMatchesAPI, TournamentMatchAPI, PlayerMatchesAPI, OrganizedTournamentsAPI,
                  TournamentOrganizerAPI, StartTournamentAPI)


urlpatterns = [
     path('api/tournament/create', CreateTournamentAPI.as_view()),
     path('api/tournament/<int:tournament_id>', TournamentAPI.as_view()),
     path('api/tournaments/incoming/page/<int:page_number>',
          IncomingTournamentsPageAPI.as_view()),
     path('api/tournaments/organized/<int:user_id>',
          OrganizedTournamentsAPI.as_view()),
     path('api/tournaments/history/page/<int:page_number>',
          HistoryTournamentsPageAPI.as_view()),
     path('api/tournament/participate',
          ParticipateTournamentAPI.as_view()),
     path('api/tournament/participants/<int:tournament_id>',
          TournamentParticipantsAPI.as_view()),
     path('api/tournament/<int:tournament_id>/matches', TournamentMatchesAPI.as_view()),
     path('api/tournament/<int:tournament_id>/match/<int:match_id>',
          TournamentMatchAPI.as_view()),
     path('api/tournament/<int:tournament_id>/organizer', TournamentOrganizerAPI.as_view()),
     path('api/tournament/<int:tournament_id>/start', StartTournamentAPI.as_view()),
     path('api/player/<int:player_id>/matches/<int:page_number>', PlayerMatchesAPI.as_view())
]
