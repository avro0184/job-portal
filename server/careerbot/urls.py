from django.urls import path
from .views import (
    CreateCareerBotAPIView,
    ListCareerBotsAPIView,
    DeleteCareerBotAPIView,
    ChatWithBotAPIView,
    GetMessagesAPIView,
    DeleteMessageAPIView,
)

urlpatterns = [
    path("bot/create/", CreateCareerBotAPIView.as_view()),
    path("bot/list/", ListCareerBotsAPIView.as_view()),
    path("bot/<int:bot_id>/delete/", DeleteCareerBotAPIView.as_view()),

    path("messages/<int:bot_id>/", GetMessagesAPIView.as_view()),
    path("chat/<int:bot_id>/", ChatWithBotAPIView.as_view()),

    path("message/<int:message_id>/delete/", DeleteMessageAPIView.as_view()),
]
