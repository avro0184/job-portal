from django.urls import path
from .views import *


urlpatterns = [

    # ---------- Auth ----------
    path("register/", UserRegistrationView.as_view(), name="register"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),

    # ---------- Email Verification ----------
    path("verify-email/", VerifyEmailView.as_view(), name="verify_email"),

    # ---------- Password Reset ----------
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot_password"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset_password"),

    # ---------- Profiles ----------
    path("profile-info/", ProfileMeAPIView.as_view(), name="profile_me"),

    # Company Profile
    path("company-profile/", CompanyProfileView.as_view(), name="company_profile"),
    path("company-profile/<int:pk>/", CompanyProfileView.as_view(), name="company_profile_detail"),

    # Institution Profile
    path("institution-profile/", InstitutionProfileView.as_view(), name="institution_profile_list_create"),
    path("institution-profile/<int:pk>/", InstitutionProfileView.as_view(), name="institution_profile_detail"),

    # ---------- Social Logins ----------
    path("google/", GoogleLoginAPIView.as_view(), name="google_login"),
    path("facebook/", FacebookLoginAPIView.as_view(), name="facebook_login"),



    path("upload-profile-image/", UploadProfileImageAPIView.as_view(), name="upload_profile_image"),
    path("upload-company-logo/", UploadCompanyLogoAPIView.as_view(), name="upload_company_logo"),
    path("upload-institution-logo/", UploadInstitutionLogoAPIView.as_view(), name="upload_institution_logo"),


    path("request-company/", RequestCompanyProfileView.as_view(), name="request_company"),
    path("request-institution/", RequestInstitutionProfileView.as_view(), name="request_institution"),

    path("approve-company/", ApproveCompanyProfileView.as_view(), name="approve_company"),
    path("approve-institution/", ApproveInstitutionProfileView.as_view(), name="approve_institution"),


    path("profile/", UserProfileView.as_view(), name="profile"),

    path("dropdown/degrees/", DegreeListView.as_view()),
    path("dropdown/skills/", SkillListView.as_view()),




]
