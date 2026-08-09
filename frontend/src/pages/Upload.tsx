import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface RecentFile {
  id: number;
  name: string;
  size: string;
  status: "success" | "warning" | "critical";
  time: string;
  analysisId?: number;
}

function Upload() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [uploadMessage, setUploadMessage] =
    useState("");

  const [uploadError, setUploadError] =
    useState("");

  /* ================================
     REAL RECENT FILES
  ================================= */

  const [recentFiles, setRecentFiles] =
    useState<RecentFile[]>([]);

  const [loadingRecentFiles, setLoadingRecentFiles] =
    useState(true);

  /* ================================
     FORMAT FILE SIZE
  ================================= */

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes <= 0) {
      return "Unknown size";
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

    return `${(
      bytes /
      (1024 * 1024 * 1024)
    ).toFixed(1)} GB`;
  };

  /* ================================
     FORMAT DATE
  ================================= */

  const formatTimeAgo = (
    dateString: string
  ) => {
    if (!dateString) {
      return "Recently";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Recently";
    }

    const now = new Date();

    const difference =
      now.getTime() - date.getTime();

    const seconds =
      Math.floor(difference / 1000);

    const minutes =
      Math.floor(seconds / 60);

    const hours =
      Math.floor(minutes / 60);

    const days =
      Math.floor(hours / 24);

    if (seconds < 60) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} ${
        minutes === 1 ? "min" : "mins"
      } ago`;
    }

    if (hours < 24) {
      return `${hours} ${
        hours === 1 ? "hour" : "hours"
      } ago`;
    }

    if (days < 7) {
      return `${days} ${
        days === 1 ? "day" : "days"
      } ago`;
    }

    return date.toLocaleDateString();
  };

  /* ================================
     FETCH REAL ANALYSIS HISTORY
  ================================= */

  const fetchRecentFiles = async () => {
    const token =
      localStorage.getItem("access_token");

    if (!token) {
      setRecentFiles([]);
      setLoadingRecentFiles(false);
      return;
    }

    try {
      setLoadingRecentFiles(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/analysis/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load recent files: ${response.status}`
        );
      }

      const data = await response.json();

      /*
        Backend may return:

        [
          {...},
          {...}
        ]

        OR:

        {
          "results": [...]
        }

        OR:

        {
          "analyses": [...]
        }
      */

      let analyses: any[] = [];

      if (Array.isArray(data)) {
        analyses = data;
      } else if (
        Array.isArray(data.results)
      ) {
        analyses = data.results;
      } else if (
        Array.isArray(data.analyses)
      ) {
        analyses = data.analyses;
      } else if (
        Array.isArray(data.data)
      ) {
        analyses = data.data;
      }

      /*
        Most recent first
      */

      analyses.sort((a, b) => {
        const dateA = new Date(
          a.created_at || 0
        ).getTime();

        const dateB = new Date(
          b.created_at || 0
        ).getTime();

        return dateB - dateA;
      });

      /*
        Convert backend analysis objects
        into Recent Telemetry Files.
      */

      const mappedFiles: RecentFile[] =
        analyses
          .slice(0, 5)
          .map((analysis: any) => {
            /*
              Try several possible backend
              field names so this works with
              your current API response.
            */

            const fileObject =
              analysis.log_file ||
              analysis.file ||
              {};

            const fileName =
              fileObject.name ||
              analysis.log_file_name ||
              analysis.filename ||
              analysis.file_name ||
              `Log File #${
                analysis.log_file_id ||
                analysis.id
              }`;

            const fileSize =
              fileObject.size ||
              analysis.file_size ||
              0;

            const severity =
              String(
                analysis.severity || "info"
              ).toLowerCase();

            let status:
              | "success"
              | "warning"
              | "critical";

            if (
              severity === "critical"
            ) {
              status = "critical";
            } else if (
              severity === "warning"
            ) {
              status = "warning";
            } else {
              status = "success";
            }

            return {
              id:
                analysis.log_file_id ||
                analysis.id,

              name: fileName,

              size:
                typeof fileSize === "number"
                  ? formatFileSize(fileSize)
                  : fileSize
                  ? String(fileSize)
                  : "Size unavailable",

              status,

              time: formatTimeAgo(
                analysis.created_at ||
                  fileObject.uploaded_at
              ),

              analysisId:
                analysis.id,
            };
          });

      setRecentFiles(mappedFiles);
    } catch (error) {
      console.error(
        "Failed to fetch recent telemetry:",
        error
      );

      setRecentFiles([]);
    } finally {
      setLoadingRecentFiles(false);
    }
  };

  /* ================================
     LOAD ON PAGE OPEN
  ================================= */

  useEffect(() => {
    fetchRecentFiles();
  }, []);

  /* ================================
     UPLOAD + GEMINI ANALYSIS
  ================================= */

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError(
        "Please select a log file first."
      );
      return;
    }

    const token =
      localStorage.getItem("access_token");

    if (!token) {
      setUploadError(
        "Please sign in first."
      );
      return;
    }

    setUploading(true);
    setUploadMessage("");
    setUploadError("");

    try {
      const formData = new FormData();

      formData.append(
        "file",
        selectedFile
      );

      setUploadMessage(
        "Uploading log file..."
      );

      /* ============================
         UPLOAD FILE
      ============================ */

      const uploadResponse =
        await fetch(
          "http://127.0.0.1:8000/api/logs/upload/",
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body: formData,
          }
        );

      const uploadData =
        await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadData.message ||
            uploadData.detail ||
            "File upload failed."
        );
      }

      const logId =
        uploadData.file.id;

      console.log(
        "Upload successful:",
        uploadData
      );

      setUploadMessage(
        "File uploaded. Gemini is analyzing the log..."
      );

      /* ============================
         GEMINI ANALYSIS
      ============================ */

      const analysisResponse =
        await fetch(
          `http://127.0.0.1:8000/api/analysis/analyze/${logId}/`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const analysisData =
        await analysisResponse.json();

      if (!analysisResponse.ok) {
        throw new Error(
          analysisData.message ||
            analysisData.detail ||
            "AI analysis failed."
        );
      }

      console.log(
        "Gemini analysis successful:",
        analysisData
      );

      const analysisId =
        analysisData.analysis.id;

      /*
        Refresh recent files so the newly
        uploaded file appears in the UI.
      */

      await fetchRecentFiles();

      setUploadMessage(
        "Analysis completed. Opening diagnosis..."
      );

      setTimeout(() => {
        navigate(
          `/analysis/${analysisId}`
        );
      }, 500);

    } catch (error) {
      console.error(
        "Upload / Analysis error:",
        error
      );

      setUploadError(
        error instanceof Error
          ? error.message
          : "Unable to process the log file."
      );
    } finally {
      setUploading(false);
    }
  };

  /* ================================
     UI
  ================================= */

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
          setCollapsed((c) => !c)
        }
      />

      <div className="db-main">

        <DashboardHeader />

        <div className="db-content">

          {/* ============================
              PAGE HEADER
          ============================ */}

          <div className="db-page-heading">

            <h1 className="db-page-title">
              Ingest Log Telemetry
            </h1>

            <p className="db-page-subtitle">
              Upload syslog data to deploy
              automated AI root-cause
              analysis pipelines.
            </p>

          </div>

          {/* ============================
              MAIN GRID
          ============================ */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1.8fr 1.2fr",
              gap: "24px",
              alignItems: "start",
            }}
          >

            {/* ==========================
                LEFT COLUMN
            ========================== */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >

              {/* UPLOAD CARD */}

              <div
                className="db-card"
                onMouseEnter={() =>
                  setIsHovered(true)
                }
                onMouseLeave={() =>
                  setIsHovered(false)
                }
                style={{
                  padding: "48px 32px",
                  textAlign: "center",

                  border:
                    isHovered
                      ? "1px dashed rgba(59, 130, 246, 0.4)"
                      : "1px dashed rgba(255, 255, 255, 0.12)",

                  background:
                    isHovered
                      ? "rgba(59, 130, 246, 0.02)"
                      : "#111827",

                  transition:
                    "all 0.28s cubic-bezier(0.25, 1, 0.5, 1)",

                  boxShadow:
                    isHovered
                      ? "0 0 32px rgba(59, 130, 246, 0.08)"
                      : "var(--shadow-base)",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >

                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "16px",
                      background:
                        "rgba(59, 130, 246, 0.08)",
                      border:
                        "1px solid rgba(59, 130, 246, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#3B82F6",
                      transform:
                        isHovered
                          ? "scale(1.06)"
                          : "scale(1)",
                      transition:
                        "transform 0.28s ease",
                    }}
                  >
                    <UploadIcon
                      size={24}
                      strokeWidth={2}
                    />
                  </div>

                  <div>

                    <h3
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "#F8FAFC",
                        letterSpacing:
                          "-0.01em",
                      }}
                    >
                      Drop syslog file to
                      start deployment
                    </h3>

                    <p
                      style={{
                        fontSize:
                          "0.8125rem",
                        color: "#94A3B8",
                        marginTop: "4px",
                      }}
                    >
                      Drag & drop your log
                      streams or select
                      from drive
                    </p>

                  </div>

                  <input
                    id="log-file-input"
                    type="file"
                    accept=".log,.txt,.csv,.json"
                    style={{
                      display: "none",
                    }}
                    onChange={(e) => {
                      const file =
                        e.target.files?.[0];

                      if (file) {
                        setSelectedFile(
                          file
                        );

                        setUploadMessage(
                          ""
                        );

                        setUploadError(
                          ""
                        );
                      }
                    }}
                  />

                  <label
                    htmlFor="log-file-input"
                    className="db-upload-btn"
                    style={{
                      height: "36px",
                      padding: "0 20px",
                      fontSize:
                        "0.8125rem",
                      cursor: "pointer",
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                    }}
                  >
                    Select Log File
                  </label>

                  {selectedFile && (
                    <div
                      style={{
                        marginTop: "4px",
                        fontSize:
                          "0.75rem",
                        color: "#3B82F6",
                      }}
                    >
                      Selected:{" "}
                      {selectedFile.name}
                    </div>
                  )}

                  {selectedFile && (
                    <button
                      className="db-upload-btn"
                      type="button"
                      onClick={
                        handleUpload
                      }
                      disabled={uploading}
                      style={{
                        height: "36px",
                        padding:
                          "0 20px",
                        fontSize:
                          "0.8125rem",
                        marginTop: "8px",
                        opacity:
                          uploading
                            ? 0.6
                            : 1,
                        cursor:
                          uploading
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {uploading
                        ? "Analyzing with Gemini..."
                        : "Upload & Analyze"}
                    </button>
                  )}

                  {uploadMessage && (
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize:
                          "0.75rem",
                        color: "#34d399",
                      }}
                    >
                      {uploadMessage}
                    </div>
                  )}

                  {uploadError && (
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize:
                          "0.75rem",
                        color: "#ef4444",
                      }}
                    >
                      {uploadError}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems:
                        "center",
                      marginTop: "8px",
                      flexWrap:
                        "wrap",
                      justifyContent:
                        "center",
                    }}
                  >
                    {[
                      ".log",
                      ".txt",
                      ".csv",
                      ".json",
                    ].map(
                      (ext) => (
                        <span
                          key={ext}
                          style={{
                            fontSize:
                              "0.6875rem",
                            color:
                              "#64748B",
                            background:
                              "rgba(255, 255, 255, 0.02)",
                            padding:
                              "3px 10px",
                            borderRadius:
                              "12px",
                            border:
                              "1px solid rgba(255, 255, 255, 0.05)",
                          }}
                        >
                          {ext}
                        </span>
                      )
                    )}
                  </div>

                </div>
              </div>

              {/* PIPELINE */}

              <div
                className="db-card"
                style={{
                  padding: "24px",
                }}
              >

                <div
                  style={{
                    borderBottom:
                      "1px solid var(--c-border)",
                    paddingBottom:
                      "12px",
                    marginBottom:
                      "16px",
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "8px",
                    }}
                  >

                    <Terminal
                      size={15}
                      className="text-blue"
                    />

                    <h3
                      style={{
                        fontSize:
                          "0.875rem",
                        fontWeight: 600,
                        color:
                          "#F8FAFC",
                      }}
                    >
                      Ingestion Pipeline
                      Execution
                    </h3>

                  </div>

                  <span
                    style={{
                      fontSize:
                        "0.6875rem",
                      color:
                        uploading
                          ? "#3B82F6"
                          : "#64748B",
                      fontWeight: 600,
                      background:
                        "rgba(59, 130, 246, 0.08)",
                      padding:
                        "2px 8px",
                      borderRadius:
                        "12px",
                    }}
                  >
                    {uploading
                      ? "RUNNING"
                      : "READY"}
                  </span>

                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection:
                      "column",
                    gap: "12px",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "10px",
                      fontSize:
                        "0.8125rem",
                      color:
                        "#94A3B8",
                    }}
                  >

                    <CheckCircle2
                      size={15}
                      style={{
                        color:
                          selectedFile
                            ? "#34d399"
                            : "#64748B",
                        flexShrink: 0,
                      }}
                    />

                    <span>
                      Upload log stream:{" "}
                      <strong
                        style={{
                          color:
                            "#F8FAFC",
                        }}
                      >
                        {selectedFile
                          ? selectedFile.name
                          : "Waiting for file"}
                      </strong>
                    </span>

                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "10px",
                      fontSize:
                        "0.8125rem",
                      color:
                        "#94A3B8",
                    }}
                  >

                    <CheckCircle2
                      size={15}
                      style={{
                        color:
                          "#34d399",
                        flexShrink: 0,
                      }}
                    />

                    <span>
                      Sanitize PII
                      credentials &
                      scrub auth keys
                    </span>

                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "10px",
                      fontSize:
                        "0.8125rem",
                      color:
                        uploading
                          ? "#F8FAFC"
                          : "#64748B",
                    }}
                  >

                    {uploading ? (
                      <Loader2
                        size={15}
                        className="text-blue"
                        style={{
                          animation:
                            "spin 1.5s linear infinite",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <Cpu
                        size={15}
                        style={{
                          flexShrink: 0,
                        }}
                      />
                    )}

                    <span>
                      {uploading
                        ? "Gemini AI diagnostic analysis running..."
                        : "Execute AI Exception Diagnostic Model"}
                    </span>

                  </div>

                  {uploading && (
                    <div
                      style={{
                        margin:
                          "4px 0 8px 25px",
                      }}
                    >

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          fontSize:
                            "0.75rem",
                          color:
                            "#94A3B8",
                          marginBottom:
                            "4px",
                        }}
                      >
                        <span>
                          AI analysis in progress
                        </span>

                        <span
                          style={{
                            color:
                              "#3B82F6",
                            fontWeight: 600,
                          }}
                        >
                          PROCESSING
                        </span>
                      </div>

                      <div
                        style={{
                          width: "100%",
                          height: "4px",
                          background:
                            "rgba(255, 255, 255, 0.04)",
                          borderRadius:
                            "2px",
                          overflow:
                            "hidden",
                        }}
                      >

                        <div
                          style={{
                            width: "70%",
                            height: "100%",
                            background:
                              "#3B82F6",
                            borderRadius:
                              "2px",
                            boxShadow:
                              "0 0 10px rgba(59, 130, 246, 0.5)",
                            animation:
                              "pulse 1.5s ease-in-out infinite",
                          }}
                        />

                      </div>

                    </div>
                  )}

                </div>

                <button
                  type="button"
                  className="db-upload-btn"
                  disabled={
                    uploading ||
                    !selectedFile
                  }
                  onClick={
                    handleUpload
                  }
                  style={{
                    width: "100%",
                    justifyContent:
                      "center",
                    height: "40px",
                    marginTop:
                      "20px",
                    opacity:
                      uploading ||
                      !selectedFile
                        ? 0.5
                        : 1,
                    cursor:
                      uploading ||
                      !selectedFile
                        ? "not-allowed"
                        : "pointer",
                  }}
                >

                  <span>
                    {uploading
                      ? "Running AI Diagnostics..."
                      : "Deploy Diagnostic Analysis"}
                  </span>

                  {uploading ? (
                    <Loader2
                      size={14}
                      style={{
                        animation:
                          "spin 1.5s linear infinite",
                      }}
                    />
                  ) : (
                    <ArrowRight
                      size={14}
                    />
                  )}

                </button>

              </div>
            </div>

            {/* ==========================
                RIGHT COLUMN
            ========================== */}

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "20px",
              }}
            >

              {/* ========================
                  REAL RECENT FILES
              ======================== */}

              <div className="db-card">

                <div
                  style={{
                    borderBottom:
                      "1px solid var(--c-border)",
                    paddingBottom:
                      "12px",
                    marginBottom:
                      "16px",
                  }}
                >

                  <h3
                    style={{
                      fontSize:
                        "0.8125rem",
                      fontWeight: 600,
                      color:
                        "var(--c-text-1)",
                      textTransform:
                        "uppercase",
                      letterSpacing:
                        "0.08em",
                    }}
                  >
                    Recent Telemetry
                    Files
                  </h3>

                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection:
                      "column",
                    gap: "12px",
                  }}
                >

                  {/* LOADING */}

                  {loadingRecentFiles && (
                    <div
                      style={{
                        padding:
                          "25px 10px",
                        textAlign:
                          "center",
                        color:
                          "var(--c-text-3)",
                        fontSize:
                          "0.75rem",
                      }}
                    >
                      <Loader2
                        size={18}
                        style={{
                          animation:
                            "spin 1.5s linear infinite",
                          marginBottom:
                            "8px",
                        }}
                      />

                      <div>
                        Loading telemetry...
                      </div>
                    </div>
                  )}

                  {/* EMPTY */}

                  {!loadingRecentFiles &&
                    recentFiles.length ===
                      0 && (
                      <div
                        style={{
                          padding:
                            "25px 10px",
                          textAlign:
                            "center",
                          color:
                            "var(--c-text-3)",
                          fontSize:
                            "0.75rem",
                        }}
                      >
                        No telemetry
                        files analyzed
                        yet.
                      </div>
                    )}

                  {/* REAL FILES */}

                  {!loadingRecentFiles &&
                    recentFiles.map(
                      (file) => (
                        <div
                          key={`${file.id}-${file.analysisId}`}
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "space-between",
                            gap: "10px",
                            background:
                              "rgba(255, 255, 255, 0.015)",
                            padding:
                              "12px",
                            borderRadius:
                              "10px",
                            border:
                              "1px solid var(--c-border)",
                            cursor:
                              file.analysisId
                                ? "pointer"
                                : "default",
                          }}
                          onClick={() => {
                            if (
                              file.analysisId
                            ) {
                              navigate(
                                `/analysis/${file.analysisId}`
                              );
                            }
                          }}
                        >

                          <div
                            className="db-file-icon"
                            style={{
                              width:
                                "26px",
                              height:
                                "26px",
                              minWidth:
                                "26px",
                            }}
                          >
                            <FileText
                              size={13}
                            />
                          </div>

                          <div
                            style={{
                              flex: 1,
                              minWidth: 0,
                            }}
                          >

                            <p
                              style={{
                                fontSize:
                                  "0.8125rem",
                                fontWeight: 500,
                                color:
                                  "var(--c-text-1)",
                                whiteSpace:
                                  "nowrap",
                                overflow:
                                  "hidden",
                                textOverflow:
                                  "ellipsis",
                              }}
                              title={
                                file.name
                              }
                            >
                              {file.name}
                            </p>

                            <p
                              style={{
                                fontSize:
                                  "0.6875rem",
                                color:
                                  "var(--c-text-3)",
                                marginTop:
                                  "2px",
                              }}
                            >
                              {file.size}
                              {" · "}
                              {file.time}
                            </p>

                          </div>

                          <div>

                            {file.status ===
                            "critical" ? (
                              <AlertTriangle
                                size={14}
                                style={{
                                  color:
                                    "#ef4444",
                                }}
                              />
                            ) : file.status ===
                              "warning" ? (
                              <AlertTriangle
                                size={14}
                                style={{
                                  color:
                                    "var(--c-warning)",
                                }}
                              />
                            ) : (
                              <CheckCircle2
                                size={14}
                                className="text-blue"
                              />
                            )}

                          </div>

                        </div>
                      )
                    )}

                </div>

              </div>

              {/* ========================
                  GUIDANCE
              ======================== */}

              <div className="db-card">

                <div
                  style={{
                    borderBottom:
                      "1px solid var(--c-border)",
                    paddingBottom:
                      "12px",
                    marginBottom:
                      "16px",
                  }}
                >

                  <h3
                    style={{
                      fontSize:
                        "0.8125rem",
                      fontWeight: 600,
                      color:
                        "var(--c-text-1)",
                      textTransform:
                        "uppercase",
                      letterSpacing:
                        "0.08em",
                    }}
                  >
                    Ingestion Guidance
                  </h3>

                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection:
                      "column",
                    gap: "14px",
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",
                      gap: "10px",
                      alignItems:
                        "start",
                    }}
                  >

                    <ShieldCheck
                      size={15}
                      className="text-blue"
                      style={{
                        marginTop:
                          "2px",
                        flexShrink: 0,
                      }}
                    />

                    <p
                      style={{
                        fontSize:
                          "0.75rem",
                        color:
                          "var(--c-text-2)",
                        lineHeight:
                          "1.4",
                      }}
                    >
                      <strong
                        style={{
                          color:
                            "#F8FAFC",
                        }}
                      >
                        Client Proxy PII
                        Scrubbing:
                      </strong>{" "}
                      Passwords,
                      private keys,
                      and OAuth
                      tokens are
                      redacted
                      automatically
                      before hitting
                      our server
                      proxy.
                    </p>

                  </div>

                  <div
                    style={{
                      display:
                        "flex",
                      gap: "10px",
                      alignItems:
                        "start",
                    }}
                  >

                    <HelpCircle
                      size={15}
                      className="text-blue"
                      style={{
                        marginTop:
                          "2px",
                        flexShrink: 0,
                      }}
                    />

                    <p
                      style={{
                        fontSize:
                          "0.75rem",
                        color:
                          "var(--c-text-2)",
                        lineHeight:
                          "1.4",
                      }}
                    >
                      <strong
                        style={{
                          color:
                            "#F8FAFC",
                        }}
                      >
                        File Size Limits:
                      </strong>{" "}
                      Standard
                      uploads support
                      up to 50 MB
                      per file. For
                      continuous
                      ingestion
                      streams, use
                      our CLI
                      integration
                      endpoint.
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