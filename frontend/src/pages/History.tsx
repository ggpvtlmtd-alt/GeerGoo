import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Eye,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/dashboard.css";

const historyLogs = [
  { id: 1, filename: "syslog_replication.log", status: "critical", date: "Today, 2:30 PM", size: "2.4 MB", node: "us-east-3" },
  { id: 2, filename: "nginx_route_exception.log", status: "warning", date: "Yesterday, 11:00 AM", size: "1.1 MB", node: "eu-west-1" },
  { id: 3, filename: "user_auth_secure.log", status: "resolved", date: "2 days ago", size: "0.8 MB", node: "us-east-1" },
  { id: 4, filename: "database_replica.log", status: "resolved", date: "4 days ago", size: "12.2 MB", node: "ap-south-1" },
];

const statusMeta = {
  critical: { icon: AlertCircle, label: "Critical" },
  warning: { icon: AlertTriangle, label: "Warning" },
  resolved: { icon: CheckCircle2, label: "Resolved" },
} as const;

function History() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = historyLogs.filter((log) =>
    log.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div
            className="db-card"
            style={{
              padding: "16px 20px",
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", gap: "10px", flex: 1, maxWidth: "440px" }}>
              <div
                className="db-header-search"
                style={{
                  margin: 0,
                  maxWidth: "none",
                  flex: 1,
                  background: "rgba(255, 255, 255, 0.015)",
                }}
              >
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search syslog files..."
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

          {/* Stripe / Linear-Inspired Table Container */}
          <div className="db-card table-card" style={{ padding: "0 0 12px 0" }}>
            <div className="db-table-wrap">
              <table className="db-table">
                <thead>
                  <tr>
                    <th style={{ padding: "14px 20px 10px" }}>Filename</th>
                    <th>Status</th>
                    <th>Node Region</th>
                    <th>Date Audited</th>
                    <th>Size</th>
                    <th style={{ padding: "14px 20px 10px", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(({ id, filename, status, date, size, node }) => {
                    const meta = statusMeta[status as keyof typeof statusMeta];
                    const StatusIcon = meta.icon;
                    return (
                      <tr key={id}>
                        <td style={{ padding: "12px 20px" }}>
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
                        <td style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#94A3B8" }}>{node}</td>
                        <td style={{ color: "#94A3B8" }}>{date}</td>
                        <td style={{ color: "#94A3B8" }}>{size}</td>
                        <td style={{ padding: "12px 20px", textAlign: "right" }}>
                          <Link to="/analysis" className="db-view-btn" style={{ display: "inline-flex", gap: "6px" }}>
                            <Eye size={13} />
                            <span>View Diagnosis</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Control */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px 4px",
                borderTop: "1px solid var(--c-border)",
                marginTop: "12px",
              }}
            >
              <span style={{ fontSize: "0.75rem", color: "var(--c-text-3)" }}>
                Showing 1–{filteredLogs.length} of 28 analyses
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