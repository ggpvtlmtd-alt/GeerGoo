import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, ShieldCheck, Terminal } from "lucide-react";

function Login() {
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [passValue, setPassValue] = useState("");

  return (
    <div className="auth-container">
      <div className="auth-grid">
        
        {/* Left Column: Form Card */}
        <div className="auth-form-column">
          <div className="auth-card-v4">
            <div className="auth-header-v4">
              <div className="auth-brand-v4">
                <img src="/logo-icon.png" alt="GeerGoo" className="auth-brand-logo" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                <span>GeerGoo</span>
              </div>
              <h1>Welcome back</h1>
              <p>Sign in to your enterprise diagnostic suite.</p>
            </div>

            <form className="auth-form-v4" onSubmit={(e) => e.preventDefault()}>
              
              {/* Email Input with floating label */}
              <div className={`form-group-v4${emailFocused || emailValue ? " active" : ""}`}>
                <label>Email Address</label>
                <div className="input-wrapper-v4">
                  <Mail size={14} className="input-icon" />
                  <input
                    type="email"
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    required
                  />
                </div>
              </div>

              {/* Password Input with floating label */}
              <div className={`form-group-v4${passFocused || passValue ? " active" : ""}`}>
                <label>Password</label>
                <div className="input-wrapper-v4">
                  <Lock size={14} className="input-icon" />
                  <input
                    type="password"
                    value={passValue}
                    onChange={(e) => setPassValue(e.target.value)}
                    onFocus={() => setPassFocused(true)}
                    onBlur={() => setPassFocused(false)}
                    required
                  />
                </div>
              </div>

              <button className="auth-btn-v4" type="submit">
                <span>Sign In</span>
                <ArrowRight size={14} />
              </button>
            </form>

            <p className="auth-footer-v4">
              Don't have an account? <Link to="/register">Create one</Link>
            </p>
          </div>
        </div>

        {/* Right Column: Visual Telemetry Illustration (Desktop Only) */}
        <div className="auth-visual-column">
          <div className="auth-mesh-overlay" />
          <div className="auth-visual-inner">
            <div className="visual-card">
              <div className="visual-header">
                <ShieldCheck size={14} className="text-blue" />
                <span>Security Engine ACTIVE</span>
              </div>
              <div className="visual-body">
                <div className="visual-grid-nodes">
                  <div className="node active" />
                  <div className="node active" />
                  <div className="node danger" />
                  <div className="node" />
                  <div className="node active" />
                </div>
                <div className="visual-console">
                  <div className="console-line"><Terminal size={10} /> Ingesting syslog.stream...</div>
                  <div className="console-line"><Terminal size={10} /> Model parameters loaded</div>
                  <div className="console-line text-blue"><Terminal size={10} /> Analyzing root anomalies</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;