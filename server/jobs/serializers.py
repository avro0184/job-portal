from rest_framework import serializers
from .models import *
from skills.models import *
from skills.serializers import *
from accounts.serializers import *


class JobSerializer(serializers.ModelSerializer):

    required_skills = SkillSerializer(many=True, read_only=True)

    # Accept skill IDs while writing
    required_skill_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Skill.objects.all(),
        write_only=True
    )

    company_info = CompanyProfileSerializer(
        source="company_profile",
        read_only=True
    )

    class Meta:
        model = Job
        fields = [
            "id", "title", "company_profile", "company_info",
            "location", "employment_mode", "job_type",
            "experience_level", "description", "responsibilities",
            "benefits",

            "required_skills",
            "required_skill_ids",

            "salary_min", "salary_max", "salary_currency",
            "deadline", "screening_questions",
            "posted_by", "is_active", "created_at"
        ]
        read_only_fields = ["posted_by", "created_at"]

    def create(self, validated_data):
        skill_ids = validated_data.pop("required_skill_ids", [])
        job = Job.objects.create(**validated_data)
        job.required_skills.set(skill_ids)
        return job

    def update(self, instance, validated_data):
        skill_ids = validated_data.pop("required_skill_ids", None)
        job = super().update(instance, validated_data)

        if skill_ids is not None:
            job.required_skills.set(skill_ids)

        return job


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = [
            "id",
            "user",
            "job",
            "resume",
            "cover_letter",
            "screening_answers",
            "status",
            "applied_at"
        ]
        read_only_fields = ["user", "status", "applied_at"]

    def validate(self, data):
        user = self.context["request"].user
        job = data["job"]

        # Duplicate Application Check
        if Application.objects.filter(user=user, job=job).exists():
            raise serializers.ValidationError("You already applied to this job.")

        # Mandatory Cover Letter
        if not data.get("cover_letter"):
            raise serializers.ValidationError("Cover letter is required.")

        return data

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
    


class MyApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)
    company_name = serializers.CharField(
        source="job.company_profile.company_name",
        read_only=True
    )
    location = serializers.CharField(source="job.location", read_only=True)

    class Meta:
        model = Application
        fields = [
            "id",
            "job_title",
            "company_name",
            "location",
            "status",
            "resume",
            "cover_letter",
            "resume_score",
            "skill_test_score",
            "overall_match_score",
            "applied_at",
        ]
