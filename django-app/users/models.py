# models.py
from email.policy import default

from django.db import models
from django.contrib.auth.models import User
from PIL import Image

# Модель профиля пользователя
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(default='default.jpg', upload_to='profile_images')
    bio = models.TextField()

    def __str__(self):
        return self.user.username

    # Изменение размера изображений
    def save(self, *args, **kwargs):
        super().save()

        img = Image.open(self.avatar.path)

        if img.height > 100 or img.width > 100:
            new_img = (100, 100)
            img.thumbnail(new_img)
            img.save(self.avatar.path)

# Модель доски (board)
class Board(models.Model):
    board_name = models.CharField(max_length=100)

    def __str__(self):
        return self.board_name

# Модель карточки (card)
class Card(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    start_date = models.DateTimeField(null=True, blank=True)  # Новое поле
    end_date = models.DateTimeField(null=True, blank=True)    # Новое поле
    participants = models.ManyToManyField(User, related_name='cards')
    color = models.CharField(max_length=50, default="#fff")

    def __str__(self):
        return self.title
