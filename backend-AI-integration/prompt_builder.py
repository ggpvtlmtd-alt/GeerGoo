class PromptBuilder:
    """
    Builds a prompt for the AI model using parsed log information.
    """

    @staticmethod
    def build(parsed_log):
        return f"""
You are an expert Software Reliability Engineer.

Analyze the following application log.

Programming Language:
{parsed_log['language']}

Error:
{parsed_log['error']}

Source File:
{parsed_log['file']}

Line Number:
{parsed_log['line']}

Stack Trace:
{parsed_log['stack_trace']}

Please provide:

1. Root Cause
2. Severity (Low/Medium/High/Critical)
3. Explanation
4. Recommended Fix
5. Best Practices
6. Confidence Score (0-100)

Return the response in professional English.
"""