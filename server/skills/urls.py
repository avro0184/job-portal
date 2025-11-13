from django.urls import path
from .views import *


urlpatterns = [
    path("dropdown/skills/", SkillListView.as_view()),
]
