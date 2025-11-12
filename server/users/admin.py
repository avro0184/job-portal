from .models import *
from django.contrib import admin
from django.contrib.auth.models import Group
from .models import *

class CustomUserAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "email",
        "phone_number",
        "is_email_verified",
        "is_superuser",
        "is_staff",
        "has_question_access",
        "remaining_questions",
        "date_joined",   # ✅ added
    )
    search_fields = (
        "full_name",
        "email",
        "phone_number",
    )
    list_filter = (
        "is_email_verified",
        "is_superuser",
        "is_staff",
        "has_question_access",
        "date_joined",   # ✅ filter by join date
    )
    ordering = ("-date_joined",)  # ✅ show newest users first

admin.site.register(User, CustomUserAdmin)
# admin.site.register(UserPermission)

# Unregister the Group model
admin.site.unregister(Group)
