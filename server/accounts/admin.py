from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html

from .models import *


# -------------------------------------------------------------------
# USER ROLE ADMIN
# -------------------------------------------------------------------
@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description")
    search_fields = ("name",)


# -------------------------------------------------------------------
# PROFILE INLINE (Student Profile)
# -------------------------------------------------------------------
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    extra = 0
    readonly_fields = ("created_at",)


# -------------------------------------------------------------------
# CUSTOM USER ADMIN
# -------------------------------------------------------------------
admin.site.register(User)

    


# -------------------------------------------------------------------
# COMPANY PROFILE ADMIN
# -------------------------------------------------------------------
@admin.register(CompanyProfile)
class CompanyProfileAdmin(admin.ModelAdmin):
    list_display = (
        "id", "company_name", "user",
        "industry", "is_active", "verified",
        "requested_at", "approved_at",
        "approve_button",
    )

    list_filter = ("is_active", "verified", "industry")
    search_fields = ("company_name", "industry", "user__email")

    readonly_fields = ("requested_at", "approved_at", "created_at")

    # Action buttons inside admin list
    def approve_button(self, obj):
        if not obj.is_active:
            return format_html(
                '<a class="button" href="/admin/approve/company/{}/">Approve</a>',
                obj.id
            )
        return "Approved"

    approve_button.short_description = "Action"
    approve_button.allow_tags = True

    # Admin actions
    actions = ["approve_selected", "reject_selected"]

    def approve_selected(self, request, queryset):
        updated = queryset.update(is_active=True, verified=True)
        for item in queryset:
            item.approved_at = item.requested_at
            item.save()
        self.message_user(request, f"{updated} companies approved.")

    def reject_selected(self, request, queryset):
        updated = queryset.update(is_active=False, verified=False)
        self.message_user(request, f"{updated} companies rejected.")


# -------------------------------------------------------------------
# INSTITUTION PROFILE ADMIN
# -------------------------------------------------------------------
@admin.register(InstitutionProfile)
class InstitutionProfileAdmin(admin.ModelAdmin):
    list_display = (
        "id", "institution_name", "user",
        "institution_type", "is_active", "verified",
        "requested_at", "approved_at",
        "approve_button",
    )

    list_filter = ("is_active", "verified", "institution_type")
    search_fields = ("institution_name", "institution_type", "user__email")

    readonly_fields = ("requested_at", "approved_at", "created_at")

    def approve_button(self, obj):
        if not obj.is_active:
            return format_html(
                '<a class="button" href="/admin/approve/institution/{}/">Approve</a>',
                obj.id
            )
        return "Approved"

    approve_button.short_description = "Action"

    actions = ["approve_selected", "reject_selected"]

    def approve_selected(self, request, queryset):
        updated = queryset.update(is_active=True, verified=True)
        for item in queryset:
            item.approved_at = item.requested_at
            item.save()
        self.message_user(request, f"{updated} institutions approved.")

    def reject_selected(self, request, queryset):
        updated = queryset.update(is_active=False, verified=False)
        self.message_user(request, f"{updated} institutions rejected.")



admin.site.register(Degree)
admin.site.register(UserEducation)
