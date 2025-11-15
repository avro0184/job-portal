from rest_framework import serializers
from .models import CareerBot, ChatMessage


class CareerBotSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerBot
        fields = "__all__"



class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = "__all__"
