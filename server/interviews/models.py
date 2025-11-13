# interviews/models.py

from django.db import models
from django.conf import settings
from jobs.models import Job
from skills.models import SkillTest


# -----------------------------------------------------
# Main Interview (Candidate applying to a Job)
# -----------------------------------------------------
class Interview(models.Model):
    FINAL_STATUS = [
        ("Pending", "Pending"),
        ("Selected", "Selected"),
        ("Rejected", "Rejected"),
    ]

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="interviews"
    )

    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="candidate_interviews"
    )

    total_rounds = models.IntegerField(default=1)
    current_round = models.IntegerField(default=1)

    final_status = models.CharField(
        max_length=20,
        choices=FINAL_STATUS,
        default="Pending"
    )

    overall_ai_score = models.FloatField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Interview for {self.job.title} - {self.candidate.email}"
    

# -----------------------------------------------------
# Individual Interview Rounds
# -----------------------------------------------------
class InterviewRound(models.Model):

    ROUND_TYPES = [
        ("HR", "HR Interview"),
        ("Technical", "Technical Interview"),
        ("Coding", "Coding Interview"),
        ("Assignment Review", "Assignment Review"),
        ("System Design", "System Design"),
    ]

    ROUND_STATUS = [
        ("Scheduled", "Scheduled"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
        ("No-show", "No-show"),
    ]

    interview = models.ForeignKey(
        Interview,
        on_delete=models.CASCADE,
        related_name="rounds"
    )

    round_number = models.IntegerField()
    round_type = models.CharField(max_length=50, choices=ROUND_TYPES)

    scheduled_time = models.DateTimeField()
    meeting_link = models.URLField(null=True, blank=True)

    # Optional coding/skill test assigned during this round
    assigned_skill_test = models.ForeignKey(
        SkillTest,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="interview_assigned_tests"
    )

    ai_round_score = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=ROUND_STATUS, default="Scheduled")

    recording_url = models.URLField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Round {self.round_number} - {self.interview.candidate.email}"


# -----------------------------------------------------
# Interview Feedback from Interviewers
# -----------------------------------------------------
class InterviewFeedback(models.Model):

    round = models.ForeignKey(
        InterviewRound,
        on_delete=models.CASCADE,
        related_name="feedback"
    )

    interviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="provided_feedback"
    )

    rating_communication = models.IntegerField(default=0)
    rating_technical = models.IntegerField(default=0)
    rating_problem_solving = models.IntegerField(default=0)

    comments = models.TextField(null=True, blank=True)

    # AI (optional)
    ai_sentiment_score = models.FloatField(null=True, blank=True)

    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback by {self.interviewer.email} (Round {self.round.round_number})"
