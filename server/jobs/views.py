from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer


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

            return Response({"success": True, "count": jobs.count(), "jobs": JobSerializer(jobs, many=True).data}   )

        # DETAIL PAGE
        try:
            job = Job.objects.get(id=pk)
        except Job.DoesNotExist:
            return Response({"error": "Job not found"}, status=404)

        return Response(JobSerializer(job).data)

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
