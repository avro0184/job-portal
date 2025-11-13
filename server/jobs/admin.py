from django.contrib import admin
from .models import *
from django import forms
from .widgets import ArraySelectMultiple


class JobAdminForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = "__all__"

    employment_mode = forms.MultipleChoiceField(
        choices=Job.EMPLOYMENT_MODE,
        required=False,
        widget=forms.CheckboxSelectMultiple
    )

    job_type = forms.MultipleChoiceField(
        choices=Job.JOB_TYPES,
        required=False,
        widget=forms.CheckboxSelectMultiple
    )

    experience_level = forms.MultipleChoiceField(
        choices=Job.EXPERIENCE_LEVELS,
        required=False,
        widget=forms.CheckboxSelectMultiple
    )

    def clean_employment_mode(self):
        return self.cleaned_data.get("employment_mode", [])

    def clean_job_type(self):
        return self.cleaned_data.get("job_type", [])

    def clean_experience_level(self):
        return self.cleaned_data.get("experience_level", [])


class JobAdmin(admin.ModelAdmin):
    form = JobAdminForm


admin.site.register(Job, JobAdmin)



class JobAdmin(admin.ModelAdmin):
    form = JobAdminForm
    list_display = ("title", "company_profile", "created_at", "is_active")


admin.site.register(Application)