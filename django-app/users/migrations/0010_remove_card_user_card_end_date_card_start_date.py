# Generated by Django 4.1.2 on 2024-06-17 07:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_card_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='card',
            name='user',
        ),
        migrations.AddField(
            model_name='card',
            name='end_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='card',
            name='start_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
