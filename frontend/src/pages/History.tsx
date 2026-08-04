import { useState } from "react";
import { FileText, Eye, AlertCircle, AlertTriangle, CheckCircle2, Search, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/dashboard.css";

const historyLogs = [
  { id: 1, filename: "syslog_replication.log", status: "critical", date: "Today, 2:30 PM", size: "2.4 MB" },
  { id: 2, filename: "nginx_route_exception.log", status: "warning", date: "Yesterday, 11:00 AM", size: "1.1 MB" },
  { id: 3, filename: "user_auth_secure.log", status: "resolved", date: "2 days ago", size: "0.8 MB" },
  { id: 4, filename: "database_replica.log", status: "resolved", date: "4 days ago", size: "12.2 MB" },
];

const statusMeta = {
  critical: { icon: AlertCircle, label: "Critical" },
  warning: { icon: AlertTriangle, label: "Warning" },
  resolved: { icon: CheckCircle2, label: "Resolved" },
} as const;

function History() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
            <h1 className="db-page-title">Analysis History</h1>
            <p className="db-page-subtitle">
              Audit previously uploaded telemetry logs, generated AI diagnoses, and patch logs.
            </p>
          </div>

          {/* Control Bar: Search + Filters + Export */}
          <div className="db-card" style={{ padding: "16px 20px", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "10px", flex: 1, maxWidth: "400px" }}>
              <div className="db-header-search" style={{ margin: 0, maxWidth: "none", flex: 1, background: "rgba(255, 255, 255, 0.015)" }}>
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <button className="db-view-btn" style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <Filter size={13} />
                <span>Filters</span>
              </button>
            </div>

            <button className="db-view-btn" style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="db-card table-card" style={{ padding: "0 0 12px 0" }}>
            <div className="db-table-wrap">
              <table className="db-table">
                <thead>
                  <tr>
                    <th style={{ padding: "14px 20px 10px" }}>Filename</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Size</th>
                    <th style={{ padding: "14px 20px 10px", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {historyLogs.map(({ id, filename, status, date, size }) => {
                    const meta = statusMeta[status as keyof typeof statusMeta];
                    const StatusIcon = meta.icon;
                    return (
                      <tr key={id}>
                        <td style={{ padding: "10px 20px" }}>
                          <div className="db-filename">
                            <div className="db-file-icon">
                              <FileText size={14} />
                            </div>
                            {filename}
                          </div>
                        </td>
                        <td>
                          <span className={`db-status ${status}`}>
                            <span className="db-status-dot" />
                            <StatusIcon size={11} />
                            {meta.label}
                          </span>
                        </td>
                        <td>{date}</td>
                        <td>{size}</td>
                        <td style={{ padding: "10px 20px", textAlign: "right" }}>
                          <button className="db-view-btn">
                            <Eye size={13} />
                            View Diagnosis
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Row */}
            <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 4px", borderTop: "1px solid var(--c-border)", marginTop: "12px" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--c-text-3)" }}>
                Showing 1–4 of 28 analyses
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button className="db-view-btn" style={{ padding: "6px" }} disabled>
                  <ChevronLeft size={14} />
                </button>
                <button className="db-view-btn" style={{ padding: "6px" }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;