from django.db import models
from django.conf import settings


class AnalysisResult(models.Model):

    SEVERITY_CHOICES = [
        ("critical", "Critical"),
        ("warning", "Warning"),
        ("resolved", "Resolved"),
        ("info", "Info"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="analysis_results",
    )

    log_file = models.ForeignKey(
        "logs.LogFile",
        on_delete=models.CASCADE,
        related_name="analysis_results",
    )

    severity = models.CharField(
        max_length=20,
        choices=SEVERITY_CHOICES,
        default="info",
    )

    error_code = models.CharField(
        max_length=100,
        blank=True,
    )

    title = models.CharField(
        max_length=255,
    )

    summary = models.TextField(
        blank=True,
    )

    root_cause = models.TextField(
        blank=True,
    )

    recommended_solution = models.TextField(
        blank=True,
    )

    code_fix = models.TextField(
        blank=True,
    )

    runtime_framework = models.CharField(
        max_length=255,
        blank=True,
    )

    cluster_node = models.CharField(
        max_length=255,
        blank=True,
    )

    thread_context = models.CharField(
        max_length=255,
        blank=True,
    )

    confidence_score = models.FloatField(
        default=0,
    )

    analysis_latency = models.FloatField(
        default=0,
    )

    timeline = models.JSONField(
        default=list,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - {self.severity}"