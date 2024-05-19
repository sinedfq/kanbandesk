from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_profile_bio'),  # Зависимость от предыдущей миграции вашего приложения
    ]

    operations = [
        migrations.CreateModel(
            name='Card',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('card_id', models.IntegerField()),
                ('user', models.ForeignKey('auth.User', on_delete=models.CASCADE)),  # Связь с моделью User
            ],
        ),
    ]
