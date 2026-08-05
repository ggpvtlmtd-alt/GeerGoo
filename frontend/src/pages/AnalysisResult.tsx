import { useState } from "react";
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
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/dashboard.css";

const timelineEvents = [
  { time: "14:23:01.042", level: "info", text: "Ingestion stream received POST /api/v1/users/checkout (200 OK)" },
  { time: "14:23:02.180", level: "warning", text: "DB Connection Pool utilization spiked above 98.4% threshold" },
  { time: "14:23:03.512", level: "error", text: "Thread #42 returned null user context reference on pool exhaustion" },
  { time: "14:23:03.514", level: "critical", text: "NullPointerException thrown at UserService.java:142 inside getUserProfile()" },
];

function AnalysisResult() {
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`db-layout${collapsed ? " sidebar-collapsed" : ""}`}>
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      <div className="db-main">
        <DashboardHeader />

        <div className="db-content">
          
          {/* Header Action Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <Link to="/history" className="db-view-btn" style={{ gap: "6px" }}>
              <ArrowLeft size={13} />
              <span>Back to History</span>
            </Link>

            <div style={{ display: "flex", gap: "10px" }}>
              <button className="db-view-btn" onClick={handleCopy} style={{ gap: "6px" }}>
                {copied ? <Check size={13} className="text-blue" /> : <Copy size={13} />}
                <span>{copied ? "Copied Diagnosis" : "Copy Diagnosis"}</span>
              </button>

              <button className="db-view-btn" style={{ gap: "6px" }}>
                <Share2 size={13} />
                <span>Share Link</span>
              </button>

              <button className="db-upload-btn" style={{ height: "32px", padding: "0 14px", fontSize: "0.75rem", gap: "6px" }}>
                <Download size={13} />
                <span>Export Report (PDF)</span>
              </button>
            </div>
          </div>

          {/* Severity Banner Header */}
          <div className="db-card" style={{ marginBottom: "24px", padding: "20px 24px", background: "linear-gradient(180deg, rgba(248, 113, 113, 0.04) 0%, rgba(17, 24, 39, 0.95) 100%)", borderColor: "rgba(248, 113, 113, 0.2)" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <span className="db-status critical" style={{ fontSize: "0.75rem" }}>
                    <span className="db-status-dot" />
                    CRITICAL SEVERITY
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--c-text-3)", fontFamily: "monospace" }}>ERR_NULL_POINTER_REF</span>
                </div>
                <h1 className="db-page-title" style={{ fontSize: "1.375rem" }}>NullPointerException in UserService.java</h1>
                <p className="db-page-subtitle" style={{ marginTop: "4px" }}>
                  Audited from log file <strong style={{ color: "#F8FAFC" }}>syslog_replication.log</strong> (2.4 MB)
                </p>
              </div>

              <div style={{ display: "flex", gap: "20px", background: "rgba(0,0,0,0.2)", padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--c-border)" }}>
                <div>
                  <span style={{ fontSize: "0.6875rem", color: "var(--c-text-3)", display: "block" }}>ANALYSIS LATENCY</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#3B82F6" }}>1.12 sec</span>
                </div>
                <div style={{ borderLeft: "1px solid var(--c-border)", paddingLeft: "20px" }}>
                  <span style={{ fontSize: "0.6875rem", color: "var(--c-text-3)", display: "block" }}>CONFIDENCE SCORE</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--c-success)" }}>99.4%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Flagship Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1.85fr 1.15fr", gap: "24px", alignItems: "start" }}>
            
            {/* Left Column: AI Diagnostics & Root Cause */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* 1. AI Executive Summary Card */}
              <div className="db-card">
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", borderBottom: "1px solid var(--c-border)", paddingBottom: "12px" }}>
                  <div style={{ color: "var(--c-accent)", background: "var(--c-accent-dim)", padding: "6px", borderRadius: "8px" }}>
                    <Brain size={16} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--c-text-1)" }}>AI Executive Summary</h3>
                    <p style={{ fontSize: "0.6875rem", color: "var(--c-text-3)" }}>Automated incident synthesis</p>
                  </div>
                </div>
                <p style={{ fontSize: "0.875rem", color: "var(--c-text-2)", lineHeight: "1.6" }}>
                  The application crashed due to an unhandled <strong style={{ color: "#F8FAFC" }}>NullPointerException</strong> during user checkout verification. On high concurrent load, thread #42 experienced database connection pool exhaustion, causing <code style={{ background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "4px", color: "#F8FAFC" }}>getUserProfile()</code> to return a null reference which was dereferenced without bounds check.
                </p>
              </div>

              {/* 2. Root Cause & Code Snippet Trace */}
              <div className="db-card">
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", borderBottom: "1px solid var(--c-border)", paddingBottom: "12px" }}>
                  <div style={{ color: "#3B82F6", background: "rgba(59, 130, 246, 0.08)", padding: "6px", borderRadius: "8px" }}>
                    <Code size={16} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--c-text-1)" }}>Root Cause Trace</h3>
                    <p style={{ fontSize: "0.6875rem", color: "var(--c-text-3)" }}>Isolated stack frame failure location</p>
                  </div>
                </div>

                <div style={{ background: "#080B11", border: "1px solid var(--c-border)", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--c-border)" }}>
                    <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--c-text-2)" }}>UserService.java</span>
                    <span style={{ fontSize: "0.6875rem", color: "var(--c-danger)", background: "rgba(248, 113, 113, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>Line 142</span>
                  </div>
                  
                  <div style={{ padding: "14px", fontFamily: "monospace", fontSize: "0.8125rem", lineHeight: "1.6", color: "#94A3B8" }}>
                    <div style={{ opacity: 0.6 }}>140: public UserProfile getUserProfile(String userId) &#123;</div>
                    <div style={{ opacity: 0.6 }}>141:     UserContext context = dbPool.acquireContext(userId);</div>
                    <div style={{ background: "rgba(248, 113, 113, 0.12)", color: "#f87171", margin: "4px -14px", padding: "2px 14px", borderLeft: "3px solid #f87171" }}>
                      142:     return context.getProfile().toDTO(); // NPE TRIPPED HERE
                    </div>
                    <div style={{ opacity: 0.6 }}>143: &#125;</div>
                  </div>
                </div>
              </div>

              {/* 3. Event Timeline Card */}
              <div className="db-card">
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", borderBottom: "1px solid var(--c-border)", paddingBottom: "12px" }}>
                  <div style={{ color: "#fbbf24", background: "rgba(251, 191, 36, 0.08)", padding: "6px", borderRadius: "8px" }}>
                    <Clock size={16} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--c-text-1)" }}>Incident Sequence Timeline</h3>
                    <p style={{ fontSize: "0.6875rem", color: "var(--c-text-3)" }}>Chronological telemetry trace</p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {timelineEvents.map((evt, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "start" }}>
                      <span style={{ fontSize: "0.6875rem", fontFamily: "monospace", color: "var(--c-text-3)", paddingTop: "2px", width: "85px", flexShrink: 0 }}>{evt.time}</span>
                      <div style={{ flex: 1, padding: "8px 12px", background: "rgba(255,255,255,0.015)", border: "1px solid var(--c-border)", borderRadius: "8px", fontSize: "0.75rem", color: "var(--c-text-2)" }}>
                        {evt.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Actionable Remediation Card */}
              <div className="db-card" style={{ borderColor: "rgba(52, 211, 153, 0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", borderBottom: "1px solid var(--c-border)", paddingBottom: "12px" }}>
                  <div style={{ color: "var(--c-success)", background: "rgba(52, 211, 153, 0.08)", padding: "6px", borderRadius: "8px" }}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--c-text-1)" }}>Recommended Patch & Solution</h3>
                    <p style={{ fontSize: "0.6875rem", color: "var(--c-text-3)" }}>Suggested code fix</p>
                  </div>
                </div>

                <p style={{ fontSize: "0.8125rem", color: "var(--c-text-2)", lineHeight: "1.5", marginBottom: "12px" }}>
                  Add null safety guard checks and expand DB pool size in <code style={{ background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "4px", color: "#F8FAFC" }}>application.yml</code> to 50 connections.
                </p>

                <div style={{ background: "#080B11", border: "1px solid rgba(52, 211, 153, 0.2)", borderRadius: "8px", padding: "12px", fontFamily: "monospace", fontSize: "0.75rem", color: "#34d399" }}>
                  + if (context == null) throw new ServiceUnavailableException("DB Pool exhausted");
                  <br />+ return context.getProfile().toDTO();
                </div>
              </div>

            </div>

            {/* Right Column: Metadata Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              <div className="db-card">
                <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "10px", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--c-text-1)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Incident Attributes</h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <span style={{ fontSize: "0.6875rem", color: "var(--c-text-3)", display: "flex", alignItems: "center", gap: "6px" }}><Code size={12} /> Runtime Framework</span>
                    <span style={{ fontSize: "0.8125rem", color: "var(--c-text-1)", fontWeight: 500, marginTop: "2px", display: "block" }}>Java 17 / Spring Boot 3.2</span>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.6875rem", color: "var(--c-text-3)", display: "flex", alignItems: "center", gap: "6px" }}><Server size={12} /> Cluster Node</span>
                    <span style={{ fontSize: "0.8125rem", color: "var(--c-text-1)", fontWeight: 500, marginTop: "2px", display: "block" }}>us-east-3 / node-replica-04</span>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.6875rem", color: "var(--c-text-3)", display: "flex", alignItems: "center", gap: "6px" }}><Layers size={12} /> Thread Context</span>
                    <span style={{ fontSize: "0.8125rem", color: "var(--c-text-1)", fontWeight: 500, marginTop: "2px", display: "block" }}>Thread-pool-worker #42</span>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.6875rem", color: "var(--c-text-3)", display: "flex", alignItems: "center", gap: "6px" }}><FileText size={12} /> Log Package</span>
                    <span style={{ fontSize: "0.8125rem", color: "var(--c-text-1)", fontWeight: 500, marginTop: "2px", display: "block" }}>syslog_replication.log (2.4 MB)</span>
                  </div>
                </div>
              </div>

              {/* Security Shield Card */}
              <div className="db-card" style={{ background: "rgba(59, 130, 246, 0.02)", borderColor: "rgba(59, 130, 246, 0.15)" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <Terminal size={16} className="text-blue" />
                  <div>
                    <h4 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--c-text-1)" }}>Redaction Verified</h4>
                    <p style={{ fontSize: "0.6875rem", color: "var(--c-text-3)", marginTop: "2px" }}>All Auth tokens scrubbed at client proxy</p>
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