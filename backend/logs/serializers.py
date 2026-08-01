from rest_framework import serializers
from .models import LogFile


class LogFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogFile
        fields = "__all__"
        read_only_fields = [
            "id",
            "user",
            "file_size",
            "file_type",
            "status",
            "uploaded_at",
            "updated_at",
        ]

    def validate_log_file(self, value):
        """
        Allow only .log and .txt files.
        """

        allowed_extensions = [".log", ".txt"]

        filename = value.name.lower()

        if not any(filename.endswith(ext) for ext in allowed_extensions):
            raise serializers.ValidationError(
                "Only .log and .txt files are allowed."
            )

        # Maximum file size = 10 MB
        max_size = 10 * 1024 * 1024

        if value.size > max_size:
            raise serializers.ValidationError(
                "File size must not exceed 10 MB."
            )

        return value