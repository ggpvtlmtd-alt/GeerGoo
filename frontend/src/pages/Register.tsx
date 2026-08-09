import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Terminal,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passValue, setPassValue] = useState("");
  const [confirmValue, setConfirmValue] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (!nameValue || !emailValue || !passValue || !confirmValue) {
      setError("Please fill in all fields.");
      return;
    }

    if (passValue !== confirmValue) {
      setError("Passwords do not match.");
      return;
    }

    // Split Full Name
    const nameParts = nameValue.trim().split(/\s+/);

    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ");

    // Generate username from email
    const username = emailValue.split("@")[0];

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: emailValue,
            phone: "",
            password: passValue,
            confirm_password: confirmValue,
          }),
        }
      );

      const data = await response.json();

      console.log("Register response:", data);

      if (!response.ok || !data.success) {
        let message = "Registration failed.";

        if (data.username) {
          message = Array.isArray(data.username)
            ? data.username[0]
            : data.username;
        } else if (data.email) {
          message = Array.isArray(data.email)
            ? data.email[0]
            : data.email;
        } else if (data.password) {
          message = Array.isArray(data.password)
            ? data.password[0]
            : data.password;
        } else if (data.confirm_password) {
          message = Array.isArray(data.confirm_password)
            ? data.confirm_password[0]
            : data.confirm_password;
        } else if (data.detail) {
          message = data.detail;
        }

        setError(message);
        return;
      }

      // Registration successful
      console.log("Registration successful");

      /*
       * Your Django register API already returns JWT tokens.
       * Store them so the user can immediately be authenticated.
       */
      if (data.tokens?.access) {
        localStorage.setItem("access", data.tokens.access);
      }

      if (data.tokens?.refresh) {
        localStorage.setItem("refresh", data.tokens.refresh);
      }

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      alert("Account created successfully!");

      // Go to Login
      navigate("/login");

    } catch (error) {
      console.error("Registration error:", error);
      setError("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Left Column: Form Card */}
      <div className="auth-form-column">
        <div className="auth-card-v4">

          <div className="auth-header-v4">

            <div className="auth-brand-v4">

              <img
                src="/logo-icon.png"
                alt="GeerGoo"
                className="auth-brand-logo"
                style={{
                  width: "18px",
                  height: "18px",
                  objectFit: "contain",
                }}
              />

              <span>GeerGoo</span>

            </div>

            <h1>Create your account</h1>

            <p>
              Get started with automated log diagnostics.
            </p>

          </div>


          <form
            className="auth-form-v4"
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >

            {/* Full Name */}
            <div
              className={`form-group-v4${
                nameFocused || nameValue ? " active" : ""
              }`}
            >

              <label>Full Name</label>

              <div className="input-wrapper-v4">

                <User
                  size={14}
                  className="input-icon"
                />

                <input
                  type="text"
                  value={nameValue}
                  onChange={(e) =>
                    setNameValue(e.target.value)
                  }
                  onFocus={() =>
                    setNameFocused(true)
                  }
                  onBlur={() =>
                    setNameFocused(false)
                  }
                  required
                />

              </div>

            </div>


            {/* Email Address */}
            <div
              className={`form-group-v4${
                emailFocused || emailValue ? " active" : ""
              }`}
            >

              <label>Email Address</label>

              <div className="input-wrapper-v4">

                <Mail
                  size={14}
                  className="input-icon"
                />

                <input
                  type="email"
                  value={emailValue}
                  onChange={(e) =>
                    setEmailValue(e.target.value)
                  }
                  onFocus={() =>
                    setEmailFocused(true)
                  }
                  onBlur={() =>
                    setEmailFocused(false)
                  }
                  required
                />

              </div>

            </div>


            {/* Password */}
            <div
              className={`form-group-v4${
                passFocused || passValue ? " active" : ""
              }`}
            >

              <label>Password</label>

              <div className="input-wrapper-v4">

                <Lock
                  size={14}
                  className="input-icon"
                />

                <input
                  type="password"
                  value={passValue}
                  onChange={(e) =>
                    setPassValue(e.target.value)
                  }
                  onFocus={() =>
                    setPassFocused(true)
                  }
                  onBlur={() =>
                    setPassFocused(false)
                  }
                  required
                />

              </div>

            </div>


            {/* Confirm Password */}
            <div
              className={`form-group-v4${
                confirmFocused || confirmValue
                  ? " active"
                  : ""
              }`}
            >

              <label>Confirm Password</label>

              <div className="input-wrapper-v4">

                <Lock
                  size={14}
                  className="input-icon"
                />

                <input
                  type="password"
                  value={confirmValue}
                  onChange={(e) =>
                    setConfirmValue(e.target.value)
                  }
                  onFocus={() =>
                    setConfirmFocused(true)
                  }
                  onBlur={() =>
                    setConfirmFocused(false)
                  }
                  required
                />

              </div>

            </div>


            {/* Error */}
            {error && (
              <div
                style={{
                  color: "#ff5c5c",
                  fontSize: "12px",
                  marginTop: "-5px",
                  marginBottom: "5px",
                }}
              >
                {error}
              </div>
            )}


            <button
              className="auth-btn-v4"
              type="submit"
              disabled={loading}
            >

              <span>
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </span>

              <ArrowRight size={14} />

            </button>

          </form>


          <p className="auth-footer-v4">

            Already have an account?{" "}

            <Link to="/login">
              Sign In
            </Link>

          </p>

        </div>
      </div>


      {/* Right Column: Visual Telemetry Illustration */}
      <div className="auth-visual-column">

        <div className="auth-mesh-overlay" />

        <div className="auth-visual-inner">

          <div className="visual-card">

            <div className="visual-header">

              <ShieldCheck
                size={14}
                className="text-blue"
              />

              <span>
                Security Engine ACTIVE
              </span>

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

                <div className="console-line">
                  <Terminal size={10} />
                  Ingesting syslog.stream...
                </div>

                <div className="console-line">
                  <Terminal size={10} />
                  Model parameters loaded
                </div>

                <div className="console-line text-blue">
                  <Terminal size={10} />
                  Analyzing root anomalies
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default Register;