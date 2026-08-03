import json
import os
import sys
from pathlib import Path

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import LogFileSerializer
from analysis.models import Analysis

# Add project root to Python path
PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

from backend_ai_integration.parser import parse_log
from backend_ai_integration.prompt_builder import PromptBuilder
from backend_ai_integration.gemini_client import GeminiClient


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_log(request):
    """
    Upload a log file, analyze it using Gemini AI,
    save the analysis, and return the response.
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

    if not serializer.is_valid():
        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Save uploaded file
    log = serializer.save(
        user=request.user,
        original_filename=uploaded_file.name,
        file_size=uploaded_file.size,
        file_type=os.path.splitext(uploaded_file.name)[1]
        .lower()
        .replace(".", ""),
    )

    try:
        # Read log file
        with open(log.log_file.path, "r", encoding="utf-8", errors="ignore") as file:
            log_content = file.read()

        # Parse log
        parsed_log = parse_log(log.log_file.path)

        # Build AI prompt
        ai_prompt = PromptBuilder.build(parsed_log)

        # Analyze using Gemini
        gemini = GeminiClient()
        ai_result = gemini.analyze(ai_prompt)

        if not ai_result["success"]:
            return Response(
                {
                    "success": False,
                    "message": "Gemini AI analysis failed.",
                    "error": ai_result["error"],
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Parse Gemini JSON response
        response_text = (
            ai_result["response"]
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        try:
            ai_json = json.loads(response_text)
        except json.JSONDecodeError:
            ai_json = {
                "Root Cause": "",
                "Severity": "Unknown",
                "Recommended Fix": "",
            }

        # Save analysis
        analysis, created = Analysis.objects.update_or_create(
            log=log,
            defaults={
                "language": parsed_log["language"],
                "error_type": parsed_log["error"],
                "severity": ai_json.get("Severity", "Unknown"),
                "root_cause": ai_json.get("Root Cause", ""),
                "recommendation": ai_json.get("Recommended Fix", ""),
                "ai_response": ai_result["response"],
            },
        )

        return Response(
            {
                "success": True,
                "message": "Log uploaded and analyzed successfully.",
                "log": serializer.data,
                "analysis": {
                    "id": analysis.id,
                    "language": analysis.language,
                    "error_type": analysis.error_type,
                    "severity": analysis.severity,
                    "root_cause": analysis.root_cause,
                    "recommendation": analysis.recommendation,
                    "ai_response": analysis.ai_response,
                    "created_at": analysis.created_at,
                },
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response(
            {
                "success": False,
                "message": "Analysis failed.",
                "error": str(e),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )