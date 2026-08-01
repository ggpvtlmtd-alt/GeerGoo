import os

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import LogFileSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_log(request):
    """
    Upload a log file for AI analysis.
    """

    uploaded_file = request.FILES.get("log_file")

    if not uploaded_file:
        return Response(
            {
                "success": False,
                "message": "No log file uploaded."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    serializer = LogFileSerializer(data=request.data)

    if serializer.is_valid():

        serializer.save(
            user=request.user,
            original_filename=uploaded_file.name,
            file_size=uploaded_file.size,
            file_type=os.path.splitext(uploaded_file.name)[1]
            .lower()
            .replace(".", ""),
        )

        return Response(
            {
                "success": True,
                "message": "Log uploaded successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(
        {
            "success": False,
            "errors": serializer.errors,
        },
        status=status.HTTP_400_BAD_REQUEST,
    )