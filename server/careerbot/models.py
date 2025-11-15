from django.db import models
from django.conf import settings

class CareerBot(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="career_bots"
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.user.email})"


class ChatMessage(models.Model):
    bot = models.ForeignKey(
        CareerBot,
        on_delete=models.CASCADE,
        related_name="messages",
        null=True
    )
    sender = models.CharField(
        max_length=10,
        choices=[("user", "User"), ("bot", "Bot")]
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} - {self.text[:30]}"
