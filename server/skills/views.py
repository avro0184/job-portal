from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializers import *

# Create your views here.
class SkillListView(APIView):
    def get(self, request):
        skills = Skill.objects.all().order_by("name")
        return Response(SkillSerializer(skills, many=True).data)
