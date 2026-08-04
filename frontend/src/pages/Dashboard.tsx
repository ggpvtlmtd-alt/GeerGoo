import { useState } from "react";
import {
  FileText,
  Brain,
  Zap,
  ShieldAlert,
  Eye,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Server,
  Activity,
  Cpu,
} from "lucide-react";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader  from "../components/DashboardHeader";
import StatCard         from "../components/StatCard";
import "../styles/dashboard.css";

/* ── Static data ─────────────────────────────────────────── */
const recentAnalyses = [
  { id: 1, filename: "syslog_replication.log",  status: "critical", date: "Today, 2:30 PM",    size: "2.4 MB" },
  { id: 2, filename: "nginx_route_exception.log", status: "warning",  date: "Yesterday, 11:00 AM", size: "1.1 MB" },
  { id: 3, filename: "user_auth_secure.log",   status: "resolved", date: "2 days ago",         size: "0.8 MB" },
  { id: 4, filename: "database_replica.log",   status: "resolved", date: "4 days ago",         size: "12.2 MB" },
];

const aiInsights = [
  { id: 1, type: "critical", message: "NullPointerException isolated in UserService.java at line 142." },
  { id: 2, type: "warning",  message: "Connection pool utilization spikes near max peak thresholds." },
];

const statusMeta = {
  critical: { icon: AlertCircle,    label: "Critical" },
  warning:  { icon: AlertTriangle,  label: "Warning"  },
  resolved: { icon: CheckCircle2,   label: "Resolved" },
  info:     { icon: Info,           label: "Info"     },
} as const;

/* ── Chart calculation ───────────────────────────────────── */
const chartData   = [3, 7, 5, 9, 6, 12, 8];
const chartLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SVG_W       = 700;
const SVG_H       = 140;
const PAD_TOP     = 15;
const PAD_BOTTOM  = 24;
const PAD_LR      = 12;
const INNER_W     = SVG_W - PAD_LR * 2;
const INNER_H     = SVG_H - PAD_TOP - PAD_BOTTOM;
const MAX_VAL     = Math.max(...chartData);

interface Pt { x: number; y: number }

const pts: Pt[] = chartData.map((v, i) => ({
  x: PAD_LR + (i / (chartData.length - 1)) * INNER_W,
  y: PAD_TOP + INNER_H - (v / MAX_VAL) * INNER_H,
}));

function smoothPath(points: Pt[]): string {
  if (points.length < 2) return "";
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx  = (prev.x + curr.x) / 2;
    d += ` C${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
  }
  return d;
}

const linePath  = smoothPath(pts);
const areaClose = `L${pts[pts.length - 1].x},${PAD_TOP + INNER_H} L${PAD_LR},${PAD_TOP + INNER_H} Z`;
const areaPath  = `${linePath} ${areaClose}`;

function Dashboard() {
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
          
          {/* Heading */}
          <div className="db-page-heading">
            <h1 className="db-page-title">Workspace Monitor</h1>
            <p className="db-page-subtitle">Real-time log intelligence and autonomous diagnostic metrics.</p>
          </div>

          {/* 1. Stat Cards Row */}
          <div className="db-stats-grid">
            <StatCard title="Logs Uploaded" value="12" icon={FileText} trend="+3 this week" trendUp={true} color="blue" />
            <StatCard title="AI Reports" value="9" icon={Brain} trend="+2 today" trendUp={true} color="purple" />
            <StatCard title="Average Analysis" value="&lt;5 sec" icon={Zap} trend="12% faster" trendUp={true} color="green" />
            <StatCard title="Threats Found" value="3" icon={ShieldAlert} trend="1 resolved" trendUp={false} color="orange" />
          </div>

          {/* 2. Large Hero Analytics Chart Card */}
          <div className="db-card chart-card" style={{ width: "100%" }}>
            <div className="db-card-header" style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "14px", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "0.875rem", fontWeight: 600 }}>Diagnostic Traffic Activity</h3>
                <p style={{ fontSize: "0.75rem", color: "var(--c-text-3)", marginTop: "2px" }}>Daily log ingestion stream volumes</p>
              </div>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Activity size={12} className="text-blue" />
                  <span style={{ fontSize: "0.75rem", color: "var(--c-text-2)" }}>2.8k events/s</span>
                </div>
                <span className="db-card-badge">Last 7 days</span>
              </div>
            </div>

            <div className="db-chart-wrapper">
              <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="db-chart-svg" aria-label="Ingestion activity chart">
                <defs>
                  <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#4F8CFF" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#4F8CFF" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="chartLineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#4F8CFF" />
                    <stop offset="100%" stopColor="#7C5CFF" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                {[0, 1, 2].map((i) => {
                  const y = PAD_TOP + (INNER_H / 2) * i;
                  return (
                    <line key={i} x1={PAD_LR} y1={y} x2={SVG_W - PAD_LR} y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  );
                })}

                <path d={areaPath} fill="url(#chartAreaGrad)" className="db-chart-area" />
                <path d={linePath} fill="none" stroke="url(#chartLineGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="db-chart-line" />

                {pts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#050505" stroke="#4F8CFF" strokeWidth="1.5" className="db-chart-dot" />
                ))}

                {chartLabels.map((label, i) => (
                  <text key={label} x={PAD_LR + (i / (chartLabels.length - 1)) * INNER_W} y={SVG_H - 4} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="Inter, sans-serif">
                    {label}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* 3. Split Grid Section: Recent Table vs AI Insights & Health */}
          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "24px", alignItems: "start" }}>
            
            {/* Left: Recent Activity Table */}
            <div className="db-card table-card" style={{ padding: "0 0 12px 0" }}>
              <div className="db-card-header" style={{ padding: "20px 20px 14px", borderBottom: "1px solid var(--c-border)" }}>
                <div>
                  <h3 style={{ fontSize: "0.875rem", fontWeight: 600 }}>Audited Logs</h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--c-text-3)", marginTop: "2px" }}>Recently analyzed syslog packages</p>
                </div>
                <a href="/history" className="db-view-all-btn">
                  View History
                  <ArrowRight size={12} />
                </a>
              </div>

              <div className="db-table-wrap">
                <table className="db-table">
                  <thead>
                    <tr>
                      <th style={{ padding: "12px 20px" }}>Filename</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th style={{ padding: "12px 20px", textAlign: "right" }}>Diagnostics</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAnalyses.map(({ id, filename, status, date }) => {
                      const meta = statusMeta[status as keyof typeof statusMeta];
                      const StatusIcon = meta.icon;
                      return (
                        <tr key={id}>
                          <td style={{ padding: "10px 20px" }}>
                            <div className="db-filename">
                              <div className="db-file-icon">
                                <FileText size={13} />
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
                          <td style={{ padding: "10px 20px", textAlign: "right" }}>
                            <button className="db-view-btn">
                              <Eye size={12} />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: AI Insights & System Health */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* AI Diagnostics Insights */}
              <div className="db-card">
                <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "10px", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--c-text-1)", textTransform: "uppercase", letterSpacing: "0.08em" }}>AI Diagnostics Insights</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {aiInsights.map((insight) => (
                    <div key={insight.id} style={{ display: "flex", gap: "10px", padding: "12px", background: "rgba(255, 255, 255, 0.012)", border: "1px solid var(--c-border)", borderRadius: "8px", alignItems: "start" }}>
                      <Brain size={14} className="text-blue" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <p style={{ fontSize: "0.75rem", color: "var(--c-text-2)", lineHeight: "1.4" }}>{insight.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Cluster Health */}
              <div className="db-card" style={{ padding: "20px" }}>
                <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "10px", marginBottom: "14px" }}>
                  <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--c-text-1)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Node Diagnostics</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--c-text-2)", display: "flex", alignItems: "center", gap: "6px" }}><Server size={12} className="text-blue" /> Cluster Node 03</span>
                    <span style={{ fontSize: "0.6875rem", color: "var(--c-success)", fontWeight: 600 }}>Active</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--c-text-2)", display: "flex", alignItems: "center", gap: "6px" }}><Cpu size={12} className="text-blue" /> Inference GPU Load</span>
                    <span style={{ fontSize: "0.6875rem", color: "var(--c-text-2)", fontWeight: 600 }}>12%</span>
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

export default Dashboard;