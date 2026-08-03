import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/" onClick={closeMenu}>
          <span className="logo-icon">
            <Zap size={18} strokeWidth={2.5} />
          </span>
          <span className="logo-text">
            Geer<span>Goo</span>
          </span>
        </Link>
      </div>

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <a href="#hero" onClick={closeMenu}>
          Home
        </a>
        <a href="#features" onClick={closeMenu}>
          Features
        </a>
        <a href="#footer" onClick={closeMenu}>
          About
        </a>
      </nav>

      <div className="nav-buttons">
        <Link to="/login" className="login-btn">
          Login
        </Link>
        <Link to="/register" className="register-btn">
          Get Started
        </Link>
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </header>
  );
}

export default Navbar;
