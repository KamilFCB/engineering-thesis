from django.db import models
from django.contrib.auth.models import User
import datetime


class Tournament(models.Model):
    name = models.CharField(unique=True, max_length=100)
    city = models.CharField(max_length=50)
    address = models.CharField(max_length=100)
    date = models.DateField()
    end_of_registration = models.DateField()
    draw_size = models.PositiveSmallIntegerField()
    description = models.TextField()
    organizer = models.ForeignKey(User, on_delete=models.CASCADE)
    started = models.BooleanField(default=False)
    accepted = models.BooleanField(default=False)


class Participation(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    player = models.ForeignKey(User, on_delete=models.CASCADE)


class Match(models.Model):
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player1", null=True)
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player2", null=True)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField(default=datetime.time(0, 00))
    round = models.PositiveSmallIntegerField()
    score = models.CharField(max_length=15, default="", blank=True)
    match_number = models.PositiveSmallIntegerField()
