import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  History,
  User,
  ChevronLeft,
} from "lucide-react";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Upload,           label: "Upload Logs", href: "/upload" },
  { icon: History,          label: "History",     href: "/history" },
  { icon: User,             label: "Profile",     href: "/profile" },
];

function DashboardSidebar({ collapsed, onToggle }: Props) {
  const location = useLocation();

  return (
    <aside className="db-sidebar">
      {/* Logo */}
      <div className="db-sidebar-logo">
        <div className="db-sidebar-logo-icon">
          <img src="/logo-icon.png" alt="GeerGoo" className="sidebar-logo-img" />
        </div>
        <span className="db-sidebar-logo-text">GeerGoo</span>
      </div>

      {/* Navigation */}
      <nav className="db-sidebar-nav">
        {navItems.map(({ icon: Icon, label, href }) => (
          <Link
            key={href}
            to={href}
            className={`db-nav-item${location.pathname === href ? " active" : ""}`}
            title={collapsed ? label : undefined}
          >
            <span className="db-nav-icon">
              <Icon size={18} strokeWidth={1.75} />
            </span>
            <span className="db-nav-label">{label}</span>
          </Link>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="db-sidebar-footer">
        <button
          className="db-collapse-btn"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="db-collapse-icon">
            <ChevronLeft size={18} strokeWidth={1.75} />
          </span>
          <span className="db-nav-label">Collapse</span>
        </button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;