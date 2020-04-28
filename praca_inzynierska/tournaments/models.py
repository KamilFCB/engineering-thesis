from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Tournament(models.Model):
    name = models.CharField(unique=True, max_length=100)
    city = models.CharField(max_length=50)
    address = models.CharField(max_length=100)
    date = models.DateField()
    draw_size = models.PositiveSmallIntegerField()
    description = models.TextField()
    organizer = models.ForeignKey(User, on_delete=models.CASCADE)
