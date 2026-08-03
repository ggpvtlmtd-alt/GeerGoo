from django.db import models
from logs.models import LogFile


class Analysis(models.Model):
    log = models.OneToOneField(
        LogFile,
        on_delete=models.CASCADE,
        related_name="analysis"
    )

    language = models.CharField(max_length=50)

    error_type = models.CharField(max_length=200)

    severity = models.CharField(max_length=20)

    root_cause = models.TextField()

    recommendation = models.TextField()

    ai_response = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.error_type} ({self.severity})"