import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="navbar-animate">
      <header className="navbar">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            <motion.div
              className="logo-img-wrapper"
              layoutId="appLogoIcon"
              transition={{ type: "spring", stiffness: 75, damping: 15, mass: 0.8 }}
            >
              <img
                src="/logo-icon.png"
                className="navbar-logo-img"
                alt="GeerGoo"
              />
            </motion.div>
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
    </div>
  );
}

export default Navbar;


