# Generated by Django 5.1.7 on 2025-03-15 09:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0018_alter_profile_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='avatar_url',
            field=models.URLField(blank=True, null=True),
        ),
    ]
