from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class TennisProfile(models.Model):
    LEFT_HANDED = 'Leworęczny'
    RIGHT_HANDED = 'Praworęczny'
    DEFAULT = '-'
    ONE_HANDED = 'Jednoręczny'
    TWO_HANDED = 'Dwuręczny'

    FOREHAND_TYPE = [
        (LEFT_HANDED, 'Leworęczny'),
        (RIGHT_HANDED, 'Praworęczny'),
        (DEFAULT, '-')
    ]
    BACKHAND_TYPE = [
        (ONE_HANDED, 'Jednoręczny'),
        (TWO_HANDED, 'Dwuręczny'),
        (DEFAULT, '-')
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    residence = models.CharField(max_length=50, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    weight = models.PositiveSmallIntegerField(blank=True, null=True)
    height = models.PositiveSmallIntegerField(blank=True, null=True)
    forehand = models.CharField(max_length=20, choices=FOREHAND_TYPE,
                                blank=True, null=True)
    backhand = models.CharField(max_length=20, choices=BACKHAND_TYPE,
                                blank=True, null=True)
