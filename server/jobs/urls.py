from django.urls import path
from .views import *

urlpatterns = [
    # JOB CRUD
    path("jobs/", JobAPIView.as_view()),                     # GET all jobs, POST create job
    path("jobs/<int:pk>/", JobAPIView.as_view()),            # GET detail, PUT update, DELETE job

    # VIEW applicants
    path("jobs/<int:pk>/applicants/", JobApplicantsAPIView.as_view()),

    path("jobs/<int:pk>/apply/", ApplyJobAPIView.as_view(), name="apply-job"),

    path("jobs/creator/", AllJobsCreatorAPIView.as_view()),

    path("jobs/skillflow/", JobSkillFlow.as_view() , name="job-skillflow"),

    path ("jobs/summery/", JobSummeryApiView.as_view() , name="job-summery"),

    path("my-applications/", MyApplicationsAPIView.as_view()),


    path("jobs/recommended/", RecommendedJobsAPIView.as_view(), name="recommended-jobs"),

    path('skillflow/', SkillFlowAPIView.as_view(), name='ai-job-skillflow'),

    

]