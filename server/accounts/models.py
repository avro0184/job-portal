# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomUserManager
from pgvector.django import VectorField   # AI-ready optional
from skills.models import Skill, SkillLevel


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
    def is_company(self):
        return self.roles.filter(name__iexact="Company").exists()

    @property
    def is_student(self):
        return self.roles.filter(name__iexact="Job Seeker").exists()

    @property
    def is_institution(self):
        return self.roles.filter(name__iexact="Institution").exists()




class Degree(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name

class UserEducation(models.Model):
    profile = models.ForeignKey("Profile", on_delete=models.CASCADE, related_name="education_items")
    degree = models.ForeignKey(Degree, on_delete=models.SET_NULL, null=True)
    institution = models.CharField(max_length=255)
    year_start = models.CharField(max_length=50)
    year_end = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.degree} at {self.institution}"


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


    last_cv_updated = models.DateTimeField(auto_now=True, db_index=True , null=True, blank=True)

    summary_text = models.TextField(null=True, blank=True)


    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Profile of {self.user.email}"
    
    @property
    def completion_percentage(self):
        score = 0

        # ---- Basic Info ----
        if self.user.full_name and self.user.email:
            score += 5
        if self.location:
            score += 5

        # ---- Bio ----
        if self.bio:
            score += 10

        # ---- Career Goal ----
        if self.career_goal:
            score += 10

        # ---- Education ----
        if self.education_items.exists():
            score += 15

        # ---- Skills ----
        if self.user.skills.exists():   # If using UserSkill model
            score += 15

        # ---- Experience ----
        if self.experiences.exists():
            score += 15

        # ---- Projects ----
        if self.projects.exists():
            score += 10

        # ---- Certifications ----
        if self.certifications.exists():
            score += 5

        # ---- CV ----
        if self.cv_text or self.resume_file:
            score += 10

        return min(score, 100)



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
    



class UserExperience(models.Model):
    profile = models.ForeignKey("Profile", on_delete=models.CASCADE, related_name="experiences")

    job_title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255, null=True, blank=True)

    start_date = models.CharField(max_length=50)   # Using string for flexible date formats
    end_date = models.CharField(max_length=50)

    description = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.job_title} at {self.company}"


class UserProject(models.Model):
    profile = models.ForeignKey("Profile", on_delete=models.CASCADE, related_name="projects")

    title = models.CharField(max_length=255)
    description = models.TextField()
    technologies = models.CharField(max_length=500, null=True, blank=True)
    link = models.URLField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class UserCertification(models.Model):
    profile = models.ForeignKey("Profile", on_delete=models.CASCADE, related_name="certifications")

    title = models.CharField(max_length=255)
    issuer = models.CharField(max_length=255, null=True, blank=True)
    date_issued = models.CharField(max_length=50, null=True, blank=True)
    credential_id = models.CharField(max_length=255, null=True, blank=True)
    credential_url = models.URLField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
