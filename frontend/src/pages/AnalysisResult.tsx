import { useEffect, useState } from "react";
import {
  Brain,
  Code,
  CheckCircle2,
  Download,
  Copy,
  Share2,
  ArrowLeft,
  Terminal,
  Clock,
  Server,
  Layers,
  FileText,
  Check,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/dashboard.css";

interface TimelineEvent {
  time?: string;
  level?: string;
  text?: string;
}

interface AnalysisData {
  id: number;
  log_file_id: number;
  severity: string;
  error_code: string;
  title: string;
  summary: string;
  root_cause: string;
  timeline: TimelineEvent[];
  recommended_solution: string;
  code_fix: string;
  runtime_framework: string;
  cluster_node: string;
  thread_context: string;
  confidence_score: number;
  analysis_latency: number;
  created_at: string;
}

function AnalysisResult() {
  const { analysisId } = useParams<{ analysisId: string }>();

  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!analysisId) {
        setError("Analysis ID is missing.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Please sign in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/analysis/${analysisId}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.detail ||
              "Unable to load analysis."
          );
        }

        setAnalysis(data.analysis);
      } catch (err) {
        console.error("Analysis fetch error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load analysis."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [analysisId]);

  const handleCopy = async () => {
    if (!analysis) return;

    const diagnosis = `
GeerGoo AI Diagnosis

Severity: ${analysis.severity}
Error Code: ${analysis.error_code || "N/A"}
Title: ${analysis.title}

Summary:
${analysis.summary}

Root Cause:
${analysis.root_cause}

Recommended Solution:
${analysis.recommended_solution}

Code Fix:
${analysis.code_fix || "No code fix provided."}

Runtime Framework:
${analysis.runtime_framework || "Not detected"}

Cluster Node:
${analysis.cluster_node || "Not detected"}

Thread Context:
${analysis.thread_context || "Not detected"}

Confidence:
${analysis.confidence_score}%
`;

    try {
      await navigator.clipboard.writeText(diagnosis);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="db-layout">
        <DashboardSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />

        <div className="db-main">
          <DashboardHeader />

          <div className="db-content">
            <div
              className="db-card"
              style={{
                padding: "60px",
                textAlign: "center",
              }}
            >
              <Brain
                size={28}
                style={{
                  marginBottom: "12px",
                  color: "#3B82F6",
                }}
              />

              <h2
                style={{
                  color: "#F8FAFC",
                  fontSize: "1rem",
                }}
              >
                Loading AI Diagnosis...
              </h2>

              <p
                style={{
                  color: "#64748B",
                  fontSize: "0.8rem",
                  marginTop: "6px",
                }}
              >
                Retrieving Gemini analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="db-layout">
        <DashboardSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />

        <div className="db-main">
          <DashboardHeader />

          <div className="db-content">
            <div
              className="db-card"
              style={{
                padding: "60px",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  color: "#F87171",
                  fontSize: "1rem",
                }}
              >
                Unable to Load Diagnosis
              </h2>

              <p
                style={{
                  color: "#94A3B8",
                  marginTop: "8px",
                }}
              >
                {error || "Analysis not found."}
              </p>

              <Link
                to="/history"
                className="db-view-btn"
                style={{
                  display: "inline-flex",
                  gap: "6px",
                  marginTop: "20px",
                }}
              >
                <ArrowLeft size={13} />
                Back to History
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const severity = analysis.severity?.toLowerCase() || "info";

  const severityLabel =
    severity.charAt(0).toUpperCase() +
    severity.slice(1);

  return (
    <div
      className={`db-layout${
        collapsed ? " sidebar-collapsed" : ""
      }`}
    >
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      <div className="db-main">
        <DashboardHeader />

        <div className="db-content">

          {/* Header Action Bar */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/history"
              className="db-view-btn"
              style={{ gap: "6px" }}
            >
              <ArrowLeft size={13} />
              <span>Back to History</span>
            </Link>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                className="db-view-btn"
                onClick={handleCopy}
                style={{ gap: "6px" }}
              >
                {copied ? (
                  <Check
                    size={13}
                    className="text-blue"
                  />
                ) : (
                  <Copy size={13} />
                )}

                <span>
                  {copied
                    ? "Copied Diagnosis"
                    : "Copy Diagnosis"}
                </span>
              </button>

              <button
                className="db-view-btn"
                style={{ gap: "6px" }}
                onClick={() => {
                  navigator.clipboard.writeText(
                    window.location.href
                  );
                }}
              >
                <Share2 size={13} />
                <span>Share Link</span>
              </button>

              <button
                className="db-upload-btn"
                style={{
                  height: "32px",
                  padding: "0 14px",
                  fontSize: "0.75rem",
                  gap: "6px",
                }}
                onClick={() =>
                  window.print()
                }
              >
                <Download size={13} />
                <span>Export Report (PDF)</span>
              </button>
            </div>
          </div>

          {/* Severity Banner */}

          <div
            className="db-card"
            style={{
              marginBottom: "24px",
              padding: "20px 24px",
              background:
                "linear-gradient(180deg, rgba(248, 113, 113, 0.04) 0%, rgba(17, 24, 39, 0.95) 100%)",
              borderColor:
                severity === "critical"
                  ? "rgba(248, 113, 113, 0.2)"
                  : "var(--c-border)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "6px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    className={`db-status ${severity}`}
                    style={{
                      fontSize: "0.75rem",
                    }}
                  >
                    <span className="db-status-dot" />

                    {severityLabel.toUpperCase()} SEVERITY
                  </span>

                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--c-text-3)",
                      fontFamily: "monospace",
                    }}
                  >
                    {analysis.error_code ||
                      "NO_ERROR_CODE"}
                  </span>
                </div>

                <h1
                  className="db-page-title"
                  style={{
                    fontSize: "1.375rem",
                  }}
                >
                  {analysis.title}
                </h1>

                <p
                  className="db-page-subtitle"
                  style={{
                    marginTop: "4px",
                  }}
                >
                  Audited from uploaded log file #
                  {analysis.log_file_id}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  background: "rgba(0,0,0,0.2)",
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border:
                    "1px solid var(--c-border)",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      color: "var(--c-text-3)",
                      display: "block",
                    }}
                  >
                    ANALYSIS LATENCY
                  </span>

                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#3B82F6",
                    }}
                  >
                    {analysis.analysis_latency.toFixed(
                      2
                    )}{" "}
                    sec
                  </span>
                </div>

                <div
                  style={{
                    borderLeft:
                      "1px solid var(--c-border)",
                    paddingLeft: "20px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      color: "var(--c-text-3)",
                      display: "block",
                    }}
                  >
                    CONFIDENCE SCORE
                  </span>

                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--c-success)",
                    }}
                  >
                    {analysis.confidence_score.toFixed(
                      1
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1.85fr 1.15fr",
              gap: "24px",
              alignItems: "start",
            }}
          >

            {/* LEFT COLUMN */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >

              {/* AI Executive Summary */}

              <div className="db-card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "12px",
                    borderBottom:
                      "1px solid var(--c-border)",
                    paddingBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      color: "var(--c-accent)",
                      background:
                        "var(--c-accent-dim)",
                      padding: "6px",
                      borderRadius: "8px",
                    }}
                  >
                    <Brain size={16} />
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--c-text-1)",
                      }}
                    >
                      AI Executive Summary
                    </h3>

                    <p
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--c-text-3)",
                      }}
                    >
                      Automated incident synthesis
                    </p>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--c-text-2)",
                    lineHeight: "1.6",
                  }}
                >
                  {analysis.summary}
                </p>
              </div>

              {/* Root Cause */}

              <div className="db-card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "16px",
                    borderBottom:
                      "1px solid var(--c-border)",
                    paddingBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      color: "#3B82F6",
                      background:
                        "rgba(59, 130, 246, 0.08)",
                      padding: "6px",
                      borderRadius: "8px",
                    }}
                  >
                    <Code size={16} />
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--c-text-1)",
                      }}
                    >
                      Root Cause Trace
                    </h3>

                    <p
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--c-text-3)",
                      }}
                    >
                      AI-identified root cause
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    background: "#080B11",
                    border:
                      "1px solid var(--c-border)",
                    borderRadius: "10px",
                    padding: "16px",
                    color: "#94A3B8",
                    fontSize: "0.8125rem",
                    lineHeight: "1.7",
                  }}
                >
                  {analysis.root_cause ||
                    "Root cause could not be determined from the uploaded log."}
                </div>
              </div>

              {/* Timeline */}

              <div className="db-card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "16px",
                    borderBottom:
                      "1px solid var(--c-border)",
                    paddingBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      color: "#fbbf24",
                      background:
                        "rgba(251, 191, 36, 0.08)",
                      padding: "6px",
                      borderRadius: "8px",
                    }}
                  >
                    <Clock size={16} />
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--c-text-1)",
                      }}
                    >
                      Incident Sequence Timeline
                    </h3>

                    <p
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--c-text-3)",
                      }}
                    >
                      Chronological telemetry trace
                    </p>
                  </div>
                </div>

                {analysis.timeline &&
                analysis.timeline.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {analysis.timeline.map(
                      (evt, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "start",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.6875rem",
                              fontFamily: "monospace",
                              color:
                                "var(--c-text-3)",
                              paddingTop: "2px",
                              width: "85px",
                              flexShrink: 0,
                            }}
                          >
                            {evt.time || "--:--:--"}
                          </span>

                          <div
                            style={{
                              flex: 1,
                              padding:
                                "8px 12px",
                              background:
                                "rgba(255,255,255,0.015)",
                              border:
                                "1px solid var(--c-border)",
                              borderRadius: "8px",
                              fontSize:
                                "0.75rem",
                              color:
                                "var(--c-text-2)",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 600,
                                marginRight:
                                  "8px",
                                textTransform:
                                  "uppercase",
                                fontSize:
                                  "0.65rem",
                              }}
                            >
                              {evt.level ||
                                "info"}
                            </span>

                            {evt.text || ""}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p
                    style={{
                      color: "var(--c-text-3)",
                      fontSize: "0.8rem",
                    }}
                  >
                    No timeline events were detected.
                  </p>
                )}
              </div>

              {/* Recommended Solution */}

              <div
                className="db-card"
                style={{
                  borderColor:
                    "rgba(52, 211, 153, 0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "12px",
                    borderBottom:
                      "1px solid var(--c-border)",
                    paddingBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      color: "var(--c-success)",
                      background:
                        "rgba(52, 211, 153, 0.08)",
                      padding: "6px",
                      borderRadius: "8px",
                    }}
                  >
                    <CheckCircle2 size={16} />
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--c-text-1)",
                      }}
                    >
                      Recommended Patch & Solution
                    </h3>

                    <p
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--c-text-3)",
                      }}
                    >
                      Suggested remediation
                    </p>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--c-text-2)",
                    lineHeight: "1.5",
                    marginBottom: "12px",
                  }}
                >
                  {analysis.recommended_solution ||
                    "No recommendation was provided."}
                </p>

                {analysis.code_fix && (
                  <div
                    style={{
                      background: "#080B11",
                      border:
                        "1px solid rgba(52, 211, 153, 0.2)",
                      borderRadius: "8px",
                      padding: "12px",
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      color: "#34d399",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {analysis.code_fix}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >

              {/* Incident Attributes */}

              <div className="db-card">
                <div
                  style={{
                    borderBottom:
                      "1px solid var(--c-border)",
                    paddingBottom: "10px",
                    marginBottom: "16px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--c-text-1)",
                      textTransform:
                        "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Incident Attributes
                  </h3>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--c-text-3)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Code size={12} />
                      Runtime Framework
                    </span>

                    <span
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--c-text-1)",
                        fontWeight: 500,
                        marginTop: "2px",
                        display: "block",
                      }}
                    >
                      {analysis.runtime_framework ||
                        "Not detected"}
                    </span>
                  </div>

                  <div>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--c-text-3)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Server size={12} />
                      Cluster Node
                    </span>

                    <span
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--c-text-1)",
                        fontWeight: 500,
                        marginTop: "2px",
                        display: "block",
                      }}
                    >
                      {analysis.cluster_node ||
                        "Not detected"}
                    </span>
                  </div>

                  <div>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--c-text-3)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Layers size={12} />
                      Thread Context
                    </span>

                    <span
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--c-text-1)",
                        fontWeight: 500,
                        marginTop: "2px",
                        display: "block",
                      }}
                    >
                      {analysis.thread_context ||
                        "Not detected"}
                    </span>
                  </div>

                  <div>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--c-text-3)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <FileText size={12} />
                      Log Package
                    </span>

                    <span
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--c-text-1)",
                        fontWeight: 500,
                        marginTop: "2px",
                        display: "block",
                      }}
                    >
                      Log File #{analysis.log_file_id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Card */}

              <div
                className="db-card"
                style={{
                  background:
                    "rgba(59, 130, 246, 0.02)",
                  borderColor:
                    "rgba(59, 130, 246, 0.15)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <Terminal
                    size={16}
                    className="text-blue"
                  />

                  <div>
                    <h4
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "var(--c-text-1)",
                      }}
                    >
                      AI Analysis Verified
                    </h4>

                    <p
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--c-text-3)",
                        marginTop: "2px",
                      }}
                    >
                      Diagnosis generated from uploaded
                      telemetry
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AnalysisResult;
