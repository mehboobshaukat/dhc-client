import { useState } from "react";
import { loginUser } from "../../services/authService";
import { setToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ switchToRegister }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ userName: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.userName || !form.password) {
      setError("Please enter both username and password");
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser(form);
      if (response.token) {
        setToken(response.token);
        navigate("/");
      }
    } catch (err) {
      let errorMessage = err.message || "Login failed";
      if (errorMessage.includes("Invalid credentials")) {
        errorMessage = "❌ Invalid username or password";
      } else if (errorMessage.toLowerCase().includes("verify")) {
        errorMessage = "⚠️ Please verify your email address first";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Welcome Back</h2>
      <p className="form-subtitle">Login to access your dashboard</p>

      {error && <div className="error-message">{error}</div>}

      <div className="input-group">
        <input
          type="text"
          name="userName"
          id="username"
          placeholder=" "
          value={form.userName}
          onChange={handleChange}
          disabled={loading}
        />
        <label htmlFor="username">Username</label>
        <span className="input-icon">👤</span>
      </div>

      <div className="input-group">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          placeholder=" "
          value={form.password}
          onChange={handleChange}
          disabled={loading}
        />
        <label htmlFor="password">Password</label>
        <span 
          className="input-icon"
          onClick={() => setShowPassword(!showPassword)}
          style={{ cursor: "pointer" }}
        >
          {showPassword ? "👁️" : "🔒"}
        </span>
      </div>

      <button type="submit" className="login-btn" disabled={loading}>
        {loading ? <span className="loading-spinner"></span> : null}
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="auth-links">
        <p>
          Don't have an account?{" "}
          <span onClick={switchToRegister}>Sign up</span>
        </p>
        <a href="/forgot-password" className="forgot-link">
          Forgot Password?
        </a>
      </div>
    </form>
  );
}

export default Login;