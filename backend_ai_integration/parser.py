import re
from pathlib import Path


class LogParser:
    """
    Parses log files and extracts useful information.
    """

    def __init__(self, file_path):
        self.file_path = file_path

    def parse(self):

        with open(self.file_path, "r", encoding="utf-8", errors="ignore") as file:
            log = file.read()

        return {
            "language": self.detect_language(log),
            "error": self.extract_error(log),
            "file": self.extract_file(log),
            "line": self.extract_line(log),
            "stack_trace": self.extract_stack(log)
        }

    # -----------------------------
    # Detect language/framework
    # -----------------------------

    def detect_language(self, log):

        if "java.lang." in log:
            return "Java"

        elif "Traceback (most recent call last)" in log:
            return "Python"

        elif "npm ERR!" in log or "Node.js" in log:
            return "Node.js"

        elif "docker" in log.lower():
            return "Docker"

        elif "SQLSTATE" in log or "ORA-" in log:
            return "SQL"

        return "Unknown"

    # -----------------------------
    # Extract error
    # -----------------------------

    def extract_error(self, log):

        patterns = [

            r"(java\.lang\.[A-Za-z0-9_]+)",

            r"([A-Za-z]+Error)",

            r"([A-Za-z]+Exception)",

            r"(SQLSTATE\[[^\]]+\])",

            r"(ORA-\d+)"
        ]

        for pattern in patterns:

            match = re.search(pattern, log)

            if match:
                return match.group(1)

        return "Unknown Error"

    # -----------------------------
    # Extract source file
    # -----------------------------

    def extract_file(self, log):

        match = re.search(r"\((.+?):(\d+)\)", log)

        if match:
            return Path(match.group(1)).name

        return "Unknown"

    # -----------------------------
    # Extract line number
    # -----------------------------

    def extract_line(self, log):

        match = re.search(r"\((.+?):(\d+)\)", log)

        if match:
            return int(match.group(2))

        return None

    # -----------------------------
    # Stack trace
    # -----------------------------

    def extract_stack(self, log):

        lines = log.splitlines()

        return "\n".join(lines[:25])