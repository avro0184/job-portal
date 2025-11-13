from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.db import transaction
from django.conf import settings
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken, TokenError
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import requests as pyrequests

from .models import *
from .serializers import *
from accounts.tasks import send_password_reset_task, send_verification_email_task
from accounts.emails import email_token_generator
from django.utils.translation import gettext as _


User = get_user_model()


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        return Response(ProfileSerializer(profile).data)

    def put(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileUpdateSerializer(profile, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": True, "profile": ProfileSerializer(profile).data})

    def patch(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileUpdateSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": True, "profile": ProfileSerializer(profile).data})


# ----------------------------------------------------------
# User Registration
# ----------------------------------------------------------
class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            with transaction.atomic():
                user = serializer.save()

                token = email_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.email))

                verification_link = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}"
                send_verification_email_task.delay(user.email, verification_link)

        except Exception:
            if "user" in locals():
                user.delete()
            return Response(
                {"success": False, "error": _("Registration failed. Try again.")},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {"success": True, "message": _("User registered successfully. Check your email.")},
            status=status.HTTP_201_CREATED
        )


# ----------------------------------------------------------
# Login
# ----------------------------------------------------------
class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        user.is_delete_requested = False
        user.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            "success": True,
            "message": _("Login successful."),
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "email": user.email,
        }, status=status.HTTP_200_OK)


# ----------------------------------------------------------
# Verify Email
# ----------------------------------------------------------
class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")

        try:
            email = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(email=email)

            if email_token_generator.check_token(user, token):
                user.is_email_verified = True
                user.is_active = True
                user.save()
                return Response({"success": True, "message": _("Email verified.")})

            return Response({"success": False, "message": _("Invalid verification link.")}, status=400)

        except Exception:
            return Response({"success": False, "error": _("Invalid link.")}, status=400)


# ----------------------------------------------------------
# Forgot Password
# ----------------------------------------------------------
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"error": _("Email is required.")}, status=400)

        try:
            user = User.objects.get(email=email)

            if not user.is_email_verified:
                return Response({"error": _("Email not verified.")}, status=400)

            token = email_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.email))

            reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
            send_password_reset_task.delay(email, reset_link)

            return Response({"success": True, "message": _("Password reset email sent.")})

        except User.DoesNotExist:
            return Response({"error": _("User not found.")}, status=400)


# ----------------------------------------------------------
# Reset Password
# ----------------------------------------------------------
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("newPassword")
        confirm_password = request.data.get("confirmPassword")

        try:
            email = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(email=email)

            if not email_token_generator.check_token(user, token):
                return Response({"error": _("Invalid or expired token.")}, status=400)

            if not new_password or not confirm_password:
                return Response({"error": _("Both password fields required.")}, status=400)

            if new_password != confirm_password:
                return Response({"error": _("Passwords do not match.")}, status=400)

            if len(new_password) < 8:
                return Response({"error": _("Password must be at least 8 characters.")}, status=400)

            user.set_password(new_password)
            user.save()

            return Response({"success": True, "message": _("Password reset successfully.")})

        except Exception:
            return Response({"error": _("Invalid token or user.")}, status=400)


# ----------------------------------------------------------
# Logout
# ----------------------------------------------------------
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh_token")

        if not refresh_token:
            return Response({"error": _("Refresh token required.")}, status=400)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response({"error": _("Invalid refresh token.")}, status=400)

        return Response({"success": True, "message": _("Logged out successfully.")})


# ----------------------------------------------------------
# Profile (Own)
# ----------------------------------------------------------
class ProfileMeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "success": True,
            "data": UserSerializer(request.user).data   
        }, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": True, "user": serializer.data})
    
    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": True, "user": serializer.data})
    
    def delete(self, request):
        user = request.user
        user.is_delete_requested = True
        user.save()
        return Response({"success": True, "message": "User deleted."})




# =====================================================================
# ------------------------- COMPANY PROFILE CRUD -----------------------
# =====================================================================
class CompanyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    # Helper function
    def get_object(self, user, pk):
        try:
            return CompanyProfile.objects.get(user=user, id=pk)
        except CompanyProfile.DoesNotExist:
            return None

    # GET (list or single)
    def get(self, request, pk=None):
        if pk:
            profile = self.get_object(request.user, pk)
            if not profile:
                return Response({"error": "Company profile not found."}, status=404)

            return Response({"success": True, "data": CompanyProfileSerializer(profile).data})

        # List all company profiles of logged-in user
        profiles = CompanyProfile.objects.filter(user=request.user)
        return Response({"success": True, "data": CompanyProfileSerializer(profiles, many=True).data})

    # CREATE
    def post(self, request):
        serializer = CompanyProfileSerializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"success": True, "message": "Created", "data": serializer.data},
            status=201
        )

    # UPDATE
    def put(self, request, pk):
        print(request.data)
        profile = self.get_object(request.user, pk)
        if not profile:
            return Response({"error": "Company profile not found."}, status=404)

        serializer = CompanyProfileSerializer(
            profile,
            data=request.data,
            partial=True,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"success": True, "message": "Updated", "data": serializer.data})

    # DELETE
    def delete(self, request, pk):
        profile = self.get_object(request.user, pk)
        if not profile:
            return Response({"error": "Company profile not found."}, status=404)

        profile.delete()
        return Response({"success": True, "message": "Company profile deleted"})

# =====================================================================
# ---------------------- INSTITUTION PROFILE CRUD ----------------------
# =====================================================================
class InstitutionProfileView(APIView):
    permission_classes = [IsAuthenticated]

    # CREATE
    def post(self, request):
        serializer = InstitutionProfileSerializer(
            data=request.data, 
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "success": True,
            "message": "Institution created",
            "profile": serializer.data
        }, status=201)

    # READ (Own or By ID)
    def get(self, request, pk=None):
        if pk:
            profile = InstitutionProfile.objects.filter(pk=pk).first()
            if not profile:
                return Response({"error": "Institution profile not found."}, status=404)
            return Response({"success": True, "profile": InstitutionProfileSerializer(profile).data})

        # GET LOGGED-IN USER PROFILE
        profiles = InstitutionProfile.objects.filter(user=request.user)
        return Response({"success": True, "profiles": InstitutionProfileSerializer(profiles, many=True).data})

    # UPDATE
    def put(self, request, pk):
        profile = InstitutionProfile.objects.filter(user=request.user, pk=pk).first()
        if not profile:
            return Response({"error": "Institution profile not found."}, status=404)

        serializer = InstitutionProfileSerializer(
            profile,
            data=request.data,
            partial=True,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "success": True,
            "message": "Institution updated",
            "profile": serializer.data
        })

    # DELETE
    def delete(self, request, pk):
        profile = InstitutionProfile.objects.filter(user=request.user, pk=pk).first()
        if not profile:
            return Response({"error": "Institution profile not found."}, status=404)

        profile.delete()
        return Response({"success": True, "message": "Institution profile deleted"})


from django.utils import timezone
class RequestCompanyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile, created = CompanyProfile.objects.get_or_create(user=request.user)

        profile.requested_at = timezone.now()
        profile.is_active = False
        profile.verified = False
        profile.save()

        return Response({
            "success": True,
            "message": "Company profile request submitted. Awaiting admin approval."
        })


class RequestInstitutionProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile, created = InstitutionProfile.objects.get_or_create(user=request.user)

        profile.requested_at = timezone.now()
        profile.is_active = False
        profile.verified = False
        profile.save()

        return Response({
            "success": True,
            "message": "Institution profile request submitted. Awaiting admin approval."
        })



class RequestInstitutionProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile, created = InstitutionProfile.objects.get_or_create(user=request.user)

        profile.requested_at = timezone.now()
        profile.is_active = False
        profile.verified = False
        profile.save()

        return Response({
            "success": True,
            "message": "Institution profile request submitted. Awaiting admin approval."
        })


class ApproveCompanyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_superuser:
            return Response({"error": "Not allowed"}, status=403)

        profile_id = request.data.get("id")
        profile = get_object_or_404(CompanyProfile, id=profile_id)

        profile.is_active = True
        profile.verified = True
        profile.approved_at = timezone.now()
        profile.save()

        return Response({"success": True, "message": "Company profile approved."})


class ApproveInstitutionProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_superuser:
            return Response({"error": "Not allowed"}, status=403)

        profile_id = request.data.get("id")
        profile = get_object_or_404(InstitutionProfile, id=profile_id)

        profile.is_active = True
        profile.verified = True
        profile.approved_at = timezone.now()
        profile.save()

        return Response({"success": True, "message": "Institution profile approved."})


# ----------------------------------------------------------
# Google Login
# ----------------------------------------------------------
class GoogleLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("id_token")
        if not token:
            return Response({"error": _("id_token required")}, status=400)

        try:
            idinfo = id_token.verify_oauth2_token(
                token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
            )

            email = idinfo["email"]
            name = idinfo.get("name", "")

            user, created = User.objects.get_or_create(
                email=email,
                defaults={"full_name": name, "is_email_verified": True, "is_active": True}
            )

            refresh = RefreshToken.for_user(user)

            return Response({
                "success": True,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "email": user.email
            })

        except Exception as e:
            return Response({"error": str(e)}, status=400)


# ----------------------------------------------------------
# Facebook Login
# ----------------------------------------------------------
class FacebookLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        access_token = request.data.get("access_token")
        if not access_token:
            return Response({"error": _("Missing access token")}, status=400)

        try:
            user_info = pyrequests.get(
                f"https://graph.facebook.com/me?fields=id,name,email&access_token={access_token}"
            ).json()

            email = user_info.get("email") or f"{user_info['id']}@facebook.com"
            name = user_info.get("name", "")

            user, created = User.objects.get_or_create(
                email=email,
                defaults={"full_name": name, "is_email_verified": True, "is_active": True}
            )

            refresh = RefreshToken.for_user(user)

            return Response({
                "success": True,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "email": user.email
            })

        except Exception:
            return Response({"error": _("Invalid Facebook token.")}, status=400)




from rest_framework.parsers import MultiPartParser, FormParser

class UploadProfileImageAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get("profile_image")
        if not file:
            return Response({"success": False, "error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)

        # optional: validate file size / content_type
        if file.size > 5 * 1024 * 1024:
            return Response({"success": False, "error": "File too large (max 5MB)."}, status=400)

        user = request.user
        user.profile_image.save(file.name, file, save=True)  # saves to MEDIA
        url = request.build_absolute_uri(user.profile_image.url)
        return Response({"success": True, "url": url}, status=status.HTTP_200_OK)


class UploadCompanyLogoAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get("logo")
        if not file:
            return Response({"success": False, "error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)

        profile, _ = CompanyProfile.objects.get_or_create(user=request.user)
        profile.logo.save(file.name, file, save=True)
        url = request.build_absolute_uri(profile.logo.url)
        return Response({"success": True, "url": url}, status=status.HTTP_200_OK)


class UploadInstitutionLogoAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get("logo")
        if not file:
            return Response({"success": False, "error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)

        profile, _ = InstitutionProfile.objects.get_or_create(user=request.user)
        profile.logo.save(file.name, file, save=True)
        url = request.build_absolute_uri(profile.logo.url)
        return Response({"success": True, "url": url}, status=status.HTTP_200_OK)







class DegreeListView(APIView):
    def get(self, request):
        degrees = Degree.objects.all().order_by("name")
        return Response(DegreeSerializer(degrees, many=True).data)


class SkillListView(APIView):
    def get(self, request):
        skills = Skill.objects.all().order_by("name")
        return Response(SkillSerializer(skills, many=True).data)
