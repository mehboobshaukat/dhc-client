import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // get token from URL
  useEffect(() => {
    const t = searchParams.get("token");
    if (!t) {
      setError("Invalid or expired reset link. Please request a new one.");
      setTimeout(() => {
        navigate("/forgot-password");
      }, 2000);
    } else {
      setToken(t);
    }
  }, [navigate, searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password || !form.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "http://localhost:5285/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            newPassword: form.password,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to reset password");
      }

      // Show success message and redirect
      setError("");
      setTimeout(() => {
        alert("Password reset successfully! Please login with your new password.");
        navigate("/login");
      }, 500);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-background">
        <div className="bg-blur-1"></div>
        <div className="bg-blur-2"></div>
        <div className="bg-blur-3"></div>
      </div>

      <div className="reset-container">
        <div className="reset-card">
          
          <div className="reset-icon">
            🔑
          </div>
          
          <h2>Reset Password</h2>
          <p className="reset-subtitle">
            Create a new strong password for your account
          </p>

          <form onSubmit={handleSubmit} className="reset-form">
            
            {/* New Password Field */}
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder=" "
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
              <label htmlFor="password">New Password</label>
              <span 
                className="input-icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? "👁️" : "🔒"}
              </span>
            </div>

            {/* Confirm Password Field */}
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder=" "
                value={form.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                required
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
              <span 
                className="input-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ cursor: "pointer" }}
              >
                {showConfirmPassword ? "👁️" : "🔒"}
              </span>
            </div>

            {/* Password Requirements */}
            <div className="password-requirements">
              <p className={form.password.length >= 6 ? "valid" : "invalid"}>
                ✓ At least 6 characters
              </p>
              <p className={form.password === form.confirmPassword && form.password ? "valid" : "invalid"}>
                ✓ Passwords match
              </p>
            </div>

            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" className="reset-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="back-link">
            <Link to="/auth">
              ← Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;