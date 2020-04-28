from django.urls import path
from .api import CreateTournamentAPI, TournamentAPI


urlpatterns = [
    path('api/tournament/create', CreateTournamentAPI.as_view()),
    path('api/tournament/get', TournamentAPI.as_view())
]