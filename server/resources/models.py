# resources/models.py

from django.db import models
from skills.models import Skill
from pgvector.django import VectorField


# -----------------------------------------------------------
# Resource Categories
# -----------------------------------------------------------
class ResourceCategory(models.Model):
    name = models.CharField(max_length=150, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


# -----------------------------------------------------------
# Main Learning Resource
# -----------------------------------------------------------
class LearningResource(models.Model):

    COSTS = [
        ("Free", "Free"),
        ("Paid", "Paid")
    ]

    RESOURCE_TYPES = [
        ("Course", "Course"),
        ("Video", "Video"),
        ("Playlist", "Playlist"),
        ("Article", "Article"),
        ("Book", "Book"),
        ("Roadmap", "Roadmap"),
        ("Practice", "Practice"),
    ]

    LEVELS = [
        ("Beginner", "Beginner"),
        ("Intermediate", "Intermediate"),
        ("Advanced", "Advanced"),
        ("Expert", "Expert"),
        ("Master", "Master"),
    ]

    title = models.CharField(max_length=300)
    platform = models.CharField(max_length=200)
    instructor = models.CharField(max_length=150, null=True, blank=True)

    url = models.URLField()
    thumbnail = models.URLField(null=True, blank=True)

    cost_indicator = models.CharField(max_length=10, choices=COSTS)
    resource_type = models.CharField(max_length=50, choices=RESOURCE_TYPES, default="Course")
    level = models.CharField(max_length=20, choices=LEVELS, default="Beginner")

    category = models.ForeignKey(
        ResourceCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="resources"
    )

    related_skills = models.ManyToManyField(Skill, blank=True, related_name="learning_resources")

    duration_hours = models.FloatField(null=True, blank=True)
    rating = models.FloatField(default=0)
    learners_count = models.PositiveIntegerField(default=0)

    description = models.TextField(null=True, blank=True)

    # AI Metadata
    ai_vector = VectorField(dimensions=768, null=True, blank=True)
    ai_keywords = models.TextField(null=True, blank=True)
    ai_summary = models.TextField(null=True, blank=True)

    popularity_score = models.FloatField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# -----------------------------------------------------------
# Resource Progress Tracking
# -----------------------------------------------------------
class ResourceProgress(models.Model):
    user = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="resource_progress"
    )
    resource = models.ForeignKey(
        LearningResource,
        on_delete=models.CASCADE,
        related_name="user_progress"
    )

    progress_percentage = models.FloatField(default=0)
    is_completed = models.BooleanField(default=False)

    last_accessed = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} progress on {self.resource.title}"
