from django.urls import path
from .views import (
    ResourceCategoryAPIView,
    LearningResourceListCreateAPIView,
    LearningResourceDetailAPIView,
)

urlpatterns = [
    path("categories/", ResourceCategoryAPIView.as_view()),

    path("resources/", LearningResourceListCreateAPIView.as_view()),
    path("resources/<int:pk>/", LearningResourceDetailAPIView.as_view()),
]
