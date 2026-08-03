import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";

function Dashboard() {
  return (
    <div className="dashboard-layout">

      <DashboardSidebar />

      <main className="dashboard-main">

        <DashboardHeader />

        <div className="stats-grid">

          <StatCard
            title="Logs Uploaded"
            value="12"
          />

          <StatCard
            title="AI Reports"
            value="9"
          />

          <StatCard
            title="Average Analysis"
            value="<5 sec"
          />

        </div>

      </main>

    </div>
  );
}

export default Dashboard;