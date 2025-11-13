from rest_framework import serializers
from django.utils import timezone
from django.contrib.auth.hashers import is_password_usable
from django.utils.translation import gettext as _
from django.contrib.auth import authenticate
from skills.serializers import *

from .models import *


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name"]

class DegreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Degree
        fields = ["id", "name"]




class UserEducationSerializer(serializers.ModelSerializer):
    # Nested degree object for GET responses
    degree = serializers.SerializerMethodField(read_only=True)

    # ID to write/update degree
    degree_id = serializers.PrimaryKeyRelatedField(
        queryset=Degree.objects.all(),
        source="degree",
        write_only=True
    )

    class Meta:
        model = UserEducation
        fields = [
            "id",
            "degree",       # nested read-only
            "degree_id",    # write-only
            "institution",
            "year_start",
            "year_end",
        ]

    def get_degree(self, obj):
        if obj.degree:
            return {
                "id": obj.degree.id,
                "name": obj.degree.name
            }
        return None


class ProfileSerializer(serializers.ModelSerializer):
    education_items = UserEducationSerializer(many=True, read_only=True)
    skills = UserSkillSerializer(source="user.skills", many=True, read_only=True)

    class Meta:
        model = Profile
        fields = "__all__"


class ProfileUpdateSerializer(serializers.ModelSerializer):
    education_items = UserEducationSerializer(many=True, write_only=True)
    skills = UserSkillSerializer(source="user.skills", many=True, write_only=True)

    class Meta:
        model = Profile
        fields = [
            "location", "bio", "career_goal", "availability",
            "expected_salary", "is_job_ready", "cv_text",
            "resume_file", "portfolio_url", "github_url",
            "linkedin_url", "education_items", "skills",
        ]

    def update(self, instance, validated_data):
        edu_data = validated_data.pop("education_items", [])
        skill_data = validated_data.pop("skills", [])

        # -------------------------
        # Update simple fields
        # -------------------------
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # -------------------------
        # EDUCATION
        # -------------------------
        UserEducation.objects.filter(profile=instance).delete()
        for edu in edu_data:
            UserEducation.objects.create(profile=instance, **edu)

        # -------------------------
        # SKILLS  (FIXED)
        # -------------------------
        UserSkill.objects.filter(user=instance.user).delete()
        for skill in skill_data:
            UserSkill.objects.create(user=instance.user, **skill)

        return instance


# -------------------------------------------
# COMPANY PROFILE SERIALIZER (MAX 3)
# -------------------------------------------
class CompanyProfileSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField(required=False)

    class Meta:
        model = CompanyProfile
        fields = [
            "id", "company_name", "industry", "logo", "website",
            "location", "about", "verified", "created_at",
            "requested_at", "is_active"
        ]
        read_only_fields = ["verified", "created_at", "requested_at", "is_active"]

    def validate(self, data):
        user = self.context["request"].user
        count = CompanyProfile.objects.filter(user=user).count()

        if self.instance is None and count >= 3:
            raise serializers.ValidationError("Maximum 3 company profiles allowed.")

        return data

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["requested_at"] = timezone.now()
        validated_data["is_active"] = False
        validated_data["verified"] = False
        return CompanyProfile.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        instance.requested_at = timezone.now()
        instance.is_active = False
        instance.verified = False
        return super().update(instance, validated_data)


# -------------------------------------------
# INSTITUTION PROFILE SERIALIZER (MAX 3)
# -------------------------------------------
class InstitutionProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstitutionProfile
        fields = [
            "id", "institution_name", "institution_type", "logo",
            "website", "location", "about", "verified",
            "created_at", "requested_at", "is_active" ,
        ]
        read_only_fields = ["verified", "created_at", "requested_at", "is_active"]

    def validate(self, data):
        user = self.context["request"].user
        count = InstitutionProfile.objects.filter(user=user).count()

        if self.instance is None and count >= 3:
            raise serializers.ValidationError("Maximum 3 institution profiles allowed.")

        return data

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["requested_at"] = timezone.now()
        validated_data["is_active"] = False
        validated_data["verified"] = False
        return InstitutionProfile.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        instance.requested_at = timezone.now()
        instance.is_active = False
        instance.verified = False
        return super().update(instance, validated_data)



# -------------------------------------------
# User Role
# -------------------------------------------
class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ["id", "name", "description"]


# -------------------------------------------
# USER SERIALIZER (FIXED)
# -------------------------------------------
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    companies = CompanyProfileSerializer(many=True, read_only=True)
    institutions = InstitutionProfileSerializer(many=True, read_only=True)
    roles = serializers.SerializerMethodField()
    profile_image = serializers.ImageField(required=False)
    is_company = serializers.SerializerMethodField()
    is_institution = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "password",
            "phone_number",
            "is_superuser",
            "is_active",
            "is_staff",
            "profile_image",
            "roles",
            "is_company",
            "is_institution",

            # related data
            "profile",
            "companies",
            "institutions",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "is_superuser": {"read_only": True},
            "is_staff": {"read_only": True},
            "is_active": {"read_only": True},
        }


    def get_roles(self, obj):
        return list(obj.roles.values_list("name", flat=True))
    
    def get_is_company(self, obj):
        return obj.is_company  

    def get_is_institution(self, obj):
        return obj.is_institution  


    # ---------------------------
    # Email validation (only create)
    # ---------------------------
    def validate_email(self, value):
        request = self.context.get("request")
        is_create = request and request.method == "POST"

        if is_create:
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError(_("User with this email already exists."))
            if '@' not in value or '.' not in value.split('@')[-1]:
                raise serializers.ValidationError(_("Invalid email format."))

        return value

    # ---------------------------
    # Global validation
    # ---------------------------
    def validate(self, data):
        request = self.context.get("request")
        is_create = request and request.method == "POST"

        if is_create:
            email = data.get("email")
            password = data.get("password")

            if not email:
                raise serializers.ValidationError({"email": _("Email is required.")})
            if not password:
                raise serializers.ValidationError({"password": _("Password is required.")})
            if len(password) < 8:
                raise serializers.ValidationError({"password": _("Password must be at least 8 characters.")})

        # UPDATE does NOT require email & password
        return data

    # ---------------------------
    # Create User
    # ---------------------------
    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    # ---------------------------
    # Update User
    # ---------------------------
    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance


# -------------------------------------------
# LOGIN SERIALIZER
# -------------------------------------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            raise serializers.ValidationError({"error": _("Email and password are required.")})

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"error": _("User does not exist.")})

        if not is_password_usable(user.password):
            raise serializers.ValidationError({"error": _("Password corrupted. Reset required.")})

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError({"error": _("Invalid credentials.")})

        if not user.is_email_verified:
            raise serializers.ValidationError({"error": _("Email not verified.")})

        data["user"] = user
        return data

