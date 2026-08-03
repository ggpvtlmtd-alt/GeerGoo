from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Analysis
from .serializers import AnalysisSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def history(request):
    """
    Return all analyses for the logged-in user.
    """

    analyses = Analysis.objects.filter(
        log__user=request.user
    ).order_by("-created_at")

    serializer = AnalysisSerializer(analyses, many=True)

    return Response(
        {
            "success": True,
            "history": serializer.data
        }
    )
from django.shortcuts import get_object_or_404


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def analysis_detail(request, analysis_id):
    """
    Return a single analysis belonging to the logged-in user.
    """

    analysis = get_object_or_404(
        Analysis,
        id=analysis_id,
        log__user=request.user
    )

    serializer = AnalysisSerializer(analysis)

    return Response(
        {
            "success": True,
            "analysis": serializer.data
        }
    )