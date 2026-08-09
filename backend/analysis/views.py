import os
import time

from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from logs.models import LogFile

from .gemini_service import analyze_log
from .models import AnalysisResult


# ============================================================
# ANALYZE UPLOADED LOG
# POST /api/analysis/analyze/<log_id>/
# ============================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def analyze_uploaded_log(request, log_id):

    start_time = time.time()

    # --------------------------------------------------------
    # Get only the logged-in user's uploaded file
    # --------------------------------------------------------

    log_file = get_object_or_404(
        LogFile,
        id=log_id,
        user=request.user,
    )

    try:

        # ----------------------------------------------------
        # Read uploaded file
        # ----------------------------------------------------

        with log_file.file.open("rb") as uploaded_file:
            content = uploaded_file.read()

        # ----------------------------------------------------
        # Convert bytes -> text
        # ----------------------------------------------------

        log_content = content.decode(
            "utf-8",
            errors="replace",
        )

        if not log_content.strip():

            return Response(
                {
                    "success": False,
                    "message": "The uploaded log file is empty.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ----------------------------------------------------
        # Send log to Gemini
        # ----------------------------------------------------

        result = analyze_log(log_content)

        # ----------------------------------------------------
        # Calculate latency
        # ----------------------------------------------------

        analysis_latency = time.time() - start_time

        # ----------------------------------------------------
        # Confidence
        #
        # Gemini may return:
        # 0.95
        #
        # or:
        # 95
        #
        # Convert everything to percentage.
        # ----------------------------------------------------

        confidence = result.get(
            "confidence_score",
            0,
        )

        try:
            confidence = float(confidence)
        except (TypeError, ValueError):
            confidence = 0

        if confidence <= 1:
            confidence = confidence * 100

        # Keep confidence within 0-100
        confidence = max(
            0,
            min(100, confidence),
        )

        # ----------------------------------------------------
        # Save analysis result
        # ----------------------------------------------------

        analysis = AnalysisResult.objects.create(

            user=request.user,

            log_file=log_file,

            severity=result.get(
                "severity",
                "info",
            ),

            error_code=result.get(
                "error_code",
                "",
            ),

            title=result.get(
                "title",
                "Log Analysis",
            ),

            summary=result.get(
                "summary",
                "",
            ),

            root_cause=result.get(
                "root_cause",
                "",
            ),

            recommended_solution=result.get(
                "recommended_solution",
                "",
            ),

            code_fix=result.get(
                "code_fix",
                "",
            ),

            runtime_framework=result.get(
                "runtime_framework",
                "",
            ),

            cluster_node=result.get(
                "cluster_node",
                "",
            ),

            thread_context=result.get(
                "thread_context",
                "",
            ),

            confidence_score=confidence,

            analysis_latency=analysis_latency,

            timeline=result.get(
                "timeline",
                [],
            ),
        )

        # ----------------------------------------------------
        # Return analysis
        # ----------------------------------------------------

        return Response(
            {
                "success": True,

                "message":
                    "Log analyzed successfully.",

                "analysis": {
                    "id":
                        analysis.id,

                    "log_file_id":
                        log_file.id,

                    "severity":
                        analysis.severity,

                    "error_code":
                        analysis.error_code,

                    "title":
                        analysis.title,

                    "summary":
                        analysis.summary,

                    "root_cause":
                        analysis.root_cause,

                    "timeline":
                        analysis.timeline,

                    "recommended_solution":
                        analysis.recommended_solution,

                    "code_fix":
                        analysis.code_fix,

                    "runtime_framework":
                        analysis.runtime_framework,

                    "cluster_node":
                        analysis.cluster_node,

                    "thread_context":
                        analysis.thread_context,

                    "confidence_score":
                        analysis.confidence_score,

                    "analysis_latency":
                        analysis.analysis_latency,

                    "created_at":
                        analysis.created_at,
                },
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:

        print(
            "Gemini Analysis Error:",
            str(e),
        )

        return Response(
            {
                "success": False,

                "message":
                    "Gemini analysis failed.",

                "error":
                    str(e),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# ============================================================
# GET SINGLE ANALYSIS
# GET /api/analysis/<analysis_id>/
# ============================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_analysis(request, analysis_id):

    # --------------------------------------------------------
    # Only allow user to see their own analysis
    # --------------------------------------------------------

    analysis = get_object_or_404(
        AnalysisResult,
        id=analysis_id,
        user=request.user,
    )

    return Response(
        {
            "success": True,

            "analysis": {

                "id":
                    analysis.id,

                "log_file_id":
                    analysis.log_file_id,

                "severity":
                    analysis.severity,

                "error_code":
                    analysis.error_code,

                "title":
                    analysis.title,

                "summary":
                    analysis.summary,

                "root_cause":
                    analysis.root_cause,

                "timeline":
                    analysis.timeline,

                "recommended_solution":
                    analysis.recommended_solution,

                "code_fix":
                    analysis.code_fix,

                "runtime_framework":
                    analysis.runtime_framework,

                "cluster_node":
                    analysis.cluster_node,

                "thread_context":
                    analysis.thread_context,

                "confidence_score":
                    analysis.confidence_score,

                "analysis_latency":
                    analysis.analysis_latency,

                "created_at":
                    analysis.created_at,
            },
        },

        status=status.HTTP_200_OK,
    )


# ============================================================
# GET ANALYSIS HISTORY
# GET /api/analysis/
# ============================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_analysis_history(request):

    # --------------------------------------------------------
    # Get only this user's analyses
    # Newest first
    # --------------------------------------------------------

    analyses = (
        AnalysisResult.objects
        .filter(
            user=request.user
        )
        .select_related(
            "log_file"
        )
        .order_by(
            "-created_at"
        )
    )

    history = []

    # --------------------------------------------------------
    # Build history response
    # --------------------------------------------------------

    for analysis in analyses:

        log_file = analysis.log_file

        # ----------------------------------------------------
        # Filename
        # ----------------------------------------------------

        filename = ""

        if log_file:

            try:

                if (
                    hasattr(log_file, "file")
                    and log_file.file
                ):
                    filename = os.path.basename(
                        log_file.file.name
                    )

            except Exception:
                filename = ""

        # Fallback
        if not filename:

            filename = (
                f"Log File #{analysis.log_file_id}"
            )

        # ----------------------------------------------------
        # File size
        # ----------------------------------------------------

        size = 0

        if log_file:

            try:

                if (
                    hasattr(log_file, "file")
                    and log_file.file
                ):
                    size = log_file.file.size

            except Exception:
                size = 0

        # ----------------------------------------------------
        # Convert bytes to readable size
        # ----------------------------------------------------

        if size < 1024:

            size_display = (
                f"{size} B"
            )

        elif size < 1024 * 1024:

            size_display = (
                f"{size / 1024:.1f} KB"
            )

        else:

            size_display = (
                f"{size / (1024 * 1024):.1f} MB"
            )

        # ----------------------------------------------------
        # Add analysis
        # ----------------------------------------------------

        history.append(

            {
                "id":
                    analysis.id,

                "log_file_id":
                    analysis.log_file_id,

                "filename":
                    filename,

                "size":
                    size_display,

                "status":
                    analysis.severity,

                "severity":
                    analysis.severity,

                "error_code":
                    analysis.error_code,

                "title":
                    analysis.title,

                "summary":
                    analysis.summary,

                "root_cause":
                    analysis.root_cause,

                "timeline":
                    analysis.timeline,

                "recommended_solution":
                    analysis.recommended_solution,

                "code_fix":
                    analysis.code_fix,

                "runtime_framework":
                    analysis.runtime_framework,

                "cluster_node":
                    analysis.cluster_node,

                "thread_context":
                    analysis.thread_context,

                "confidence_score":
                    analysis.confidence_score,

                "analysis_latency":
                    analysis.analysis_latency,

                "created_at":
                    analysis.created_at,
            }
        )

    # --------------------------------------------------------
    # Return history
    # --------------------------------------------------------

    return Response(
        {
            "success": True,

            "count":
                len(history),

            "analyses":
                history,
        },

        status=status.HTTP_200_OK,
    )