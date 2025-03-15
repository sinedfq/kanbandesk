# models.py
from email.policy import default

from django.db import models
from django.contrib.auth.models import User
from PIL import Image

# Модель профиля пользователя
class Profile(models.Model):

    ROLE_CHOICES = [
        ('admin', 'Админ'),
        ('user', 'Пользователь'),
        ('moderator', 'Модератор'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/', default='avatars/default.jpg')
    bio = models.TextField()
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')

    # Изменение размера изображений
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        img = Image.open(self.avatar.path)
        if img.height > 100 or img.width > 100:
            new_img = (100, 100)
            img.thumbnail(new_img)
            img.save(self.avatar.path)

    def get_user_comments(self):
        return Comment.objects.filter(user=self.user)
    
    def __str__(self):
        return f'{self.user.username} Profile'


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

# Модель комментариев к карточке
class Comment(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Автор комментария
    comment = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)  # Дата создания

    def __str__(self):
        return f"{self.user.username}: {self.comment[:20]}..."
