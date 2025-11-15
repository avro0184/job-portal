from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import json5
from .models import SavedRoadmap
from .serializers import SavedRoadmapSerializer
import google.generativeai as genai
import os


def attach_phase_progress(roadmap_json):
    phases = roadmap_json.get("phases", [])

    for idx, ph in enumerate(phases):
        ph["id"] = idx + 1
        ph["is_completed"] = False
        ph["completed_at"] = None

    roadmap_json["phases"] = phases
    return roadmap_json



class AICareerRoadmapAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
            roadmaps = SavedRoadmap.objects.filter(user=request.user).order_by("-created_at")

            serializer = SavedRoadmapSerializer(roadmaps, many=True)

            return Response({
                "success": True,
                "total": roadmaps.count(),
                "roadmaps": serializer.data
            })

    def post(self, request):
        skills_raw = request.data.get("skills", [])
        target_role = request.data.get("target_role")
        timeframe = request.data.get("timeframe_months")
        weekly_hours = request.data.get("weekly_hours")

        # -------------------------------
        # Validation
        # -------------------------------
        if not target_role:
            return Response({"error": "target_role is required"}, status=400)

        if not skills_raw:
            return Response({"error": "At least one skill required"}, status=400)

        # -------------------------------
        # Normalize skills list
        # -------------------------------
        normalized_skills = []
        for s in skills_raw:
            if isinstance(s, dict):
                normalized_skills.append(s["skill"]["name"])
            elif isinstance(s, str):
                normalized_skills.append(s)
            else:
                return Response({"error": "Invalid skill format"}, status=400)

        # -------------------------------
        # Build AI Prompt
        # -------------------------------
        prompt = f"""
        Generate a **WEEK-BY-WEEK career roadmap** in strictly valid JSON format.

        Role: {target_role}
        Skills: {normalized_skills}
        Timeframe: {timeframe} months
        Weekly hours: {weekly_hours}

        The roadmap must include:
        - A clear summary.
        - When the user should begin applying for internships/jobs.
        - Phases list (each with title, duration_weeks, topics[], projects[], tips).
        - Keep the format strictly JSON.

        Return valid JSON exactly like:
        {{
          "summary": "",
          "applySuggestion": "",
          "phases": [
            {{
              "title": "",
              "duration_weeks": 4,
              "topics": [],
              "projects": [],
              "tips": ""
            }}
          ]
        }}
        """

        # -------------------------------
        # Gemini AI Call
        # -------------------------------
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel("models/gemini-2.5-pro")

        try:
            ai_raw = model.generate_content(prompt)
            raw = ai_raw.text

            cleaned = (
                raw.replace("```json", "")
                .replace("```", "")
                .strip()
            )

            roadmap_json = json5.loads(cleaned)

            # 🔥 Add tracking fields for phases
            roadmap_json = attach_phase_progress(roadmap_json)

        except Exception as e:
            return Response({
                "error": "AI request failed",
                "details": str(e),
                "raw_output": raw if "raw" in locals() else None
            }, status=500)

        # -------------------------------
        # Save Roadmap to Database
        # -------------------------------
        saved = SavedRoadmap.objects.create(
            user=request.user,
            target_role=target_role,
            skills_used=normalized_skills,
            timeframe_months=timeframe,
            weekly_hours=weekly_hours,
            roadmap_data=roadmap_json
        )

        return Response({
            "success": True,
            "roadmap_id": saved.id,
            "roadmap": roadmap_json
        })


import django.utils.timezone as timezone
class UpdateRoadmapPhaseAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, phase_id):
        try:
            roadmap_id = request.data.get("roadmap_id")
            index = request.data.get("phase_index")  # 0-based index

            rm = SavedRoadmap.objects.get(id=roadmap_id, user=request.user)
        except SavedRoadmap.DoesNotExist:
            return Response({"error": "Roadmap not found"}, status=404)

        phases = rm.roadmap_data.get("phases", [])

        if index < 0 or index >= len(phases):
            return Response({"error": "Invalid phase index"}, status=400)

        # Toggle phase status
        phase = phases[index]
        phase["is_completed"] = not phase.get("is_completed", False)
        phase["completed_at"] = timezone.now().isoformat() if phase["is_completed"] else None

        # Save back
        rm.roadmap_data["phases"] = phases
        rm.save(update_fields=["roadmap_data"])

        return Response({
            "success": True,
            "phase": phase
        })



class DeleteRoadmapAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, roadmap_id):
        try:
            rm = SavedRoadmap.objects.get(id=roadmap_id, user=request.user)
            rm.delete()
            return Response({"success": True, "message": "Roadmap deleted"})
        except SavedRoadmap.DoesNotExist:
            return Response({"error": "Roadmap not found"}, status=404)
