import { useEffect, useState } from "react";
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
  RefreshCw,
} from "lucide-react";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/dashboard.css";

interface AnalysisItem {
  id: number;
  log_file_id: number;

  filename?: string;
  file_name?: string;

  severity: string;
  error_code: string;
  title: string;
  summary: string;

  runtime_framework: string;
  cluster_node: string;
  thread_context: string;

  confidence_score: number;
  analysis_latency: number;

  created_at: string;

  size?: string | number;

  log_file?: {
    id: number;
    name: string;
    size?: number;
  };
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
    icon: CheckCircle2,
    label: "Info",
  },
};

function History() {
  const [collapsed, setCollapsed] = useState(false);

  const [analyses, setAnalyses] =
    useState<AnalysisItem[]>([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 10;

  // =====================================================
  // GET ACCESS TOKEN
  // =====================================================

  const getAccessToken = () => {
    return localStorage.getItem(
      "access_token"
    );
  };

  // =====================================================
  // LOAD REAL ANALYSIS HISTORY
  // =====================================================

  const fetchHistory = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getAccessToken();

      console.log(
        "History token exists:",
        !!token
      );

      if (!token) {
        throw new Error(
          "Authentication required. Please sign in again."
        );
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/analysis/",
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

      console.log(
        "History HTTP status:",
        response.status
      );

      const data =
        await response.json();

      console.log(
        "History API response:",
        data
      );

      // -------------------------------------------------
      // API ERROR
      // -------------------------------------------------

      if (!response.ok) {
        throw new Error(
          data.detail ||
          data.message ||
          "Unable to load analysis history."
        );
      }

      // -------------------------------------------------
      // YOUR DJANGO RESPONSE
      //
      // {
      //   success: true,
      //   count: 3,
      //   analyses: [...]
      // }
      // -------------------------------------------------

      if (
        data.success === true &&
        Array.isArray(data.analyses)
      ) {
        setAnalyses(
          data.analyses
        );

        console.log(
          "Analyses loaded:",
          data.analyses.length
        );

        return;
      }

      // -------------------------------------------------
      // FALLBACK: ARRAY
      // -------------------------------------------------

      if (Array.isArray(data)) {
        setAnalyses(data);
        return;
      }

      // -------------------------------------------------
      // FALLBACK: DRF RESULTS
      // -------------------------------------------------

      if (
        Array.isArray(data.results)
      ) {
        setAnalyses(
          data.results
        );

        return;
      }

      console.warn(
        "Unexpected History API response:",
        data
      );

      setAnalyses([]);

    } catch (err) {
      console.error(
        "History loading error:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to load analysis history."
        );
      }

      setAnalyses([]);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD HISTORY WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    fetchHistory();
  }, []);

  // =====================================================
  // GET FILE NAME
  // =====================================================

  const getFilename = (
    analysis: AnalysisItem
  ) => {
    return (
      analysis.filename ||
      analysis.file_name ||
      analysis.log_file?.name ||
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
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredAnalyses =
    analyses.filter(
      (analysis) => {
        const filename =
          getFilename(
            analysis
          );

        const searchText =
          `
          ${filename}
          ${analysis.title}
          ${analysis.severity}
          ${analysis.error_code}
          ${analysis.runtime_framework}
        `.toLowerCase();

        return searchText.includes(
          searchQuery.toLowerCase()
        );
      }
    );

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredAnalyses.length /
          itemsPerPage
      )
    );

  const safePage =
    Math.min(
      currentPage,
      totalPages
    );

  const startIndex =
    (safePage - 1) *
    itemsPerPage;

  const endIndex =
    startIndex +
    itemsPerPage;

  const paginatedAnalyses =
    filteredAnalyses.slice(
      startIndex,
      endIndex
    );

  // =====================================================
  // RESET PAGE WHEN SEARCH CHANGES
  // =====================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // =====================================================
  // EXPORT CSV
  // =====================================================

  const exportCSV = () => {
    if (
      !filteredAnalyses.length
    ) {
      return;
    }

    const headers = [
      "ID",
      "Filename",
      "Severity",
      "Error Code",
      "Title",
      "Runtime Framework",
      "Confidence",
      "Latency",
      "Created At",
    ];

    const rows =
      filteredAnalyses.map(
        (analysis) => [
          analysis.id,
          getFilename(
            analysis
          ),
          analysis.severity,
          analysis.error_code ||
            "",
          analysis.title ||
            "",
          analysis.runtime_framework ||
            "",
          `${analysis.confidence_score}%`,
          `${analysis.analysis_latency}s`,
          formatDate(
            analysis.created_at
          ),
        ]
      );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(
              value
            ).replace(
              /"/g,
              '""'
            )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      "geergoo-analysis-history.csv";

    link.click();

    URL.revokeObjectURL(
      url
    );
  };

  // =====================================================
  // UI
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
        collapsed={collapsed}
        onToggle={() =>
          setCollapsed(
            (c) => !c
          )
        }
      />

      <div className="db-main">

        <DashboardHeader />

        <div className="db-content">

          {/* PAGE HEADER */}

          <div className="db-page-heading">

            <h1 className="db-page-title">
              Analysis History
            </h1>

            <p className="db-page-subtitle">
              Audit previously uploaded
              telemetry logs, generated AI
              diagnoses, and remediation
              results.
            </p>

          </div>

          {/* CONTROL BAR */}

          <div
            className="db-card"
            style={{
              padding:
                "16px 20px",
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems:
                "center",
              justifyContent:
                "space-between",
              marginBottom:
                "20px",
            }}
          >

            <div
              style={{
                display:
                  "flex",
                gap: "10px",
                flex: 1,
                maxWidth:
                  "520px",
              }}
            >

              {/* SEARCH */}

              <div
                className="db-header-search"
                style={{
                  margin: 0,
                  maxWidth:
                    "none",
                  flex: 1,
                  background:
                    "rgba(255,255,255,0.015)",
                }}
              >

                <Search size={14} />

                <input
                  type="text"
                  placeholder="Search analyses..."
                  value={
                    searchQuery
                  }
                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value
                    )
                  }
                />

              </div>

              <button
                className="db-view-btn"
                style={{
                  display:
                    "flex",
                  gap: "6px",
                  alignItems:
                    "center",
                }}
              >
                <Filter
                  size={13}
                />

                <span>
                  Filters
                </span>
              </button>

            </div>

            {/* ACTIONS */}

            <div
              style={{
                display:
                  "flex",
                gap: "8px",
              }}
            >

              {/* REFRESH */}

              <button
                className="db-view-btn"
                onClick={
                  fetchHistory
                }
                disabled={
                  loading
                }
                style={{
                  display:
                    "flex",
                  gap: "6px",
                  alignItems:
                    "center",
                }}
              >

                <RefreshCw
                  size={13}
                  style={{
                    animation:
                      loading
                        ? "spin 1s linear infinite"
                        : "none",
                  }}
                />

                <span>
                  Refresh
                </span>

              </button>

              {/* EXPORT */}

              <button
                className="db-view-btn"
                onClick={
                  exportCSV
                }
                style={{
                  display:
                    "flex",
                  gap: "6px",
                  alignItems:
                    "center",
                }}
              >

                <Download
                  size={13}
                />

                <span>
                  Export CSV
                </span>

              </button>

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div
              className="db-card"
              style={{
                padding:
                  "16px 20px",
                marginBottom:
                  "20px",
                border:
                  "1px solid rgba(248,113,113,0.25)",
                color:
                  "#f87171",
              }}
            >
              {error}
            </div>
          )}

          {/* TABLE */}

          <div
            className="db-card table-card"
            style={{
              padding:
                "0 0 12px 0",
            }}
          >

            <div className="db-table-wrap">

              <table className="db-table">

                <thead>

                  <tr>

                    <th
                      style={{
                        padding:
                          "14px 20px 10px",
                      }}
                    >
                      Filename
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Error
                    </th>

                    <th>
                      Date Audited
                    </th>

                    <th>
                      Confidence
                    </th>

                    <th
                      style={{
                        padding:
                          "14px 20px 10px",
                        textAlign:
                          "right",
                      }}
                    >
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {/* LOADING */}

                  {loading && (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          padding:
                            "50px 20px",
                          textAlign:
                            "center",
                          color:
                            "#64748B",
                        }}
                      >
                        Loading analysis
                        history...
                      </td>
                    </tr>
                  )}

                  {/* EMPTY */}

                  {!loading &&
                    !error &&
                    paginatedAnalyses.length ===
                      0 && (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            padding:
                              "50px 20px",
                            textAlign:
                              "center",
                            color:
                              "#64748B",
                          }}
                        >
                          {searchQuery
                            ? "No analyses match your search."
                            : "No analyses found. Upload a log to begin."}
                        </td>
                      </tr>
                    )}

                  {/* REAL DATA */}

                  {!loading &&
                    paginatedAnalyses.map(
                      (analysis) => {

                        const severity =
                          (
                            analysis.severity ||
                            "info"
                          ).toLowerCase();

                        const meta =
                          statusMeta[
                            severity as keyof typeof statusMeta
                          ] ||
                          statusMeta.info;

                        const StatusIcon =
                          meta.icon;

                        const filename =
                          getFilename(
                            analysis
                          );

                        return (
                          <tr
                            key={
                              analysis.id
                            }
                          >

                            {/* FILENAME */}

                            <td
                              style={{
                                padding:
                                  "12px 20px",
                              }}
                            >

                              <div className="db-filename">

                                <div className="db-file-icon">

                                  <FileText
                                    size={14}
                                  />

                                </div>

                                <div>

                                  <div>
                                    {filename}
                                  </div>

                                  <div
                                    style={{
                                      fontSize:
                                        "0.65rem",
                                      color:
                                        "#64748B",
                                      marginTop:
                                        "3px",
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

                            {/* STATUS */}

                            <td>

                              <span
                                className={`db-status ${severity}`}
                              >

                                <span className="db-status-dot" />

                                <StatusIcon
                                  size={11}
                                />

                                {
                                  meta.label
                                }

                              </span>

                            </td>

                            {/* ERROR */}

                            <td
                              style={{
                                fontFamily:
                                  "monospace",
                                fontSize:
                                  "0.75rem",
                                color:
                                  "#94A3B8",
                              }}
                            >
                              {
                                analysis.error_code ||
                                "—"
                              }
                            </td>

                            {/* DATE */}

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

                            {/* CONFIDENCE */}

                            <td
                              style={{
                                color:
                                  "#34D399",
                                fontWeight:
                                  600,
                                fontSize:
                                  "0.75rem",
                              }}
                            >
                              {Number(
                                analysis.confidence_score
                              ).toFixed(0)}
                              %
                            </td>

                            {/* VIEW */}

                            <td
                              style={{
                                padding:
                                  "12px 20px",
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
                                    "6px",
                                }}
                              >

                                <Eye
                                  size={13}
                                />

                                <span>
                                  View Diagnosis
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

            {/* PAGINATION */}

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                padding:
                  "16px 20px 4px",
                borderTop:
                  "1px solid var(--c-border)",
                marginTop:
                  "12px",
              }}
            >

              <span
                style={{
                  fontSize:
                    "0.75rem",
                  color:
                    "var(--c-text-3)",
                }}
              >
                {filteredAnalyses.length ===
                0
                  ? "Showing 0 analyses"
                  : `Showing ${
                      startIndex + 1
                    }–${Math.min(
                      endIndex,
                      filteredAnalyses.length
                    )} of ${
                      filteredAnalyses.length
                    } analyses`}
              </span>

              <div
                style={{
                  display:
                    "flex",
                  gap: "6px",
                }}
              >

                <button
                  className="db-view-btn"
                  style={{
                    padding:
                      "6px",
                  }}
                  disabled={
                    safePage <= 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          1,
                          page - 1
                        )
                    )
                  }
                >
                  <ChevronLeft
                    size={14}
                  />
                </button>

                <span
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    padding:
                      "0 8px",
                    fontSize:
                      "0.75rem",
                    color:
                      "#94A3B8",
                  }}
                >
                  {safePage} /{" "}
                  {totalPages}
                </span>

                <button
                  className="db-view-btn"
                  style={{
                    padding:
                      "6px",
                  }}
                  disabled={
                    safePage >=
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          totalPages,
                          page + 1
                        )
                    )
                  }
                >
                  <ChevronRight
                    size={14}
                  />
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