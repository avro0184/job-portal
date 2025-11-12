from rest_framework import serializers
from django.core.validators import RegexValidator
from .models import *
from django.contrib.auth import authenticate
from mcq.serializers import *
from mcq.models import ClassName  
from mcq.halper import *
from exam.serializers import *
from existing_question.serializers import *
from django.utils.translation import gettext as _


class UserSerializer(serializers.ModelSerializer):
    allowed_classes = serializers.SerializerMethodField()
    # mock_exam_classess = serializers.SerializerMethodField()
    institution_groups = serializers.SerializerMethodField()
    allowsed_subjects_mentor = serializers.SerializerMethodField()
    years = serializers.SerializerMethodField()
    topics = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'password', 'last_login', 'date_joined', 'phone_number',
            'allowed_classes', 'is_superuser', 'has_question_access', 'is_active', 'is_staff',
            'remaining_questions' ,"max_upload_questions",
            'institution_groups' , "allowsed_subjects_mentor", "years" , "max_group" , "max_exam_in_group" , "topics"
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'is_superuser': {'read_only': True},
            'is_staff': {'read_only': True},
            'is_active': {'read_only': False},
            'last_login': {'read_only': True},
            'date_joined': {'read_only': True},
            'has_question_access': {'read_only': True},
            'remaining_questions': {'read_only': True},
            'allowed_classes': {'read_only': True},
            'has_question_upload_access' : {'read_only': True},
            'max_upload_questions' : {'read_only': True},
            'institution_groups' : {'read_only': True},
            'allowsed_subjects_mentor' : {'read_only': True},
            'years' : {'read_only': True} , 
            'max_group' : {'read_only': True} , 
            'max_exam_in_group' : {'read_only': True}
        }
    
    def get_years(self, obj):
        return YearSerializer(Year.objects.all(), many=True, context=self.context).data

    def get_topics(self, obj):
        return list(obj.topics.values_list("name", flat=True))
    
    # def get_mock_exam_classess(self, obj):
    #     all_class = ClassName.objects.prefetch_related(
    #         'subjects__faculty', 
    #         'subjects__subject', 
    #         'subjects__paper', 
    #         'subjects__chapters'
    #     ).all()
    #     return ClassNameSerializer(all_class, many=True, context=self.context).data
    
    
    def get_institution_groups(self, obj):
        return GroupOfInstitutionShortSerializer(GrpupOfInstitutionnName.objects.all(), many=True, context=self.context).data
        
    def get_allowsed_subjects_mentor(self, obj):
        try:
            request = self.context.get("request")
            user = request.user if request and request.user.is_authenticated else None
            if user and hasattr(user, 'mentors_access'):
                return SubjectSerializer(user.mentors_access.all(), many=True).data
        except Exception as e:
            return []
    
    def get_allowed_classes(self, obj):
        return ClassNameShortSerializer( ClassName.objects.all(), many=True, context=self.context).data

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(_("User with this email already exists."))
        if '@' not in value or '.' not in value.split('@')[-1]:
            raise serializers.ValidationError(_("Invalid email format. It must contain '@' and a domain (e.g., '.com')."))
        return value

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email and not password:
            raise serializers.ValidationError({"email": _("Email and password are required.")})

        if email and '@' not in email or '.' not in email.split('@')[-1]:
            raise serializers.ValidationError({"email": _("Invalid email format. It must contain '@' and a domain (e.g., '.com').")})

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": _("User with this email already exists.")})

        if password:
            password_errors = []
            if len(password) < 8:
                password_errors.append(_("Password must be at least 8 characters long."))
            # if not any(char.isdigit() for char in password):
            #     password_errors.append("Password must contain at least one numeric character.")
            # if not any(char.isalpha() for char in password):
            #     password_errors.append("Password must contain at least one alphabetic character.")
            # if not any(char in "!@#$%^&*()-_+=<>" for char in password):
            #     password_errors.append("Password must contain at least one special character.")
            # if not any(char.isupper() for char in password):
            #     password_errors.append("Password must contain at least one uppercase letter.")

            if password_errors:
                raise serializers.ValidationError({"password": password_errors})

        return data

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)
        
        instance.save()
        return instance    



from django.contrib.auth.hashers import is_password_usable
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError({"error": _("Email and password are required.")})

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"error": _("User with this email does not exist.")})

        # ✅ Ensure password is not NULL or corrupted
        if not is_password_usable(user.password):
            raise serializers.ValidationError({"error": _("Password is corrupted. Please reset your password.")})

        # ✅ Authenticate normally
        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError({"error": _("Invalid credentials.")})

        if not user.is_active:
            raise serializers.ValidationError({"error": _("Account is not active.")})

        if not user.is_email_verified:
            raise serializers.ValidationError({"error": _("Email is not verified. Check your email.")})

        data['user'] = user
        return data





    
    