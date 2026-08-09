from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import LogFile


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_log(request):

    uploaded_file = request.FILES.get("file")

    if not uploaded_file:
        return Response(
            {
                "success": False,
                "message": "No file provided."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    allowed_extensions = [".log", ".txt", ".csv", ".json"]

    filename = uploaded_file.name.lower()

    if not any(filename.endswith(ext) for ext in allowed_extensions):
        return Response(
            {
                "success": False,
                "message": "Unsupported file type. Allowed: .log, .txt, .csv, .json"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    log_file = LogFile.objects.create(
        user=request.user,
        file=uploaded_file,
        original_filename=uploaded_file.name,
        status="uploaded"
    )

    return Response(
        {
            "success": True,
            "message": "File uploaded successfully.",
            "file": {
                "id": log_file.id,
                "name": log_file.original_filename,
                "size": uploaded_file.size,
                "status": log_file.status,
                "uploaded_at": log_file.uploaded_at,
            }
        },
        status=status.HTTP_201_CREATED
    )