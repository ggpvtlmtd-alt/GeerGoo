import { Zap } from "lucide-react";

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-inner">
        <div className="footer-top">
          
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-logo">
              <Zap size={18} strokeWidth={2.5} />
              <span>GeerGoo</span>
            </div>
            <p className="footer-tagline">
              Autonomous AI diagnostics platform protecting mission-critical cloud infrastructure.
            </p>       
          </div>

          {/* Links columns */}
          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><a href="#features">AI Diagnostics</a></li>
              <li><a href="#hero">Log Ingestion</a></li>
              <li><a href="#">Integrations</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">API Reference</a></li>
              <li><a href="#">System Status</a></li>
              <li><a href="#">Changelog</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Subscribe to our security bulletin and product releases.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="work@email.com" required aria-label="Work Email Address" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 GeerGoo Technologies, Inc. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Security Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
