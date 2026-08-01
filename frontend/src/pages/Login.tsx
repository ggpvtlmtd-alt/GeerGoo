function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p>Login to your GeerGoo account</p>

        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        <button>Login</button>

        <p className="register-link">
          Don't have an account? Register
        </p>
      </div>
    </div>
  );
}

export default Login;