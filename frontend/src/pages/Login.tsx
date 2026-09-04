import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Activity,
  Server,
  Cpu,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [emailValue, setEmailValue] = useState("");
  const [passValue, setPassValue] = useState("");

  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://geergoo.onrender.com/api/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailValue,
            password: passValue,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (typeof data === "string") {
          throw new Error(data);
        }

        if (data.non_field_errors) {
          throw new Error(data.non_field_errors[0]);
        }

        throw new Error(
          data.detail ||
            data.email?.[0] ||
            data.password?.[0] ||
            "Invalid email or password."
        );
      }

      if (!data.tokens?.access) {
        throw new Error("Login succeeded but no access token was returned.");
      }

      // Store JWT tokens
      localStorage.setItem(
        "access_token",
        data.tokens.access
      );

      if (data.tokens.refresh) {
        localStorage.setItem(
          "refresh_token",
          data.tokens.refresh
        );
      }

      // Store real logged-in user
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      // Redirect
      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to connect to backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    width: "100%",
    background:
      "radial-gradient(circle at 75% 20%, rgba(37,99,235,0.12), transparent 32%), #080b12",
    color: "#f8fafc",
    display: "flex",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    overflow: "hidden",
  };

  const leftStyle: React.CSSProperties = {
    width: "52%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    boxSizing: "border-box",
  };

  const rightStyle: React.CSSProperties = {
    width: "48%",
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(145deg, #0d1422 0%, #0a101b 55%, #070b12 100%)",
    borderLeft: "1px solid rgba(148,163,184,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "450px",
    padding: "42px",
    boxSizing: "border-box",
    borderRadius: "20px",
    background:
      "linear-gradient(145deg, rgba(18,26,42,0.96), rgba(10,15,25,0.96))",
    border: "1px solid rgba(148,163,184,0.13)",
    boxShadow:
      "0 30px 80px rgba(0,0,0,0.42)",
  };

  const inputContainer = (focused: boolean): React.CSSProperties => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    borderRadius: "10px",
    background: "#0b111c",
    border: focused
      ? "1px solid rgba(59,130,246,0.8)"
      : "1px solid rgba(148,163,184,0.16)",
    boxShadow: focused
      ? "0 0 0 3px rgba(59,130,246,0.10)"
      : "none",
    transition: "all 0.2s ease",
  });

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "48px",
    padding: "0 15px 0 42px",
    boxSizing: "border-box",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#f8fafc",
    fontSize: "14px",
    borderRadius: "10px",
  };

  return (
    <div style={pageStyle}>

      {/* =====================================================
          LEFT SIDE — LOGIN
      ====================================================== */}
      <div style={leftStyle}>

        <div style={cardStyle}>

          {/* Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              marginBottom: "34px",
            }}
          >
            <img
              src="/logo-icon.png"
              alt="GeerGoo"
              style={{
                width: "30px",
                height: "30px",
                objectFit: "contain",
              }}
            />

            <span
              style={{
                fontSize: "19px",
                fontWeight: 700,
                letterSpacing: "-0.4px",
              }}
            >
              GeerGoo
            </span>

            <span
              style={{
                fontSize: "9px",
                fontWeight: 600,
                color: "#60a5fa",
                border: "1px solid rgba(59,130,246,0.3)",
                padding: "3px 6px",
                borderRadius: "5px",
                marginLeft: "3px",
              }}
            >
              AI
            </span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: "30px" }}>

            <h1
              style={{
                margin: 0,
                fontSize: "34px",
                lineHeight: 1.15,
                fontWeight: 700,
                letterSpacing: "-1.2px",
              }}
            >
              Welcome back
            </h1>

            <p
              style={{
                margin: "10px 0 0",
                color: "#94a3b8",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              Sign in to your enterprise diagnostic suite.
            </p>

          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>

            {/* Email */}
            <div style={{ marginBottom: "20px" }}>

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color:
                    emailFocused || emailValue
                      ? "#bfdbfe"
                      : "#94a3b8",
                }}
              >
                Email Address
              </label>

              <div
                style={inputContainer(
                  emailFocused
                )}
              >

                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    left: "14px",
                    color: emailFocused
                      ? "#60a5fa"
                      : "#64748b",
                  }}
                />

                <input
                  type="email"
                  value={emailValue}
                  onChange={(e) =>
                    setEmailValue(e.target.value)
                  }
                  onFocus={() =>
                    setEmailFocused(true)
                  }
                  onBlur={() =>
                    setEmailFocused(false)
                  }
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                  style={inputStyle}
                />

              </div>

            </div>

            {/* Password */}
            <div style={{ marginBottom: "18px" }}>

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color:
                    passFocused || passValue
                      ? "#bfdbfe"
                      : "#94a3b8",
                }}
              >
                Password
              </label>

              <div
                style={inputContainer(
                  passFocused
                )}
              >

                <Lock
                  size={16}
                  style={{
                    position: "absolute",
                    left: "14px",
                    color: passFocused
                      ? "#60a5fa"
                      : "#64748b",
                  }}
                />

                <input
                  type="password"
                  value={passValue}
                  onChange={(e) =>
                    setPassValue(e.target.value)
                  }
                  onFocus={() =>
                    setPassFocused(true)
                  }
                  onBlur={() =>
                    setPassFocused(false)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  style={inputStyle}
                />

              </div>

            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  marginBottom: "18px",
                  padding: "11px 13px",
                  borderRadius: "8px",
                  background:
                    "rgba(239,68,68,0.08)",
                  border:
                    "1px solid rgba(239,68,68,0.22)",
                  color: "#f87171",
                  fontSize: "12px",
                  lineHeight: 1.5,
                }}
              >
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "48px",
                border: "none",
                borderRadius: "10px",
                background: loading
                  ? "#334155"
                  : "linear-gradient(135deg, #2563eb, #3b82f6)",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 700,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "9px",
                boxShadow: loading
                  ? "none"
                  : "0 10px 25px rgba(37,99,235,0.22)",
                transition: "all 0.2s ease",
              }}
            >

              {loading ? (
                <>
                  <span
                    style={{
                      width: "15px",
                      height: "15px",
                      border:
                        "2px solid rgba(255,255,255,0.35)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation:
                        "geergoo-spin 0.8s linear infinite",
                    }}
                  />

                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}

            </button>

          </form>

          {/* Register */}
          <div
            style={{
              marginTop: "25px",
              textAlign: "center",
              color: "#64748b",
              fontSize: "12px",
            }}
          >
            Don't have an account?{" "}

            <Link
              to="/register"
              style={{
                color: "#60a5fa",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Create one
            </Link>
          </div>

          {/* Security note */}
          <div
            style={{
              marginTop: "30px",
              paddingTop: "20px",
              borderTop:
                "1px solid rgba(148,163,184,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              color: "#64748b",
              fontSize: "10px",
            }}
          >
            <ShieldCheck size={13} />
            Enterprise-grade authentication
          </div>

        </div>

      </div>

      {/* =====================================================
          RIGHT SIDE — AI DIAGNOSTICS VISUAL
      ====================================================== */}
      <div style={rightStyle}>

        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.25,
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background:
              "rgba(37,99,235,0.10)",
            filter: "blur(80px)",
            top: "12%",
            left: "25%",
          }}
        />

        <div
          style={{
            position: "relative",
            width: "78%",
            maxWidth: "560px",
          }}
        >

          {/* Heading */}
          <div style={{ marginBottom: "24px" }}>

            <div
              style={{
                color: "#60a5fa",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "2px",
                marginBottom: "10px",
              }}
            >
              GEERGOO DIAGNOSTICS
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "31px",
                lineHeight: 1.2,
                letterSpacing: "-1px",
              }}
            >
              Detect.
              <br />
              Diagnose.
              <br />
              Resolve.
            </h2>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "13px",
                lineHeight: 1.7,
                maxWidth: "420px",
                marginTop: "14px",
              }}
            >
              AI-powered log diagnostics that transform
              complex production telemetry into actionable
              root-cause insights.
            </p>

          </div>

          {/* System card */}
          <div
            style={{
              borderRadius: "16px",
              border:
                "1px solid rgba(96,165,250,0.18)",
              background:
                "rgba(10,17,30,0.78)",
              backdropFilter: "blur(12px)",
              overflow: "hidden",
              boxShadow:
                "0 25px 60px rgba(0,0,0,0.35)",
            }}
          >

            {/* Card header */}
            <div
              style={{
                padding: "15px 18px",
                borderBottom:
                  "1px solid rgba(148,163,184,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                <Activity
                  size={14}
                  color="#60a5fa"
                />

                Security Engine
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "9px",
                  color: "#4ade80",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#4ade80",
                    boxShadow:
                      "0 0 8px rgba(74,222,128,0.8)",
                  }}
                />

                ACTIVE
              </div>

            </div>

            {/* Metrics */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, 1fr)",
                borderBottom:
                  "1px solid rgba(148,163,184,0.10)",
              }}
            >

              <Metric
                icon={<Server size={13} />}
                label="Telemetry"
                value="LIVE"
              />

              <Metric
                icon={<Cpu size={13} />}
                label="AI Engine"
                value="READY"
              />

              <Metric
                icon={<Activity size={13} />}
                label="Threats"
                value="MONITORING"
              />

            </div>

            {/* Console */}
            <div
              style={{
                padding: "18px",
                fontFamily:
                  "'SFMono-Regular', Consolas, monospace",
                fontSize: "10px",
              }}
            >

              <ConsoleLine>
                Ingesting syslog.stream...
              </ConsoleLine>

              <ConsoleLine>
                Parsing telemetry payload
              </ConsoleLine>

              <ConsoleLine>
                Model parameters loaded
              </ConsoleLine>

              <ConsoleLine active>
                Analyzing root anomalies...
              </ConsoleLine>

              <ConsoleLine success>
                Diagnostic pipeline ready
              </ConsoleLine>

            </div>

          </div>

          {/* Bottom labels */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "18px",
              color: "#475569",
              fontSize: "9px",
            }}
          >
            <span>REAL-TIME ANALYSIS</span>
            <span>•</span>
            <span>ROOT-CAUSE DETECTION</span>
            <span>•</span>
            <span>AI ASSISTED</span>
          </div>

        </div>

      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes geergoo-spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 900px) {
            .geergoo-login-right {
              display: none !important;
            }
          }
        `}
      </style>

    </div>
  );
}


/* =========================================================
   SMALL COMPONENTS
========================================================= */

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: "15px",
        borderRight:
          "1px solid rgba(148,163,184,0.08)",
      }}
    >
      <div
        style={{
          color: "#475569",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          marginBottom: "7px",
        }}
      >
        {icon}
        <span style={{ fontSize: "8px" }}>
          {label}
        </span>
      </div>

      <div
        style={{
          fontSize: "9px",
          fontWeight: 700,
          color: "#cbd5e1",
        }}
      >
        {value}
      </div>
    </div>
  );
}


function ConsoleLine({
  children,
  active = false,
  success = false,
}: {
  children: React.ReactNode;
  active?: boolean;
  success?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "10px",
        color: success
          ? "#4ade80"
          : active
          ? "#60a5fa"
          : "#64748b",
      }}
    >
      <Terminal size={10} />

      <span>
        {children}
      </span>

    </div>
  );
}


export default Login;
