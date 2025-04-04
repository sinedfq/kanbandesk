from rest_framework import serializers
from .models import Profile, Board, Card, Comment
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    role = serializers.CharField(source='get_role_display')

    class Meta:
        model = Profile
        fields = ['id', 'user', 'avatar', 'bio', 'role']
        
class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ['id', 'board_name']

class CardSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Card
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 'board', 'participants', 'color']
        extra_kwargs = {
            'board': {'required': True},  # Убедитесь, что поле `board` является обязательным
        }


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Comment
        fields = ['id', 'card', 'user', 'comment', 'created_at']