# skills/models.py
from django.db import models
from django.conf import settings
from pgvector.django import VectorField


# ------------------------------------------------------
# Skill Category
# ------------------------------------------------------
class SkillCategory(models.Model):
    name = models.CharField(max_length=150, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


# ------------------------------------------------------
# Skill Model
# ------------------------------------------------------
class Skill(models.Model):
    category = models.ForeignKey(
        SkillCategory, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="skills"
    )

    name = models.CharField(max_length=150, unique=True)

    # AI fields (future use)
    ai_vector = VectorField(dimensions=768, null=True, blank=True)
    ai_keywords = models.TextField(null=True, blank=True)
    ai_summary = models.TextField(null=True, blank=True)

    difficulty_level = models.CharField(
        max_length=50,
        choices=[("Easy", "Easy"), ("Medium", "Medium"), ("Hard", "Hard")],
        default="Medium"
    )

    popularity_score = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ------------------------------------------------------
# User Skill (Main skill record used for job matching)
# ------------------------------------------------------
class UserSkill(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="skills"
    )
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

    # Initially Intermediate
    proficiency_percentage = models.FloatField(default=50)
    level = models.CharField(max_length=50, default="Intermediate")

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "skill")

    # 7-level skill ladder
    def update_level(self):
        p = self.proficiency_percentage

        if p <= 20:
            self.level = "Novice"
        elif 21 <= p <= 40:
            self.level = "Beginner"
        elif 41 <= p <= 55:
            self.level = "Intermediate"
        elif 56 <= p <= 70:
            self.level = "Skilled"
        elif 71 <= p <= 85:
            self.level = "Advanced"
        elif 86 <= p <= 95:
            self.level = "Expert"
        else:
            self.level = "Master"

        self.save()

    def __str__(self):
        return f"{self.user.email} - {self.skill.name} ({self.level})"


# ------------------------------------------------------
# Skill Test (Multiple tests per skill)
# ------------------------------------------------------
class SkillTest(models.Model):
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name="tests")
    title = models.CharField(max_length=255)
    description = models.TextField()

    difficulty = models.CharField(
        max_length=50,
        choices=[("Easy", "Easy"), ("Medium", "Medium"), ("Hard", "Hard")],
        default="Medium"
    )

    duration_minutes = models.PositiveIntegerField(default=30)
    total_marks = models.PositiveIntegerField(default=100)

    version = models.IntegerField(default=1)
    randomize_questions = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.skill.name})"


# ------------------------------------------------------
# Skill Questions (MCQ)
# ------------------------------------------------------
class SkillQuestion(models.Model):
    test = models.ForeignKey(SkillTest, on_delete=models.CASCADE, related_name="questions")
    question_text = models.TextField()

    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)

    correct_option = models.CharField(
        max_length=1,
        choices=[("A", "A"), ("B", "B"), ("C", "C"), ("D", "D")]
    )

    difficulty = models.CharField(
        max_length=50,
        choices=[
            ("Easy", "Easy"),
            ("Medium", "Medium"),
            ("Hard", "Hard")
        ],
        default="Medium"
    )

    marks = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.question_text[:40]}..."


# ------------------------------------------------------
# Test Result (each test attempt)
# ------------------------------------------------------
class UserSkillTestResult(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    test = models.ForeignKey(SkillTest, on_delete=models.CASCADE)

    score = models.FloatField(default=0)
    percentage = models.FloatField(default=0)
    passed = models.BooleanField(default=False)

    taken_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Update or create skill record
        user_skill, created = UserSkill.objects.get_or_create(
            user=self.user,
            skill=self.test.skill
        )

        # update score
        user_skill.proficiency_percentage = self.percentage
        user_skill.update_level()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.email} - {self.test.title} ({self.percentage}%)"


# ------------------------------------------------------
# Skill Progress History (graph + analytics)
# ------------------------------------------------------
class UserSkillProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

    proficiency_percentage = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.user.email} progress on {self.skill.name}"
