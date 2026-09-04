import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import "../styles/dashboard.css";

interface AnalysisItem {
  id: number;
  log_file_id: number;

  filename?: string;
  file_name?: string;

  status?: string;
  severity?: string;

  error_code?: string;
  title?: string;
  summary?: string;
  root_cause?: string;

  recommended_solution?: string;
  code_fix?: string;

  runtime_framework?: string;
  cluster_node?: string;
  thread_context?: string;

  confidence_score?: number;
  analysis_latency?: number;

  created_at: string;

  size?: string;
}

const statusMeta = {
  critical: {
    icon: AlertCircle,
    label: "Critical",
  },

  warning: {
    icon: AlertTriangle,
    label: "Warning",
  },

  resolved: {
    icon: CheckCircle2,
    label: "Resolved",
  },

  info: {
    icon: Info,
    label: "Info",
  },
};

function Dashboard() {
  const [collapsed, setCollapsed] =
    useState(false);

  const [analyses, setAnalyses] =
    useState<AnalysisItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // GET ACCESS TOKEN
  // =====================================================

  const getAccessToken = () => {
    return localStorage.getItem(
      "access_token"
    );
  };

  // =====================================================
  // GET FILE NAME
  // =====================================================

  const getFilename = (
    analysis: AnalysisItem
  ) => {
    return (
      analysis.filename ||
      analysis.file_name ||
      `Log File #${analysis.log_file_id}`
    );
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    dateString: string
  ) => {
    if (!dateString) {
      return "Unknown";
    }

    const date =
      new Date(dateString);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateString;
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // LOAD REAL ANALYSES
  // =====================================================

  const fetchDashboardData =
    async () => {
      setLoading(true);
      setError("");

      try {
        const token =
          getAccessToken();

        if (!token) {
          throw new Error(
            "Authentication required. Please sign in again."
          );
        }

        const response =
          await fetch(
            "/api/analysis/",
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );

        const data =
          await response.json();

        console.log(
          "Dashboard API:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.detail ||
              data.message ||
              "Unable to load dashboard data."
          );
        }

        if (
          data.success === true &&
          Array.isArray(
            data.analyses
          )
        ) {
          setAnalyses(
            data.analyses
          );
        } else if (
          Array.isArray(data)
        ) {
          setAnalyses(data);
        } else if (
          Array.isArray(
            data.results
          )
        ) {
          setAnalyses(
            data.results
          );
        } else {
          setAnalyses([]);
        }
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        if (
          err instanceof Error
        ) {
          setError(
            err.message
          );
        } else {
          setError(
            "Unable to load dashboard."
          );
        }

        setAnalyses([]);
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // LOAD WHEN DASHBOARD OPENS
  // =====================================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =====================================================
  // REAL STATISTICS
  // =====================================================

  const totalAnalyses =
    analyses.length;

  const criticalCount =
    analyses.filter(
      (item) =>
        (
          item.severity ||
          item.status ||
          ""
        ).toLowerCase() ===
        "critical"
    ).length;

  const warningCount =
    analyses.filter(
      (item) =>
        (
          item.severity ||
          item.status ||
          ""
        ).toLowerCase() ===
        "warning"
    ).length;

  const resolvedCount =
    analyses.filter(
      (item) =>
        (
          item.severity ||
          item.status ||
          ""
        ).toLowerCase() ===
        "resolved"
    ).length;

  // =====================================================
  // AVERAGE ANALYSIS TIME
  // =====================================================

  const averageLatency =
    useMemo(() => {
      const valid =
        analyses.filter(
          (item) =>
            typeof item.analysis_latency ===
              "number" &&
            item.analysis_latency >
              0
        );

      if (!valid.length) {
        return "—";
      }

      const total =
        valid.reduce(
          (
            sum,
            item
          ) =>
            sum +
            Number(
              item.analysis_latency
            ),
          0
        );

      const average =
        total /
        valid.length;

      if (
        average < 10
      ) {
        return `${average.toFixed(
          1
        )} sec`;
      }

      return `${average.toFixed(
        1
      )} sec`;
    }, [analyses]);

  // =====================================================
  // RECENT ANALYSES
  // =====================================================

  const recentAnalyses =
    analyses.slice(
      0,
      5
    );

  // =====================================================
  // AI INSIGHTS
  // =====================================================

  const aiInsights =
    analyses
      .filter(
        (item) =>
          item.summary ||
          item.root_cause
      )
      .slice(
        0,
        3
      );

  // =====================================================
  // CONFIDENCE
  // =====================================================

  const averageConfidence =
    useMemo(() => {
      const valid =
        analyses.filter(
          (item) =>
            typeof item.confidence_score ===
              "number"
        );

      if (!valid.length) {
        return "—";
      }

      const total =
        valid.reduce(
          (
            sum,
            item
          ) =>
            sum +
            Number(
              item.confidence_score
            ),
          0
        );

      return `${(
        total /
        valid.length
      ).toFixed(0)}%`;
    }, [analyses]);

  // =====================================================
  // CHART DATA
  // LAST 7 DAYS
  // =====================================================

  const chartData =
    useMemo(() => {
      const today =
        new Date();

      const days: { date: Date; count: number }[] = [];

      for (
        let i = 6;
        i >= 0;
        i--
      ) {
        const date =
          new Date(
            today
          );

        date.setDate(
          today.getDate() -
            i
        );

        days.push({
          date,
          count: 0,
        });
      }

      analyses.forEach(
        (analysis) => {
          const created =
            new Date(
              analysis.created_at
            );

          days.forEach(
            (day) => {
              if (
                created.toDateString() ===
                day.date.toDateString()
              ) {
                day.count++;
              }
            }
          );
        }
      );

      return days;
    }, [analyses]);

  const chartValues =
    chartData.map(
      (item) =>
        item.count
    );

  const maxChartValue =
    Math.max(
      ...chartValues,
      1
    );

  const SVG_W = 700;
  const SVG_H = 140;
  const PAD_TOP = 15;
  const PAD_BOTTOM = 24;
  const PAD_LR = 12;

  const INNER_W =
    SVG_W -
    PAD_LR * 2;

  const INNER_H =
    SVG_H -
    PAD_TOP -
    PAD_BOTTOM;

  const points =
    chartValues.map(
      (
        value,
        index
      ) => ({
        x:
          PAD_LR +
          (index /
            Math.max(
              chartValues.length -
                1,
              1
            )) *
            INNER_W,

        y:
          PAD_TOP +
          INNER_H -
          (value /
            maxChartValue) *
            INNER_H,
      })
    );

  const smoothPath = (
    pts: {
      x: number;
      y: number;
    }[]
  ) => {
    if (
      pts.length <
      2
    ) {
      return "";
    }

    let d = `M${pts[0].x},${pts[0].y}`;

    for (
      let i = 1;
      i < pts.length;
      i++
    ) {
      const previous =
        pts[i - 1];

      const current =
        pts[i];

      const controlX =
        (previous.x +
          current.x) /
        2;

      d +=
        ` C${controlX},${previous.y}` +
        ` ${controlX},${current.y}` +
        ` ${current.x},${current.y}`;
    }

    return d;
  };

  const linePath =
    smoothPath(
      points
    );

  const areaPath =
    points.length
      ? `${linePath} L${points[points.length - 1].x},${PAD_TOP + INNER_H} L${PAD_LR},${PAD_TOP + INNER_H} Z`
      : "";

  const chartLabels =
    chartData.map(
      (item) =>
        item.date.toLocaleDateString(
          "en-IN",
          {
            weekday:
              "short",
          }
        )
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className={`db-layout${
        collapsed
          ? " sidebar-collapsed"
          : ""
      }`}
    >

      <DashboardSidebar
        collapsed={
          collapsed
        }
        onToggle={() =>
          setCollapsed(
            (c) => !c
          )
        }
      />

      <div className="db-main">

        <DashboardHeader />

        <div className="db-content">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="db-page-heading">

            <h1 className="db-page-title">
              Workspace Monitor
            </h1>

            <p className="db-page-subtitle">
              Real-time log intelligence
              and autonomous diagnostic
              metrics.
            </p>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div
              className="db-card"
              style={{
                padding:
                  "14px 18px",
                marginBottom:
                  "20px",
                color:
                  "#f87171",
                border:
                  "1px solid rgba(248,113,113,0.25)",
              }}
            >
              {error}
            </div>
          )}

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="db-stats-grid">

            <StatCard
              title="Logs Analyzed"
              value={
                loading
                  ? "..."
                  : String(
                      totalAnalyses
                    )
              }
              icon={
                FileText
              }
              trend={
                `${totalAnalyses} total`
              }
              trendUp={
                true
              }
              color="blue"
            />

            <StatCard
              title="AI Reports"
              value={
                loading
                  ? "..."
                  : String(
                      totalAnalyses
                    )
              }
              icon={
                Brain
              }
              trend={
                `${averageConfidence} avg confidence`
              }
              trendUp={
                true
              }
              color="purple"
            />

            <StatCard
              title="Average Analysis"
              value={
                loading
                  ? "..."
                  : averageLatency
              }
              icon={
                Zap
              }
              trend={
                "Gemini analysis"
              }
              trendUp={
                true
              }
              color="green"
            />

            <StatCard
              title="Threats Found"
              value={
                loading
                  ? "..."
                  : String(
                      criticalCount +
                        warningCount
                    )
              }
              icon={
                ShieldAlert
              }
              trend={
                `${resolvedCount} resolved`
              }
              trendUp={
                false
              }
              color="orange"
            />

          </div>

          {/* =================================================
              REAL ANALYTICS CHART
          ================================================= */}

          <div
            className="db-card chart-card"
            style={{
              width: "100%",
            }}
          >

            <div
              className="db-card-header"
              style={{
                borderBottom:
                  "1px solid var(--c-border)",
                paddingBottom:
                  "14px",
                marginBottom:
                  "16px",
              }}
            >

              <div>

                <h3
                  style={{
                    fontSize:
                      "0.875rem",
                    fontWeight:
                      600,
                  }}
                >
                  Diagnostic Traffic
                  Activity
                </h3>

                <p
                  style={{
                    fontSize:
                      "0.75rem",
                    color:
                      "var(--c-text-3)",
                    marginTop:
                      "2px",
                  }}
                >
                  Real log analyses
                  over the last
                  7 days
                </p>

              </div>

              <div
                style={{
                  display:
                    "flex",
                  gap:
                    "16px",
                  alignItems:
                    "center",
                }}
              >

                <span
                  className="db-card-badge"
                >
                  Last 7 days
                </span>

              </div>

            </div>

            <div className="db-chart-wrapper">

              <svg
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                className="db-chart-svg"
                aria-label="Real analysis activity chart"
              >

                <defs>

                  <linearGradient
                    id="chartAreaGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#4F8CFF"
                      stopOpacity="0.08"
                    />

                    <stop
                      offset="100%"
                      stopColor="#4F8CFF"
                      stopOpacity="0"
                    />

                  </linearGradient>

                  <linearGradient
                    id="chartLineGrad"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >

                    <stop
                      offset="0%"
                      stopColor="#4F8CFF"
                    />

                    <stop
                      offset="100%"
                      stopColor="#7C5CFF"
                    />

                  </linearGradient>

                </defs>

                {/* GRID */}

                {[0, 1, 2].map(
                  (i) => {

                    const y =
                      PAD_TOP +
                      (INNER_H /
                        2) *
                        i;

                    return (
                      <line
                        key={i}
                        x1={
                          PAD_LR
                        }
                        y1={y}
                        x2={
                          SVG_W -
                          PAD_LR
                        }
                        y2={y}
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth="1"
                      />
                    );
                  }
                )}

                {/* AREA */}

                {areaPath && (
                  <path
                    d={
                      areaPath
                    }
                    fill="url(#chartAreaGrad)"
                    className="db-chart-area"
                  />
                )}

                {/* LINE */}

                {linePath && (
                  <path
                    d={
                      linePath
                    }
                    fill="none"
                    stroke="url(#chartLineGrad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="db-chart-line"
                  />
                )}

                {/* DOTS */}

                {points.map(
                  (
                    point,
                    index
                  ) => (
                    <circle
                      key={
                        index
                      }
                      cx={
                        point.x
                      }
                      cy={
                        point.y
                      }
                      r="3.5"
                      fill="#050505"
                      stroke="#4F8CFF"
                      strokeWidth="1.5"
                      className="db-chart-dot"
                    />
                  )
                )}

                {/* LABELS */}

                {chartLabels.map(
                  (
                    label,
                    index
                  ) => (

                    <text
                      key={`${label}-${index}`}
                      x={
                        PAD_LR +
                        (index /
                          Math.max(
                            chartLabels.length -
                              1,
                            1
                          )) *
                          INNER_W
                      }
                      y={
                        SVG_H -
                        4
                      }
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.2)"
                      fontSize="9"
                      fontFamily="Inter, sans-serif"
                    >
                      {
                        label
                      }
                    </text>

                  )
                )}

              </svg>

            </div>

          </div>

          {/* =================================================
              RECENT ANALYSES + INSIGHTS
          ================================================= */}

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "1.8fr 1.2fr",
              gap:
                "24px",
              alignItems:
                "start",
            }}
          >

            {/* =================================================
                RECENT ANALYSES
            ================================================= */}

            <div
              className="db-card table-card"
              style={{
                padding:
                  "0 0 12px 0",
              }}
            >

              <div
                className="db-card-header"
                style={{
                  padding:
                    "20px 20px 14px",
                  borderBottom:
                    "1px solid var(--c-border)",
                }}
              >

                <div>

                  <h3
                    style={{
                      fontSize:
                        "0.875rem",
                      fontWeight:
                        600,
                    }}
                  >
                    Audited Logs
                  </h3>

                  <p
                    style={{
                      fontSize:
                        "0.75rem",
                      color:
                        "var(--c-text-3)",
                      marginTop:
                        "2px",
                    }}
                  >
                    Recently analyzed
                    telemetry logs
                  </p>

                </div>

                <Link
                  to="/history"
                  className="db-view-all-btn"
                >
                  View History
                  <ArrowRight
                    size={12}
                  />
                </Link>

              </div>

              <div className="db-table-wrap">

                <table className="db-table">

                  <thead>

                    <tr>

                      <th
                        style={{
                          padding:
                            "12px 20px",
                        }}
                      >
                        Filename
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Date
                      </th>

                      <th
                        style={{
                          padding:
                            "12px 20px",
                          textAlign:
                            "right",
                        }}
                      >
                        Diagnostics
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {loading && (
                      <tr>

                        <td
                          colSpan={4}
                          style={{
                            padding:
                              "40px 20px",
                            textAlign:
                              "center",
                            color:
                              "#64748B",
                          }}
                        >
                          Loading
                          analyses...
                        </td>

                      </tr>
                    )}

                    {!loading &&
                      recentAnalyses.length ===
                        0 && (
                        <tr>

                          <td
                            colSpan={4}
                            style={{
                              padding:
                                "40px 20px",
                              textAlign:
                                "center",
                              color:
                                "#64748B",
                            }}
                          >
                            No analyses
                            yet. Upload
                            a log to
                            begin.
                          </td>

                        </tr>
                      )}

                    {!loading &&
                      recentAnalyses.map(
                        (
                          analysis
                        ) => {

                          const severity =
                            (
                              analysis.severity ||
                              analysis.status ||
                              "info"
                            ).toLowerCase();

                          const meta =
                            statusMeta[
                              severity as keyof typeof statusMeta
                            ] ||
                            statusMeta.info;

                          const StatusIcon =
                            meta.icon;

                          return (

                            <tr
                              key={
                                analysis.id
                              }
                            >

                              <td
                                style={{
                                  padding:
                                    "10px 20px",
                                }}
                              >

                                <div className="db-filename">

                                  <div className="db-file-icon">

                                    <FileText
                                      size={13}
                                    />

                                  </div>

                                  <div>

                                    <div>
                                      {
                                        getFilename(
                                          analysis
                                        )
                                      }
                                    </div>

                                    <div
                                      style={{
                                        fontSize:
                                          "0.65rem",
                                        color:
                                          "#64748B",
                                        marginTop:
                                          "2px",
                                      }}
                                    >
                                      Analysis #
                                      {
                                        analysis.id
                                      }
                                    </div>

                                  </div>

                                </div>

                              </td>

                              <td>

                                <span
                                  className={`db-status ${severity}`}
                                >

                                  <span className="db-status-dot" />

                                  <StatusIcon
                                    size={
                                      11
                                    }
                                  />

                                  {
                                    meta.label
                                  }

                                </span>

                              </td>

                              <td
                                style={{
                                  color:
                                    "#94A3B8",
                                }}
                              >
                                {formatDate(
                                  analysis.created_at
                                )}
                              </td>

                              <td
                                style={{
                                  padding:
                                    "10px 20px",
                                  textAlign:
                                    "right",
                                }}
                              >

                                <Link
                                  to={`/analysis/${analysis.id}`}
                                  className="db-view-btn"
                                  style={{
                                    display:
                                      "inline-flex",
                                    gap:
                                      "4px",
                                  }}
                                >

                                  <Eye
                                    size={
                                      12
                                    }
                                  />

                                  <span>
                                    View
                                  </span>

                                </Link>

                              </td>

                            </tr>

                          );
                        }
                      )}

                  </tbody>

                </table>

              </div>

            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div
              style={{
                display:
                  "flex",
                flexDirection:
                  "column",
                gap:
                  "20px",
              }}
            >

              {/* AI INSIGHTS */}

              <div className="db-card">

                <div
                  style={{
                    borderBottom:
                      "1px solid var(--c-border)",
                    paddingBottom:
                      "10px",
                    marginBottom:
                      "16px",
                  }}
                >

                  <h3
                    style={{
                      fontSize:
                        "0.8125rem",
                      fontWeight:
                        600,
                      color:
                        "var(--c-text-1)",
                      textTransform:
                        "uppercase",
                      letterSpacing:
                        "0.08em",
                    }}
                  >
                    AI Diagnostics
                    Insights
                  </h3>

                </div>

                <div
                  style={{
                    display:
                      "flex",
                    flexDirection:
                      "column",
                    gap:
                      "10px",
                  }}
                >

                  {loading && (
                    <p
                      style={{
                        fontSize:
                          "0.75rem",
                        color:
                          "var(--c-text-3)",
                      }}
                    >
                      Loading AI
                      insights...
                    </p>
                  )}

                  {!loading &&
                    aiInsights.length ===
                      0 && (
                      <p
                        style={{
                          fontSize:
                            "0.75rem",
                          color:
                            "var(--c-text-3)",
                        }}
                      >
                        AI insights
                        will appear
                        after your
                        first log
                        analysis.
                      </p>
                    )}

                  {!loading &&
                    aiInsights.map(
                      (
                        insight
                      ) => (

                        <div
                          key={
                            insight.id
                          }
                          style={{
                            display:
                              "flex",
                            gap:
                              "10px",
                            padding:
                              "12px",
                            background:
                              "rgba(255,255,255,0.012)",
                            border:
                              "1px solid var(--c-border)",
                            borderRadius:
                              "8px",
                            alignItems:
                              "start",
                          }}
                        >

                          <Brain
                            size={
                              14
                            }
                            className="text-blue"
                            style={{
                              flexShrink:
                                0,
                              marginTop:
                                "2px",
                            }}
                          />

                          <div>

                            <p
                              style={{
                                fontSize:
                                  "0.75rem",
                                color:
                                  "var(--c-text-2)",
                                lineHeight:
                                  "1.4",
                                fontWeight:
                                  600,
                                marginBottom:
                                  "4px",
                              }}
                            >
                              {
                                insight.title ||
                                "AI Analysis"
                              }
                            </p>

                            <p
                              style={{
                                fontSize:
                                  "0.72rem",
                                color:
                                  "var(--c-text-3)",
                                lineHeight:
                                  "1.4",
                              }}
                            >
                              {
                                insight.summary ||
                                insight.root_cause ||
                                "No additional summary available."
                              }
                            </p>

                          </div>

                        </div>

                      )
                    )}

                </div>

              </div>

              {/* SYSTEM HEALTH */}

              <div
                className="db-card"
                style={{
                  padding:
                    "20px",
                }}
              >

                <div
                  style={{
                    borderBottom:
                      "1px solid var(--c-border)",
                    paddingBottom:
                      "10px",
                    marginBottom:
                      "14px",
                  }}
                >

                  <h3
                    style={{
                      fontSize:
                        "0.8125rem",
                      fontWeight:
                        600,
                      color:
                        "var(--c-text-1)",
                      textTransform:
                        "uppercase",
                      letterSpacing:
                        "0.08em",
                    }}
                  >
                    Diagnostic Health
                  </h3>

                </div>

                <div
                  style={{
                    display:
                      "flex",
                    flexDirection:
                      "column",
                    gap:
                      "12px",
                  }}
                >

                  {/* TOTAL */}

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >

                    <span
                      style={{
                        fontSize:
                          "0.75rem",
                        color:
                          "var(--c-text-2)",
                      }}
                    >
                      Total Analyses
                    </span>

                    <span
                      style={{
                        fontSize:
                          "0.6875rem",
                        color:
                          "var(--c-success)",
                        fontWeight:
                          600,
                      }}
                    >
                      {
                        totalAnalyses
                      }
                    </span>

                  </div>

                  {/* CRITICAL */}

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >

                    <span
                      style={{
                        fontSize:
                          "0.75rem",
                        color:
                          "var(--c-text-2)",
                      }}
                    >
                      Critical
                    </span>

                    <span
                      style={{
                        fontSize:
                          "0.6875rem",
                        color:
                          "#f87171",
                        fontWeight:
                          600,
                      }}
                    >
                      {
                        criticalCount
                      }
                    </span>

                  </div>

                  {/* WARNING */}

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >

                    <span
                      style={{
                        fontSize:
                          "0.75rem",
                        color:
                          "var(--c-text-2)",
                      }}
                    >
                      Warnings
                    </span>

                    <span
                      style={{
                        fontSize:
                          "0.6875rem",
                        color:
                          "#fbbf24",
                        fontWeight:
                          600,
                      }}
                    >
                      {
                        warningCount
                      }
                    </span>

                  </div>

                  {/* RESOLVED */}

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >

                    <span
                      style={{
                        fontSize:
                          "0.75rem",
                        color:
                          "var(--c-text-2)",
                      }}
                    >
                      Resolved
                    </span>

                    <span
                      style={{
                        fontSize:
                          "0.6875rem",
                        color:
                          "#34d399",
                        fontWeight:
                          600,
                      }}
                    >
                      {
                        resolvedCount
                      }
                    </span>

                  </div>

                  {/* CONFIDENCE */}

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >

                    <span
                      style={{
                        fontSize:
                          "0.75rem",
                        color:
                          "var(--c-text-2)",
                      }}
                    >
                      Avg AI Confidence
                    </span>

                    <span
                      style={{
                        fontSize:
                          "0.6875rem",
                        color:
                          "#60a5fa",
                        fontWeight:
                          600,
                      }}
                    >
                      {
                        averageConfidence
                      }
                    </span>

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



