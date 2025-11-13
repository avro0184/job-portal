from rest_framework import serializers
from .models import *
from skills.models import *
from skills.serializers import *
from accounts.serializers import *


class JobSerializer(serializers.ModelSerializer):

    # Read-only nested skill objects
    required_skills = SkillSerializer(many=True, read_only=True)

    # Write-only list of IDs
    required_skill_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Skill.objects.all(),
        write_only=True,
        source="required_skills"
    )

    company_info = CompanyProfileSerializer(
        source="company_profile",
        read_only=True
    )

    employment_mode = serializers.ListField(
        child=serializers.ChoiceField(choices=Job.EMPLOYMENT_MODE)
    )

    job_type = serializers.ListField(
        child=serializers.ChoiceField(choices=Job.JOB_TYPES)
    )

    experience_level = serializers.ListField(
        child=serializers.ChoiceField(choices=Job.EXPERIENCE_LEVELS)
    )

    required_skill_level = serializers.ChoiceField(
        choices=SkillLevel.choices,
        required=False,
        allow_null=True
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
            "required_skill_level",

            "salary_min", "salary_max", "salary_currency",
            "deadline", "screening_questions",
            "posted_by", "is_active", "created_at"
        ]
        read_only_fields = ["posted_by", "created_at"]

    def create(self, validated_data):
        skills = validated_data.pop("required_skills", [])
        job = Job.objects.create(**validated_data)
        job.required_skills.set(skills)
        return job

    def update(self, instance, validated_data):
        skills = validated_data.pop("required_skills", None)
        job = super().update(instance, validated_data)

        if skills is not None:
            job.required_skills.set(skills)

        return job




class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = [
            "id", "user", "job", "resume",
            "cover_letter", "screening_answers",
            "status", "applied_at"
        ]
        read_only_fields = ["user", "status", "applied_at"]

    def validate(self, data):
        user = self.context["request"].user
        job = data["job"]

        if Application.objects.filter(user=user, job=job).exists():
            raise serializers.ValidationError("You already applied to this job.")

        return data

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
