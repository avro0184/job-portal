from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework import status

from .models import *
from .serializers import *
from jobs.services.matching import *

class JobAPIView(APIView):
    permission_classes = [IsAuthenticated]

    # --------------------------
    # VALIDATION FOR MULTI FIELDS
    # --------------------------
    def validate_multi_fields(self, data):
        multi_fields = ["employment_mode", "job_type", "experience_level"]
        for field in multi_fields:
            if field in data and not isinstance(data[field], list):
                raise ValueError(f"{field} must be a list.")

    # --------------------------
    # GET: LIST or DETAIL
    # --------------------------
    def get(self, request, pk=None):
        # LIST ALL JOBS
        if pk is None:
            jobs = Job.objects.filter(is_active=True)

            exp = request.GET.getlist("experience_level")
            if exp:
                jobs = jobs.filter(experience_level__overlap=exp)

            mode = request.GET.getlist("employment_mode")
            if mode:
                jobs = jobs.filter(employment_mode__overlap=mode)

            jtype = request.GET.getlist("job_type")
            if jtype:
                jobs = jobs.filter(job_type__overlap=jtype)

            salary_min = request.GET.get("salary_min")
            salary_max = request.GET.get("salary_max")

            if salary_min:
                jobs = jobs.filter(salary_min__gte=salary_min)

            if salary_max:
                jobs = jobs.filter(salary_max__lte=salary_max)

            # ⭐ ADD MATCH SCORE FOR EVERY JOB IN LIST
            job_list = []
            for job in jobs:
                data = JobSerializer(job).data

                if request.user.is_authenticated:
                    has_applied = Application.objects.filter(user=request.user, job=job).exists()
                    data["job_status"] = "Applied" if has_applied else "Not Applied"

                if request.user.is_authenticated:
                    try:
                        data["match"] = calculate_matching_score(request.user, job)
                    except Exception:
                        data["match"] = None
                else:
                    data["match"] = None

                job_list.append(data)

            return Response({
                "success": True,
                "count": len(job_list),
                "jobs": job_list
            })


        # DETAIL PAGE
        try:
            job = Job.objects.get(id=pk)
        except Job.DoesNotExist:
            return Response({"error": "Job not found"}, status=404)

        job_data = JobSerializer(job).data

        if request.user.is_authenticated:
                has_applied = Application.objects.filter(user=request.user, job=job).exists()
                data["job_status"] = "Applied" if has_applied else "Not Applied"

        if request.user.is_authenticated:
            try:
                job_data["match"] = calculate_matching_score(request.user, job)
            except Exception:
                job_data["match"] = None
        else:
            job_data["match"] = None

        return Response({
            "success": True,
            "data": job_data
        })


    # --------------------------
    # POST: CREATE job OR APPLY job
    # --------------------------
    def post(self, request, pk=None):
        user = request.user

        # --------------------------
        # 1) CREATE NEW JOB
        # --------------------------
        if pk is None:
            if not user.is_company:
                return Response({"error": "Only company users can post jobs."}, status=403)

            try:
                self.validate_multi_fields(request.data)
            except ValueError as e:
                return Response({"error": str(e)}, status=400)

            serializer = JobSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(posted_by=user)

            return Response({"success": True, "data": serializer.data}, status=201)

        # --------------------------
        # 2) APPLY TO A JOB → /jobs/<pk>/apply/
        # --------------------------
        if request.path.endswith("apply/"):
            if not user.is_student:
                return Response({"error": "Only students can apply for jobs."}, status=403)

            data = {**request.data, "job": pk}

            serializer = ApplicationSerializer(
                data=data, context={"request": request}
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response({"success": True, "data": serializer.data}, status=201)

        return Response({"error": "Invalid request"}, status=400)

    # --------------------------
    # PUT: Update job (owner only)
    # --------------------------
    def put(self, request, pk=None):
        if pk is None:
            return Response({"error": "Job ID required"}, status=400)

        user = request.user

        try:
            job = Job.objects.get(id=pk, posted_by=user)
        except Job.DoesNotExist:
            return Response({"error": "You cannot edit this job."}, status=403)

        try:
            self.validate_multi_fields(request.data)
        except ValueError as e:
            return Response({"error": str(e)}, status=400)

        serializer = JobSerializer(job, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"success": True, "data": serializer.data})

    # --------------------------
    # DELETE: Delete job
    # --------------------------
    def delete(self, request, pk=None):
        if pk is None:
            return Response({"error": "Job ID required"}, status=400)

        user = request.user

        try:
            job = Job.objects.get(id=pk, posted_by=user)
        except Job.DoesNotExist:
            return Response({"error": "You cannot delete this job."}, status=403)

        job.delete()
        return Response({"success": True, "message": "Job deleted"})




class AllJobsCreatorAPIView(APIView):
    def get(self, request):
        jobs = Job.objects.filter(company_profile__user=request.user)
        return Response({"success": True, "count": jobs.count(), "jobs": JobSerializer(jobs, many=True).data})



# --------------------------------------------------------
# VIEW JOB APPLICANTS (COMPANY OWNER ONLY)
# --------------------------------------------------------
class JobApplicantsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = request.user

        if not user.is_company:
            return Response({"error": "Only companies can view applicants."}, status=403)

        try:
            job = Job.objects.get(id=pk, posted_by=user)
        except Job.DoesNotExist:
            return Response({"error": "Not authorized to view applicants."}, status=403)

        applicants = job.applications.select_related("user").all()

        return Response({
            "success": True,
            "count": applicants.count(),
            "applicants": ApplicationSerializer(applicants, many=True).data
        })



class ApplyJobAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user = request.user

        # Only students can apply
        if not user.is_student:
            return Response({"error": "Only students can apply for jobs."}, status=403)

        try:
            job = Job.objects.get(id=pk, is_active=True)
        except Job.DoesNotExist:
            return Response({"error": "Job not found."}, status=404)

        # Add job into request payload
        data = request.data.copy()
        data["job"] = pk

        serializer = ApplicationSerializer(data=data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "success": True,
            "message": "Application submitted successfully!",
            "application": serializer.data
        }, status=201)
    

import google.generativeai as genai
import os
import json5  

class JobSkillFlow(APIView):
    def post(self, request, *args, **kwargs):
        job = request.data.get("job")

        if not job:
            return Response({"error": "Job data required"}, status=status.HTTP_400_BAD_REQUEST)

        match = job.get("match", {})
        matched = [x["skill"] for x in match.get("matched_skills", [])]
        missing = match.get("missing_skills", [])

        # --- STRICT JSON PROMPT FOR GEMINI ---
        prompt = f"""
        You are an expert tech career mentor.

        Matched skills: {matched}
        Missing skills: {missing}

        Produce EXACTLY this JSON structure:

        {{
          "ai_summary": "string",
          "skill_flow": "string",
          "resources": {{
            "Skill Name": [
              {{
                "title": "string",
                "url": "string"
              }}
            ]
          }}
        }}

        RULES:
        - ONLY return JSON
        - NO markdown
        - NO extra text
        - Use valid JSON-like format (JSON5 allowed)
        """

        GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=GEMINI_API_KEY)

        model = genai.GenerativeModel("models/gemini-2.5-pro")

        try:
            gpt_response = model.generate_content(prompt)
            raw = gpt_response.text

            # Remove markdown wrappers if Gemini adds them
            cleaned = (
                raw.replace("```json", "")
                    .replace("```", "")
                    .strip()
            )

            # --- Parse using JSON5 (supports unquoted keys, commas, etc.) ---
            try:
                parsed = json5.loads(cleaned)
            except Exception as e:
                return Response({
                    "error": "JSON parse failed",
                    "reason": str(e),
                    "raw_output": cleaned
                }, status=500)

            return Response(parsed, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


from accounts.models import *
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from skills.models import *

class JobSummeryApiView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):

        # Total Active Jobs
        total_active_jobs = Job.objects.filter(is_active=True).count()

        # Total Companies
        total_companies = User.objects.filter(
            roles__name__iexact="Company"
        ).distinct().count()

        # Total Remote Jobs
        total_remote_jobs = Job.objects.filter(
            is_active=True,
            employment_mode__contains=["Remote"]
        ).count()

        # Jobs posted in last week
        one_week_ago = timezone.now() - timedelta(days=7)
        jobs_last_week = Job.objects.filter(
            created_at__gte=one_week_ago,
            is_active=True
        ).count()

        # ---------------------------------------
        # 🔥 ONE TOP COMPANY (Most Job Posts)
        # ---------------------------------------
        top_company = (
            CompanyProfile.objects
            .annotate(job_post_count=Count("jobs"))
            .order_by("-job_post_count")
            .values("id", "company_name", "job_post_count")
            .first()  # ← Only 1 result
        )

        recent_jobs = (
                Job.objects.filter(is_active=True)
                .order_by("-created_at")[:6]
                .values(
                    "id",
                    "title",
                    "location",
                    "salary_min",
                    "salary_max",
                    "salary_currency",
                    "company_profile",
                    "company_profile__company_name",
                    "created_at",
                )
            )
        skill_categories = SkillCategory.objects.all().values("id", "name")

        return Response({
            "success": True,
            "data":{
            "total_active_jobs": total_active_jobs,
            "total_companies": total_companies,
            "total_remote_jobs": total_remote_jobs,
            "jobs_posted_last_week": jobs_last_week,
            "top_company_by_job_posts": top_company or {},
            "recent_jobs": recent_jobs,
            "skill_categories": skill_categories
            }
        })
    


class MyApplicationsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # all jobs the user applied to
        applications = Application.objects.filter(user=user).order_by("-applied_at")

        serializer = MyApplicationSerializer(applications, many=True)

        return Response({
            "success": True,
            "total": applications.count(),
            "applications": serializer.data
        })
    

class RecommendedJobsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # -----------------------------
        # 1. Recent Jobs (last 10)
        # -----------------------------
        recent_jobs_qs = Job.objects.filter(
            is_active=True
        ).order_by("-created_at")[:10]

        recent_jobs = []
        for job in recent_jobs_qs:
            data = JobSerializer(job).data

            try:
                data["match"] = calculate_matching_score(user, job)
            except:
                data["match"] = None

            recent_jobs.append(data)

        # -----------------------------
        # 2. Best Matches (High match scores)
        # -----------------------------
        all_jobs = Job.objects.filter(is_active=True)

        match_list = []
        for job in all_jobs:
            try:
                score = calculate_matching_score(user, job)
                match_list.append({
                    "job": JobSerializer(job).data,
                    "match_score": score.get("final_score", 0)
                })
            except:
                continue

        # Sort by match score
        match_list_sorted = sorted(
            match_list,
            key=lambda x: x["match_score"],
            reverse=True
        )

        # Extract only job data
        best_matches = [
            {**m["job"], "match": {"final_score": m["match_score"]}}
            for m in match_list_sorted[:10]
        ]

        # -----------------------------
        # 3. Recommendation Logic
        # -----------------------------
        # Top 5 recommended jobs (based on best match)
        top_recommended = best_matches[:5]

        return Response({
            "success": True,
            "recent_jobs": recent_jobs,
            "best_matches": best_matches,
            "recommended": top_recommended
        })





from django.shortcuts import get_object_or_404
from resources.models import LearningResource
class SkillFlowAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        job_data = request.data.get('job')
        if not job_data:
            return Response({"error": "Job data is required"}, status=400)
        
        required_skills = job_data.get('required_skills', [])
        if not required_skills:
            return Response({"error": "Required skills are not provided in the job data"}, status=400)
        
        matched_skills = []
        missing_skills = []
        
        # Fetch existing skills from the database that match the job's required skills
        skills = Skill.objects.filter(id__in=[skill['id'] for skill in required_skills])
        
        for skill in skills:
            matched_skills.append(skill.name)
        
        # Identify missing skills
        missing_skills = list(set([skill['name'] for skill in required_skills]) - set(matched_skills))
        
        # Now, fetch learning resources related to the missing skills
        resources = {}
        for missing_skill in missing_skills:
            skill = get_object_or_404(Skill, name=missing_skill)
            resources[missing_skill] = LearningResource.objects.filter(related_skills=skill)
        
        # Generate the skill flow (roadmap)
        skill_flow = self.generate_skill_flow(missing_skills)

        # Return response containing matched and missing skills along with the resources
        return Response({
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "resources": resources,
            "skill_flow": skill_flow
        })

    def generate_skill_flow(self, missing_skills):        
        skill_flow = []
        for skill in missing_skills:
            skill_flow.append({
                "title": f"Learn {skill}",
                "duration_weeks": 4,  # Assume 4 weeks per skill as an example
                "topics": [f"Basic {skill} Concepts", f"Intermediate {skill} Techniques", f"Advanced {skill}"],
                "projects": [f"Build a {skill} Project", f"Contribute to an Open Source {skill} Project"],
                "tips": f"Practice {skill} regularly, and follow tutorials for real-world projects."
            })
        
        return skill_flow