from rest_framework import serializers
from .models import LearningResource, ResourceCategory
from skills.models import Skill
from skills.serializers import SkillSerializer


class ResourceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceCategory
        fields = ["id", "name", "description"]


class LearningResourceSerializer(serializers.ModelSerializer):
    # Read-only skill objects
    related_skills = SkillSerializer(many=True, read_only=True)

    # Write skill IDs
    related_skill_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Skill.objects.all(),
        write_only=True,
        required=False
    )

    category_info = ResourceCategorySerializer(
        source="category",
        read_only=True
    )

    class Meta:
        model = LearningResource
        fields = [
            "id",
            "title",
            "platform",
            "instructor",
            "url",
            "thumbnail",
            "cost_indicator",
            "resource_type",
            "level",
            "category",
            "category_info",
            "related_skills",
            "related_skill_ids",
            "duration_hours",
            "rating",
            "learners_count",
            "description",
            "popularity_score",
            "created_at",
        ]

    def create(self, validated_data):
        skill_ids = validated_data.pop("related_skill_ids", [])
        resource = LearningResource.objects.create(**validated_data)
        resource.related_skills.set(skill_ids)
        return resource

    def update(self, instance, validated_data):
        skill_ids = validated_data.pop("related_skill_ids", None)
        resource = super().update(instance, validated_data)

        if skill_ids is not None:
            resource.related_skills.set(skill_ids)

        return resource
    



