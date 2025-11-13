from django.urls import path
from .views import *

urlpatterns = [
    path("dropdown/skills/", SkillListView.as_view(), name="skill-list"),

    path("user/skills/", UserSkillListCreateView.as_view(), name="user-skill-list-create"),
    path("user/skills/<int:skill_id>/", UserSkillUpdateView.as_view(), name="user-skill-update"),

    path("tests/", SkillTestListView.as_view(), name="skill-test-list"),
    path("tests/<int:test_id>/", SkillTestDetailView.as_view(), name="skill-test-detail"),

    # Submit Test (one attempt per skill)
    path("tests/<int:test_id>/submit/", SubmitSkillTestView.as_view(), name="skill-test-submit"),

    path("progress/<int:skill_id>/", UserSkillProgressView.as_view(), name="skill-progress"),
]
