from django.db import models
from django.conf import settings


class LogFile(models.Model):
    """
    Stores uploaded log files for AI analysis.
    """

    STATUS_CHOICES = [
        ("UPLOADED", "Uploaded"),
        ("PROCESSING", "Processing"),
        ("COMPLETED", "Completed"),
        ("FAILED", "Failed"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="logs"
    )

    title = models.CharField(
        max_length=200
    )

    original_filename = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    log_file = models.FileField(
        upload_to="logs/"
    )

    file_size = models.PositiveBigIntegerField()

    file_type = models.CharField(
        max_length=20
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="UPLOADED"
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "log_files"
        ordering = ["-uploaded_at"]
        verbose_name = "Log File"
        verbose_name_plural = "Log Files"

    def __str__(self):
        return f"{self.title} ({self.user.username})"