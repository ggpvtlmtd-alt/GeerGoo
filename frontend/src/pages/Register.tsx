import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, Zap, ArrowRight, ShieldCheck, Terminal } from "lucide-react";

function Register() {
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passValue, setPassValue] = useState("");
  const [confirmValue, setConfirmValue] = useState("");

  return (
    <div className="auth-container">
      <div className="auth-grid">
        
        {/* Left Column: Form Card */}
        <div className="auth-form-column">
          <div className="auth-card-v4">
            <div className="auth-header-v4">
              <div className="auth-brand-v4">
                <Zap size={18} strokeWidth={2.5} />
                <span>GeerGoo</span>
              </div>
              <h1>Create your account</h1>
              <p>Get started with automated log diagnostics.</p>
            </div>

            <form className="auth-form-v4" onSubmit={(e) => e.preventDefault()}>
              
              {/* Full Name */}
              <div className={`form-group-v4${nameFocused || nameValue ? " active" : ""}`}>
                <label>Full Name</label>
                <div className="input-wrapper-v4">
                  <User size={14} className="input-icon" />
                  <input
                    type="text"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
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

              {/* Password */}
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

              {/* Confirm Password */}
              <div className={`form-group-v4${confirmFocused || confirmValue ? " active" : ""}`}>
                <label>Confirm Password</label>
                <div className="input-wrapper-v4">
                  <Lock size={14} className="input-icon" />
                  <input
                    type="password"
                    value={confirmValue}
                    onChange={(e) => setConfirmValue(e.target.value)}
                    onFocus={() => setConfirmFocused(true)}
                    onBlur={() => setConfirmFocused(false)}
                    required
                  />
                </div>
              </div>

              <button className="auth-btn-v4" type="submit">
                <span>Create Account</span>
                <ArrowRight size={14} />
              </button>
            </form>

            <p className="auth-footer-v4">
              Already have an account? <Link to="/login">Sign In</Link>
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

export default Register;