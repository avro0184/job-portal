from django.db import models
from django.conf import settings

class SavedRoadmap(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saved_roadmaps"
    )
    target_role = models.CharField(max_length=255)
    skills_used = models.JSONField()  # list of strings
    timeframe_months = models.IntegerField()
    weekly_hours = models.IntegerField()
    roadmap_data = models.JSONField()  # complete AI roadmap
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.target_role}"
