function DashboardSidebar() {
  return (
    <aside className="dashboard-sidebar">

      <h2 className="logo">
        Geer<span>Goo</span>
      </h2>

      <nav>

        <a href="/dashboard">🏠 Dashboard</a>

        <a href="/upload">📁 Upload Logs</a>

        <a href="/history">📄 History</a>

        <a href="/profile">👤 Profile</a>

      </nav>

    </aside>
  );
}

export default DashboardSidebar;