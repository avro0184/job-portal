from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db import IntegrityError, transaction
from django.shortcuts import get_object_or_404

from .models import *
from .serializers import *

# -------------------------------------------------
# Skill List View
# -------------------------------------------------
class SkillListView(APIView):
    def get(self, request):
        skills = Skill.objects.all().order_by("name")
        return Response({"success": True, "data": SkillSerializer(skills, many=True).data})


# -------------------------------------------------
# Skill Test List View
# -------------------------------------------------
class SkillTestListView(APIView):
    def get(self, request):
        tests = SkillTest.objects.all().order_by("skill__name")
        return Response({"success": True, "data": SkillTestSerializer(tests, many=True).data})


# -------------------------------------------------
# Skill Test Detail (with 15 questions)
# -------------------------------------------------
class SkillTestDetailView(APIView):
    def get(self, request, test_id):
        test = get_object_or_404(SkillTest.objects.prefetch_related("questions"), id=test_id)

        # Ensure test has exactly 15 questions
        if test.questions.count() != 15:
            return Response(
                {"error": "This test is not ready. It must contain exactly 15 MCQs."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(SkillTestDetailSerializer(test).data)


# -------------------------------------------------
# Submit Test (scoring + update skill + one attempt only)
# -------------------------------------------------
class SubmitSkillTestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, test_id):
        test = get_object_or_404(SkillTest.objects.prefetch_related("questions"), id=test_id)

        # Validate answers
        serializer = SubmitTestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        answers = serializer.validated_data["answers"]

        # Ensure 15 questions exist
        if test.questions.count() != 15:
            return Response(
                {"error": "Test is not ready. It must contain exactly 15 questions."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Score calculation
        questions = test.questions.all()
        total_score = sum(q.marks for q in questions)
        earned = 0

        question_map = {str(q.id): q for q in questions}

        for qid, user_ans in answers.items():
            q = question_map.get(qid)
            if q.correct_option == user_ans:
                earned += q.marks

        percentage = round((earned / total_score) * 100, 2)
        passed = percentage >= 60

        # Save the result – one attempt per skill
        try:
            with transaction.atomic():
                result = UserSkillTestResult.objects.create(
                    user=request.user,
                    test=test,
                    score=earned,
                    percentage=percentage,
                    passed=passed,
                )

                # Skill progress history
                UserSkillProgress.objects.create(
                    user=request.user,
                    skill=test.skill,
                    proficiency_percentage=percentage
                )

        except IntegrityError:
            return Response(
                {"error": "You have already taken the test for this skill."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({
            "score": earned,
            "percentage": percentage,
            "passed": passed,
            "result": UserSkillTestResultSerializer(result).data
        })


# -------------------------------------------------
# UserSkill List + Add
# -------------------------------------------------
class UserSkillListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        skills = UserSkill.objects.filter(user=request.user)
        return Response(UserSkillSerializer(skills, many=True).data)

    def post(self, request):
        serializer = UserSkillSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


# -------------------------------------------------
# UserSkill Update (update proficiency)
# -------------------------------------------------
class UserSkillUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, skill_id):
        try:
            user_skill = UserSkill.objects.get(user=request.user, id=skill_id)
        except UserSkill.DoesNotExist:
            return Response({"error": "Skill not found."}, status=404)

        serializer = UserSkillSerializer(user_skill, data=request.data, partial=True, context={"request": request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


# -------------------------------------------------
# User Skill Progress History
# -------------------------------------------------
class UserSkillProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, skill_id):
        progress = UserSkillProgress.objects.filter(
            user=request.user,
            skill_id=skill_id
        ).order_by("-timestamp")

        return Response(UserSkillProgressSerializer(progress, many=True).data)
