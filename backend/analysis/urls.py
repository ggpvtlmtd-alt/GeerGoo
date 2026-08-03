from django.urls import path
from . import views

urlpatterns = [
    path("history/", views.history, name="history"),

    path(
        "analysis/<int:analysis_id>/",
        views.analysis_detail,
        name="analysis-detail",
    ),
]