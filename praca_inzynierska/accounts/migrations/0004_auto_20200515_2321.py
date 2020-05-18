# Generated by Django 3.0.6 on 2020-05-15 21:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_auto_20200422_2205'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tennisprofile',
            name='backhand',
            field=models.CharField(blank=True, choices=[('Jednoręczny', 'Jednoręczny'), ('Dwuręczny', 'Dwuręczny'), ('-', '-')], max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='tennisprofile',
            name='forehand',
            field=models.CharField(blank=True, choices=[('Leworęczny', 'Leworęczny'), ('Praworęczny', 'Praworęczny'), ('-', '-')], max_length=20, null=True),
        ),
    ]