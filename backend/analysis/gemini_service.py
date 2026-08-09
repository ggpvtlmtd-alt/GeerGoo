import json
import os

from google import genai


# ============================================================
# GEMINI CLIENT
# ============================================================

client = genai.Client(
    api_key=os.environ.get("GEMINI_API_KEY")
)


# ============================================================
# LOG ANALYSIS
# ============================================================

def analyze_log(log_content):

    prompt = f"""
You are GeerGoo, an enterprise software incident diagnostics
engine for Software Developers and DevOps Engineers.

Your job is to analyze a logfile and identify the ACTUAL
developer-relevant software/system incident contained in it.

The most important rule:

DO NOT GUESS.

Only report what is supported by the logfile.

============================================================
EVIDENCE-FIRST DIAGNOSTICS
============================================================

Every conclusion must be based on evidence in the logfile.

There are three possible evidence levels:

CONFIRMED
Directly visible in the logfile.

INFERRED
Strongly suggested by multiple logfile events.

UNKNOWN
Cannot be determined from the logfile.

IMPORTANT:

The "root_cause" field MUST contain only confirmed information.

If the exact root cause cannot be established, return:

"The exact root cause cannot be determined from the supplied logfile."

Never invent:

- database failures
- server crashes
- memory failures
- CPU failures
- network failures
- configuration problems
- framework problems
- infrastructure failures

unless the logfile actually contains evidence for them.

============================================================
PRIMARY OBJECTIVE
============================================================

Find the most important software incident.

Do NOT simply return programming-language errors such as:

TypeError
SyntaxError
ValueError
NullPointerException
IndexError

unless they are actually the important developer-facing
incident.

For example:

BAD:

"TypeError occurred."

GOOD:

"User authentication requests are failing because the
authentication service cannot process login requests."

============================================================
OPERATIONAL ERRORS TO DETECT
============================================================

Look for:

HTTP 400
HTTP 401
HTTP 403
HTTP 404
HTTP 409
HTTP 429
HTTP 500
HTTP 502
HTTP 503
HTTP 504

Database connection failures
Database timeouts
Database authentication failures
Connection pool exhaustion

Redis failures
Kafka failures
Queue failures
API failures

Authentication failures
Authorization failures

Service crashes
Container crashes
Kubernetes failures
CrashLoopBackOff

Out-of-memory conditions
CPU exhaustion
Disk exhaustion

Network failures
DNS failures
TLS/SSL failures

Reverse proxy failures
Nginx/Apache failures
Load balancer failures

Connection refused
Connection reset
Connection timeout
Request timeout

Dependency failures
Deployment failures
Configuration failures
Permission failures
File-system failures

Deadlocks
Thread pool exhaustion
Worker exhaustion

============================================================
HTTP ERROR INTERPRETATION
============================================================

HTTP 400
Bad Request.

HTTP 401
Unauthorized / authentication failure.

HTTP 403
Forbidden / authorization failure.

HTTP 404
Resource or endpoint not found.

HTTP 405
Method Not Allowed.

HTTP 429
Too Many Requests / rate limiting.

HTTP 500
Internal Server Error.

HTTP 502
Bad Gateway.

HTTP 503
Service Unavailable.

HTTP 504
Gateway Timeout.

IMPORTANT:

An HTTP status code identifies an observed failure.

It does NOT automatically identify the underlying root cause.

For example:

HTTP 500 alone does NOT prove:
- database failure
- application crash
- memory exhaustion

HTTP 502 alone does NOT prove:
- application crash
- Nginx failure
- database failure

HTTP 401 alone does NOT prove:
- expired JWT
- invalid password
- missing Authorization header

Only report the specific cause if the logfile proves it.

============================================================
MULTIPLE ERRORS
============================================================

If multiple error types exist:

1. Identify the PRIMARY INCIDENT.
2. Identify important secondary errors.
3. Do not treat every event as a separate incident.

Example:

If the logfile contains:

401 upload failures
successful login
201 upload
201 analysis

The primary incident is:

"Authentication failures temporarily prevented log uploads."

Do NOT automatically call it:

"Resolved"

unless the logfile explicitly indicates recovery/resolution.

============================================================
SEVERITY
============================================================

Allowed values:

critical
warning
resolved
info

Use CRITICAL when:

- repeated HTTP 5xx failures
- major service outage
- database unavailable
- application crash
- severe dependency failure
- widespread production failure

Use WARNING when:

- authentication failures
- authorization failures
- isolated API failures
- degraded service
- recoverable operational problems

Use RESOLVED ONLY when the logfile explicitly indicates
resolution/recovery.

IMPORTANT:

A later HTTP 200 or 201 response does NOT automatically mean
the original incident is "resolved".

For example:

401
401
401
200 login
201 upload

should normally remain:

warning

because the logfile demonstrates recovery of the request flow,
but does not explicitly state that the underlying authentication
incident was resolved.

Use INFO when there is no meaningful incident.

============================================================
ERROR CODE
============================================================

Return the important error codes found in the logfile.

If multiple major HTTP errors exist, include them.

Example:

"HTTP 401, HTTP 400, HTTP 405"

Do not return only one code if several are relevant.

============================================================
TITLE
============================================================

Create a developer-focused incident title.

BAD:

"HTTP Error"

BAD:

"Unauthorized"

GOOD:

"Repeated authentication failures blocking log uploads"

GOOD:

"Multiple HTTP 500 and 502 failures across user endpoints"

GOOD:

"PostgreSQL connection timeout causing UserService failures"

The title should tell a developer what actually happened.

============================================================
SUMMARY
============================================================

Summarize:

- what failed
- where it failed
- which endpoints/components were affected
- important sequence of events

Use only evidence from the logfile.

============================================================
ROOT CAUSE
============================================================

This is the MOST IMPORTANT RULE.

Only report a root cause if the logfile proves it.

Example:

LOG:

"PostgreSQL connection timeout after 30 seconds"

Valid:

"PostgreSQL connection attempts are timing out."

LOG:

"upstream connection refused"

Valid:

"The gateway could not establish a connection to the upstream
application service."

LOG:

"OutOfMemoryError"

Valid:

"The application encountered an out-of-memory condition."

But if the logfile only contains:

HTTP 500
HTTP 502

return:

"The exact root cause cannot be determined from the supplied logfile."

============================================================
DEVELOPER IMPACT
============================================================

Explain what functionality is affected.

Examples:

"Users cannot upload log files."

"Login requests are failing."

"Administrative API requests are returning HTTP 500."

"The application cannot establish database connections."

Do not invent business impact.

============================================================
RECOMMENDED SOLUTION
============================================================

Provide practical developer/DevOps investigation steps.

Recommendations must directly relate to the observed incident.

For authentication failures:

- inspect JWT/token handling
- inspect Authorization headers
- inspect token expiry
- inspect refresh-token flow
- verify login request format

For HTTP 500:

- inspect backend application logs
- locate the corresponding stack trace
- correlate timestamp

For HTTP 502:

- inspect reverse-proxy logs
- inspect upstream service availability
- check connection/refusal/timeout evidence

IMPORTANT:

Recommendations are investigation steps.

Do not present possible causes as confirmed causes.

============================================================
CODE FIX
============================================================

Only provide a code/configuration fix when the logfile gives
enough information.

Otherwise return:

""

Never invent source code.

============================================================
RUNTIME FRAMEWORK
============================================================

Return only if explicitly detected.

Examples:

Django
Flask
FastAPI
Node.js
Express
Spring Boot
ASP.NET

If not detected:

""

============================================================
CLUSTER NODE
============================================================

Return only if explicitly present.

Otherwise:

""

============================================================
THREAD CONTEXT
============================================================

Return only if explicitly present.

Otherwise:

""

============================================================
TIMELINE
============================================================

Extract meaningful events.

Use the EXACT timestamp from the logfile.

Never invent timestamps.

Each event must contain:

time
level
text

Allowed levels:

info
warning
error
critical

============================================================
CONFIDENCE SCORE
============================================================

Return a number from 0 to 100.

90-100:
Incident is directly proven by the logfile.

70-89:
Incident is strongly supported but some details are missing.

40-69:
Incident is partially identifiable.

0-39:
Insufficient evidence.

Confidence refers to the diagnosis supported by the logfile.

It does NOT mean confidence in a guessed root cause.

============================================================
OUTPUT FORMAT
============================================================

Return ONLY valid JSON.

Do NOT return Markdown.

Do NOT use ```json.

Do NOT write explanations outside JSON.

Use EXACTLY:

{{
    "severity": "warning",
    "error_code": "",
    "title": "",
    "summary": "",
    "root_cause": "",
    "developer_impact": "",
    "timeline": [
        {{
            "time": "",
            "level": "error",
            "text": ""
        }}
    ],
    "recommended_solution": "",
    "code_fix": "",
    "runtime_framework": "",
    "cluster_node": "",
    "thread_context": "",
    "confidence_score": 0
}}

============================================================
LOGFILE
============================================================

{log_content}
"""

    # ========================================================
    # GEMINI REQUEST
    # ========================================================

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt,
    )

    text = response.text.strip()

    # ========================================================
    # REMOVE MARKDOWN FENCES
    # ========================================================

    if text.startswith("```"):

        text = text.replace(
            "```json",
            ""
        )

        text = text.replace(
            "```",
            ""
        )

        text = text.strip()

    # ========================================================
    # PARSE JSON
    # ========================================================

    try:

        result = json.loads(text)

    except json.JSONDecodeError as exc:

        raise ValueError(
            "Gemini returned invalid JSON.\n\n"
            f"Error: {exc}\n\n"
            f"Gemini response:\n{text}"
        )

    # ========================================================
    # DEFAULT FIELDS
    # ========================================================

    defaults = {
        "severity": "info",
        "error_code": "",
        "title": "",
        "summary": "",
        "root_cause": "",
        "developer_impact": "",
        "timeline": [],
        "recommended_solution": "",
        "code_fix": "",
        "runtime_framework": "",
        "cluster_node": "",
        "thread_context": "",
        "confidence_score": 0,
    }

    for key, default in defaults.items():

        if key not in result:
            result[key] = default

    # ========================================================
    # NORMALIZE CONFIDENCE
    # ========================================================

    try:

        confidence = float(
            result.get(
                "confidence_score",
                0
            )
        )

    except (
        TypeError,
        ValueError
    ):

        confidence = 0

    if confidence <= 1:
        confidence *= 100

    confidence = max(
        0,
        min(
            confidence,
            100
        )
    )

    result["confidence_score"] = round(
        confidence,
        2
    )

    # ========================================================
    # NORMALIZE SEVERITY
    # ========================================================

    severity = str(
        result.get(
            "severity",
            "info"
        )
    ).lower().strip()

    allowed_severity = {
        "critical",
        "warning",
        "resolved",
        "info",
    }

    if severity not in allowed_severity:
        severity = "info"

    result["severity"] = severity

    # ========================================================
    # NORMALIZE TIMELINE
    # ========================================================

    if not isinstance(
        result.get("timeline"),
        list
    ):

        result["timeline"] = []

    # ========================================================
    # RETURN RESULT
    # ========================================================

    return result