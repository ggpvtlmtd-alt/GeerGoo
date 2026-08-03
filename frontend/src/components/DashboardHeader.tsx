function DashboardHeader() {
  return (
    <div className="dashboard-header">

      <div>
        <h1>Welcome Back 👋</h1>
        <p>Manage your AI log analysis from one place.</p>
      </div>

      <button className="upload-btn">
        + Upload Log
      </button>

    </div>
  );
}

export default DashboardHeader;