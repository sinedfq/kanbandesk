from rest_framework import serializers
from .models import Profile, Board, Card

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ['id', 'board_name']

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 'board']
        extra_kwargs = {
            'board': {'required': True},  # Убедитесь, что поле `board` является обязательным
        }