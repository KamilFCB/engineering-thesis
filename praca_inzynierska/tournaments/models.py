from django.db import models
from django.contrib.auth.models import User


class Tournament(models.Model):
    name = models.CharField(unique=True, max_length=100)
    city = models.CharField(max_length=50)
    address = models.CharField(max_length=100)
    date = models.DateField()
    draw_size = models.PositiveSmallIntegerField()
    description = models.TextField()
    organizer = models.ForeignKey(User, on_delete=models.CASCADE)


class Participation(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    player = models.ForeignKey(User, on_delete=models.CASCADE)


class Match(models.Model):
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player1")
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player2")
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    date = models.DateField()
    round = models.PositiveSmallIntegerField()
    score = models.CharField(max_length=15)
