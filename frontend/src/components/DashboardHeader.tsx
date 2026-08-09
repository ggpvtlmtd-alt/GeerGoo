import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Settings,
  Plus,
  User,
  LogOut,
  Shield,
  X,
} from "lucide-react";

interface UserData {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_picture?: string | null;
}

function DashboardHeader() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserData | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  /* =========================
     LOAD REAL USER DATA
  ========================= */

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Unable to load user:", error);
    }
  }, []);

  /* =========================
     CLOSE MENUS WHEN CLICKING
     OUTSIDE
  ========================= */

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(target)
      ) {
        setShowUserMenu(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setShowNotifications(false);
      }

      if (
        settingsRef.current &&
        !settingsRef.current.contains(target)
      ) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =========================
     USER DISPLAY
  ========================= */

  const firstName =
    user?.first_name?.trim() ||
    user?.username?.trim() ||
    "User";

  const lastName =
    user?.last_name?.trim() || "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  const email =
    user?.email || "";

  /* =========================
     REAL INITIALS
  ========================= */

  const getInitials = () => {
    if (user?.first_name) {
      const firstParts = user.first_name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      const firstInitial =
        firstParts[0]?.charAt(0) || "";

      const lastInitial =
        user.last_name?.trim().charAt(0) || "";

      if (lastInitial) {
        return (
          firstInitial + lastInitial
        ).toUpperCase();
      }

      if (firstParts.length >= 2) {
        return (
          firstParts[0].charAt(0) +
          firstParts[1].charAt(0)
        ).toUpperCase();
      }

      return firstInitial.toUpperCase();
    }

    if (user?.username) {
      return user.username
        .substring(0, 2)
        .toUpperCase();
    }

    return "U";
  };

  const initials = getInitials();

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    setShowUserMenu(false);

    navigate("/login");
  };

  /* =========================
     TOGGLE FUNCTIONS
  ========================= */

  const toggleNotifications = () => {
    setShowNotifications((value) => !value);
    setShowSettings(false);
    setShowUserMenu(false);
  };

  const toggleSettings = () => {
    setShowSettings((value) => !value);
    setShowNotifications(false);
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu((value) => !value);
    setShowNotifications(false);
    setShowSettings(false);
  };

  return (
    <header className="db-header">

      {/* =========================
          SEARCH
      ========================= */}

      <div className="db-header-search">
        <Search size={15} />

        <input
          type="text"
          placeholder="Search logs, reports..."
          aria-label="Search logs and reports"
        />
      </div>

      <div className="db-header-spacer" />

      {/* =========================
          ACTIONS
      ========================= */}

      <div className="db-header-actions">

        {/* Upload Log */}

        <button
          className="db-upload-btn"
          onClick={() => navigate("/upload")}
          type="button"
        >
          <Plus
            size={15}
            strokeWidth={2.5}
          />

          Upload Log
        </button>

        <div
          className="db-header-divider"
          aria-hidden="true"
        />

        {/* =========================
            SETTINGS
        ========================= */}

        <div
          ref={settingsRef}
          style={{
            position: "relative",
          }}
        >
          <button
            className="db-icon-btn"
            aria-label="Settings"
            type="button"
            onClick={toggleSettings}
          >
            <Settings
              size={16}
              strokeWidth={1.75}
            />
          </button>

          {showSettings && (
            <div
              style={{
                position: "absolute",
                top: "42px",
                right: "0",
                width: "280px",
                background: "#111827",
                border: "1px solid #263247",
                borderRadius: "12px",
                padding: "16px",
                zIndex: 1000,
                boxShadow:
                  "0 18px 45px rgba(0,0,0,0.45)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "14px",
                }}
              >
                <strong
                  style={{
                    color: "#f8fafc",
                    fontSize: "14px",
                  }}
                >
                  Settings
                </strong>

                <button
                  onClick={() =>
                    setShowSettings(false)
                  }
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                  }}
                >
                  <X size={15} />
                </button>
              </div>

              <div
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background:
                    "rgba(255,255,255,0.03)",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <Shield
                    size={16}
                    color="#60a5fa"
                  />

                  <div>
                    <div
                      style={{
                        color: "#f8fafc",
                        fontSize: "13px",
                      }}
                    >
                      Security
                    </div>

                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "11px",
                        marginTop: "3px",
                      }}
                    >
                      JWT authentication active
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowSettings(false);
                  navigate("/profile");
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "11px",
                  border: "none",
                  borderRadius: "8px",
                  background:
                    "rgba(255,255,255,0.03)",
                  color: "#cbd5e1",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Account & Profile
              </button>
            </div>
          )}
        </div>

        {/* =========================
            NOTIFICATIONS
        ========================= */}

        <div
          ref={notificationRef}
          style={{
            position: "relative",
          }}
        >
          <button
            className="db-icon-btn"
            aria-label="Notifications"
            type="button"
            onClick={toggleNotifications}
          >
            <Bell
              size={16}
              strokeWidth={1.75}
            />

            <span
              className="db-notif-badge"
              aria-hidden="true"
            />
          </button>

          {showNotifications && (
            <div
              style={{
                position: "absolute",
                top: "42px",
                right: "0",
                width: "300px",
                background: "#111827",
                border: "1px solid #263247",
                borderRadius: "12px",
                padding: "16px",
                zIndex: 1000,
                boxShadow:
                  "0 18px 45px rgba(0,0,0,0.45)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "14px",
                }}
              >
                <strong
                  style={{
                    color: "#f8fafc",
                    fontSize: "14px",
                  }}
                >
                  Notifications
                </strong>

                <button
                  onClick={() =>
                    setShowNotifications(false)
                  }
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                  }}
                >
                  <X size={15} />
                </button>
              </div>

              <div
                style={{
                  padding: "13px",
                  borderRadius: "8px",
                  background:
                    "rgba(59,130,246,0.08)",
                  border:
                    "1px solid rgba(59,130,246,0.15)",
                }}
              >
                <div
                  style={{
                    color: "#60a5fa",
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "5px",
                  }}
                >
                  GeerGoo Monitoring
                </div>

                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "11px",
                    lineHeight: 1.5,
                  }}
                >
                  Your latest log analysis and
                  telemetry events will appear here.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================
            REAL USER AVATAR
        ========================= */}

        <div
          ref={userMenuRef}
          style={{
            position: "relative",
          }}
        >
          <button
            type="button"
            className="db-avatar"
            onClick={toggleUserMenu}
            aria-label="User menu"
            style={{
              cursor: "pointer",
              border: "1px solid #263247",
              background: "#111827",
            }}
          >
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt={fullName}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "inherit",
                  objectFit: "cover",
                }}
              />
            ) : (
              initials
            )}
          </button>

          {/* USER DROPDOWN */}

          {showUserMenu && (
            <div
              style={{
                position: "absolute",
                top: "44px",
                right: "0",
                width: "260px",
                background: "#111827",
                border:
                  "1px solid #263247",
                borderRadius: "12px",
                padding: "14px",
                zIndex: 1000,
                boxShadow:
                  "0 18px 45px rgba(0,0,0,0.45)",
              }}
            >
              {/* User information */}

              <div
                style={{
                  display: "flex",
                  gap: "11px",
                  alignItems: "center",
                  paddingBottom: "13px",
                  marginBottom: "8px",
                  borderBottom:
                    "1px solid #263247",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    minWidth: "38px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "rgba(59,130,246,0.12)",
                    color: "#60a5fa",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {initials}
                </div>

                <div
                  style={{
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      color: "#f8fafc",
                      fontSize: "13px",
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fullName}
                  </div>

                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "11px",
                      marginTop: "3px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {email}
                  </div>
                </div>
              </div>

              {/* Profile */}

              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false);
                  navigate("/profile");
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px",
                  border: "none",
                  borderRadius: "8px",
                  background:
                    "transparent",
                  color: "#cbd5e1",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "13px",
                }}
              >
                <User size={15} />

                View Profile
              </button>

              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px",
                  border: "none",
                  borderRadius: "8px",
                  background:
                    "transparent",
                  color: "#f87171",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "13px",
                }}
              >
                <LogOut size={15} />

                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;