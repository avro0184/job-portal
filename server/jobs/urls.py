from django.urls import path
from .views import *

urlpatterns = [
    # JOB CRUD
    path("jobs/", JobAPIView.as_view()),                     # GET all jobs, POST create job
    path("jobs/<int:pk>/", JobAPIView.as_view()),            # GET detail, PUT update, DELETE job

    # APPLY to job
    path("jobs/<int:pk>/apply/", JobAPIView.as_view()),      # POST apply for job

    # VIEW applicants
    path("jobs/<int:pk>/applicants/", JobApplicantsAPIView.as_view()),


    path("jobs/creator/", AllJobsCreatorAPIView.as_view()),
]
