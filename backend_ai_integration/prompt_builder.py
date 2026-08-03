class PromptBuilder:

    @staticmethod
    def build(parsed):

        return f"""
You are an expert Software Reliability Engineer.

Analyze the following application log.

Language:
{parsed['language']}

Error:
{parsed['error']}

Source File:
{parsed['file']}

Line Number:
{parsed['line']}

Stack Trace:
{parsed['stack_trace']}

Return:

1. Root Cause
2. Severity
3. Explanation
4. Recommended Fix
5. Best Practices
6. Confidence Score

Respond in JSON.
"""