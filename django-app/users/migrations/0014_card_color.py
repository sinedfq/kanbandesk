# Generated by Django 5.1.6 on 2025-02-15 08:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_alter_profile_avatar_alter_profile_bio'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='color',
            field=models.CharField(default='#fff', max_length=50),
        ),
    ]
