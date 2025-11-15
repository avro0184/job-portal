from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import LearningResource, ResourceCategory
from .serializers import LearningResourceSerializer, ResourceCategorySerializer


# ---------------------------------------------------
# Resource Category List
# ---------------------------------------------------
class ResourceCategoryAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = ResourceCategory.objects.all()
        serializer = ResourceCategorySerializer(categories, many=True)
        return Response({"success": True, "categories": serializer.data})
    

# ---------------------------------------------------
# Learning Resource LIST + CREATE
# ---------------------------------------------------
class LearningResourceListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        List all learning resources
        """
        resources = LearningResource.objects.all().order_by("-created_at")
        serializer = LearningResourceSerializer(resources, many=True)
        return Response({"success": True, "resources": serializer.data})

    def post(self, request):
        """
        Create a new learning resource
        """
        serializer = LearningResourceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data}, status=201)

        return Response(serializer.errors, status=400)


# ---------------------------------------------------
# Learning Resource DETAIL + UPDATE + DELETE
# ---------------------------------------------------
class LearningResourceDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return LearningResource.objects.get(id=pk)
        except LearningResource.DoesNotExist:
            return None

    def get(self, request, pk):
        """
        Retrieve a single learning resource
        """
        resource = self.get_object(pk)
        if not resource:
            return Response({"error": "Resource not found"}, status=404)

        serializer = LearningResourceSerializer(resource)
        return Response({"success": True, "data": serializer.data})

    def put(self, request, pk):
        """
        Update a resource
        """
        resource = self.get_object(pk)
        if not resource:
            return Response({"error": "Resource not found"}, status=404)

        serializer = LearningResourceSerializer(resource, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": serializer.data})

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        """
        Delete a resource
        """
        resource = self.get_object(pk)
        if not resource:
            return Response({"error": "Resource not found"}, status=404)

        resource.delete()
        return Response({"success": True, "message": "Resource deleted"})
