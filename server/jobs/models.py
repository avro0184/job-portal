# jobs/models.py
from django.db import models
from django.conf import settings
from skills.models import Skill
from pgvector.django import VectorField


# -------------------------------------------------------
# Job Model (Advanced + ATS-Ready + AI-Ready)
# -------------------------------------------------------
class Job(models.Model):
    EXPERIENCE = [
        ("Fresher", "Fresher"),
        ("Junior", "Junior"),
        ("Mid", "Mid"),
        ("Senior", "Senior"),
        ("Lead", "Lead"),
    ]

    JOB_TYPES = [
        ("Internship", "Internship"),
        ("Part-time", "Part-time"),
        ("Full-time", "Full-time"),
        ("Freelance", "Freelance"),
        ("Contract", "Contract"),
    ]

    EMPLOYMENT_MODE = [
        ("Remote", "Remote"),
        ("Hybrid", "Hybrid"),
        ("On-site", "On-site"),
    ]

    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)

    # If company has a profile
    company_profile = models.ForeignKey(
        "accounts.CompanyProfile",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="company_jobs"
    )

    location = models.CharField(max_length=255)
    employment_mode = models.CharField(max_length=50, choices=EMPLOYMENT_MODE)

    job_type = models.CharField(max_length=50, choices=JOB_TYPES)
    experience_level = models.CharField(max_length=50, choices=EXPERIENCE)

    description = models.TextField()
    responsibilities = models.TextField(null=True, blank=True)
    benefits = models.TextField(null=True, blank=True)

    required_skills = models.ManyToManyField(Skill, blank=True, related_name="jobs")
    required_skill_level = models.CharField(     # new (Beginner–Master)
        max_length=20,
        null=True,
        blank=True,
        choices=[
            ("Novice","Novice"),
            ("Beginner","Beginner"),
            ("Intermediate","Intermediate"),
            ("Skilled","Skilled"),
            ("Advanced","Advanced"),
            ("Expert","Expert"),
            ("Master","Master"),
        ]
    )

    posted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="posted_jobs"
    )

    salary_min = models.IntegerField(null=True, blank=True)
    salary_max = models.IntegerField(null=True, blank=True)
    salary_currency = models.CharField(max_length=10, default="USD")

    deadline = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    # Screening questions (ATS-style)
    screening_questions = models.JSONField(null=True, blank=True)

    # AI fields
    ai_vector = VectorField(dimensions=768, null=True, blank=True)
    ai_keywords = models.TextField(null=True, blank=True)
    ai_summary = models.TextField(null=True, blank=True)
    ai_skill_match_score = models.FloatField(null=True, blank=True)

    trending_score = models.FloatField(default=0)
    views_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} — {self.company}"


# -------------------------------------------------------
# Job Application (Advanced)
# -------------------------------------------------------
class Application(models.Model):
    STATUS = [
        ("Applied", "Applied"),
        ("Shortlisted", "Shortlisted"),
        ("Test Assigned", "Test Assigned"),
        ("Test Completed", "Test Completed"),
        ("Interview Scheduled", "Interview Scheduled"),
        ("Interview Completed", "Interview Completed"),
        ("Offered", "Offered"),
        ("Rejected", "Rejected"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")

    # Resume & Cover letter
    resume = models.FileField(upload_to="applications/resumes/", null=True, blank=True)
    cover_letter = models.TextField(null=True, blank=True)

    # Applicant answers screening questions
    screening_answers = models.JSONField(null=True, blank=True)

    # Scores
    resume_score = models.FloatField(null=True, blank=True)     # AI resume job-fit score
    skill_test_score = models.FloatField(null=True, blank=True) # from SkillTestResult
    overall_match_score = models.FloatField(null=True, blank=True) # combined score

    # Application status
    status = models.CharField(max_length=50, choices=STATUS, default="Applied")
    applied_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    # Interview integration
    interview_round = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.email} applied for {self.job.title}"
