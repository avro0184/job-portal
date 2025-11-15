import os
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from google import generativeai as genai

from .models import CareerBot, ChatMessage
from .serializers import CareerBotSerializer, ChatMessageSerializer

from .vector_memory import (
    save_memory,
    search_memory,
    delete_memory_for_bot,
    delete_memory_for_message
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-2.5-pro")


# CREATE BOT
class CreateCareerBotAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        name = request.data.get("name")
        if not name:
            return Response({"error": "Bot name required"}, status=400)

        bot = CareerBot.objects.create(
            user=request.user,
            name=name,
            description=request.data.get("description", "")
        )

        return Response({"success": True, "bot": CareerBotSerializer(bot).data})


# LIST BOTS
class ListCareerBotsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bots = CareerBot.objects.filter(user=request.user)
        return Response({"success": True, "data": CareerBotSerializer(bots, many=True).data})


# DELETE BOT + messages + memory
class DeleteCareerBotAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, bot_id):
        bot = get_object_or_404(CareerBot, id=bot_id, user=request.user)

        delete_memory_for_bot(bot_id)

        ChatMessage.objects.filter(bot=bot).delete()
        bot.delete()

        return Response({"success": True, "message": "Bot deleted."})


# GET ALL MESSAGES FOR A BOT
class GetMessagesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, bot_id):
        bot = get_object_or_404(CareerBot, id=bot_id, user=request.user)

        msgs = ChatMessage.objects.filter(bot=bot).order_by("created_at")

        return Response({"success": True, "messages": ChatMessageSerializer(msgs, many=True).data})


# CHAT
class ChatWithBotAPIView(APIView):
    permission_classes = [IsAuthenticated]

    MODEL_NAME = "gemini-2.0-flash"   # or your preferred model


class ChatWithBotAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, bot_id):

        bot = get_object_or_404(CareerBot, id=bot_id, user=request.user)

        user_query = request.data.get("query")
        if not user_query:
            return Response({"error": "Query required"}, status=400)

        user_msg = ChatMessage.objects.create(
            bot=bot,
            sender="user",
            text=user_query
        )
        save_memory(bot.id, "user", user_query, user_msg.id)

        # ---------------------------
        # Get relevant memory
        # ---------------------------
        memory_chunks = search_memory(bot.id, user_query)
        memory_text = "\n".join(memory_chunks)

        # ---------------------------
        # Build AI prompt
        # ---------------------------
        prompt = f"""
        You are a friendly career guidance assistant.

        USER QUESTION:
        {user_query}

        Relevant Past Memory:
        {memory_text}

        Give a clear, short, helpful career answer.
        """

        # ---------------------------
        # Gemini API
        # ---------------------------
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel("models/gemini-2.5-pro")

        try:
            response = model.generate_content(prompt)
            ai_text = response.text.strip()
        except Exception as e:
            return Response({"error": "AI generation failed", "details": str(e)}, status=500)

        # ---------------------------
        # Save bot message
        # ---------------------------
        bot_msg = ChatMessage.objects.create(
            bot=bot,
            sender="bot",
            text=ai_text
        )
        save_memory(bot.id, "bot", ai_text, bot_msg.id)

        # ---------------------------
        # Response
        # ---------------------------
        return Response({
            "success": True,
            "answer": ai_text
        })

# DELETE MESSAGE + memory
class DeleteMessageAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, message_id):
        msg = get_object_or_404(ChatMessage, id=message_id, bot__user=request.user)

        delete_memory_for_message(message_id)

        msg.delete()

        return Response({"success": True, "message": "Message deleted"})
