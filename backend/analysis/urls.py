from django.urls import path

from . import views


urlpatterns = [

    # Analysis history
    path(
        "",
        views.get_analysis_history,
        name="analysis-history",
    ),

    # Analyze uploaded log
    path(
        "analyze/<int:log_id>/",
        views.analyze_uploaded_log,
        name="analyze-log",
    ),

    # Single analysis
    path(
        "<int:analysis_id>/",
        views.get_analysis,
        name="get-analysis",
    ),
]