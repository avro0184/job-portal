from rest_framework import serializers
from .models import (
    SkillCategory,
    Skill,
    SkillLevel,
    UserSkill,
    SkillTest,
    SkillQuestion,
    UserSkillTestResult,
    UserSkillProgress,
)


# -------------------------------------------------
# Skill Category Serializer
# -------------------------------------------------
class SkillCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillCategory
        fields = ["id", "name", "description"]


# -------------------------------------------------
# Skill Serializer
# -------------------------------------------------
class SkillSerializer(serializers.ModelSerializer):
    category = SkillCategorySerializer(read_only=True)

    class Meta:
        model = Skill
        fields = [
            "id", "name", "category", "difficulty_level",
            "ai_vector", "ai_keywords", "ai_summary",
            "popularity_score", "created_at"
        ]


# -------------------------------------------------
# User Skill Serializer  (for user profile)
# -------------------------------------------------
class UserSkillSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    skill_id = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(),
        write_only=True,
        source="skill"
    )

    class Meta:
        model = UserSkill
        fields = [
            "id",
            "skill",
            "skill_id",
            "proficiency_percentage",
            "level",
            "updated_at"
        ]
        read_only_fields = ["level", "updated_at"]

    def create(self, validated_data):
        user = self.context["request"].user
        skill = validated_data["skill"]

        # prevent duplicates
        if UserSkill.objects.filter(user=user, skill=skill).exists():
            raise serializers.ValidationError("Skill already added.")

        validated_data["user"] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        instance.proficiency_percentage = validated_data.get(
            "proficiency_percentage",
            instance.proficiency_percentage
        )
        instance.update_level()
        return instance

# -------------------------------------------------
# Skill Test Serializer
# -------------------------------------------------
class SkillTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillTest
        fields = [
            "id", "skill", "title",
            "description", "difficulty",
            "duration_minutes", "total_marks",
            "version", "randomize_questions",
            "created_at"
        
]


# -------------------------------------------------
# Skill Question Serializer
# -------------------------------------------------
class SkillQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillQuestion
        fields = [
            "id", "test", "question_text",
            "option_a", "option_b", "option_c", "option_d",
            "correct_option", "difficulty", "marks"
        ]




class SkillTestDetailSerializer(serializers.ModelSerializer):
    questions = SkillQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = SkillTest
        fields = [
            "id", "title", "description", "skill",
            "difficulty", "duration_minutes", "total_marks",
            "questions"
        ]



class SubmitTestSerializer(serializers.Serializer):
    answers = serializers.DictField(
        child=serializers.CharField(),
        write_only=True
    )

    def validate_answers(self, value):
        if len(value) != 15:
            raise serializers.ValidationError("You must answer exactly 15 questions.")

        for qid, opt in value.items():
            if opt not in ["A", "B", "C", "D"]:
                raise serializers.ValidationError(f"Invalid answer choice for question {qid}")

        return value


# -------------------------------------------------
# Skill Test Result Serializer
# -------------------------------------------------
class SubmitTestSerializer(serializers.Serializer):
    answers = serializers.DictField(
        child=serializers.CharField(),
        write_only=True
    )

    def validate_answers(self, value):
        if len(value) != 15:
            raise serializers.ValidationError("You must answer exactly 15 questions.")

        for qid, opt in value.items():
            if opt not in ["A", "B", "C", "D"]:
                raise serializers.ValidationError(f"Invalid answer choice for question {qid}")

        return value


# -------------------------------------------------
# Skill Progress Serializer
# -------------------------------------------------
class SubmitTestSerializer(serializers.Serializer):
    answers = serializers.DictField(
        child=serializers.CharField(),
        write_only=True
    )

    def validate_answers(self, value):
        if len(value) != 15:
            raise serializers.ValidationError("You must answer exactly 15 questions.")

        for qid, opt in value.items():
            if opt not in ["A", "B", "C", "D"]:
                raise serializers.ValidationError(f"Invalid answer choice for question {qid}")

        return value
