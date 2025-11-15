from rest_framework import serializers
from .models import SavedRoadmap

class SavedRoadmapSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedRoadmap
        fields = "__all__"
        read_only_fields = ("user", "created_at")
