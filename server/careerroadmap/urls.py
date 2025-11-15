from django.urls import path
from .views import AICareerRoadmapAPIView

urlpatterns = [
    path("career-roadmap/", AICareerRoadmapAPIView.as_view()),
]
