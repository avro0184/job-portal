# jobs/models.py
from django.db import models
from django.conf import settings
from skills.models import Skill
from pgvector.django import VectorField
from accounts.models import CompanyProfile
from skills.models import Skill ,SkillLevel
from django.contrib.postgres.fields import ArrayField

# -------------------------------------------------------
# Job Model (Advanced + ATS-Ready + AI-Ready)
# -------------------------------------------------------
class Job(models.Model):
    EXPERIENCE_LEVELS = [
        ("Fresher", "Fresher"),
        ("Junior", "Junior"),
        ("Mid", "Mid"),
        ("Senior", "Senior"),
        ("Lead", "Lead"),
    ]

    EMPLOYMENT_MODE = [
        ("Remote", "Remote"),
        ("Hybrid", "Hybrid"),
        ("On-site", "On-site"),
    ]

    JOB_TYPES = [
        ("Internship", "Internship"),
        ("Part-time", "Part-time"),
        ("Full-time", "Full-time"),
        ("Freelance", "Freelance"),
        ("Contract", "Contract"),
    ]

    # Basic Job info
    title = models.CharField(max_length=255)
    description = models.TextField()
    responsibilities = models.TextField(null=True, blank=True)
    benefits = models.TextField(null=True, blank=True)

    # Company
    company_profile = models.ForeignKey(
        CompanyProfile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="jobs"
    )

    posted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="jobs_posted"
    )

    # Work Details
    location = models.CharField(max_length=255)

    employment_mode = ArrayField(
        models.CharField(max_length=50, choices=EMPLOYMENT_MODE),
        default=list,
        blank=True,
        null=True
    )

    job_type = ArrayField(
        models.CharField(max_length=50, choices=JOB_TYPES),
        default=list,
        blank=True,
        null=True
    )

    experience_level = ArrayField(
        models.CharField(max_length=50, choices=EXPERIENCE_LEVELS),
        default=list,
        blank=True,
        null=True
    )

    # Skills
    required_skills = models.ManyToManyField(Skill, blank=True, related_name="job_listings")

    # Salary
    salary_min = models.IntegerField(null=True, blank=True)
    salary_max = models.IntegerField(null=True, blank=True)
    salary_currency = models.CharField(max_length=10, default="BDT")

    # Deadline
    deadline = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    # ATS Screening
    screening_questions = models.JSONField(null=True, blank=True)

    # AI fields
    ai_vector = VectorField(dimensions=768, null=True, blank=True)
    ai_keywords = models.TextField(null=True, blank=True)
    ai_summary = models.TextField(null=True, blank=True)
    ai_skill_match_score = models.FloatField(null=True, blank=True)

    # Trending
    trending_score = models.FloatField(default=0)
    views_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["title"]),
            models.Index(fields=["location"]),
        ]

    def __str__(self):
        return f"{self.title} – {self.company_profile.company_name if self.company_profile else 'Unknown'}"


# -------------------------------------------------------
# Job Application (Advanced)
# -------------------------------------------------------
class Application(models.Model):

    STATUS = [
        ("Applied", "Applied"),
        ("Shortlisted", "Shortlisted"),
        ("Interview Scheduled", "Interview Scheduled"),
        ("Interview Completed", "Interview Completed"),
        ("Offered", "Offered"),
        ("Rejected", "Rejected"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    # Files
    resume = models.FileField(upload_to="applications/resumes/", null=True, blank=True)
    cover_letter = models.TextField(null=True, blank=True)

    # ATS answers
    screening_answers = models.JSONField(null=True, blank=True)

    # AI scoring
    resume_score = models.FloatField(null=True, blank=True)
    skill_test_score = models.FloatField(null=True, blank=True)
    overall_match_score = models.FloatField(null=True, blank=True)

    # Status
    status = models.CharField(max_length=50, choices=STATUS, default="Applied")
    interview_round = models.IntegerField(default=0)

    # Timestamps
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Workflow timestamps
    shortlisted_at = models.DateTimeField(null=True, blank=True)
    interview_scheduled_at = models.DateTimeField(null=True, blank=True)
    offered_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)

    # Optional feedback fields
    feedback = models.TextField(null=True, blank=True)
    rejection_reason = models.TextField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "job")
        ordering = ["-applied_at"]

    def __str__(self):
        return f"{self.user.email} → {self.job.title}"
