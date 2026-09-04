import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Play, Loader2, Brain, Activity, Terminal } from "lucide-react";

function IngestionCounter() {
  const [count, setCount] = useState(91420);

  useEffect(() => {
    let frame: number;
    const target = 104842;
    const start = 91420;
    const duration = 1800;
    const t0 = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - t0) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(start + (target - start) * easedProgress);
      setCount(current);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <span>{count.toLocaleString()}</span>;
}

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero" id="hero">
      {/* Grid backdrop and ambient background light */}
      <div className="hero-grid-overlay" aria-hidden="true" />
      <div className="hero-visual-glow" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-content">
          <div className="hero-badge hero-animate-badge">
            <Sparkles size={12} />
            <span>Enterprise Log Intelligence</span>
          </div>

          <h1 className="hero-animate-title">
            Automate log analysis with <span>AI diagnostics</span>
          </h1>

          <p className="hero-description hero-animate-desc">
            Ingest production logs, trace security anomalies, and map system exceptions to root causes in real time. Designed for high-velocity engineering teams.
          </p>

          <div className="hero-buttons hero-animate-btns">
            <button
              className="primary-btn"
              type="button"
              onClick={() => navigate("/upload")}
            >
              Upload Logs
              <ArrowRight size={15} />
            </button>
            <button className="secondary-btn" type="button">
              <Play size={14} />
              See How It Works
            </button>
          </div>

          {/* Stats Section with improved typography */}
          <div className="hero-stats hero-animate-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">10M+</span>
              <span className="hero-stat-label">Events Audited</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">99.8%</span>
              <span className="hero-stat-label">Precision Rate</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">&lt;3s</span>
              <span className="hero-stat-label">Avg. Latency</span>
            </div>
          </div>

          {/* Trusted By Enterprise Logo strip */}
          <div className="hero-trusted hero-animate-trusted">
            <span className="trusted-title">Trusted by engineering teams at</span>
            <div className="trusted-logos">
              {/* Minimal SVG Logos */}
              <div className="logo-item" title="Stripe">
                <svg viewBox="0 0 60 20" fill="currentColor"><path d="M51.05 9.07c0-2.88-1.52-4.14-3.76-4.14-2.73 0-4.32 1.95-4.32 4.96 0 3.32 1.92 4.7 4.54 4.7 1.25 0 2.27-.32 2.87-.72V12.1c-.53.25-1.3.46-2.14.46-1.55 0-2.33-.67-2.38-1.78h7.06c.07-.63.13-1.2.13-1.71zm-5.23-.97c.03-1.07.69-1.54 1.48-1.54.77 0 1.39.46 1.4 1.54h-2.88zM36.1 4.93c-1.3 0-2.14.63-2.58 1.15V5.11h-2.75v12.28h3.02v-7.39c0-1.8 1.05-2.6 2.37-2.6.43 0 .76.05.95.12V5.07c-.3-.1-.72-.14-1.01-.14zM24.7 2.34l-3.02.64v2.13h-1.92v2.46h1.92v6.6c0 2.65 1.44 3.73 3.72 3.73.74 0 1.34-.08 1.76-.23v-2.42c-.32.08-.66.12-1.07.12-1.05 0-1.39-.46-1.39-1.54V8.21h2.46V5.75h-2.46V2.34zM12.92 9.47c0-1.35-1.12-1.73-2.67-1.98l-1.34-.23c-.7-.12-1.14-.33-1.14-.85 0-.5.5-.83 1.26-.83.82 0 1.63.26 2.26.68V3.82C10.66 3.56 9.77 3.4 8.92 3.4c-2.48 0-4.24 1.29-4.24 3.53 0 2.25 1.78 2.76 3.59 3.05l1.09.18c.84.14 1.26.4 1.26.96 0 .58-.6.94-1.48.94-.96 0-1.96-.34-2.63-.78v2.54c.76.32 1.8.52 2.87.52 2.62 0 4.54-1.28 4.54-3.87zM.3 5.11h3.02v12.28H.3zM1.82 3.5c1.04 0 1.82-.78 1.82-1.82C3.64.64 2.86 0 1.82 0S0 .64 0 1.68c0 1.04.78 1.82 1.82 1.82z" /></svg>
              </div>
              <div className="logo-item" title="Vercel">
                <svg viewBox="0 0 60 20" fill="currentColor"><path d="M6.28 0L12.56 10.87H0L6.28 0Z" /><text x="18" y="10" fontSize="8" fontWeight="800" letterSpacing="0.05em">VERCEL</text></svg>
              </div>
              <div className="logo-item" title="Linear">
                <svg viewBox="0 0 60 20" fill="currentColor"><circle cx="8" cy="10" r="6" stroke="currentColor" strokeWidth="2" fill="none" /><line x1="8" y1="4" x2="8" y2="16" stroke="currentColor" strokeWidth="2" /><text x="20" y="13" fontSize="9" fontWeight="700">Linear</text></svg>
              </div>
              <div className="logo-item" title="OpenAI">
                <svg viewBox="0 0 60 20" fill="currentColor"><path d="M5 10c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5-5-2.24-5-5z" fill="none" stroke="currentColor" strokeWidth="1.5" /><text x="20" y="13" fontSize="9" fontWeight="700">OpenAI</text></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Live Dashboard Preview (High Fidelity Mockup) */}
        <div className="hero-visual hero-animate-preview">
          <div className="hero-mockup">
            <div className="mockup-header">
              <span className="mockup-dot" />
              <span className="mockup-dot" />
              <span className="mockup-dot" />
              <div className="mockup-tab">
                <Terminal size={11} />
                <span>GeerGoo Security Engine</span>
              </div>
            </div>

            <div className="mockup-body">
              {/* Telemetry Indicator */}
              <div className="mockup-telemetry">
                <div className="telemetry-left">
                  <Activity size={14} className="pulse-icon" />
                  <span>Real-time Ingestion Stream</span>
                </div>
                <div className="telemetry-right">
                  <span className="live-pill">LIVE</span>
                </div>
              </div>

              {/* Advanced Ingestion Counter */}
              <div className="mockup-scan-bar">
                <Loader2 size={13} />
                <span>Scanning buffer: <IngestionCounter /> events/sec</span>
              </div>

              {/* Mini SVG Ingestion Line Chart */}
              <div className="mockup-chart">
                <svg viewBox="0 0 400 100" className="mockup-chart-svg" aria-hidden="true">
                  <defs>
                    <linearGradient id="mockupChartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="25" x2="400" y2="25" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                  <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                  <line x1="0" y1="75" x2="400" y2="75" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                  
                  {/* Filled Area */}
                  <path d="M 10,80 C 80,25 120,70 170,45 C 230,20 280,68 330,28 C 360,8 375,18 390,12 L 390,100 L 10,100 Z" fill="url(#mockupChartAreaGrad)" />
                  
                  {/* Chart Stroke Line */}
                  <path d="M 10,80 C 80,25 120,70 170,45 C 230,20 280,68 330,28 C 360,8 375,18 390,12" fill="none" stroke="#3B82F6" strokeWidth="2" className="mockup-chart-line" />
                  
                  {/* Gliding Telemetry Pulse Dot */}
                  <circle r="3.5" fill="#3B82F6" className="mockup-chart-pulse-dot">
                    <animateMotion dur="5s" repeatCount="indefinite" path="M 10,80 C 80,25 120,70 170,45 C 230,20 280,68 330,28 C 360,8 375,18 390,12" />
                  </circle>
                  
                  {/* Ingestion Data Node Dots */}
                  <circle cx="10" cy="80" r="3" fill="#0B0F17" stroke="#3B82F6" strokeWidth="1.5" className="mockup-dot-1" />
                  <circle cx="120" cy="70" r="3" fill="#0B0F17" stroke="#3B82F6" strokeWidth="1.5" className="mockup-dot-2" />
                  <circle cx="170" cy="45" r="3" fill="#0B0F17" stroke="#3B82F6" strokeWidth="1.5" className="mockup-dot-3" />
                  <circle cx="330" cy="28" r="3" fill="#0B0F17" stroke="#3B82F6" strokeWidth="1.5" className="mockup-dot-4" />
                  <circle cx="390" cy="12" r="3" fill="#0B0F17" stroke="#3B82F6" strokeWidth="1.5" className="mockup-dot-5" />
                </svg>
              </div>

              {/* Interactive Log Logs (simulated output) */}
              <div className="mockup-terminal-lines">
                <div className="mockup-log-line ok">
                  <span className="log-timestamp">00:24:18</span>
                  <span className="log-level ok">SYS</span>
                  <span className="log-text">Security model loaded successfully</span>
                </div>

                <div className="mockup-log-line warn">
                  <span className="log-timestamp">00:24:20</span>
                  <span className="log-level warn">WRN</span>
                  <span className="log-text">TLS handshake delay limit exceeded (420ms)</span>
                </div>

                <div className="mockup-log-line error">
                  <span className="log-timestamp">00:24:21</span>
                  <span className="log-level error">ERR</span>
                  <span className="log-text">Database replication failure at node us-east-3</span>
                </div>
              </div>

              {/* Beautiful AI Diagnosis Card */}
              <div className="mockup-insight animate-insight">
                <div className="mockup-insight-label">
                  <Brain size={12} />
                  AI Exception Resolution
                </div>
                <p className="mockup-insight-text">
                  Replication timeout triggered by packet loss on interface enp3s0. <span className="highlight-blue">Action:</span> Verify subnet route flags or scale replication timeout threshold to 15s in replica.conf.
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

