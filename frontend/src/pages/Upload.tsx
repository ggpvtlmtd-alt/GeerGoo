import { useState } from "react";
import { Upload as UploadIcon, FileText, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
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
            <h1 className="db-page-title">Upload Log File</h1>
            <p className="db-page-subtitle">
              Ingest your logs and initiate the AI automated troubleshooting sequence.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "24px", alignItems: "start" }}>
            
            {/* Left Column: Dropzone & Progress Mockup */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="db-card upload-card" style={{ padding: "40px" }}>
                <div className="upload-box-wrapper">
                  <div className="upload-box-icon">
                    <UploadIcon size={32} strokeWidth={1.5} />
                  </div>
                  <h3>Drag and drop syslog files here</h3>
                  <p>Or select files from your remote local drives</p>
                  
                  <button className="db-view-btn" style={{ margin: "20px 0 12px" }}>
                    Select Log File
                  </button>

                  <div className="supported-badge">
                    <FileText size={12} />
                    <span>Plain text log formats (.log, .txt, .csv)</span>
                  </div>
                </div>

                {/* Upload progress mockup — Stripe / Vercel style */}
                <div style={{ borderTop: "1px solid var(--c-border)", paddingTop: "24px", marginTop: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--c-text-2)" }}>Replication log uploaded</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--c-accent)", fontWeight: 600 }}>88% completed</span>
                  </div>
                  <div style={{ width: "100%", height: "4px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: "88%", height: "100%", background: "var(--c-accent)", borderRadius: "2px", boxShadow: "0 0 8px var(--c-accent)" }} />
                  </div>
                </div>

                <button className="db-upload-btn" style={{ width: "100%", justifyContent: "center", height: "38px" }}>
                  Start Analysis Engine
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right Column: Recent Uploads & Tips */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* Recent Files card */}
              <div className="db-card">
                <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "12px", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--c-text-1)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Recent Uploads</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {recentFiles.map((file) => (
                    <div key={file.name} style={{ display: "flex", alignItems: "center", justifyItems: "space-between", gap: "10px", background: "rgba(255, 255, 255, 0.01)", padding: "10px", borderRadius: "8px", border: "1px solid var(--c-border)" }}>
                      <div className="db-file-icon" style={{ width: "24px", height: "24px", minWidth: "24px" }}>
                        <FileText size={12} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--c-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</p>
                        <p style={{ fontSize: "0.6875rem", color: "var(--c-text-3)" }}>{file.size} · {file.time}</p>
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

              {/* Upload Tips Card */}
              <div className="db-card">
                <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "12px", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--c-text-1)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Ingestion Instructions</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "start" }}>
                    <ShieldCheck size={14} className="text-blue" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <p style={{ fontSize: "0.75rem", color: "var(--c-text-2)", lineHeight: "1.4" }}>
                      <strong>Data Scrubbing:</strong> Any credentials, private keys, or credentials found in environment logs are redacted at the client proxy layer.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "start" }}>
                    <HelpCircle size={14} className="text-blue" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <p style={{ fontSize: "0.75rem", color: "var(--c-text-2)", lineHeight: "1.4" }}>
                      <strong>Max Limits:</strong> Files must be under 50 MB. For larger log transfers, establish direct integration endpoints using our API.
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