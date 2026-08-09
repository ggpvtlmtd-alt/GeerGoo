import { useMemo, useState } from "react";
import {
  User,
  Mail,
  Shield,
  Bell,
  CreditCard,
  Trash2,
  Building,
  ExternalLink,
  Phone,
  Calendar,
  LogOut,
} from "lucide-react";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/dashboard.css";

interface UserData {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  bio: string;
  profile_picture: string | null;
  created_at: string;
}

function Profile() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);

  // --------------------------------------------------
  // GET REAL LOGGED-IN USER
  // --------------------------------------------------

  const user: UserData | null = useMemo(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Unable to read user data:", error);
      return null;
    }
  }, []);

  // --------------------------------------------------
  // DISPLAY NAME
  // --------------------------------------------------

  const fullName = user
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
    : "User";

  const displayName =
    fullName || user?.username || "User";

  // --------------------------------------------------
  // AVATAR INITIALS
  // --------------------------------------------------

  const initials = user
    ? `${user.first_name?.charAt(0) || ""}${user.last_name?.charAt(0) || ""}`
        .toUpperCase() ||
      user.username?.slice(0, 2).toUpperCase()
    : "US";

  // --------------------------------------------------
  // ACCOUNT CREATED DATE
  // --------------------------------------------------

  const createdDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not available";

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // --------------------------------------------------
  // NO USER
  // --------------------------------------------------

  if (!user) {
    return (
      <div className="db-layout">
        <DashboardSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />

        <div className="db-main">
          <DashboardHeader />

          <div className="db-content">
            <div className="db-card" style={{ padding: "40px" }}>
              <h2
                style={{
                  color: "var(--c-text-1)",
                  marginBottom: "10px",
                }}
              >
                No user session found
              </h2>

              <p
                style={{
                  color: "var(--c-text-3)",
                  marginBottom: "20px",
                }}
              >
                Please sign in again to view your profile.
              </p>

              <button
                className="db-upload-btn"
                onClick={() =>
                  (window.location.href = "/login")
                }
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <DashboardHeader />

        <div className="db-content">

          {/* PAGE HEADER */}
          <div className="db-page-heading">
            <h1 className="db-page-title">
              Profile & Settings
            </h1>

            <p className="db-page-subtitle">
              Manage your GeerGoo account, security preferences,
              and notification settings.
            </p>
          </div>

          {/* TABS */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              borderBottom:
                "1px solid var(--c-border)",
              marginBottom: "24px",
              paddingBottom: "2px",
              overflowX: "auto",
            }}
          >
            {[
              {
                id: "general",
                label: "General & Info",
              },
              {
                id: "security",
                label: "Security",
              },
              {
                id: "account",
                label: "Account",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id)
                }
                style={{
                  padding: "8px 16px",
                  fontSize: "0.8125rem",
                  fontWeight:
                    activeTab === tab.id
                      ? 600
                      : 500,
                  color:
                    activeTab === tab.id
                      ? "#3B82F6"
                      : "#94A3B8",
                  borderBottom:
                    activeTab === tab.id
                      ? "2px solid #3B82F6"
                      : "2px solid transparent",
                  transition:
                    "all 0.2s ease",
                  cursor: "pointer",
                  background: "transparent",
                  borderLeft: "none",
                  borderRight: "none",
                  borderTop: "none",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* MAIN GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 2.2fr",
              gap: "24px",
              alignItems: "start",
            }}
          >

            {/* =====================================
                LEFT COLUMN
            ===================================== */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >

              {/* PROFILE CARD */}
              <div
                className="db-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "32px 24px",
                }}
              >

                {/* PROFILE IMAGE / INITIALS */}
                {user.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt={displayName}
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "20px",
                      objectFit: "cover",
                      marginBottom: "16px",
                    }}
                  />
                ) : (
                  <div
                    className="db-avatar"
                    style={{
                      width: "72px",
                      height: "72px",
                      fontSize: "1.5rem",
                      borderRadius: "20px",
                      marginBottom: "16px",
                      background:
                        "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                      boxShadow:
                        "0 0 24px rgba(59, 130, 246, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFFFFF",
                      fontWeight: 700,
                    }}
                  >
                    {initials}
                  </div>
                )}

                <h2
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "var(--c-text-1)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {displayName}
                </h2>

                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--c-text-3)",
                    marginTop: "4px",
                  }}
                >
                  @{user.username}
                </p>

                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--c-text-3)",
                    marginTop: "3px",
                  }}
                >
                  {user.email}
                </p>

                <div
                  style={{
                    width: "100%",
                    height: "1px",
                    background:
                      "var(--c-border)",
                    margin: "20px 0",
                  }}
                />

                {/* ACCOUNT STATUS */}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--c-text-3)",
                    }}
                  >
                    Account Status
                  </span>

                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      color: "#34D399",
                      background:
                        "rgba(52, 211, 153, 0.08)",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      border:
                        "1px solid rgba(52, 211, 153, 0.2)",
                    }}
                  >
                    ACTIVE
                  </span>
                </div>

                {/* USER ID */}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--c-text-3)",
                    }}
                  >
                    User ID
                  </span>

                  <span
                    style={{
                      fontSize: "0.6875rem",
                      color: "#94A3B8",
                      fontFamily:
                        "monospace",
                    }}
                  >
                    #{user.id}
                  </span>
                </div>
              </div>

              {/* ORGANIZATION */}
              <div
                className="db-card"
                style={{ padding: "20px" }}
              >
                <h4
                  style={{
                    fontSize: "0.6875rem",
                    textTransform:
                      "uppercase",
                    letterSpacing:
                      "0.08em",
                    color:
                      "var(--c-text-3)",
                    fontWeight: 600,
                    marginBottom: "12px",
                  }}
                >
                  Workspace
                </h4>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color:
                      "var(--c-text-2)",
                    fontSize:
                      "0.8125rem",
                  }}
                >
                  <Building
                    size={14}
                    className="text-blue"
                  />

                  <span>GeerGoo</span>
                </div>
              </div>

              {/* ACCOUNT CREATED */}
              <div
                className="db-card"
                style={{ padding: "20px" }}
              >
                <h4
                  style={{
                    fontSize: "0.6875rem",
                    textTransform:
                      "uppercase",
                    letterSpacing:
                      "0.08em",
                    color:
                      "var(--c-text-3)",
                    fontWeight: 600,
                    marginBottom: "12px",
                  }}
                >
                  Member Since
                </h4>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color:
                      "var(--c-text-2)",
                    fontSize:
                      "0.8125rem",
                  }}
                >
                  <Calendar
                    size={14}
                    className="text-blue"
                  />

                  <span>
                    {createdDate}
                  </span>
                </div>
              </div>
            </div>

            {/* =====================================
                RIGHT COLUMN
            ===================================== */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >

              {/* PERSONAL INFORMATION */}
              <div className="db-card">

                <div
                  style={{
                    borderBottom:
                      "1px solid var(--c-border)",
                    paddingBottom: "12px",
                    marginBottom: "20px",
                  }}
                >
                  <h3
                    style={{
                      fontSize:
                        "0.875rem",
                      fontWeight: 600,
                      color:
                        "var(--c-text-1)",
                    }}
                  >
                    Personal Information
                  </h3>

                  <p
                    style={{
                      fontSize:
                        "0.6875rem",
                      color:
                        "var(--c-text-3)",
                      marginTop: "3px",
                    }}
                  >
                    Information associated
                    with your GeerGoo account.
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap: "16px",
                  }}
                >

                  {/* FULL NAME */}
                  <div className="form-group">

                    <label
                      style={{
                        fontSize:
                          "0.6875rem",
                        color:
                          "var(--c-text-3)",
                        textTransform:
                          "uppercase",
                        letterSpacing:
                          "0.05em",
                        marginBottom:
                          "6px",
                        fontWeight: 500,
                        display:
                          "block",
                      }}
                    >
                      Full Name
                    </label>

                    <div
                      className="db-header-search"
                      style={{
                        margin: 0,
                        maxWidth:
                          "none",
                        background:
                          "rgba(255,255,255,0.015)",
                      }}
                    >
                      <User size={14} />

                      <input
                        type="text"
                        value={displayName}
                        readOnly
                      />
                    </div>

                  </div>

                  {/* USERNAME */}
                  <div className="form-group">

                    <label
                      style={{
                        fontSize:
                          "0.6875rem",
                        color:
                          "var(--c-text-3)",
                        textTransform:
                          "uppercase",
                        letterSpacing:
                          "0.05em",
                        marginBottom:
                          "6px",
                        fontWeight: 500,
                        display:
                          "block",
                      }}
                    >
                      Username
                    </label>

                    <div
                      className="db-header-search"
                      style={{
                        margin: 0,
                        maxWidth:
                          "none",
                        background:
                          "rgba(255,255,255,0.015)",
                      }}
                    >
                      <User size={14} />

                      <input
                        type="text"
                        value={user.username}
                        readOnly
                      />
                    </div>

                  </div>

                  {/* EMAIL */}
                  <div className="form-group">

                    <label
                      style={{
                        fontSize:
                          "0.6875rem",
                        color:
                          "var(--c-text-3)",
                        textTransform:
                          "uppercase",
                        letterSpacing:
                          "0.05em",
                        marginBottom:
                          "6px",
                        fontWeight: 500,
                        display:
                          "block",
                      }}
                    >
                      Email Address
                    </label>

                    <div
                      className="db-header-search"
                      style={{
                        margin: 0,
                        maxWidth:
                          "none",
                        background:
                          "rgba(255,255,255,0.015)",
                      }}
                    >
                      <Mail size={14} />

                      <input
                        type="email"
                        value={user.email}
                        readOnly
                      />
                    </div>

                  </div>

                  {/* PHONE */}
                  <div className="form-group">

                    <label
                      style={{
                        fontSize:
                          "0.6875rem",
                        color:
                          "var(--c-text-3)",
                        textTransform:
                          "uppercase",
                        letterSpacing:
                          "0.05em",
                        marginBottom:
                          "6px",
                        fontWeight: 500,
                        display:
                          "block",
                      }}
                    >
                      Phone
                    </label>

                    <div
                      className="db-header-search"
                      style={{
                        margin: 0,
                        maxWidth:
                          "none",
                        background:
                          "rgba(255,255,255,0.015)",
                      }}
                    >
                      <Phone size={14} />

                      <input
                        type="text"
                        value={
                          user.phone ||
                          "Not provided"
                        }
                        readOnly
                      />
                    </div>

                  </div>

                </div>

                {/* BIO */}
                <div
                  style={{
                    marginTop: "16px",
                  }}
                >
                  <label
                    style={{
                      fontSize:
                        "0.6875rem",
                      color:
                        "var(--c-text-3)",
                      textTransform:
                        "uppercase",
                      letterSpacing:
                        "0.05em",
                      marginBottom:
                        "6px",
                      fontWeight: 500,
                      display:
                        "block",
                    }}
                  >
                    Bio
                  </label>

                  <div
                    style={{
                      background:
                        "rgba(255,255,255,0.015)",
                      border:
                        "1px solid var(--c-border)",
                      borderRadius:
                        "8px",
                      padding:
                        "12px",
                      fontSize:
                        "0.8125rem",
                      color:
                        user.bio
                          ? "#CBD5E1"
                          : "#64748B",
                      minHeight:
                        "48px",
                    }}
                  >
                    {user.bio ||
                      "No bio added yet."}
                  </div>
                </div>

              </div>

              {/* SECURITY */}
              <div className="db-card">

                <div
                  style={{
                    borderBottom:
                      "1px solid var(--c-border)",
                    paddingBottom: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <h3
                    style={{
                      fontSize:
                        "0.875rem",
                      fontWeight: 600,
                      color:
                        "var(--c-text-1)",
                    }}
                  >
                    Security & Notifications
                  </h3>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection:
                      "column",
                    gap: "18px",
                  }}
                >

                  {/* 2FA */}
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

                    <div
                      style={{
                        display:
                          "flex",
                        gap: "10px",
                        alignItems:
                          "center",
                      }}
                    >
                      <Shield
                        size={16}
                        className="text-blue"
                      />

                      <div>
                        <p
                          style={{
                            fontSize:
                              "0.8125rem",
                            fontWeight: 500,
                            color:
                              "#F8FAFC",
                          }}
                        >
                          Two-Factor Authentication
                        </p>

                        <p
                          style={{
                            fontSize:
                              "0.6875rem",
                            color:
                              "#64748B",
                          }}
                        >
                          Additional protection
                          for your account
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setTwoFactorEnabled(
                          !twoFactorEnabled
                        )
                      }
                      style={{
                        width: "40px",
                        height: "22px",
                        borderRadius:
                          "12px",
                        background:
                          twoFactorEnabled
                            ? "#3B82F6"
                            : "rgba(255,255,255,0.1)",
                        padding: "2px",
                        cursor:
                          "pointer",
                        border: "none",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius:
                            "50%",
                          background:
                            "#FFFFFF",
                          transform:
                            twoFactorEnabled
                              ? "translateX(18px)"
                              : "translateX(0)",
                          transition:
                            "transform 0.2s ease",
                        }}
                      />
                    </button>

                  </div>

                  {/* EMAIL ALERTS */}
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

                    <div
                      style={{
                        display:
                          "flex",
                        gap: "10px",
                        alignItems:
                          "center",
                      }}
                    >
                      <Bell
                        size={16}
                        className="text-blue"
                      />

                      <div>
                        <p
                          style={{
                            fontSize:
                              "0.8125rem",
                            fontWeight: 500,
                            color:
                              "#F8FAFC",
                          }}
                        >
                          Critical Incident Alerts
                        </p>

                        <p
                          style={{
                            fontSize:
                              "0.6875rem",
                            color:
                              "#64748B",
                          }}
                        >
                          Receive alerts at{" "}
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setEmailAlertsEnabled(
                          !emailAlertsEnabled
                        )
                      }
                      style={{
                        width: "40px",
                        height: "22px",
                        borderRadius:
                          "12px",
                        background:
                          emailAlertsEnabled
                            ? "#3B82F6"
                            : "rgba(255,255,255,0.1)",
                        padding: "2px",
                        cursor:
                          "pointer",
                        border: "none",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius:
                            "50%",
                          background:
                            "#FFFFFF",
                          transform:
                            emailAlertsEnabled
                              ? "translateX(18px)"
                              : "translateX(0)",
                          transition:
                            "transform 0.2s ease",
                        }}
                      />
                    </button>

                  </div>

                </div>

              </div>

              {/* ACCOUNT INFORMATION */}
              <div className="db-card">

                <div
                  style={{
                    borderBottom:
                      "1px solid var(--c-border)",
                    paddingBottom: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <h3
                    style={{
                      fontSize:
                        "0.875rem",
                      fontWeight: 600,
                      color:
                        "var(--c-text-1)",
                    }}
                  >
                    Account Information
                  </h3>
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    flexDirection:
                      "column",
                    gap: "12px",
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                    }}
                  >
                    <span
                      style={{
                        color:
                          "#64748B",
                        fontSize:
                          "0.75rem",
                      }}
                    >
                      User ID
                    </span>

                    <span
                      style={{
                        color:
                          "#CBD5E1",
                        fontSize:
                          "0.75rem",
                        fontFamily:
                          "monospace",
                      }}
                    >
                      {user.id}
                    </span>
                  </div>

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                    }}
                  >
                    <span
                      style={{
                        color:
                          "#64748B",
                        fontSize:
                          "0.75rem",
                      }}
                    >
                      Username
                    </span>

                    <span
                      style={{
                        color:
                          "#CBD5E1",
                        fontSize:
                          "0.75rem",
                      }}
                    >
                      {user.username}
                    </span>
                  </div>

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                    }}
                  >
                    <span
                      style={{
                        color:
                          "#64748B",
                        fontSize:
                          "0.75rem",
                      }}
                    >
                      Account Created
                    </span>

                    <span
                      style={{
                        color:
                          "#CBD5E1",
                        fontSize:
                          "0.75rem",
                      }}
                    >
                      {createdDate}
                    </span>
                  </div>

                </div>

              </div>

              {/* LOGOUT */}
              <div
                className="db-card"
                style={{
                  border:
                    "1px solid rgba(248, 113, 113, 0.2)",
                  background:
                    "rgba(248, 113, 113, 0.02)",
                }}
              >

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

                  <div>
                    <h3
                      style={{
                        fontSize:
                          "0.875rem",
                        fontWeight: 600,
                        color:
                          "#f87171",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "6px",
                      }}
                    >
                      <LogOut
                        size={15}
                      />

                      Sign Out
                    </h3>

                    <p
                      style={{
                        fontSize:
                          "0.75rem",
                        color:
                          "#94A3B8",
                        marginTop:
                          "4px",
                      }}
                    >
                      Sign out of your
                      current GeerGoo session.
                    </p>
                  </div>

                  <button
                    className="db-view-btn"
                    onClick={handleLogout}
                    style={{
                      borderColor:
                        "rgba(248, 113, 113, 0.3)",
                      color:
                        "#f87171",
                    }}
                  >
                    Sign Out
                  </button>

                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;