# Generated by Django 4.1.2 on 2024-04-13 10:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_user_cards'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Card',
        ),
        migrations.AddField(
            model_name='profile',
            name='cards_id',
            field=models.IntegerField(default=0),
        ),
    ]
