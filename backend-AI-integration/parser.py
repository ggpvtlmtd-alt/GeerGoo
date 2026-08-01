import re


class LogParser:
    """
    Parses log files and extracts useful information
    for AI analysis.
    """

    def __init__(self, file_path):
        self.file_path = file_path

    def read_log(self):
        """
        Read log file safely.
        """
        with open(self.file_path, "r", encoding="utf-8", errors="ignore") as file:
            return file.read()

    def detect_language(self, text):
        """
        Detect programming language/framework.
        """

        if "java.lang." in text:
            return "Java"

        elif "Traceback (most recent call last)" in text:
            return "Python"

        elif "TypeError" in text or "ReferenceError" in text:
            return "Node.js"

        elif "Exception" in text:
            return "Java"

        return "Unknown"

    def extract_error(self, text):
        """
        Extract main error.
        """

        patterns = [
            r"(java\.\w+\.\w+)",
            r"(\w+Error)",
            r"(\w+Exception)",
        ]

        for pattern in patterns:
            match = re.search(pattern, text)

            if match:
                return match.group(1)

        return "Unknown Error"

    def extract_file(self, text):
        """
        Extract filename.
        """

        match = re.search(
            r'([A-Za-z0-9_]+\.(java|py|js|ts|cpp|c))',
            text
        )

        if match:
            return match.group(1)

        return None

    def extract_line(self, text):
        """
        Extract line number.
        """

        match = re.search(
            r":(\d+)",
            text
        )

        if match:
            return int(match.group(1))

        return None

    def extract_stack_trace(self, text):
        """
        Return first few lines of stack trace.
        """

        lines = text.splitlines()

        return "\n".join(lines[:20])

    def parse(self):
        """
        Main parser.
        """

        text = self.read_log()

        return {
            "language": self.detect_language(text),
            "error": self.extract_error(text),
            "file": self.extract_file(text),
            "line": self.extract_line(text),
            "stack_trace": self.extract_stack_trace(text),
            "raw_log": text,
        }


if __name__ == "__main__":

    parser = LogParser("test_logs/java_error.log")

    result = parser.parse()

    print(result)