import {
  Sparkles,
  ArrowRight,
  Play,
  Loader2,
  Brain,
} from "lucide-react";

function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            AI-Powered Log Analysis
          </div>

          <h1>
            Debug smarter with{" "}
            <span>intelligent insights</span>
          </h1>

          <p className="hero-description">
            Upload your system logs and receive AI-powered root cause analysis,
            security threat detection, and actionable fixes — all within seconds.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" type="button">
              Upload Logs
              <ArrowRight size={18} />
            </button>
            <button className="secondary-btn" type="button">
              <Play size={16} />
              See How It Works
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">10k+</span>
              <span className="hero-stat-label">Logs analyzed</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">98%</span>
              <span className="hero-stat-label">Accuracy rate</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">&lt;5s</span>
              <span className="hero-stat-label">Avg. analysis time</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-glow" aria-hidden="true" />

          <div className="hero-mockup">
            <div className="mockup-header">
              <span className="mockup-dot" />
              <span className="mockup-dot" />
              <span className="mockup-dot" />
              <span className="mockup-title">geergoo — log-analysis.session</span>
            </div>

            <div className="mockup-body">
              <div className="mockup-scan-bar">
                <Loader2 size={14} />
                AI scanning 2,847 log entries…
              </div>

              <div className="mockup-log-line error">
                <span className="log-level error">ERR</span>
                <span className="log-text">
                  NullPointerException at UserService.java:142
                </span>
              </div>

              <div className="mockup-log-line warn">
                <span className="log-level warn">WARN</span>
                <span className="log-text">
                  Connection pool exhausted — max 20 reached
                </span>
              </div>

              <div className="mockup-log-line ok">
                <span className="log-level ok">INFO</span>
                <span className="log-text">
                  Request handled in 234ms — /api/v1/users
                </span>
              </div>

              <div className="mockup-insight">
                <div className="mockup-insight-label">
                  <Brain size={12} />
                  Root Cause Detected
                </div>
                <p>
                  Uninitialized user object passed to getProfile(). Add null
                  check at line 138 or validate input in the controller layer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
