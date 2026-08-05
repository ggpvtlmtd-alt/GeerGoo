import { useState } from "react";
import {
  User,
  Mail,
  Key,
  Shield,
  Bell,
  CreditCard,
  Trash2,
  Copy,
  Check,
  Building,
  ExternalLink,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/dashboard.css";

function Profile() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [copiedToken, setCopiedToken] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);

  const handleCopyToken = () => {
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

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
            <h1 className="db-page-title">Workspace Settings</h1>
            <p className="db-page-subtitle">
              Manage your personal credentials, API access tokens, security policies, and billing.
            </p>
          </div>

          {/* SaaS Settings Navigation Bar */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              borderBottom: "1px solid var(--c-border)",
              marginBottom: "24px",
              paddingBottom: "2px",
            }}
          >
            {[
              { id: "general", label: "General & Info" },
              { id: "security", label: "Security & 2FA" },
              { id: "tokens", label: "API Access Tokens" },
              { id: "billing", label: "Billing & Subscriptions" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "8px 16px",
                  fontSize: "0.8125rem",
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  color: activeTab === tab.id ? "#3B82F6" : "#94A3B8",
                  borderBottom: activeTab === tab.id ? "2px solid #3B82F6" : "2px solid transparent",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: "24px", alignItems: "start" }}>
            
            {/* Left Column: Avatar Profile & Account Summary Card */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
                <div
                  className="db-avatar"
                  style={{
                    width: "72px",
                    height: "72px",
                    fontSize: "1.5rem",
                    borderRadius: "20px",
                    marginBottom: "16px",
                    background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                    boxShadow: "0 0 24px rgba(59, 130, 246, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontWeight: 700,
                  }}
                >
                  JP
                </div>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--c-text-1)", letterSpacing: "-0.02em" }}>
                  Joy Princy
                </h2>
                <p style={{ fontSize: "0.8125rem", color: "var(--c-text-3)", marginTop: "4px" }}>
                  joy@example.com
                </p>

                <div style={{ width: "100%", height: "1px", background: "var(--c-border)", margin: "20px 0" }} />

                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--c-text-3)" }}>Tier Plan</span>
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      color: "#3B82F6",
                      background: "rgba(59, 130, 246, 0.08)",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                    }}
                  >
                    ENTERPRISE AI
                  </span>
                </div>
              </div>

              {/* Organization Info Card */}
              <div className="db-card" style={{ padding: "20px" }}>
                <h4 style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--c-text-3)", fontWeight: 600, marginBottom: "12px" }}>
                  Organization Context
                </h4>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--c-text-2)", fontSize: "0.8125rem" }}>
                  <Building size={14} className="text-blue" />
                  <span>GeerGoo Dev Core Ltd</span>
                </div>
              </div>
            </div>

            {/* Right Column: Settings Tab Contents */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* Personal Information Card */}
              <div className="db-card">
                <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--c-text-1)" }}>Personal Information</h3>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label style={{ fontSize: "0.6875rem", color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px", fontWeight: 500, display: "block" }}>
                      Full Name
                    </label>
                    <div className="db-header-search" style={{ margin: 0, maxWidth: "none", background: "rgba(255, 255, 255, 0.015)" }}>
                      <User size={14} />
                      <input type="text" value="Joy Princy" readOnly />
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: "0.6875rem", color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px", fontWeight: 500, display: "block" }}>
                      Email Address
                    </label>
                    <div className="db-header-search" style={{ margin: 0, maxWidth: "none", background: "rgba(255, 255, 255, 0.015)" }}>
                      <Mail size={14} />
                      <input type="email" value="joy@example.com" readOnly />
                    </div>
                  </div>
                </div>
              </div>

              {/* API Access Tokens Card */}
              <div className="db-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--c-border)", paddingBottom: "12px", marginBottom: "20px" }}>
                  <div>
                    <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--c-text-1)" }}>API Access Tokens</h3>
                    <p style={{ fontSize: "0.6875rem", color: "var(--c-text-3)", marginTop: "2px" }}>Secret keys for automated syslog webhook ingest</p>
                  </div>
                  <button className="db-upload-btn" style={{ height: "30px", fontSize: "0.75rem", padding: "0 12px" }}>
                    + New Token
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255, 255, 255, 0.015)", padding: "14px", borderRadius: "10px", border: "1px solid var(--c-border)" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <Key size={16} className="text-blue" />
                      <div>
                        <p style={{ fontSize: "0.8125rem", fontFamily: "monospace", color: "#F8FAFC", fontWeight: 500 }}>
                          gg_live_4a827d92f8b1c4e9
                        </p>
                        <p style={{ fontSize: "0.6875rem", color: "#64748B", marginTop: "2px" }}>
                          Created Aug 2026 · Never expires
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button className="db-view-btn" onClick={handleCopyToken} style={{ gap: "4px", fontSize: "0.75rem" }}>
                        {copiedToken ? <Check size={12} className="text-blue" /> : <Copy size={12} />}
                        <span>{copiedToken ? "Copied" : "Copy"}</span>
                      </button>
                      <span style={{ fontSize: "0.6875rem", color: "#34d399", fontWeight: 600, background: "rgba(52, 211, 153, 0.1)", padding: "2px 8px", borderRadius: "12px" }}>
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Notification Controls */}
              <div className="db-card">
                <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "12px", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--c-text-1)" }}>Security & Notifications</h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* 2FA Toggle */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <Shield size={16} className="text-blue" />
                      <div>
                        <p style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#F8FAFC" }}>Two-Factor Authentication (2FA)</p>
                        <p style={{ fontSize: "0.6875rem", color: "#64748B" }}>Require authenticator app codes on sign-in</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      style={{
                        width: "40px",
                        height: "22px",
                        borderRadius: "12px",
                        background: twoFactorEnabled ? "#3B82F6" : "rgba(255,255,255,0.1)",
                        padding: "2px",
                        cursor: "pointer",
                        transition: "background 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          background: "#FFFFFF",
                          transform: twoFactorEnabled ? "translateX(18px)" : "translateX(0)",
                          transition: "transform 0.2s ease",
                        }}
                      />
                    </button>
                  </div>

                  {/* Email Notifications Toggle */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <Bell size={16} className="text-blue" />
                      <div>
                        <p style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#F8FAFC" }}>Critical Incident Email Alerts</p>
                        <p style={{ fontSize: "0.6875rem", color: "#64748B" }}>Receive instant email dispatches on High severity exceptions</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEmailAlertsEnabled(!emailAlertsEnabled)}
                      style={{
                        width: "40px",
                        height: "22px",
                        borderRadius: "12px",
                        background: emailAlertsEnabled ? "#3B82F6" : "rgba(255,255,255,0.1)",
                        padding: "2px",
                        cursor: "pointer",
                        transition: "background 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          background: "#FFFFFF",
                          transform: emailAlertsEnabled ? "translateX(18px)" : "translateX(0)",
                          transition: "transform 0.2s ease",
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Billing Summary Card */}
              <div className="db-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--c-border)", paddingBottom: "12px", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--c-text-1)" }}>Payment Method</h3>
                  <button className="db-view-btn" style={{ fontSize: "0.75rem", gap: "4px" }}>
                    <span>Manage Portal</span>
                    <ExternalLink size={11} />
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <CreditCard size={18} className="text-blue" />
                  <div>
                    <p style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#F8FAFC" }}>American Express ending in 4002</p>
                    <p style={{ fontSize: "0.6875rem", color: "#64748B" }}>Renews on Sep 1, 2026 ($299/mo Enterprise Plan)</p>
                  </div>
                </div>
              </div>

              {/* Danger Zone Card */}
              <div className="db-card" style={{ border: "1px solid rgba(248, 113, 113, 0.2)", background: "rgba(248, 113, 113, 0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#f87171", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Trash2 size={15} /> Delete Workspace
                    </h3>
                    <p style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "4px" }}>
                      Irreversibly delete this workspace and all audited log events.
                    </p>
                  </div>
                  <button className="db-view-btn" style={{ borderColor: "rgba(248, 113, 113, 0.3)", color: "#f87171" }}>
                    Delete Space
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