import { useState } from "react";
import {
  Upload as UploadIcon,
  FileText,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  HelpCircle,
  Terminal,
  Loader2,
  Cpu,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/dashboard.css";

const recentFiles = [
  { name: "auth_daemon.log", size: "1.2 MB", status: "success", time: "10 mins ago" },
  { name: "nginx_access.log", size: "12.8 MB", status: "warning", time: "1 hour ago" },
  { name: "postgres_query.log", size: "4.5 MB", status: "success", time: "5 hours ago" },
];

function Upload() {
  const [collapsed, setCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`db-layout${collapsed ? " sidebar-collapsed" : ""}`}>
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      <div className="db-main">
        <DashboardHeader />

        <div className="db-content">
          <div className="db-page-heading">
            <h1 className="db-page-title">Ingest Log Telemetry</h1>
            <p className="db-page-subtitle">
              Upload syslog data to deploy automated AI root-cause analysis pipelines.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "24px", alignItems: "start" }}>
            
            {/* Left Column: Vercel-Style Deployment Dropzone & Live Pipeline */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* Dropzone Card */}
              <div
                className="db-card"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  padding: "48px 32px",
                  textAlign: "center",
                  border: isHovered ? "1px dashed rgba(59, 130, 246, 0.4)" : "1px dashed rgba(255, 255, 255, 0.12)",
                  background: isHovered ? "rgba(59, 130, 246, 0.02)" : "#111827",
                  transition: "all 0.28s cubic-bezier(0.25, 1, 0.5, 1)",
                  boxShadow: isHovered ? "0 0 32px rgba(59, 130, 246, 0.08)" : "var(--shadow-base)",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "16px",
                      background: "rgba(59, 130, 246, 0.08)",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#3B82F6",
                      transform: isHovered ? "scale(1.06)" : "scale(1)",
                      transition: "transform 0.28s ease",
                    }}
                  >
                    <UploadIcon size={24} strokeWidth={2} />
                  </div>

                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#F8FAFC", letterSpacing: "-0.01em" }}>
                      Drop syslog file to start deployment
                    </h3>
                    <p style={{ fontSize: "0.8125rem", color: "#94A3B8", marginTop: "4px" }}>
                      Drag & drop your log streams or select from drive
                    </p>
                  </div>

                  <button className="db-upload-btn" style={{ height: "36px", padding: "0 20px", fontSize: "0.8125rem" }}>
                    Select Log File
                  </button>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "8px" }}>
                    <span style={{ fontSize: "0.6875rem", color: "#64748B", background: "rgba(255, 255, 255, 0.02)", padding: "3px 10px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      .log
                    </span>
                    <span style={{ fontSize: "0.6875rem", color: "#64748B", background: "rgba(255, 255, 255, 0.02)", padding: "3px 10px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      .txt
                    </span>
                    <span style={{ fontSize: "0.6875rem", color: "#64748B", background: "rgba(255, 255, 255, 0.02)", padding: "3px 10px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      .csv
                    </span>
                    <span style={{ fontSize: "0.6875rem", color: "#64748B", background: "rgba(255, 255, 255, 0.02)", padding: "3px 10px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      .json
                    </span>
                  </div>
                </div>
              </div>

              {/* Vercel-Style Real-time Deployment Pipeline Card */}
              <div className="db-card" style={{ padding: "24px" }}>
                <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "12px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Terminal size={15} className="text-blue" />
                    <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#F8FAFC" }}>
                      Ingestion Pipeline Execution
                    </h3>
                  </div>
                  <span style={{ fontSize: "0.6875rem", color: "#3B82F6", fontWeight: 600, background: "rgba(59, 130, 246, 0.08)", padding: "2px 8px", borderRadius: "12px" }}>
                    RUNNING
                  </span>
                </div>

                {/* Pipeline Step List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.8125rem", color: "#94A3B8" }}>
                    <CheckCircle2 size={15} style={{ color: "#34d399", flexShrink: 0 }} />
                    <span>Upload log stream: <strong style={{ color: "#F8FAFC" }}>syslog_replication.log (12.8 MB)</strong></span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.8125rem", color: "#94A3B8" }}>
                    <CheckCircle2 size={15} style={{ color: "#34d399", flexShrink: 0 }} />
                    <span>Sanitize PII credentials & scrub auth keys</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.8125rem", color: "#F8FAFC" }}>
                    <Loader2 size={15} className="text-blue" style={{ animation: "spin 1.5s linear infinite", flexShrink: 0 }} />
                    <span>Parsing 104,842 log event records...</span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ margin: "4px 0 8px 25px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#94A3B8", marginBottom: "4px" }}>
                      <span>Stream parsing progress</span>
                      <span style={{ color: "#3B82F6", fontWeight: 600 }}>88%</span>
                    </div>
                    <div style={{ width: "100%", height: "4px", background: "rgba(255, 255, 255, 0.04)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ width: "88%", height: "100%", background: "#3B82F6", borderRadius: "2px", boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.8125rem", color: "#64748B" }}>
                    <Cpu size={15} style={{ flexShrink: 0 }} />
                    <span>Execute AI Exception Diagnostic Model</span>
                  </div>
                </div>

                <a href="/analysis" className="db-upload-btn" style={{ width: "100%", justifyContent: "center", height: "40px", marginTop: "20px" }}>
                  <span>Deploy Diagnostic Analysis</span>
                  <ArrowRight size={14} />
                </a>
              </div>

            </div>

            {/* Right Column: Recent Uploads & Ingestion Guidance */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* Recent Uploads */}
              <div className="db-card">
                <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "12px", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--c-text-1)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Recent Telemetry Files</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {recentFiles.map((file) => (
                    <div key={file.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", background: "rgba(255, 255, 255, 0.015)", padding: "12px", borderRadius: "10px", border: "1px solid var(--c-border)" }}>
                      <div className="db-file-icon" style={{ width: "26px", height: "26px", minWidth: "26px" }}>
                        <FileText size={13} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--c-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</p>
                        <p style={{ fontSize: "0.6875rem", color: "var(--c-text-3)", marginTop: "2px" }}>{file.size} · {file.time}</p>
                      </div>
                      <div>
                        {file.status === "success" ? (
                          <CheckCircle2 size={14} className="text-blue" />
                        ) : (
                          <AlertTriangle size={14} style={{ color: "var(--c-warning)" }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingestion Security & Limits Guidance */}
              <div className="db-card">
                <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "12px", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--c-text-1)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Ingestion Guidance</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "start" }}>
                    <ShieldCheck size={15} className="text-blue" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <p style={{ fontSize: "0.75rem", color: "var(--c-text-2)", lineHeight: "1.4" }}>
                      <strong style={{ color: "#F8FAFC" }}>Client Proxy PII Scrubbing:</strong> Passwords, private keys, and OAuth tokens are redacted automatically before hitting our server proxy.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "start" }}>
                    <HelpCircle size={15} className="text-blue" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <p style={{ fontSize: "0.75rem", color: "var(--c-text-2)", lineHeight: "1.4" }}>
                      <strong style={{ color: "#F8FAFC" }}>File Size Limits:</strong> Standard uploads support up to 50 MB per file. For continuous ingestion streams, use our CLI integration endpoint.
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

export default Upload;