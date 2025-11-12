from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from .managers import CustomUserManager
from datetime import timedelta
from notification.models import NotificationTopic


class User(AbstractUser):
    first_name = None
    last_name = None
    username = models.CharField(max_length=100, null=True, blank=True)
    full_name = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(max_length=150, unique=True)
    password = models.CharField(max_length=100, null=True, blank=True)

    is_email_verified = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    is_phone_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=255, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    has_question_access = models.BooleanField(default=True)

    # Quotas
    remaining_questions = models.IntegerField(default=0)   # used for free + paid
    question_size_per_subject = models.IntegerField(default=30)
    max_pdf_questions = models.IntegerField(default=30)
    max_upload_questions = models.IntegerField(default=0)

    # Relations
    subjects = models.ManyToManyField("mcq.Subject", blank=True)
    institution_groups = models.ManyToManyField(
        "existing_question.GrpupOfInstitutionnName",
        blank=True,
        related_name="user_groups"
    )
    mentors_access = models.ManyToManyField(
        "mcq.Subject", blank=True, related_name="mentors_access"
    )

    # Limits
    max_group = models.IntegerField(default=0)
    max_exam_in_group = models.IntegerField(default=0)

    # Subscription
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    # Tracking resets
    last_quota_reset = models.DateField(null=True, blank=True)


    fcm_token = models.TextField(null=True, blank=True)   # ✅ save one token
    # ✅ Notification topics (Many-to-Many)
    topics = models.ManyToManyField(NotificationTopic, blank=True, related_name="subscribers")


    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    
    @property
    def display_name(self):
        return self.full_name or self.username or self.email

    # ✅ Check if user has active purchase
    @property
    def has_active_plan(self):
        today = timezone.now().date()
        return self.end_date and self.end_date >= today

    # ✅ Reset remaining questions if free user and new month
    def ensure_question_quota(self, commit=True):
        today = timezone.now().date()

        # 1. Paid users → no auto reset
        if self.has_active_plan:
            return

        # 2. Free users → reset only on a new month
        if (
            self.last_quota_reset is None
            or self.last_quota_reset.year != today.year
            or self.last_quota_reset.month != today.month
        ):
            self.remaining_questions = 0   # free plan = 3 questions
            self.last_quota_reset = today
            if commit:
                self.save(update_fields=["remaining_questions", "last_quota_reset"])

    # ✅ When user purchases a plan
    def activate_purchase(self, duration_days=30, quota=100):
        today = timezone.now().date()
        self.start_date = today
        self.end_date = today + timedelta(days=duration_days)
        self.remaining_questions = quota
        self.last_quota_reset = today  # reset tracking to today
        self.save(
            update_fields=["start_date", "end_date", "remaining_questions", "last_quota_reset"]
        )
