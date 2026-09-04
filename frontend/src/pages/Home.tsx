import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  History,
  LogOut,
  Settings,
  ShieldCheck,
  UploadCloud,
  User,
} from "lucide-react";

import DashboardSidebar from "../components/DashboardSidebar";
import "../styles/dashboard.css";

const API_BASE = "";

interface AnalysisItem {
  id: number;
  log_file_id: number;

  severity: string;
  error_code: string;
  title: string;
  summary: string;

  runtime_framework?: string;
  cluster_node?: string;
  thread_context?: string;

  confidence_score: number;
  analysis_latency: number;
  created_at: string;

  filename?: string;
  file_name?: string;

  log_file?: {
    id: number;
    name: string;
    size?: number;
  };
}

interface UserData {
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_picture?: string | null;
}

interface RecentFile {
  analysisId: number;
  logFileId: number;
  name: string;
  size?: number;
  severity: string;
  title: string;
  createdAt: string;
}

function Home() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState<UserData | null>(null);

  // ============================================================
  // USER
  // ============================================================

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Unable to read user:", err);
    }
  }, []);

  // ============================================================
  // LOAD REAL ANALYSIS DATA
  // ============================================================

  useEffect(() => {
    const fetchAnalyses = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Please sign in to view your dashboard.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE}/api/analysis/`,
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
            data.detail ||
              data.message ||
              "Unable to load dashboard data."
          );
        }

        let records: AnalysisItem[] = [];

        if (Array.isArray(data)) {
          records = data;
        } else if (Array.isArray(data.results)) {
          records = data.results;
        } else if (Array.isArray(data.analysis)) {
          records = data.analysis;
        }

        setAnalyses(records);
      } catch (err) {
        console.error("Dashboard API error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  // ============================================================
  // HELPERS
  // ============================================================

  const getFilename = (analysis: AnalysisItem) => {
    return (
      analysis.filename ||
      analysis.file_name ||
      analysis.log_file?.name ||
      `Log file #${analysis.log_file_id}`
    );
  };

  const getSeverity = (severity: string) => {
    const value = String(severity || "info").toLowerCase();

    if (value === "critical") return "critical";
    if (value === "warning") return "warning";
    if (value === "resolved") return "resolved";

    return "info";
  };

  const formatSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) {
      return "Size unavailable";
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Unknown time";
    }

    const diff = Date.now() - date.getTime();

    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 30) {
      return `${days} day${days === 1 ? "" : "s"} ago`;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================================
  // RECENT FILES
  // ============================================================

  const recentFiles: RecentFile[] = useMemo(() => {
    return [...analyses]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      )
      .slice(0, 5)
      .map((analysis) => ({
        analysisId: analysis.id,
        logFileId: analysis.log_file_id,
        name: getFilename(analysis),
        size: analysis.log_file?.size,
        severity: getSeverity(analysis.severity),
        title: analysis.title,
        createdAt: analysis.created_at,
      }));
  }, [analyses]);

  // ============================================================
  // DASHBOARD STATISTICS
  // ============================================================

  const statistics = useMemo(() => {
    const critical = analyses.filter(
      (item) => getSeverity(item.severity) === "critical"
    ).length;

    const warning = analyses.filter(
      (item) => getSeverity(item.severity) === "warning"
    ).length;

    const resolved = analyses.filter(
      (item) => getSeverity(item.severity) === "resolved"
    ).length;

    const averageConfidence =
      analyses.length > 0
        ? analyses.reduce(
            (sum, item) =>
              sum + Number(item.confidence_score || 0),
            0
          ) / analyses.length
        : 0;

    return {
      total: analyses.length,
      critical,
      warning,
      resolved,
      averageConfidence,
    };
  }, [analyses]);

  // ============================================================
  // USER DISPLAY
  // ============================================================

  const displayName =
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    user?.username ||
    "User";

  const initials =
    `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`
      .toUpperCase() ||
    user?.username?.slice(0, 2).toUpperCase() ||
    "US";

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ============================================================
  // TOP BAR
  // ============================================================

  const TopBar = () => (
    <div
      style={{
        height: "64px",
        borderBottom: "1px solid var(--c-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "rgba(8, 12, 20, 0.92)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <img
          src="/logo-icon.png"
          alt="GeerGoo"
          style={{
            width: "24px",
            height: "24px",
            objectFit: "contain",
          }}
        />

        <span
          style={{
            fontWeight: 700,
            color: "#F8FAFC",
            letterSpacing: "-0.02em",
          }}
        >
          GeerGoo
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/history")}
          className="db-view-btn"
          title="Analysis History"
          style={{
            width: "34px",
            height: "34px",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <History size={15} />
        </button>

        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="db-view-btn"
          title="Settings"
          style={{
            width: "34px",
            height: "34px",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Settings size={15} />
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          style={{
            border: "1px solid var(--c-border)",
            background: "rgba(255,255,255,0.03)",
            color: "#F8FAFC",
            borderRadius: "9px",
            padding: "5px 8px 5px 5px",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            cursor: "pointer",
          }}
          title="Account menu"
        >
          {user?.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={displayName}
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "7px",
                objectFit: "cover",
              }}
            />
          ) : (
            <span
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "7px",
                background: "rgba(59,130,246,0.15)",
                border: "1px solid rgba(59,130,246,0.25)",
                color: "#60A5FA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.65rem",
                fontWeight: 700,
              }}
            >
              {initials}
            </span>
          )}

          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            {initials}
          </span>

          <ChevronDown size={13} />
        </button>

        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "44px",
              right: 0,
              width: "220px",
              background: "#111827",
              border: "1px solid var(--c-border)",
              borderRadius: "12px",
              padding: "8px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
              zIndex: 100,
            }}
          >
            <div
              style={{
                padding: "10px",
                borderBottom: "1px solid var(--c-border)",
                marginBottom: "6px",
              }}
            >
              <div
                style={{
                  color: "#F8FAFC",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                {displayName}
              </div>

              <div
                style={{
                  color: "#64748B",
                  fontSize: "0.7rem",
                  marginTop: "3px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.email || "Signed in"}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              style={menuItemStyle}
            >
              <User size={14} />
              <span>Profile</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              style={menuItemStyle}
            >
              <Settings size={14} />
              <span>Settings</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/history")}
              style={menuItemStyle}
            >
              <History size={14} />
              <span>Analysis History</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                ...menuItemStyle,
                color: "#F87171",
              }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

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
        <TopBar />

        <div className="db-content">
          {/* ================================================== */}
          {/* PAGE HEADER */}
          {/* ================================================== */}

          <div className="db-page-heading">
            <h1 className="db-page-title">
              Welcome back, {displayName}
            </h1>

            <p className="db-page-subtitle">
              Real-time view of your uploaded telemetry and AI
              diagnostics.
            </p>
          </div>

          {/* ================================================== */}
          {/* QUICK ACTIONS */}
          {/* ================================================== */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(210p 1fr))",
              gap: "14px",
              marginBottom: "20px",
            }}
          >
            <Link
              to="/upload"
              className="db-card"
              style={{
                padding: "18px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "13px",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "rgba(59,130,246,0.1)",
                  color: "#60A5FA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UploadCloud size={18} />
              </div>

              <div>
                <div
                  style={{
                    color: "#F8FAFC",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                  }}
                >
                  Upload Telemetry
                </div>

                <div
                  style={{
                    color: "#64748B",
                    fontSize: "0.7rem",
                    marginTop: "3px",
                  }}
                >
                  Start a new AI diagnosis
                </div>
              </div>
            </Link>

            <Link
              to="/history"
              className="db-card"
              style={{
                padding: "18px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "13px",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "rgba(139,92,246,0.1)",
                  color: "#A78BFA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <History size={18} />
              </div>

              <div>
                <div
                  style={{
                    color: "#F8FAFC",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                  }}
                >
                  Analysis History
                </div>

                <div
                  style={{
                    color: "#64748B",
                    fontSize: "0.7rem",
                    marginTop: "3px",
                  }}
                >
                  Review previous incidents
                </div>
              </div>
            </Link>
          </div>

          {/* ================================================== */}
          {/* STATISTICS */}
          {/* ================================================== */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180p 1fr))",
              gap: "14px",
              marginBottom: "24px",
            }}
          >
            <StatCard
              icon={<FileText size={17} />}
              label="Total Analyses"
              value={statistics.total}
            />

            <StatCard
              icon={<AlertCircle size={17} />}
              label="Critical"
              value={statistics.critical}
            />

            <StatCard
              icon={<AlertTriangle size={17} />}
              label="Warnings"
              value={statistics.warning}
            />

            <StatCard
              icon={<CheckCircle2 size={17} />}
              label="Resolved"
              value={statistics.resolved}
            />

            <StatCard
              icon={<ShieldCheck size={17} />}
              label="Avg. Confidence"
              value={`${statistics.averageConfidence.toFixed(1)}%`}
            />
          </div>

          {/* ================================================== */}
          {/* MAIN GRID */}
          {/* ================================================== */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1.6fr) minmax(300p 1fr)",
              gap: "20px",
              alignItems: "start",
            }}
          >
            {/* RECENT TELEMETRY */}

            <div className="db-card">
              <div
                style={{
                  paddingBottom: "13px",
                  borderBottom: "1px solid var(--c-border)",
                  marginBottom: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: "#F8FAFC",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                    }}
                  >
                    Recent Telemetry Files
                  </h3>

                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "#64748B",
                      fontSize: "0.68rem",
                    }}
                  >
                    Live data from your analysis database
                  </p>
                </div>

                <Link
                  to="/history"
                  className="db-view-btn"
                  style={{
                    fontSize: "0.7rem",
                    textDecoration: "none",
                  }}
                >
                  View all
                </Link>
              </div>

              {loading ? (
                <EmptyState
                  icon={<Activity size={20} />}
                  title="Loading telemetry..."
                  text="Retrieving your latest analyses."
                />
              ) : error ? (
                <EmptyState
                  icon={<AlertCircle size={20} />}
                  title="Unable to load telemetry"
                  text={error}
                />
              ) : recentFiles.length === 0 ? (
                <EmptyState
                  icon={<FileText size={20} />}
                  title="No telemetry yet"
                  text="Upload your first log file to start an AI diagnosis."
                  action={
                    <Link
                      to="/upload"
                      className="db-upload-btn"
                      style={{
                        textDecoration: "none",
                        display: "inline-flex",
                        marginTop: "10px",
                      }}
                    >
                      Upload Log
                    </Link>
                  }
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {recentFiles.map((file) => (
                    <Link
                      key={file.analysisId}
                      to={`/analysis/${file.analysisId}`}
                      style={{
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "11px",
                        padding: "11px",
                        borderRadius: "9px",
                        border: "1px solid var(--c-border)",
                        background:
                          "rgba(255,255,255,0.015)",
                      }}
                    >
                      <div
                        className="db-file-icon"
                        style={{
                          width: "30px",
                          height: "30px",
                          minWidth: "30px",
                        }}
                      >
                        <FileText size={14} />
                      </div>

                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            color: "#F8FAFC",
                            fontSize: "0.77rem",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {file.name}
                        </div>

                        <div
                          style={{
                            color: "#64748B",
                            fontSize: "0.66rem",
                            marginTop: "3px",
                          }}
                        >
                          {formatSize(file.size)} ·{" "}
                          {formatRelativeTime(file.createdAt)}
                        </div>
                      </div>

                      <SeverityBadge
                        severity={file.severity}
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* SYSTEM STATUS */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div className="db-card">
                <div
                  style={{
                    paddingBottom: "13px",
                    borderBottom: "1px solid var(--c-border)",
                    marginBottom: "16px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: "#F8FAFC",
                      fontSize: "0.82rem",
                    }}
                  >
                    Diagnostic Engine
                  </h3>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <StatusRow
                    icon={<Brain size={15} />}
                    label="Gemini Analysis"
                    value="Available"
                    positive
                  />

                  <StatusRow
                    icon={<Activity size={15} />}
                    label="Telemetry Database"
                    value={
                      loading
                        ? "Checking..."
                        : "Connected"
                    }
                    positive={!error}
                  />

                  <StatusRow
                    icon={<ShieldCheck size={15} />}
                    label="Authentication"
                    value={
                      localStorage.getItem(
                        "access_token"
                      )
                        ? "Authenticated"
                        : "Sign in required"
                    }
                    positive={
                      Boolean(
                        localStorage.getItem(
                          "access_token"
                        )
                      )
                    }
                  />
                </div>
              </div>

              <div className="db-card">
                <div
                  style={{
                    display: "flex",
                    gap: "11px",
                    alignItems: "flex-start",
                  }}
                >
                  <Clock3
                    size={17}
                    style={{
                      color: "#60A5FA",
                      marginTop: "2px",
                      flexShrink: 0,
                    }}
                  />

                  <div>
                    <h3
                      style={{
                        margin: 0,
                        color: "#F8FAFC",
                        fontSize: "0.8rem",
                      }}
                    >
                      How GeerGoo works
                    </h3>

                    <p
                      style={{
                        marginTop: "6px",
                        color: "#64748B",
                        fontSize: "0.7rem",
                        lineHeight: 1.5,
                      }}
                    >
                      Upload a telemetry log, let Gemini
                      analyze the evidence, then review the
                      developer-focused diagnosis and
                      recommended remediation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* LATEST DIAGNOSIS */}
          {/* ================================================== */}

          {recentFiles.length > 0 && (
            <div
              className="db-card"
              style={{
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <BarChart3
                  size={17}
                  style={{ color: "#60A5FA" }}
                />

                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: "#F8FAFC",
                      fontSize: "0.82rem",
                    }}
                  >
                    Latest AI Diagnosis
                  </h3>

                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "#64748B",
                      fontSize: "0.68rem",
                    }}
                  >
                    {recentFiles[0].title ||
                      "Latest analysis"}
                  </p>
                </div>

                <Link
                  to={`/analysis/${recentFiles[0].analysisId}`}
                  className="db-view-btn"
                  style={{
                    marginLeft: "auto",
                    textDecoration: "none",
                  }}
                >
                  View Diagnosis
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SMALL COMPONENTS
// ============================================================

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="db-card" style={{ padding: "16px" }}>
      <div
        style={{
          color: "#60A5FA",
          marginBottom: "10px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#F8FAFC",
          fontSize: "1.25rem",
          fontWeight: 700,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#64748B",
          fontSize: "0.68rem",
          marginTop: "4px",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function StatusRow({
  icon,
  label,
  value,
  positive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  positive: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <span style={{ color: "#64748B" }}>{icon}</span>

      <span
        style={{
          flex: 1,
          color: "#CBD5E1",
          fontSize: "0.72rem",
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontSize: "0.65rem",
          color: positive ? "#34D399" : "#F87171",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: positive ? "#34D399" : "#F87171",
          }}
        />

        {value}
      </span>
    </div>
  );
}

function SeverityBadge({
  severity,
}: {
  severity: string;
}) {
  const styles: Record<
    string,
    { color: string; background: string }
  > = {
    critical: {
      color: "#F87171",
      background: "rgba(248,113,113,0.1)",
    },
    warning: {
      color: "#FBBF24",
      background: "rgba(251,191,36,0.1)",
    },
    resolved: {
      color: "#34D399",
      background: "rgba(52,211,153,0.1)",
    },
    info: {
      color: "#60A5FA",
      background: "rgba(96,165,250,0.1)",
    },
  };

  const style = styles[severity] || styles.info;

  return (
    <span
      style={{
        color: style.color,
        background: style.background,
        padding: "4px 7px",
        borderRadius: "6px",
        fontSize: "0.6rem",
        fontWeight: 700,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {severity}
    </span>
  );
}

function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "34px 20px",
        textAlign: "center",
        color: "#64748B",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
          color: "#475569",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#CBD5E1",
          fontSize: "0.78rem",
          fontWeight: 600,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#64748B",
          fontSize: "0.68rem",
          marginTop: "5px",
        }}
      >
        {text}
      </div>

      {action}
    </div>
  );
}

const menuItemStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  background: "transparent",
  color: "#CBD5E1",
  padding: "9px 10px",
  borderRadius: "7px",
  display: "flex",
  alignItems: "center",
  gap: "9px",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "0.72rem",
};

export default Home;


