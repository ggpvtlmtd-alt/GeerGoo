import { Search, Bell, Settings, Plus } from "lucide-react";

function DashboardHeader() {
  return (
    <header className="db-header">
      {/* Search */}
      <div className="db-header-search">
        <Search size={15} strokeWidth={1.75} />
        <input type="text" placeholder="Search logs, reports..." aria-label="Search" />
      </div>

      <div className="db-header-spacer" />

      {/* Actions */}
      <div className="db-header-actions">
        {/* Upload Log — original button preserved */}
        <button className="db-upload-btn">
          <Plus size={15} strokeWidth={2.5} />
          Upload Log
        </button>

        <div className="db-header-divider" aria-hidden="true" />

        {/* Settings */}
        <button className="db-icon-btn" aria-label="Settings">
          <Settings size={16} strokeWidth={1.75} />
        </button>

        {/* Notifications */}
        <button className="db-icon-btn" aria-label="Notifications">
          <Bell size={16} strokeWidth={1.75} />
          <span className="db-notif-badge" aria-hidden="true" />
        </button>

        {/* User avatar — initials from original profile name */}
        <div className="db-avatar" role="button" tabIndex={0} aria-label="User menu">
          JP
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;