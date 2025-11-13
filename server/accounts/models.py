# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomUserManager
from pgvector.django import VectorField   # AI-ready optional


# ----------------------------------------------------------
# User Roles (Student, Company, Institution, etc.)
# ----------------------------------------------------------
class UserRole(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


# ----------------------------------------------------------
# Custom User Model (Multi-role)
# ----------------------------------------------------------
class User(AbstractUser):
    first_name = None
    last_name = None
    username = models.CharField(max_length=100, null=True, blank=True)

    full_name = models.CharField(max_length=150)
    email = models.EmailField(max_length=150, unique=True)

    profile_image = models.ImageField(
        upload_to="profile_images/",
        null=True,
        blank=True,
        default="profile_images/default.png"
    )

    # MULTIPLE ROLES (Student + Company etc.)
    roles = models.ManyToManyField(UserRole, blank=True, related_name="users")

    # verification info
    is_email_verified = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    is_phone_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=255, null=True, blank=True)

    is_delete_requested = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    # Helper properties
    @property
    def is_student(self):
        return self.roles.filter(name="student").exists()

    @property
    def is_company(self):
        return self.roles.filter(name="company").exists()

    @property
    def is_institution(self):
        return self.roles.filter(name="institution").exists()

class Skill(models.Model):
    name = models.CharField(max_length=150, unique=True)

    def __str__(self):
        return self.name


class SkillLevel(models.TextChoices):
    BEGINNER = "beginner", "Beginner"
    INTERMEDIATE = "intermediate", "Intermediate"
    ADVANCED = "advanced", "Advanced"
    EXPERT = "expert", "Expert"

class Degree(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name

class UserEducation(models.Model):
    profile = models.ForeignKey("Profile", on_delete=models.CASCADE, related_name="education_items")
    degree = models.ForeignKey(Degree, on_delete=models.SET_NULL, null=True)
    institution = models.CharField(max_length=255)
    year_start = models.IntegerField()
    year_end = models.IntegerField()

    def __str__(self):
        return f"{self.degree} at {self.institution}"

class UserSkill(models.Model):
    profile = models.ForeignKey("Profile", on_delete=models.CASCADE, related_name="skills")
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    level = models.CharField(max_length=20, choices=SkillLevel.choices)

    def __str__(self):
        return f"{self.skill.name} ({self.level})"

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    # Basic Info
    location = models.CharField(max_length=150, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    career_goal = models.CharField(max_length=300, null=True, blank=True)

    # Job readiness
    availability = models.CharField(max_length=100, null=True, blank=True)
    expected_salary = models.CharField(max_length=100, null=True, blank=True)
    is_job_ready = models.BooleanField(default=False)

    # CV
    cv_text = models.TextField(null=True, blank=True)
    resume_file = models.FileField(upload_to="resumes/", null=True, blank=True)

    # Social
    portfolio_url = models.URLField(null=True, blank=True)
    github_url = models.URLField(null=True, blank=True)
    linkedin_url = models.URLField(null=True, blank=True)

    # AI Fields (optional)
    ai_cv_vector = VectorField(dimensions=768, null=True, blank=True)
    ai_keywords = models.TextField(null=True, blank=True)
    ai_summary = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Profile of {self.user.email}"


# ----------------------------------------------------------
# Company Owner Profile
# ----------------------------------------------------------
class CompanyProfile(models.Model):
    user = models.ForeignKey(User, related_name="companies" , on_delete=models.CASCADE, null=True, blank=True)
    company_name = models.CharField(max_length=255)
    industry = models.CharField(max_length=150)
    logo = models.ImageField(upload_to="company_logos/", null=True, blank=True)

    website = models.URLField(null=True, blank=True)
    location = models.CharField(max_length=200, null=True, blank=True)
    about = models.TextField(null=True, blank=True)

    # Approval Workflow
    requested_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=False)   # Only True after admin approves
    verified = models.BooleanField(default=False)    # Extra if needed

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company_name

# ----------------------------------------------------------
# Institution / Training Center Profile
# ----------------------------------------------------------
class InstitutionProfile(models.Model):
    user = models.ForeignKey(User, related_name="institutions" , on_delete=models.CASCADE, null=True, blank=True)

    institution_name = models.CharField(max_length=255)
    institution_type = models.CharField(max_length=150)  # School, Bootcamp, Academy
    logo = models.ImageField(upload_to="institution_logos/", null=True, blank=True)

    website = models.URLField(null=True, blank=True)
    location = models.CharField(max_length=200, null=True, blank=True)
    about = models.TextField(null=True, blank=True)

    # Approval Workflow
    requested_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=False)   # Active after admin approves
    verified = models.BooleanField(default=False)    # Extra trust badge / optional

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.institution_name