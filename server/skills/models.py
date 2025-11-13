# skills/models.py
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from pgvector.django import VectorField


# ------------------------------------------------------
# Skill Level Choices
# ------------------------------------------------------
class SkillLevel(models.TextChoices):
    NOVICE = "novice", "Novice"
    BEGINNER = "beginner", "Beginner"
    INTERMEDIATE = "intermediate", "Intermediate"
    SKILLED = "skilled", "Skilled"
    ADVANCED = "advanced", "Advanced"
    EXPERT = "expert", "Expert"
    MASTER = "master", "Master"


# ------------------------------------------------------
# Skill Category
# ------------------------------------------------------
class SkillCategory(models.Model):
    name = models.CharField(max_length=150, unique=True, db_index=True)  # indexed
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


# ------------------------------------------------------
# Skill
# ------------------------------------------------------
class Skill(models.Model):
    category = models.ForeignKey(
        SkillCategory, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="skills", db_index=True
    )
    name = models.CharField(max_length=150, unique=True, db_index=True)

    ai_vector = VectorField(dimensions=768, null=True, blank=True)
    ai_keywords = models.TextField(null=True, blank=True)
    ai_summary = models.TextField(null=True, blank=True)

    difficulty_level = models.CharField(
        max_length=50,
        choices=[("Easy", "Easy"), ("Medium", "Medium"), ("Hard", "Hard")],
        default="Medium",
        db_index=True
    )

    popularity_score = models.FloatField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=["category"]),
            models.Index(fields=["difficulty_level"]),
            models.Index(fields=["popularity_score"]),
        ]

    def __str__(self):
        return self.name


# ------------------------------------------------------
# User Skill
# ------------------------------------------------------
class UserSkill(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="skills",
        db_index=True
    )
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, db_index=True)

    proficiency_percentage = models.FloatField(default=50, db_index=True)
    level = models.CharField(
        max_length=20,
        choices=SkillLevel.choices,
        default=SkillLevel.INTERMEDIATE,
        db_index=True
    )

    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        unique_together = ("user", "skill")
        indexes = [
            models.Index(fields=["user", "skill"]),
            models.Index(fields=["level"]),
        ]

    def update_level(self):
        p = max(0, min(100, self.proficiency_percentage))

        if p <= 20:
            self.level = SkillLevel.NOVICE
        elif p <= 40:
            self.level = SkillLevel.BEGINNER
        elif p <= 55:
            self.level = SkillLevel.INTERMEDIATE
        elif p <= 70:
            self.level = SkillLevel.SKILLED
        elif p <= 85:
            self.level = SkillLevel.ADVANCED
        elif p <= 95:
            self.level = SkillLevel.EXPERT
        else:
            self.level = SkillLevel.MASTER

        self.save(update_fields=["level"])

    def __str__(self):
        return f"{self.user.email} - {self.skill.name} ({self.level})"


# ------------------------------------------------------
# Skill Test (Must have 15 questions)
# ------------------------------------------------------
class SkillTest(models.Model):
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name="tests", db_index=True)
    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField()

    difficulty = models.CharField(
        max_length=50,
        choices=[("Easy", "Easy"), ("Medium", "Medium"), ("Hard", "Hard")],
        default="Medium",
        db_index=True
    )

    duration_minutes = models.PositiveIntegerField(default=30)
    total_marks = models.PositiveIntegerField(default=100)

    version = models.IntegerField(default=1, db_index=True)
    randomize_questions = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=["skill"]),
            models.Index(fields=["difficulty"]),
            models.Index(fields=["created_at"]),
        ]

    def clean(self):
        if self.questions.count() != 15:
            raise ValidationError("Each SkillTest must contain exactly 15 questions.")

    def __str__(self):
        return f"{self.title} ({self.skill.name})"


# ------------------------------------------------------
# Skill Questions – Max 15
# ------------------------------------------------------
class SkillQuestion(models.Model):
    test = models.ForeignKey(SkillTest, on_delete=models.CASCADE, related_name="questions", db_index=True)
    question_text = models.TextField()

    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)

    correct_option = models.CharField(max_length=1,
        choices=[("A", "A"), ("B", "B"), ("C", "C"), ("D", "D")],
        db_index=True
    )

    difficulty = models.CharField(
        max_length=50,
        choices=[("Easy", "Easy"), ("Medium", "Medium"), ("Hard", "Hard")],
        default="Medium",
        db_index=True
    )

    marks = models.PositiveIntegerField(default=1, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=["test"]),
            models.Index(fields=["difficulty"]),
        ]

    def save(self, *args, **kwargs):
        if not self.pk and self.test.questions.count() >= 15:
            raise ValidationError("A SkillTest cannot have more than 15 questions.")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.question_text[:40]}..."


# ------------------------------------------------------
# Test Result – User can take only ONE test per skill
# ------------------------------------------------------
class UserSkillTestResult(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, db_index=True)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, db_index=True)
    test = models.ForeignKey(SkillTest, on_delete=models.CASCADE, db_index=True)

    score = models.FloatField(default=0, db_index=True)
    percentage = models.FloatField(default=0, db_index=True)
    passed = models.BooleanField(default=False, db_index=True)

    taken_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        unique_together = ("user", "skill")
        indexes = [
            models.Index(fields=["user", "skill"]),
            models.Index(fields=["test"]),
            models.Index(fields=["percentage"]),
        ]

    def save(self, *args, **kwargs):
        self.skill = self.test.skill

        user_skill, created = UserSkill.objects.get_or_create(
            user=self.user,
            skill=self.skill
        )

        user_skill.proficiency_percentage = self.percentage
        user_skill.update_level()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.email} - {self.skill.name} ({self.percentage}%)"


# ------------------------------------------------------
# Skill Progress History
# ------------------------------------------------------
class UserSkillProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, db_index=True)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, db_index=True)

    proficiency_percentage = models.FloatField(db_index=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["user", "skill"]),
            models.Index(fields=["timestamp"]),
        ]

    def __str__(self):
        return f"{self.user.email} progress on {self.skill.name}"
