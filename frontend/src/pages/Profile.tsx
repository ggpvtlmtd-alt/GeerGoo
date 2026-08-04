import { useState } from "react";
import { User, Mail, Key, Shield, Bell, CreditCard, Trash2 } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/dashboard.css";

function Profile() {
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
          <div className="db-page-heading">
            <h1 className="db-page-title">Account Settings</h1>
            <p className="db-page-subtitle">
              Manage your personal info, secure API keys, and notification preferences.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: "24px", alignItems: "start" }}>
            
            {/* Left Column: Avatar Profile & Account Tier */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="db-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "32px 24px" }}>
                <div className="db-avatar" style={{ width: "72px", height: "72px", fontSize: "1.5rem", borderRadius: "18px", marginBottom: "16px" }}>
                  JP
                </div>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--c-text-1)", letterSpacing: "-0.02em" }}>Joy Princy</h2>
                <p style={{ fontSize: "0.8125rem", color: "var(--c-text-3)", marginTop: "4px" }}>joy@example.com</p>
                
                <div style={{ width: "100%", height: "1px", background: "var(--c-border)", margin: "20px 0" }} />
                
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--c-text-3)" }}>Tier Status</span>
                  <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--c-accent)", background: "var(--c-accent-dim)", padding: "2px 8px", borderRadius: "20px", border: "1px solid rgba(79, 140, 255, 0.2)" }}>ENTERPRISE AI</span>
                </div>
              </div>

              {/* Quick links Card */}
              <div className="db-card" style={{ padding: "20px" }}>
                <h4 style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--c-text-3)", fontWeight: 600, marginBottom: "12px" }}>Billing Summary</h4>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--c-text-2)", fontSize: "0.8125rem" }}>
                  <CreditCard size={14} className="text-blue" />
                  <span>Amex ending in 4002</span>
                </div>
              </div>
            </div>

            {/* Right Column: Settings Sections */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* Personal Info Card */}
              <div className="db-card">
                <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--c-text-1)" }}>Personal Information</h3>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label style={{ fontSize: "0.6875rem", color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px", fontWeight: 500 }}>Full Name</label>
                    <div className="db-header-search" style={{ margin: 0, maxWidth: "none", background: "rgba(255, 255, 255, 0.01)" }}>
                      <User size={13} />
                      <input type="text" value="Joy Princy" readOnly />
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: "0.6875rem", color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px", fontWeight: 500 }}>Email Address</label>
                    <div className="db-header-search" style={{ margin: 0, maxWidth: "none", background: "rgba(255, 255, 255, 0.01)" }}>
                      <Mail size={13} />
                      <input type="email" value="joy@example.com" readOnly />
                    </div>
                  </div>
                </div>
              </div>

              {/* API Keys Card */}
              <div className="db-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--c-border)", paddingBottom: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--c-text-1)" }}>API Access Tokens</h3>
                  <button className="db-view-all-btn" style={{ fontSize: "0.75rem" }}>Generate Token</button>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255, 255, 255, 0.01)", padding: "12px", borderRadius: "8px", border: "1px solid var(--c-border)" }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <Key size={14} className="text-blue" />
                      <div>
                        <p style={{ fontSize: "0.8125rem", fontFamily: "ui-monospace, monospace", color: "var(--c-text-1)" }}>gg_live_4a82...12df</p>
                        <p style={{ fontSize: "0.6875rem", color: "var(--c-text-3)", marginTop: "2px" }}>Production ingestion token</p>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.6875rem", color: "var(--c-text-3)" }}>Active</span>
                  </div>
                </div>
              </div>

              {/* Security & Notifications Preferences */}
              <div className="db-card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div>
                  <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "8px", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--c-text-1)" }}>System Security</h3>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Shield size={14} className="text-blue" />
                      <span style={{ fontSize: "0.8125rem", color: "var(--c-text-2)" }}>2-Factor Authentication</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "8px", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--c-text-1)" }}>Notification Channels</h3>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Bell size={14} className="text-blue" />
                      <span style={{ fontSize: "0.8125rem", color: "var(--c-text-2)" }}>Diagnostic Alerts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone Card */}
              <div className="db-card" style={{ border: "1px solid rgba(248, 113, 113, 0.2)", background: "rgba(248, 113, 113, 0.015)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--c-danger)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Trash2 size={14} /> Delete Organization
                    </h3>
                    <p style={{ fontSize: "0.75rem", color: "var(--c-text-3)", marginTop: "4px" }}>
                      Irreversibly delete this dashboard workspace and all audited log events.
                    </p>
                  </div>
                  <button className="db-view-btn" style={{ borderColor: "rgba(248, 113, 113, 0.3)", color: "var(--c-danger)" }}>
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